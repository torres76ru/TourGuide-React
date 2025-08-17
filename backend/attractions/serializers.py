from rest_framework import serializers
from .models import Attraction, AttractionPhoto
from ratings.serializers import RatingSerializer

class AttractionSerializer(serializers.ModelSerializer):
    rating_count = serializers.IntegerField(read_only=True)
    class Meta:
        model = Attraction

        fields = ['id', 'name', 'latitude', 'longitude', 'image_url', 'tags', 'created_at', 'ratings', 'average_rating', 'rating_count']

class AttractionPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = AttractionPhoto
        fields = ['id', 'photo', 'uploaded_at']
        read_only_fields = ['uploaded_at']

class AttractionListSerializer(serializers.ModelSerializer):
    main_photo_url = serializers.SerializerMethodField()

    class Meta:
        model = Attraction
        fields = [
            'id', 'name', 'latitude', 'longitude',
            'main_photo_url', 'average_rating'
        ]

    def get_main_photo_url(self, obj):
        if obj.main_photo:
            return obj.main_photo.url
        return None

class AttractionDetailSerializer(serializers.ModelSerializer):
    additional_photos = AttractionPhotoSerializer(many=True, read_only=True)
    main_photo_url = serializers.SerializerMethodField()
    ratings = RatingSerializer(many=True, read_only=True)
    class Meta:
        model = Attraction
        fields = [
            'id', 'name', 'latitude', 'longitude',
            'description', 'tags', 'created_at',
            'average_rating', 'rating_count',
            'main_photo_url', 'additional_photos','ratings'
        ]
    
    def get_main_photo_url(self, obj):
        if obj.main_photo:
            return obj.main_photo.url
        return None
