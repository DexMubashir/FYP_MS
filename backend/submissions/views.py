from rest_framework import viewsets, permissions
from .models import Submission, FeedbackThread, FeedbackMessage
from .serializers import (
    SubmissionSerializer,
    FeedbackThreadSerializer,
    FeedbackMessageSerializer,
)
from fyps.models import Project


class IsStudentOrSupervisorOnProject(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        project_id = request.data.get("project")
        if not project_id:
            return False
        try:
            project = Project.objects.get(id=project_id)
        except Project.DoesNotExist:
            return False
        if request.user.role == "student" and request.user in project.students.all():
            return True
        if request.user.role == "supervisor" and request.user == project.supervisor:
            return True
        return False


class SubmissionViewSet(viewsets.ModelViewSet):
    queryset = Submission.objects.all().order_by("-submitted_at")
    serializer_class = SubmissionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)

    def get_queryset(self):
        user = self.request.user
        if user.role == "student":
            return Submission.objects.filter(student=user)
        elif user.role == "supervisor":
            return Submission.objects.filter(project__supervisor=user)
        return Submission.objects.all()


class FeedbackThreadViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = FeedbackThread.objects.all()
    serializer_class = FeedbackThreadSerializer
    permission_classes = [permissions.IsAuthenticated]


class FeedbackMessageViewSet(viewsets.ModelViewSet):
    queryset = FeedbackMessage.objects.all().order_by("created_at")
    serializer_class = FeedbackMessageSerializer
    permission_classes = [permissions.IsAuthenticated, IsStudentOrSupervisorOnProject]

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)

    def get_queryset(self):
        user = self.request.user
        if user.role == "student":
            return FeedbackMessage.objects.filter(thread__submission__student=user)
        elif user.role == "supervisor":
            return FeedbackMessage.objects.filter(
                thread__submission__project__supervisor=user
            )
        return FeedbackMessage.objects.all()
