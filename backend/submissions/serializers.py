from rest_framework import serializers
from .models import Submission, FeedbackThread, FeedbackMessage


class FeedbackMessageSerializer(serializers.ModelSerializer):
    sender_email = serializers.EmailField(source="sender.email", read_only=True)

    class Meta:
        model = FeedbackMessage
        fields = ["id", "thread", "sender", "sender_email", "message", "created_at"]
        read_only_fields = ["sender", "created_at", "sender_email"]


class FeedbackThreadSerializer(serializers.ModelSerializer):
    messages = FeedbackMessageSerializer(many=True, read_only=True)

    class Meta:
        model = FeedbackThread
        fields = ["id", "submission", "messages"]


class SubmissionSerializer(serializers.ModelSerializer):
    feedback_thread = FeedbackThreadSerializer(read_only=True)

    class Meta:
        model = Submission
        fields = [
            "id",
            "title",
            "file",
            "student",
            "project",
            "submitted_at",
            "feedback_thread",
        ]
        read_only_fields = ["student", "submitted_at", "feedback_thread"]
