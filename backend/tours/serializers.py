from rest_framework import serializers
from .models import Tour, Schedule
from users.serializers import UserSerializer


class ScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Schedule
        fields = ["day_of_week", "start_time", "end_time"]


class TourSerializer(serializers.ModelSerializer):
    guide = UserSerializer(read_only=True)
    participants = UserSerializer(many=True, read_only=True)
    available_slots = serializers.IntegerField(read_only=True)
    schedules = ScheduleSerializer(many=True, read_only=True)

    class Meta:
        model = Tour
        fields = [
            "id",
            "title",
            "content",
            "date",
            "image",
            "guide",
            "price",
            "participants",
            "meeting_email",
            "meeting_phone",
            "meeting_address",
            "created_at",
            "available_slots",
            "schedules",
        ]


class TourCreateSerializer(serializers.ModelSerializer):
    schedules = ScheduleSerializer(many=True)
    guide = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Tour
        fields = '__all__'

    def create(self, validated_data):
        schedules_data = validated_data.pop('schedules', [])
        tour = Tour.objects.create(**validated_data)
        for schedule_data in schedules_data:
            Schedule.objects.create(tour=tour, **schedule_data)
        return tour
