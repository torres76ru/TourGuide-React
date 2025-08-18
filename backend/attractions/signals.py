from django.db.models.signals import post_save
from django.dispatch import receiver
from ratings.models import Rating

@receiver(post_save, sender=Rating)
def update_attraction_rating(sender, instance, **kwargs):
    try:
        instance.attraction.update_rating_stats()
    except Exception as e:
        print(f"Error updating rating stats: {str(e)}")