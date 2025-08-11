from django.db import models
from users.models import User
from fyps.models import Project


class Submission(models.Model):
    title = models.CharField(max_length=255)
    file = models.FileField(upload_to="submissions/")
    student = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="submissions"
    )
    project = models.ForeignKey(
        Project, on_delete=models.CASCADE, related_name="submissions"
    )
    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.student.email})"


class FeedbackThread(models.Model):
    submission = models.OneToOneField(
        Submission, on_delete=models.CASCADE, related_name="feedback_thread"
    )

    def __str__(self):
        return f"Feedback for {self.submission.title}"


class FeedbackMessage(models.Model):
    thread = models.ForeignKey(
        FeedbackThread, on_delete=models.CASCADE, related_name="messages"
    )
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sender.email}: {self.message[:30]}..."
