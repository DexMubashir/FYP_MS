from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .models import Notification
from .serializers import NotificationSerializer
from django.core.mail import send_mail
from django.conf import settings


class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all().order_by("-created_at")
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:
            return Notification.objects.all()
        return Notification.objects.filter(recipient=user)

    def perform_create(self, serializer):
        notification = serializer.save()
        self.send_notification_email(notification)

    def send_notification_email(self, notification):
        if notification.email_sent or not notification.recipient.email:
            return
        subject = f"FYP Notification: {notification.type.title()}"
        message = notification.message
        recipient_list = [notification.recipient.email]
        try:
            send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, recipient_list)
            notification.email_sent = True
            notification.save()
        except Exception:
            pass

    def update(self, request, *args, **kwargs):
        # Allow marking as read
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        if "read" in serializer.validated_data:
            instance.read = serializer.validated_data["read"]
            instance.save()
        return Response(self.get_serializer(instance).data)
