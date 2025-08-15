from django.db import models
from django.db.models import Avg, Count

class Attraction(models.Model):
    name = models.CharField(max_length=255)
    latitude = models.FloatField()
    longitude = models.FloatField()
    image_url = models.URLField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    tags = models.JSONField(default=dict, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    average_rating = models.FloatField(default=0.0, editable=False)
    rating_count = models.PositiveIntegerField(default=0, editable=False)

    need_photo = models.BooleanField(default=False)
    admin_reviewed = models.BooleanField(default=False)

    def update_rating_stats(self):
        from ratings.models import Rating
        stats = Rating.objects.filter(attraction=self).aggregate(
            avg_rating=Avg('value'),
            count=Count('id')
        )
        self.average_rating = stats['avg_rating'] or 0.0
        self.rating_count = stats['count']
        self.save(update_fields=['average_rating', 'rating_count'])

    def __str__(self):
        return self.name