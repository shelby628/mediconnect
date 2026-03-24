from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    full_name = models.CharField(max_length=255)
    dob = models.DateField(null=True, blank=True)
    national_id = models.CharField(max_length=50, unique=True)
    gender = models.CharField(max_length=20, choices=[('Male', 'Male'), ('Female', 'Female'), ('Other', 'Other')])
    phone = models.CharField(max_length=20)
    username = models.CharField(max_length=50, unique=True)
    email = models.EmailField(unique=True, null=True, blank=True, default=None)
    role = models.CharField(
        max_length=20,
        choices=[
            ('patient', 'Patient'),
            ('admin', 'Admin'),
            ('doctor', 'Doctor')
        ],
        default='patient'
    )
    REQUIRED_FIELDS = ['full_name', 'phone']

    def __str__(self):
        return self.full_name


class Doctor(models.Model):
    STATUS_CHOICES = [
        ('Available', 'Available'),
        ('Fully Booked', 'Fully Booked'),
        ('Unavailable', 'Unavailable'),
    ]

    name = models.CharField(max_length=255)
    department = models.CharField(max_length=100)
    specialty = models.CharField(max_length=100)
    phone = models.CharField(max_length=20, null=True, blank=True)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='Available'
    )

    def __str__(self):
        return self.name


class Appointment(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Approved', 'Approved'),
        ('Completed', 'Completed'),
        ('Cancelled', 'Cancelled'),
    ]

    TYPE_CHOICES = [
        ('Upcoming', 'Upcoming'),
        ('Past', 'Past'),
    ]

    # ── Belongs to a patient ──
    patient = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='appointments'
    )

    doctor = models.ForeignKey(
        Doctor,
        on_delete=models.SET_NULL,
        null=True,
        related_name='appointments'
    )

    date_time = models.DateTimeField()
    notes = models.TextField(null=True, blank=True)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='Pending'
    )
    type = models.CharField(
        max_length=20,
        choices=TYPE_CHOICES,
        default='Upcoming'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"APT-{self.id} | {self.patient.full_name} → {self.doctor.name}"


class Consultation(models.Model):
    # ── Belongs to a patient ──
    patient = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='consultations'
    )

    doctor = models.ForeignKey(
        Doctor,
        on_delete=models.SET_NULL,
        null=True,
        related_name='consultations'
    )

    date = models.DateField()
    notes = models.TextField(null=True, blank=True)
    follow_up = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"CNS-{self.id} | {self.patient.full_name} → {self.doctor.name}"


class Ticket(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Responded', 'Responded'),
        ('Resolved', 'Resolved'),
    ]

    TYPE_CHOICES = [
        ('Technical', 'Technical'),
        ('Appointment', 'Appointment'),
        ('Billing', 'Billing'),
        ('Medical Record', 'Medical Record'),
        ('Other', 'Other'),
    ]

    # ── Belongs to a patient ──
    patient = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='tickets'
    )

    subject = models.CharField(max_length=255)
    type = models.CharField(
        max_length=20,
        choices=TYPE_CHOICES,
        default='Technical'
    )
    message = models.TextField()
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='Pending'
    )
    response = models.TextField(null=True, blank=True)
    date = models.DateField(auto_now_add=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"TKT-{self.id} | {self.patient.full_name} - {self.subject}"


class Notification(models.Model):
    # ── Belongs to a patient ──
    patient = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='notifications'
    )

    title = models.CharField(max_length=255)
    message = models.TextField()
    type = models.CharField(max_length=50, null=True, blank=True)
    read = models.BooleanField(default=False)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.patient.full_name} - {self.title}"