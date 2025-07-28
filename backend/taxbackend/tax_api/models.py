from django.contrib.auth.models import AbstractUser
from django.db import models
import uuid
from django.core.validators import (
    RegexValidator,
    MinValueValidator
)

class User(AbstractUser):
    # Remove first_name/last_name and use full_name only
    full_name = models.CharField(max_length=150)
    username = models.CharField(max_length=150, unique=True)  # Required for AbstractUser
    
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