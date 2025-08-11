from django.db import models
from users.models import User


class ProjectProposal(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("approved", "Approved"),
        ("rejected", "Rejected"),
    ]
    title = models.CharField(max_length=255)
    description = models.TextField()
    document = models.FileField(upload_to="proposals/")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    student = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="proposals"
    )
    supervisor = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="supervised_proposals",
    )
    feedback = models.TextField(blank=True)
    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.student.email})"


class Project(models.Model):
    STATUS_CHOICES = [
        ("active", "Active"),
        ("completed", "Completed"),
        ("on_hold", "On Hold"),
    ]
    proposal = models.OneToOneField(
        ProjectProposal, on_delete=models.CASCADE, related_name="project"
    )
    title = models.CharField(max_length=255)
    description = models.TextField()
    supervisor = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, related_name="assigned_projects"
    )
    students = models.ManyToManyField(User, related_name="assigned_projects_as_student")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="active")
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return self.title


class Milestone(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("completed", "Completed"),
        ("overdue", "Overdue"),
    ]
    project = models.ForeignKey(
        Project, on_delete=models.CASCADE, related_name="milestones"
    )
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    due_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    completion_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"{self.title} ({self.project.title})"


class Document(models.Model):
    DOCUMENT_TYPES = [
        ("report", "Report"),
        ("code", "Code"),
        ("presentation", "Presentation"),
        ("other", "Other"),
    ]
    project = models.ForeignKey(
        Project, on_delete=models.CASCADE, related_name="documents"
    )
    file = models.FileField(upload_to="documents/")
    name = models.CharField(max_length=255)
    type = models.CharField(max_length=20, choices=DOCUMENT_TYPES, default="other")
    version = models.PositiveIntegerField(default=1)
    uploaded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    description = models.TextField(blank=True)

    class Meta:
        unique_together = ("project", "name", "version")
        ordering = ["-uploaded_at"]

    def __str__(self):
        return f"{self.name} v{self.version} ({self.project.title})"
