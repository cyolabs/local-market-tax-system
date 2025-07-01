from django.contrib.auth.models import AbstractUser
from django.db import models
class User(AbstractUser):
    full_name = models.CharField(max_length=100)
    national_id = models.CharField(max_length=20, unique=True, blank=False, null=False)

    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('vendor', 'Vendor'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='vendor')

    BUSINESS_TYPES = [
        ('retail', 'Retail'),
        ('wholesale', 'Wholesale'),
        ('service', 'Service Provider'),
        ('other', 'Other'),
    ]
    business_type = models.CharField(max_length=20, choices=BUSINESS_TYPES)

    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other'),
    ]
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES)

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
    market_of_operation = models.CharField(max_length=20, choices=MARKET_CHOICES)

    date_registered = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return f"{self.full_name} ({self.national_id})"
class PaymentTransaction(models.Model):
    TRANSACTION_STATUS = [
        ('Pending', 'Pending'),
        ('Completed', 'Completed'),
        ('Failed', 'Failed'),
    ]
    
    user = models.ForeignKey(
        'User',  # Use string reference to avoid circular import
        on_delete=models.SET_NULL, 
        null=True, 
        related_name='transactions'
    )
    phone_number = models.CharField(max_length=15)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    account_reference = models.CharField(max_length=100)
    description = models.CharField(max_length=100)
    merchant_request_id = models.CharField(max_length=100)
    checkout_request_id = models.CharField(max_length=100)
    receipt_number = models.CharField(max_length=100, null=True, blank=True)
    transaction_date = models.DateTimeField(null=True, blank=True)  # Changed to DateTimeField
    status = models.CharField(
        max_length=15, 
        choices=TRANSACTION_STATUS, 
        default='Pending'
    )
    result_description = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']  # New transactions first
    
    def __str__(self):
        return f"{self.account_reference} - {self.amount}"
    
class PaymentTransaction(models.Model):
    phone_number = models.CharField(max_length=15)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    transaction_id = models.CharField(max_length=100, unique=True)
    merchant_request_id = models.CharField(max_length=100, null=True, blank=True)
    checkout_request_id = models.CharField(max_length=100)
    transaction_date = models.DateTimeField()
    status = models.CharField(max_length=20)
    result_description = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"{self.transaction_id} - {self.status}"

