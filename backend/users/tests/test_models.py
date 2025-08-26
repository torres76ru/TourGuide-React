import pytest
from users.models import User

@pytest.mark.django_db
def test_user_creation():
    user = User.objects.create_user(username="testuser_m", email="test_m@example.com", password="pass123")
    assert user.username == "testuser_m"
    assert user.email == "test_m@example.com"
    assert user.check_password("pass123")
    assert not user.is_guide
