from rest_framework import serializers
from attractions.models import Attraction

class LeaderboardSerializer(serializers.ModelSerializer):
    weighted_average = serializers.FloatField(read_only=True)
    average_rating = serializers.FloatField(read_only=True)
    rating_count = serializers.IntegerField(read_only=True)
    main_photo_url = serializers.SerializerMethodField()

    class Meta:
        model = Attraction
        fields = ['id', 'name', 'category', 'address', 'weighted_average', 'average_rating', 'rating_count','description_short','main_photo_url']

    def get_main_photo_url(self, obj):
        if obj.main_photo:
            return obj.main_photo.url
        return None