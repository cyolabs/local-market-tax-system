# Add this to your existing serializers.py file

from rest_framework import serializers
from .models import User, Feedback, PaymentTransaction
from django.contrib.auth.password_validation import validate_password

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

# ADD THIS NEW SERIALIZER
class PaymentTransactionSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.full_name', read_only=True)
    
    class Meta:
        model = PaymentTransaction
        fields = [
            'id', 'transaction_id', 'receipt_number', 'user', 'user_name',
            'phone_number', 'amount', 'account_reference', 'category', 
            'status', 'mpesa_receipt_number', 'created_at', 'updated_at',
            'transaction_date'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'user_name']

class FeedbackSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.full_name', read_only=True)
    user_username = serializers.CharField(source='user.username', read_only=True)
    user_phone = serializers.CharField(source='user.phone_number', read_only=True)
    
    class Meta:
        model = Feedback
        fields = [
            'id', 'subject', 'message', 'status', 'priority',
            'admin_response', 'admin_user', 'user_name', 'user_username', 'user_phone',
            'created_at', 'updated_at', 'resolved_at', 'is_resolved'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'resolved_at', 'is_resolved', 'user_name', 'user_username', 'user_phone']
    
    def create(self, validated_data):
        # The user will be set in the view
        return super().create(validated_data)

class FeedbackCreateSerializer(serializers.ModelSerializer):
    """Simplified serializer for creating feedback"""
    class Meta:
        model = Feedback
        fields = ['subject', 'message']
    
    def validate_subject(self):
        subject = self.validated_data.get('subject', '').strip()
        if len(subject) < 5:
            raise serializers.ValidationError("Subject must be at least 5 characters long.")
        return subject
    
    def validate_message(self):
        message = self.validated_data.get('message', '').strip()
        if len(message) < 10:
            raise serializers.ValidationError("Message must be at least 10 characters long.")
        return message