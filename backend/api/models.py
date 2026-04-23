from django.contrib.auth.models import AbstractUser
from django.db import models


# =========================
# CUSTOM USER MODEL
# =========================
class User(AbstractUser):
    full_name = models.CharField(max_length=255)
    dob = models.DateField(null=True, blank=True)
    national_id = models.CharField(max_length=50, unique=True)

    gender = models.CharField(
        max_length=20,
        choices=[('Male', 'Male'), ('Female', 'Other')]
    )

    phone = models.CharField(max_length=20)

    username = models.CharField(max_length=50, unique=True)
    email = models.EmailField(unique=True, null=True, blank=True)

    role = models.CharField(
        max_length=20,
        choices=[
            ('patient', 'Patient'),
            ('doctor', 'Doctor'),
            ('admin', 'Admin')
        ],
        default='patient'
    )

    # ✅ FIX: ensures createsuperuser asks for these
    REQUIRED_FIELDS = ['email', 'national_id']

    def __str__(self):
        return self.full_name


# =========================
# DOCTOR PROFILE
# =========================
class Doctor(models.Model):
    STATUS_CHOICES = [
        ('Available', 'Available'),
        ('Fully Booked', 'Fully Booked'),
        ('Unavailable', 'Unavailable'),
    ]

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='doctor_profile'
    )

    department = models.CharField(max_length=100)
    specialty = models.CharField(max_length=100)
    phone = models.CharField(max_length=20, null=True, blank=True)

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='Available'
    )

    def __str__(self):
        return self.user.full_name


# =========================
# APPOINTMENT
# =========================
class Appointment(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Approved', 'Approved'),
        ('Completed', 'Completed'),
        ('Cancelled', 'Cancelled'),
    ]

    patient = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='appointments_as_patient'
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

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        doctor_name = self.doctor.user.full_name if self.doctor else "No Doctor"
        return f"APT-{self.id} | {self.patient.full_name} → {doctor_name}"


# =========================
# CONSULTATION
# =========================
class Consultation(models.Model):
    appointment = models.OneToOneField(
        Appointment,
        on_delete=models.CASCADE,
        related_name='consultation'
    )

    notes = models.TextField()
    follow_up = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"CNS-{self.id} | {self.appointment.patient.full_name}"


# =========================
# SUPPORT TICKETS
# =========================
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


# =========================
# NOTIFICATIONS
# =========================
class Notification(models.Model):
    patient = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='notifications'
    )

    title = models.CharField(max_length=255)
    message = models.TextField()
    type = models.CharField(max_length=50, null=True, blank=True)

    read = models.BooleanField(default=False)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.patient.full_name} - {self.title}"