from django.db import models
from django.db.models import Avg, Count
from users.models import User
import os,uuid

def main_photo_path(instance, filename):
    return f'mainphoto/{instance.id}.{filename.split(".")[-1]}'

def additional_photos_path(instance, filename):
    return f'{instance.attraction.id}/{uuid.uuid4()}.{filename.split(".")[-1]}'

class Attraction(models.Model):
    # Основные поля 
    name = models.CharField(max_length=255)
    latitude = models.FloatField()
    longitude = models.FloatField()
    description = models.TextField(blank=True, null=True)
    tags = models.JSONField(default=dict, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    # Поля рейтинга
    average_rating = models.FloatField(default=0.0, editable=False)
    rating_count = models.PositiveIntegerField(default=0, editable=False)
    
    # Главное фото (скачанное с вики)
    main_photo = models.ImageField(
        upload_to=main_photo_path,
        blank=True,
        null=True
    )
    
    # Флаги
    need_photo = models.BooleanField(default=True)
    admin_reviewed = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        # При сохранении проверяем наличие главного фото
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