import pytest
from django.utils import timezone
from datetime import timedelta, time
from tours.models import Tour
from tours.serializers import TourCreateSerializer, TourSerializer
from rest_framework.test import APIRequestFactory



@pytest.mark.django_db
def test_tour_create_serializer(user_guide):
    factory = APIRequestFactory()
    request = factory.post("/fake-url/")
    request.user = user_guide  # подменяем user

    data = {
        "title": "Serializer Tour",
        "content": "Test content",
        "date": (timezone.now().date() + timedelta(days=1)),
        "schedules": [
            {"day_of_week": 1, "start_time": "10:00:00", "end_time": "12:00:00"}
        ],
        "meeting_email": "guide@example.com",
    }
    serializer = TourCreateSerializer(data=data, context={"request": request})
    assert serializer.is_valid(), serializer.errors
    tour = serializer.save()
    assert tour.guide == user_guide
    assert tour.schedules.count() == 1


@pytest.mark.django_db
def test_tour_serializer(user_guide, user_participant):
    tour = Tour.objects.create(
        title="Tour",
        content="Content",
        date=timezone.now().date() + timedelta(days=1),
        guide=user_guide,
    )
    tour.add_participant(user_participant)
    serializer = TourSerializer(tour)
    data = serializer.data
    assert data["title"] == "Tour"
    assert len(data["participants"]) == 1
    assert "available_slots" in data
