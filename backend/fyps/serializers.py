from rest_framework import serializers
from .models import ProjectProposal, Project, Milestone, Document


class ProjectProposalSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectProposal
        fields = "__all__"
        read_only_fields = [
            "status",
            "supervisor",
            "feedback",
            "student",
            "submitted_at",
        ]


class MilestoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Milestone
        fields = "__all__"


class ProjectSerializer(serializers.ModelSerializer):
    proposal = ProjectProposalSerializer(read_only=True)
    proposal_id = serializers.PrimaryKeyRelatedField(
        queryset=ProjectProposal.objects.filter(status="approved"),
        source="proposal",
        write_only=True,
    )
    milestones = MilestoneSerializer(many=True, read_only=True)

    class Meta:
        model = Project
        fields = [
            "id",
            "proposal",
            "proposal_id",
            "title",
            "description",
            "supervisor",
            "students",
            "status",
            "start_date",
            "end_date",
            "milestones",
        ]


class DocumentSerializer(serializers.ModelSerializer):
    uploaded_by_email = serializers.EmailField(
        source="uploaded_by.email", read_only=True
    )

    class Meta:
        model = Document
        fields = [
            "id",
            "project",
            "file",
            "name",
            "type",
            "version",
            "uploaded_by",
            "uploaded_by_email",
            "uploaded_at",
            "description",
        ]
        read_only_fields = ["uploaded_by", "uploaded_by_email", "uploaded_at"]
