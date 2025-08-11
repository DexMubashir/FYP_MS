from django.db import models
from users.models import User
from fyps.models import Project


class EvaluationRubric(models.Model):
    name = models.CharField(max_length=255)
    criteria = models.JSONField(
        help_text='List of criteria with max scores, e.g. [{"name": "Originality", "max": 10}]'
    )
    max_score = models.PositiveIntegerField()

    def __str__(self):
        return self.name


class Evaluation(models.Model):
    project = models.ForeignKey(
        Project, on_delete=models.CASCADE, related_name="evaluations"
    )
    evaluator = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="evaluations"
    )
    rubric = models.ForeignKey(EvaluationRubric, on_delete=models.SET_NULL, null=True)
    scores = models.JSONField(
        help_text='Scores per criterion, e.g. [{"name": "Originality", "score": 8}]'
    )
    total_score = models.FloatField()
    comments = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("project", "evaluator")
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.project.title} by {self.evaluator.email} ({self.total_score})"
