from rest_framework import serializers, generics
from .models import User
from django.contrib.auth.password_validation import validate_password


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'first_name', 'last_name', 'is_guide']

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name', 'is_guide']
        read_only_fields = ['email']  # email нельзя редактировать

    def update(self, instance, validated_data):
        # на всякий случай — удаляем email, если вдруг он придет
        if instance.email and 'email' in validated_data:
            validated_data.pop('email')
        return super().update(instance, validated_data)
