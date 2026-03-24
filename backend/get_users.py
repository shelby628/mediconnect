import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mediconnect_backend.settings')
django.setup()

from django.contrib.auth import get_user_model
User = get_user_model()

with open('users_list.txt', 'w') as f:
    f.write("--- USERS ---\n")
    for u in User.objects.all():
        f.write(f"Username: {u.username}, Email: {u.email}, is_staff: {u.is_staff}, is_superuser: {u.is_superuser}\n")
    f.write("-------------\n")
