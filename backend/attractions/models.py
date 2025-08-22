# attractions/models.py

from django.db import models
from django.db.models import Avg, Count
from users.models import User
from cities.models import City
import os, uuid

def main_photo_path(instance, filename):
    return f'mainphoto/{instance.id}.{filename.split(".")[-1]}'

def additional_photos_path(instance, filename):
    return f'{instance.attraction.id}/{uuid.uuid4()}.{filename.split(".")[-1]}'

class Attraction(models.Model):
    name = models.CharField(max_length=255)
    category = models.CharField(max_length=100)
    description = models.TextField(null=True, blank=True)
    address = models.CharField(max_length=255, blank=True, null=True)  # Combined address
    latitude = models.FloatField()
    longitude = models.FloatField()

    working_hours = models.CharField(max_length=255, blank=True, null=True)  # Время работы
    phone_number = models.CharField(max_length=20, blank=True, null=True)  # Номер телефона
    email = models.EmailField(blank=True, null=True)  # Эл. почта
    website = models.URLField(blank=True, null=True)  # Сайт
    cost = models.CharField(max_length=100, blank=True, null=True)  # Стоимость
    average_check = models.CharField(max_length=100, blank=True, null=True)  # Средний чек

    city = models.ForeignKey(City, on_delete=models.SET_NULL, blank=True, null=True, related_name='attractions')
    street = models.CharField(max_length=255, blank=True, null=True)
    house = models.CharField(max_length=10, blank=True, null=True)
    entrance = models.CharField(max_length=10, blank=True, null=True)
    apartment = models.CharField(max_length=10, blank=True, null=True)

    tags = models.JSONField(default=dict, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    main_photo = models.ImageField(upload_to=main_photo_path, blank=True, null=True)
    average_rating = models.FloatField(default=0.0, editable=False)
    rating_count = models.PositiveIntegerField(default=0, editable=False)
    need_photo = models.BooleanField(default=True)
    admin_reviewed = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if self.street or self.house or self.entrance or self.apartment:
            address_parts = [part for part in [self.street, self.house, self.entrance, self.apartment] if part]
            self.address = f"{self.city.name}, {' '.join(address_parts)}" if self.city else ' '.join(address_parts)
        if self.main_photo:
            self.need_photo = False
        super().save(*args, **kwargs)

    def update_related_data(self, new_name):
        if not self.description:
            view = MapAttractionsView()
            wp_description = view.get_wikipedia_description(new_name.replace(' ', '_'))
            if wp_description:
                self.description = wp_description

        if not self.category:
            if 'музей' in new_name.lower():
                self.category = 'Музей'
            elif 'парк' in new_name.lower():
                self.category = 'Парк'
            else:
                self.category = 'Достопримечательность'

        self.save(update_fields=['description', 'category'])

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
        self.rating_count = stats['count'] or 0
        self.save(update_fields=['average_rating', 'rating_count'])

class PendingAttractionUpdate(models.Model):
    attraction = models.ForeignKey(Attraction, on_delete=models.CASCADE, related_name='pending_updates', null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    name = models.CharField(max_length=255, blank=True, null=True)
    category = models.CharField(max_length=100, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    working_hours = models.CharField(max_length=255, blank=True, null=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    website = models.URLField(blank=True, null=True)
    cost = models.CharField(max_length=100, blank=True, null=True)
    average_check = models.CharField(max_length=100, blank=True, null=True)
    address = models.CharField(max_length=255, blank=True, null=True)
    latitude = models.FloatField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)
    city = models.ForeignKey(City, on_delete=models.SET_NULL, blank=True, null=True)
    tags = models.JSONField(default=dict, blank=True, null=True)
    status = models.CharField(
        max_length=20,
        choices=[
            ('pending', 'Pending'),
            ('approved', 'Approved'),
            ('rejected', 'Rejected'),
        ],
        default='pending'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def apply_update(self):
        if not self.attraction:
            attraction = Attraction(
                name=self.name,
                category=self.category,
                description=self.description,
                working_hours=self.working_hours,
                phone_number=self.phone_number,
                email=self.email,
                website=self.website,
                cost=self.cost,
                average_check=self.average_check,
                address=self.address,
                latitude=self.latitude,
                longitude=self.longitude,
                city=self.city,
                tags=self.tags
            )
            attraction.save()
            self.attraction = attraction
        else:
            fields = [
                'name', 'category', 'description', 'working_hours', 'phone_number',
                'email', 'website', 'cost', 'average_check', 'address', 'latitude',
                'longitude', 'city', 'tags'
            ]
            attraction = self.attraction
            for field in fields:
                value = getattr(self, field)
                if value is not None:
                    setattr(attraction, field, value)
            attraction.save()

        self.status = 'approved'
        self.save()

    def __str__(self):
        return f"Pending update for {self.name or 'Unnamed'} by {self.user}"