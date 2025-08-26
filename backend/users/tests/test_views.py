import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from users.models import User

@pytest.mark.django_db
def test_register_view_creates_user_and_returns_tokens():
    client = APIClient()
    url = reverse("register")  # убедись, что у тебя в urls.py имя роута = "register"

    data = {
        "username": "apiviewuser",
        "email": "apiview@example.com",
        "password": "SuperSecret123!",
        "first_name": "Alice",
        "last_name": "Smith",
        "is_guide": False,
    }

    response = client.post(url, data, format="json")
    assert response.status_code == 201
    response_data = response.json()

    # Проверяем наличие токенов
    assert "access" in response_data
    assert "refresh" in response_data
    assert "user" in response_data
    assert response_data["user"]["username"] == "apiviewuser"

    # Проверяем, что пользователь реально создался
    assert User.objects.filter(username="apiviewuser").exists()
