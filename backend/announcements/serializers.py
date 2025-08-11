from rest_framework import serializers
from .models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    recipient_email = serializers.EmailField(source="recipient.email", read_only=True)

    class Meta:
        model = Notification
        fields = [
            "id",
            "recipient",
            "recipient_email",
            "message",
            "type",
            "read",
            "created_at",
            "link",
            "email_sent",
        ]
        read_only_fields = ["created_at", "recipient_email", "email_sent"]
