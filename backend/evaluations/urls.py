from rest_framework.routers import DefaultRouter
from .views import EvaluationRubricViewSet, EvaluationViewSet

router = DefaultRouter()
router.register(r"rubrics", EvaluationRubricViewSet, basename="rubric")
router.register(r"evaluations", EvaluationViewSet, basename="evaluation")

urlpatterns = router.urls
