from rest_framework import serializers
from .models import Rating
from users.serializers import UserSerializer

class RatingSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Rating
        fields = ['id', 'attraction', 'user', 'value', 'comment', 'created_at', 'updated_at']  # Добавлена запятая
        read_only_fields = ['created_at', 'updated_at']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

    def update(self, instance, validated_data):
        instance.value = validated_data.get('value', instance.value)
        instance.comment = validated_data.get('comment', instance.comment)
        instance.save()
        return instance