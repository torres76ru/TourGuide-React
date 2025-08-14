from rest_framework import serializers
from .models import Attraction
from ratings.serializers import RatingSerializer

class AttractionSerializer(serializers.ModelSerializer):
    ratings = RatingSerializer(many=True, read_only=True)
    average_rating = serializers.FloatField(read_only=True)
    rating_count = serializers.IntegerField(read_only=True)
    class Meta:
        model = Attraction
        fields = ['id', 'name', 'latitude', 'longitude', 'image_url', 'tags', 'created_at','ratings','average_rating','rating_count']