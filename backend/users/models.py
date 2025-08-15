from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    is_guide=models.BooleanField(default=False)
    email = models.EmailField(unique=True)
    is_active = models.BooleanField(default=False)


