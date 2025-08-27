import pytest
from users.serializers import RegisterSerializer
from users.models import User

@pytest.mark.django_db
def test_register_serializer_creates_user():
    data = {
        "username": "newuser_s",
        "email": "new_s@example.com",
        "password": "StrongPass123!",
        "first_name": "andrey",
        "last_name": "pavlov",
        "is_guide": True,
    }
    serializer = RegisterSerializer(data=data)
    assert serializer.is_valid(), serializer.errors

    user = serializer.save()
    assert isinstance(user, User)
    assert user.username == "newuser_s"
    assert user.is_guide is True
    assert user.check_password("StrongPass123!")
