from rest_framework import serializers
from .models import Attraction, AttractionPhoto
from ratings.serializers import RatingSerializer


class AttractionSerializer(serializers.ModelSerializer):
    rating_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Attraction

        fields = ['id', 'name', 'latitude', 'longitude', 'image_url', 'tags', 'created_at', 'ratings', 'average_rating',
                  'rating_count']


class AttractionPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = AttractionPhoto
        fields = ['id', 'photo', 'uploaded_at']
        read_only_fields = ['uploaded_at']


class AttractionListSerializer(serializers.ModelSerializer):
    main_photo_url = serializers.SerializerMethodField()
    city = serializers.CharField(source='city.name', allow_null=True)
    rating_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Attraction
        fields = [
            'id', 'name', 'latitude', 'longitude', 'city', 'address',
            'main_photo_url', 'average_rating', 'rating_count',"tags"
        ]

    def get_main_photo_url(self, obj):
        if obj.main_photo:
            return obj.main_photo.url
        return None

class AttractionDetailSerializer(serializers.ModelSerializer):
    main_photo_url = serializers.SerializerMethodField()
    additional_photos = AttractionPhotoSerializer(many=True, read_only=True)
    attractions_ratings = RatingSerializer(many=True, read_only=True)
    rating_count = serializers.IntegerField(read_only=True)
    city = serializers.CharField(source='city.name', allow_null=True)

    class Meta:
        model = Attraction
        fields = [
            'id', 'name', 'latitude', 'longitude', 'city', 'address',
            'description', 'tags', 'created_at', 'average_rating',
            'rating_count', 'main_photo_url', 'additional_photos', 'attractions_ratings'
        ]

    def get_main_photo_url(self, obj):
        if obj.main_photo:
            return obj.main_photo.url
        return None

    def validate(self, data):
        latitude = data.get('latitude')
        longitude = data.get('longitude')
        if latitude is not None and (latitude < -90 or latitude > 90):
            raise serializers.ValidationError("Latitude must be между -90 и 90.")
        if longitude is not None and (longitude < -180 or longitude > 180):
            raise serializers.ValidationError("Longitude must be между -180 и 180.")
        return data