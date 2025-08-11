from rest_framework.routers import DefaultRouter
from .views import (
    ProjectProposalViewSet,
    ProjectViewSet,
    MilestoneViewSet,
    DocumentViewSet,
    AdminAnalyticsView,
)

router = DefaultRouter()
router.register(r"proposals", ProjectProposalViewSet, basename="proposal")
router.register(r"projects", ProjectViewSet, basename="project")
router.register(r"milestones", MilestoneViewSet, basename="milestone")
router.register(r"documents", DocumentViewSet, basename="document")

urlpatterns = router.urls

from django.urls import path

urlpatterns += [
    path("analytics/", AdminAnalyticsView.as_view(), name="admin-analytics"),
]
