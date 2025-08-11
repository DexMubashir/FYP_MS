from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/users/", include("users.urls")),
    path(
        "api/auth/", include("djoser.urls")
    ),  # Djoser endpoints for registration, password, etc.
    path(
        "api/auth/", include("djoser.urls.jwt")
    ),  # Djoser JWT endpoints for login/logout
    path("api/fyps/", include("fyps.urls")),
    path("api/submissions/", include("submissions.urls")),
    path("api/announcements/", include("announcements.urls")),
    path("api/evaluations/", include("evaluations.urls")),
]
