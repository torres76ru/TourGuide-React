from rest_framework import serializers
from .models import Attraction, AttractionPhoto, PendingAttractionUpdate
from ratings.serializers import RatingSerializer  # Предполагаем, что RatingSerializer уже есть
from users.serializers import UserSerializer  # Предполагаем, что UserSerializer уже есть
from cities.models import City

class AttractionSerializer(serializers.ModelSerializer):
    rating_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Attraction
        fields = [
            'id', 'name', 'latitude', 'longitude', 'image_url', 'tags', 'created_at',
            'ratings', 'average_rating', 'rating_count'
        ]

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
            'main_photo_url', 'average_rating', 'rating_count', 'tags'
        ]

    def get_main_photo_url(self, obj):
        if obj.main_photo:
            return obj.main_photo.url
        return None

class AttractionDetailSerializer(serializers.ModelSerializer):
    main_photo_url = serializers.SerializerMethodField()
    additional_photos = AttractionPhotoSerializer(many=True, read_only=True)
    ratings = RatingSerializer(many=True, read_only=True)
    rating_count = serializers.IntegerField(read_only=True)
    city = serializers.CharField(source='city.name', allow_null=True)

    class Meta:
        model = Attraction
        fields = [
            'id', 'name', 'category', 'description', 'working_hours', 'phone_number',
            'email', 'website', 'cost', 'average_check', 'address', 'latitude',
            'longitude', 'city', 'tags', 'created_at', 'average_rating', 'rating_count',
            'main_photo_url', 'additional_photos', 'ratings'
        ]

    def get_main_photo_url(self, obj):
        if obj.main_photo:
            return obj.main_photo.url
        return None

    def validate(self, data):
        required_fields = ['name', 'category', 'description', 'address']
        for field in required_fields:
            if not data.get(field):
                raise serializers.ValidationError(f"{field} является обязательным.")
        latitude = data.get('latitude')
        longitude = data.get('longitude')
        if latitude is not None and (latitude < -90 or latitude > 90):
            raise serializers.ValidationError("Широта должна быть между -90 и 90.")
        if longitude is not None and (longitude < -180 or longitude > 180):
            raise serializers.ValidationError("Долгота должна быть между -180 и 180.")
        return data

    def create(self, validated_data):
        city_name = validated_data.pop('city')
        city, created = City.objects.get_or_create(name=city_name)
        attraction = Attraction.objects.create(city=city, **validated_data)
        return attraction

    def update(self, instance, validated_data):
        city_name = validated_data.pop('city')
        city, created = City.objects.get_or_create(name=city_name)
        instance.city = city
        instance.name = validated_data.get('name', instance.name)
        instance.category = validated_data.get('category', instance.category)
        instance.description = validated_data.get('description', instance.description)
        instance.address = validated_data.get('address', instance.address)
        instance.latitude = validated_data.get('latitude', instance.latitude)
        instance.longitude = validated_data.get('longitude', instance.longitude)
        instance.save()
        return instance

class PendingAttractionUpdateSerializer(serializers.ModelSerializer):
    city = serializers.CharField(source='city.name', allow_null=True)

    class Meta:
        model = PendingAttractionUpdate
        fields = [
            'id', 'attraction', 'user', 'name', 'category', 'description',
            'working_hours', 'phone_number', 'email', 'website', 'cost',
            'average_check', 'address', 'latitude', 'longitude', 'city',
            'tags', 'status', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']

    def create(self, validated_data):
        city_name = validated_data.pop('city')
        city, created = City.objects.get_or_create(name=city_name)
        validated_data['city'] = city
        return super().create(validated_data)

    def update(self, instance, validated_data):
        city_name = validated_data.pop('city')
        city, created = City.objects.get_or_create(name=city_name)
        instance.city = city
        instance.name = validated_data.get('name', instance.name)
        instance.category = validated_data.get('category', instance.category)
        instance.description = validated_data.get('description', instance.description)
        instance.working_hours = validated_data.get('working_hours', instance.working_hours)
        instance.phone_number = validated_data.get('phone_number', instance.phone_number)
        instance.email = validated_data.get('email', instance.email)
        instance.website = validated_data.get('website', instance.website)
        instance.cost = validated_data.get('cost', instance.cost)
        instance.average_check = validated_data.get('average_check', instance.average_check)
        instance.address = validated_data.get('address', instance.address)
        instance.latitude = validated_data.get('latitude', instance.latitude)
        instance.longitude = validated_data.get('longitude', instance.longitude)
        instance.tags = validated_data.get('tags', instance.tags)
        instance.status = validated_data.get('status', instance.status)
        instance.save()
        return instance