from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    # Overriding standard fields or adding new ones
    full_name = models.CharField(max_length=255)
    dob = models.DateField(null=True, blank=True)
    national_id = models.CharField(max_length=50, unique=True)
    gender = models.CharField(max_length=20, choices=[('Male', 'Male'), ('Female', 'Female'), ('Other', 'Other')])
    phone = models.CharField(max_length=20)
    
    # We use username as the email or national id, but let's just use national_id as username for uniqueness
    username = models.CharField(max_length=50, unique=True) # This will store national_id
    email = models.EmailField(unique=True, null=True, blank=True)

    REQUIRED_FIELDS = ['full_name', 'phone']

    def __str__(self):
        return self.full_name
