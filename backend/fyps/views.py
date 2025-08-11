from rest_framework import viewsets, permissions
from .models import ProjectProposal, Project, Milestone, Document
from .serializers import (
    ProjectProposalSerializer,
    ProjectSerializer,
    MilestoneSerializer,
    DocumentSerializer,
)
from users.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from submissions.models import Submission
from evaluations.models import Evaluation
from django.db.models import Avg


class IsStudentOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        # Allow read for all, write only for authenticated students
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_authenticated and request.user.role == "student"

    def has_object_permission(self, request, view, obj):
        # Students can only modify their own proposals
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.student == request.user


class IsSupervisorOrAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in [
            "supervisor",
            "admin",
        ]


class ProjectProposalViewSet(viewsets.ModelViewSet):
    queryset = ProjectProposal.objects.all().order_by("-submitted_at")
    serializer_class = ProjectProposalSerializer

    def get_permissions(self):
        if self.action in ["update", "partial_update", "destroy"]:
            return [IsSupervisorOrAdmin()]
        elif self.action == "create":
            return [IsStudentOrReadOnly()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)

    def get_queryset(self):
        user = self.request.user
        if user.role == "student":
            return ProjectProposal.objects.filter(student=user)
        elif user.role == "supervisor":
            return ProjectProposal.objects.filter(supervisor=user)
        return ProjectProposal.objects.all()


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all().order_by("-start_date")
    serializer_class = ProjectSerializer

    def get_permissions(self):
        if self.action in ["create", "update", "partial_update", "destroy"]:
            return [IsSupervisorOrAdmin()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        if user.role == "student":
            return Project.objects.filter(students=user)
        elif user.role == "supervisor":
            return Project.objects.filter(supervisor=user)
        return Project.objects.all()


class MilestoneViewSet(viewsets.ModelViewSet):
    queryset = Milestone.objects.all().order_by("due_date")
    serializer_class = MilestoneSerializer

    def get_permissions(self):
        if self.action in ["create", "update", "partial_update", "destroy"]:
            return [IsSupervisorOrAdmin()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        if user.role == "student":
            return Milestone.objects.filter(project__students=user)
        elif user.role == "supervisor":
            return Milestone.objects.filter(project__supervisor=user)
        return Milestone.objects.all()


class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.all().order_by("-uploaded_at")
    serializer_class = DocumentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == "student":
            return Document.objects.filter(project__students=user)
        elif user.role == "supervisor":
            return Document.objects.filter(project__supervisor=user)
        return Document.objects.all()

    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user)


class AdminAnalyticsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        # User stats
        user_counts = {
            role: User.objects.filter(role=role).count()
            for role, _ in User.ROLE_CHOICES
        }
        # Project stats
        project_counts = {
            status: Project.objects.filter(status=status).count()
            for status, _ in Project.STATUS_CHOICES
        }
        # Proposal stats
        proposal_counts = {
            status: ProjectProposal.objects.filter(status=status).count()
            for status, _ in ProjectProposal.STATUS_CHOICES
        }
        # Milestone stats
        milestone_counts = {
            status: Milestone.objects.filter(status=status).count()
            for status, _ in Milestone.STATUS_CHOICES
        }
        # Document stats
        document_counts = {
            doc_type: Document.objects.filter(type=doc_type).count()
            for doc_type, _ in Document.DOCUMENT_TYPES
        }
        # Submission stats
        total_submissions = Submission.objects.count()
        # Evaluation stats
        avg_evaluation_score = Evaluation.objects.aggregate(avg=Avg("total_score"))[
            "avg"
        ]
        # Overdue milestones
        overdue_milestones = Milestone.objects.filter(status="overdue").count()

        return Response(
            {
                "user_counts": user_counts,
                "project_counts": project_counts,
                "proposal_counts": proposal_counts,
                "milestone_counts": milestone_counts,
                "document_counts": document_counts,
                "total_submissions": total_submissions,
                "avg_evaluation_score": avg_evaluation_score,
                "overdue_milestones": overdue_milestones,
            }
        )
