import pytest
from users.models import User
from rest_framework.test import APIClient


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def user_guide(db):
    return User.objects.create_user(
        username="guide", email="guide@test.com", password="password", is_active=True, is_guide=True
    )


@pytest.fixture
def user_participant(db):
    return User.objects.create_user(
        username="participant", email="participant@test.com", password="password", is_active=True
    )
