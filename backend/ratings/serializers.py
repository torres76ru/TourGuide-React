from rest_framework import serializers
from .models import Rating
from users.serializers import UserSerializer
from attractions.models import Attraction  # Assuming you have an Attraction model

class RatingSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Rating
        fields = ['id', 'attraction', 'user', 'value', 'comment', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

    def validate(self, data):

        user = self.context['request'].user
        attraction = data.get('attraction')
        if self.instance is None:  # Only check for create, not update
            if Rating.objects.filter(user=user, attraction=attraction).exists():
                raise serializers.ValidationError(
                    {"detail": "You have already rated this attraction."}
                )
        return data

    def create(self, validated_data):

        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

    def update(self, instance, validated_data):

        instance.value = validated_data.get('value', instance.value)
        instance.comment = validated_data.get('comment', instance.comment)
        instance.save()
        return instance