from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from attractions.models import Attraction
from users.models import User

class Rating(models.Model):
    attraction = models.ForeignKey(
        Attraction, 
        on_delete=models.CASCADE,
        related_name='ratings'
    )
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='ratings'
    )
    value = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('attraction', 'user')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.value}* by {self.user} for {self.attraction}"