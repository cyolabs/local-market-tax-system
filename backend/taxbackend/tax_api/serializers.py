from rest_framework import serializers
from .models import User
from django.contrib.auth.password_validation import validate_password
from .models import Feedback

class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = ['id', 'user', 'subject', 'message', 'submitted_at']
        read_only_fields = ['id', 'submitted_at']

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password]
    )
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = [
            'username', 'password', 'password2',
            'full_name', 'national_id', 'business_type',
            'gender', 'email', 'role', 'market_of_operation'
        ]
        extra_kwargs = {
            'national_id': {'required': True},
            'full_name': {'required': True},
            'market_of_operation': {'required': True},
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        role = validated_data.get('role', 'vendor')
        user = User.objects.create_user(
            **validated_data,
            role=role
        )
        return user
