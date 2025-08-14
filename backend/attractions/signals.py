from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from ratings.models import Rating

@receiver([post_save, post_delete], sender=Rating)
def update_attraction_rating(sender, instance, **kwargs):
    instance.attraction.update_rating_stats()