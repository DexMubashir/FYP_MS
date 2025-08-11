from rest_framework.routers import DefaultRouter
from .views import SubmissionViewSet, FeedbackThreadViewSet, FeedbackMessageViewSet

router = DefaultRouter()
router.register(r"submissions", SubmissionViewSet, basename="submission")
router.register(r"feedback-threads", FeedbackThreadViewSet, basename="feedback-thread")
router.register(
    r"feedback-messages", FeedbackMessageViewSet, basename="feedback-message"
)

urlpatterns = router.urls
