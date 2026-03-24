import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mediconnect_backend.settings')
django.setup()

from api.models import User

user, created = User.objects.get_or_create(
    full_name='Test Patient',
    defaults={
        'national_id': '00000000',
        'dob': '1990-01-01',
        'gender': 'Male',
        'phone': '1234567890',
        'username': '00000000'
    }
)
user.set_password('password123')
user.save()

print("Test Patient created/updated successfully!")
