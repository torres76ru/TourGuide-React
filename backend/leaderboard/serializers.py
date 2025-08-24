from rest_framework import serializers
from attractions.models import Attraction

class LeaderboardSerializer(serializers.ModelSerializer):
    weighted_average = serializers.FloatField(read_only=True)
    rating_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Attraction
        fields = ['id', 'name', 'category', 'address', 'weighted_average', 'rating_count']