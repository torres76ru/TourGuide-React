import pytest
from django.utils import timezone
from datetime import timedelta
from tours.models import Tour


@pytest.mark.django_db
def test_create_tour_as_guide(api_client, user_guide):
    api_client.force_authenticate(user=user_guide)
    data = {
        "title": "API Tour",
        "content": "Some description",
        "date": (timezone.now().date() + timedelta(days=1)),
        "schedules": [],
        "meeting_email": "guide@example.com",
    }
    response = api_client.post("/api/tours/", data, format="json")
    assert response.status_code == 201
    assert Tour.objects.count() == 1


@pytest.mark.django_db
def test_create_tour_as_not_guide(api_client, user_participant):
    api_client.force_authenticate(user=user_participant)
    data = {
        "title": "API Tour",
        "content": "Some description",
        "date": (timezone.now().date() + timedelta(days=1)),
        "schedules": [],
        "meeting_email": "user@example.com",
    }
    response = api_client.post("/api/tours/", data, format="json")
    assert response.status_code == 403
    assert "Только гид" in response.data["detail"]


@pytest.mark.django_db
def test_join_and_leave_tour(api_client, user_guide, user_participant):
    tour = Tour.objects.create(
        title="Join Tour",
        content="Content",
        date=timezone.now().date() + timedelta(days=1),
        guide=user_guide,
    )

    api_client.force_authenticate(user=user_participant)
    join_response = api_client.post(f"/api/tours/{tour.id}/join/")
    assert join_response.status_code == 200
    assert tour.participants.count() == 1

    leave_response = api_client.post(f"/api/tours/{tour.id}/leave/")
    assert leave_response.status_code == 200
    assert tour.participants.count() == 0


@pytest.mark.django_db
def test_cannot_join_full_tour(api_client, user_guide, user_participant, django_user_model):
    tour = Tour.objects.create(
        title="Full Tour",
        content="Content",
        date=timezone.now().date() + timedelta(days=1),
        guide=user_guide,
        max_participants=1,
    )
    another_user = django_user_model.objects.create_user(
        username="another", email="a@test.com", password="1234", is_active=True
    )
    tour.add_participant(another_user)

    api_client.force_authenticate(user=user_participant)
    response = api_client.post(f"/api/tours/{tour.id}/join/")
    assert response.status_code == 400
    assert "Достигнут лимит" in str(response.data["error"])
