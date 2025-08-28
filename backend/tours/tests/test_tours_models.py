import pytest
from django.utils import timezone
from users.models import User
from tours.models import Tour, Schedule
from rest_framework.exceptions import ValidationError
from datetime import timedelta, time


@pytest.mark.django_db
def test_tour_str(user_guide):
    tour = Tour.objects.create(
        title="Test Tour",
        content="Some content",
        date=timezone.now().date() + timedelta(days=1),
        guide=user_guide,
    )
    assert str(tour) == "Test Tour"


@pytest.mark.django_db
def test_schedule_str(user_guide):
    tour = Tour.objects.create(
        title="Test Tour",
        content="Some content",
        date=timezone.now().date() + timedelta(days=1),
        guide=user_guide,
    )
    schedule = Schedule.objects.create(
        tour=tour, day_of_week=0, start_time=time(10, 0), end_time=time(12, 0)
    )
    assert "Понедельник" in str(schedule)


@pytest.mark.django_db
def test_tour_clean_invalid_date(user_guide):
    tour = Tour(
        title="Past Tour",
        content="Past content",
        date=timezone.now().date() - timedelta(days=1),
        guide=user_guide,
    )
    with pytest.raises(ValidationError):
        tour.clean()


@pytest.mark.django_db
def test_add_and_remove_participant(user_guide, user_participant):
    tour = Tour.objects.create(
        title="Future Tour",
        content="Content",
        date=timezone.now().date() + timedelta(days=1),
        guide=user_guide,
        max_participants=1,
    )

    # Добавление
    tour.add_participant(user_participant)
    assert tour.participants.count() == 1

    # Повторное добавление
    with pytest.raises(ValidationError):
        tour.add_participant(user_participant)

    # Удаление
    tour.remove_participant(user_participant)
    assert tour.participants.count() == 0

    # Повторное удаление
    with pytest.raises(ValidationError):
        tour.remove_participant(user_participant)


@pytest.mark.django_db
def test_available_slots(user_guide, user_participant):
    tour = Tour.objects.create(
        title="Future Tour",
        content="Content",
        date=timezone.now().date() + timedelta(days=1),
        guide=user_guide,
        max_participants=2,
    )
    assert tour.available_slots == 2
    tour.add_participant(user_participant)
    assert tour.available_slots == 1
