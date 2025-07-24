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

class PaymentTransaction(models.Model):
    TRANSACTION_STATUS = [
        ('Pending', 'Pending'),
        ('Completed', 'Completed'),
        ('Failed', 'Failed'),
        ('Cancelled', 'Cancelled'),
    ]

    # Internal system ID for tracking (UUID)
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )

    user = models.ForeignKey(
        'User',
        on_delete=models.SET_NULL,
        null=True,
        related_name='transactions'
    )

    phone_number = models.CharField(
        max_length=15,
        validators=[RegexValidator(r'^254[17]\d{8}$', 'Enter a valid phone number in 2547XXXXXXXX format')]
    )

    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(1)]
    )

    # This is the Mpesa Receipt Number from the callback (e.g., RKTXY4WQ6S)
    mpesa_receipt_number = models.CharField(
        max_length=100,
        null=True,
        blank=True,
        unique=True,
        help_text="The Mpesa receipt number from the callback"
    )

    account_reference = models.CharField(
        max_length=100,
        help_text="Payment category (e.g., Fresh products traders)"
    )

    description = models.CharField(max_length=100)

    merchant_request_id = models.CharField(max_length=100, null=True, blank=True)
    checkout_request_id = models.CharField(max_length=100)

    transaction_date = models.DateTimeField(null=True, blank=True)

    status = models.CharField(
        max_length=15,
        choices=TRANSACTION_STATUS,
        default='Pending'
    )

    result_description = models.TextField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Payment Transaction"
        verbose_name_plural = "Payment Transactions"
        indexes = [
            models.Index(fields=['status']),
            models.Index(fields=['created_at']),
            models.Index(fields=['user', 'status']),
        ]

    def __str__(self):
        return f"{self.mpesa_receipt_number or self.id} - {self.status}"
class Feedback(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    subject = models.CharField(max_length=255)
    message = models.TextField()
    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Feedback from {self.user.email} - {self.subject}"