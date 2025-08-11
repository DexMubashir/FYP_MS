from django.db import models
from users.models import User


class Notification(models.Model):
    NOTIFICATION_TYPES = [
        ("info", "Info"),
        ("warning", "Warning"),
        ("success", "Success"),
    ]
    recipient = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="notifications"
    )
    message = models.TextField()
    type = models.CharField(max_length=20, choices=NOTIFICATION_TYPES, default="info")
    read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    link = models.URLField(blank=True, null=True)
    email_sent = models.BooleanField(default=False)

    def __str__(self):
        return f"To {self.recipient.email}: {self.message[:30]}..."
