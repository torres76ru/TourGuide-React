from django.db import models
import json

class Attraction(models.Model):
    name = models.CharField(max_length=255)
    latitude = models.FloatField()
    longitude = models.FloatField()
    image_url = models.URLField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    tags = models.JSONField(default=dict, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name