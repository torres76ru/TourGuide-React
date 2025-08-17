from rest_framework import serializers
from .models import Tour
from users.serializers import UserSerializer

class TourSerializer(serializers.ModelSerializer):
    guide = UserSerializer(read_only=True)
    participants = UserSerializer(many=True, read_only=True)  # участники

    class Meta:
        model = Tour
        fields = [
            "id",
            "title",
            "content",
            "date",
            "image",
            "guide",
            "participants",
            "created_at",
        ]

