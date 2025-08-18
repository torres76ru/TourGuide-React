from django.db import models
from django.db.models import Avg, Count
from users.models import User
from cities.models import City
import os,uuid
from rest_framework import serializers

def main_photo_path(instance, filename):
    return f'mainphoto/{instance.id}.{filename.split(".")[-1]}'

def additional_photos_path(instance, filename):
    return f'{instance.attraction.id}/{uuid.uuid4()}.{filename.split(".")[-1]}'


class Attraction(models.Model):
    # Основные поля
    name = models.CharField(max_length=255)
    latitude = models.FloatField()
    longitude = models.FloatField()
    city = models.ForeignKey(City, on_delete=models.SET_NULL, blank=True, null=True, related_name='attractions')
    address = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    tags = models.JSONField(default=dict, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    admin_uploaded_image = models.ImageField(upload_to='admin_photos/', blank=True, null=True)
    main_photo = models.ImageField(upload_to=main_photo_path, blank=True, null=True)

    # Поля рейтинга
    average_rating = models.FloatField(default=0.0, editable=False)
    rating_count = models.PositiveIntegerField(default=0, editable=False)

    # Флаги
    need_photo = models.BooleanField(default=True)
    admin_reviewed = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if self.main_photo:
            self.need_photo = False
        super().save(*args, **kwargs)


class AttractionPhoto(models.Model):
    attraction = models.ForeignKey(
        Attraction,
        related_name='additional_photos',
        on_delete=models.CASCADE
    )
    photo = models.ImageField(upload_to=additional_photos_path)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True
    )

    def delete(self, *args, **kwargs):
        # Удаляем файл при удалении записи
        storage, path = self.photo.storage, self.photo.path
        super().delete(*args, **kwargs)
        storage.delete(path)
    def update_rating_stats(self):
        from ratings.models import Rating
        stats = Rating.objects.filter(attraction=self).aggregate(
            avg_rating=Avg('value'),
            count=Count('id')
        )
        self.average_rating = stats['avg_rating'] or 0.0
        self.rating_count = stats['count']
        self.save(update_fields=['average_rating', 'rating_count'])