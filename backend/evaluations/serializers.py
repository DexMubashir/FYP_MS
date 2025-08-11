from rest_framework import serializers
from .models import EvaluationRubric, Evaluation


class EvaluationRubricSerializer(serializers.ModelSerializer):
    class Meta:
        model = EvaluationRubric
        fields = ["id", "name", "criteria", "max_score"]


class EvaluationSerializer(serializers.ModelSerializer):
    evaluator_email = serializers.EmailField(source="evaluator.email", read_only=True)

    class Meta:
        model = Evaluation
        fields = [
            "id",
            "project",
            "evaluator",
            "evaluator_email",
            "rubric",
            "scores",
            "total_score",
            "comments",
            "created_at",
        ]
        read_only_fields = ["evaluator", "evaluator_email", "created_at"]
