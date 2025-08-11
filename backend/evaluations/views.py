from rest_framework import viewsets, permissions
from .models import EvaluationRubric, Evaluation
from .serializers import EvaluationRubricSerializer, EvaluationSerializer
from fyps.models import Project


class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_authenticated and request.user.role == "admin"


class EvaluationRubricViewSet(viewsets.ModelViewSet):
    queryset = EvaluationRubric.objects.all()
    serializer_class = EvaluationRubricSerializer
    permission_classes = [IsAdminOrReadOnly]


class EvaluationViewSet(viewsets.ModelViewSet):
    queryset = Evaluation.objects.all().order_by("-created_at")
    serializer_class = EvaluationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(evaluator=self.request.user)

    def get_queryset(self):
        user = self.request.user
        if user.role == "student":
            return Evaluation.objects.filter(project__students=user)
        elif user.role == "supervisor":
            return Evaluation.objects.filter(
                project__supervisor=user
            ) | Evaluation.objects.filter(evaluator=user)
        return Evaluation.objects.all()
