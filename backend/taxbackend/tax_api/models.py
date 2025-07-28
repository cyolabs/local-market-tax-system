# Add this to your existing models.py file

from django.contrib.auth.models import AbstractUser
from django.db import models
import uuid
from django.core.validators import (
    RegexValidator,
    MinValueValidator
)

class User(AbstractUser):
    # Your existing User model code stays the same
    full_name = models.CharField(max_length=150)
    username = models.CharField(max_length=150, unique=True)
   
    national_id = models.CharField(
        max_length=20,
        unique=True,
        validators=[RegexValidator(r'^[0-9]{8,20}$', 'Enter a valid national ID')]
    )
   
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('vendor', 'Vendor'),
    )
    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default='vendor'
    )
    BUSINESS_TYPES = [
        ('retail', 'Retail'),
        ('wholesale', 'Wholesale'),
        ('service', 'Service Provider'),
        ('other', 'Other'),
    ]
    business_type = models.CharField(
        max_length=20,
        choices=BUSINESS_TYPES,
        blank=False
    )
    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other'),
    ]
    gender = models.CharField(
        max_length=1,
        choices=GENDER_CHOICES,
        blank=False
    )
    MARKET_CHOICES = [
        ('kapsabet', 'Kapsabet Market'),
        ('mosoriot', 'Mosoriot Market'),
        ('nandi_hills', 'Nandi Hills Market'),
        ('kabiyet', 'Kabiyet Market'),
        ('kebulonik', 'Kebulonik Market'),
        ('lessos', 'Lessos Market'),
        ('kaiboi', 'Kaiboi Market'),
        ('chepterit', 'Chepterit Market'),
        ('baraton', 'Baraton Market'),
        ('kipkaren', 'Kipkaren Market'),
    ]
    market_of_operation = models.CharField(
        max_length=20,
        choices=MARKET_CHOICES,
        blank=False
    )
    date_registered = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.full_name} ({self.national_id})"

class Feedback(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    subject = models.CharField(max_length=255)
    message = models.TextField()
    submitted_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Feedback from {self.user.email} - {self.subject}"

# ADD THIS NEW MODEL
class PaymentTransaction(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Completed', 'Completed'),
        ('Failed', 'Failed'),
        ('Cancelled', 'Cancelled'),
    ]
    
    CATEGORY_CHOICES = [
        ('Fresh products traders', 'Fresh products traders'),
        ('Livestock and meat', 'Livestock and meat'),
        ('Fish vendors', 'Fish vendors'),
        ('Clothes and textile', 'Clothes and textile'),
        ('Household goods', 'Household goods'),
    ]
    
    transaction_id = models.CharField(max_length=100, unique=True)
    receipt_number = models.CharField(max_length=100, unique=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='payments')
    phone_number = models.CharField(max_length=15)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    account_reference = models.CharField(max_length=200)  # This will store the category
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    mpesa_receipt_number = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    transaction_date = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        
    def save(self, *args, **kwargs):
        if not self.receipt_number:
            # Generate a unique receipt number
            import time
            self.receipt_number = f"RC{int(time.time())}{self.id or ''}"
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"Payment {self.transaction_id} - {self.user.full_name} - KES {self.amount}"