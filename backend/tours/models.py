from django.db import models
from django.conf import settings

class Tour(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField()
    date = models.DateField()
    image = models.ImageField(
        upload_to='tours_img/',
        blank=True,
        null=True
    )

    guide = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='tours'
    )

    participants = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name='tours_joined',
        blank=True
    )

    created_at = models.DateTimeField(auto_now_add=True)

