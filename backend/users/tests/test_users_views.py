import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from users.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from users.tokens import account_activation_token
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes

@pytest.mark.django_db
def test_register_view_creates_user_and_returns_tokens():
    client = APIClient()
    url = reverse("register")

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

    assert "access" in response_data
    assert "refresh" in response_data
    assert "user" in response_data
    assert response_data["user"]["username"] == "apiviewuser"


    assert User.objects.filter(username="apiviewuser").exists()


@pytest.mark.django_db
class TestUserViews:
    @pytest.fixture
    def client(self):
        return APIClient()

    @pytest.fixture
    def active_user(self):
        return User.objects.create_user(
            username="activeuser",
            email="active@example.com",
            password="StrongPassword123!",
            is_active=True
        )

    @pytest.fixture
    def inactive_user(self):
        return User.objects.create_user(
            username="inactiveuser",
            email="inactive@example.com",
            password="StrongPassword123!",
            is_active=False
        )

    # -------- LoginView tests --------
    def test_login_with_username_success(self, client, active_user):
        url = reverse("login")
        response = client.post(url, {"username": "activeuser", "password": "StrongPassword123!"})
        assert response.status_code == 200
        assert "access" in response.data
        assert response.data["user"]["username"] == "activeuser"

    def test_login_with_email_success(self, client, active_user):
        url = reverse("login")
        response = client.post(url, {"username": "active@example.com", "password": "StrongPassword123!"})
        assert response.status_code == 200
        assert "refresh" in response.data

    def test_login_wrong_credentials(self, client, active_user):
        url = reverse("login")
        response = client.post(url, {"username": "activeuser", "password": "WrongPassword"})
        assert response.status_code == 400
        assert "error" in response.data

    def test_login_inactive_user(self, client, inactive_user):
        url = reverse("login")
        response = client.post(url, {"username": "inactiveuser", "password": "StrongPassword123!"})
        assert response.status_code == 400
        assert response.data["error"] == "Аккаунт не активирован"

    # -------- MeView tests --------
    def test_me_view_authenticated(self, client, active_user):
        url = reverse("me")
        refresh = RefreshToken.for_user(active_user)
        client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")
        response = client.get(url)
        assert response.status_code == 200
        assert response.data["username"] == "activeuser"

    def test_me_view_unauthenticated(self, client):
        url = reverse("me")
        response = client.get(url)
        assert response.status_code == 401

    # -------- ActivateAccountView tests --------
    def test_activate_account_success(self, client):
        user = User.objects.create_user(
            username="newuser",
            email="new@example.com",
            password="StrongPassword123!",
            is_active=False
        )
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = account_activation_token.make_token(user)
        url = reverse("activate", kwargs={"uidb64": uid, "token": token})
        response = client.get(url)
        assert response.status_code == 200
        user.refresh_from_db()
        assert user.is_active is True

    def test_activate_account_invalid_token(self, client):
        user = User.objects.create_user(
            username="newuser2",
            email="new2@example.com",
            password="StrongPassword123!",
            is_active=False
        )
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        url = reverse("activate", kwargs={"uidb64": uid, "token": "invalid-token"})
        response = client.get(url)
        assert response.status_code == 400
        user.refresh_from_db()
        assert user.is_active is False
