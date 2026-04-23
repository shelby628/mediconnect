from rest_framework import serializers
from .models import User, Doctor, Appointment, Consultation, Ticket


# =========================
# USER
# =========================
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 'full_name', 'dob', 'national_id',
            'gender', 'phone', 'email', 'role', 'password'
        ]
        extra_kwargs = {
            'password': {'write_only': True},
            'role': {'read_only': True},
            'email': {'required': False}
        }

    def create(self, validated_data):
        user = User(
            username=validated_data['national_id'],
            full_name=validated_data['full_name'],
            dob=validated_data.get('dob'),
            national_id=validated_data['national_id'],
            gender=validated_data['gender'],
            phone=validated_data['phone'],
            email=validated_data.get('email'),
            role='patient'
        )
        user.set_password(validated_data['password'])
        user.save()
        return user


# =========================
# DOCTOR
# =========================
class DoctorSerializer(serializers.ModelSerializer):
    # ✅ FIX: 'name' field does not exist on Doctor model.
    # Name lives on the related User. Expose it as a read-only computed field.
    full_name = serializers.CharField(source='user.full_name', read_only=True)

    class Meta:
        model = Doctor
        fields = [
            'id', 'full_name', 'department',
            'specialty', 'status', 'phone'
        ]
        extra_kwargs = {
            'user': {'read_only': True}
        }


# =========================
# APPOINTMENT
# =========================
class AppointmentSerializer(serializers.ModelSerializer):
    doctor_name = serializers.CharField(source='doctor.user.full_name', read_only=True)
    doctor_department = serializers.CharField(source='doctor.department', read_only=True)
    patient_name = serializers.CharField(source='patient.full_name', read_only=True)

    class Meta:
        model = Appointment
        fields = [
            'id',
            'patient',
            'patient_name',
            'doctor',
            'doctor_name',
            'doctor_department',
            'date_time',
            'notes',
            'status',
            'created_at'
        ]
        extra_kwargs = {
            'patient': {'read_only': True},
            'status': {'read_only': True},   # status is changed via a dedicated endpoint, not here
            'created_at': {'read_only': True},
        }


# =========================
# CONSULTATION
# =========================
class ConsultationSerializer(serializers.ModelSerializer):
    # ✅ FIX: 'doctor' and 'date' do not exist on the Consultation model.
    # Doctor is reachable via appointment → doctor, and date via created_at.
    doctor_name = serializers.CharField(source='appointment.doctor.user.full_name', read_only=True)
    patient_name = serializers.CharField(source='appointment.patient.full_name', read_only=True)

    class Meta:
        model = Consultation
        fields = [
            'id',
            'appointment',
            'patient_name',
            'doctor_name',
            'notes',
            'follow_up',
            'created_at'
        ]
        extra_kwargs = {
            'created_at': {'read_only': True},
        }


# =========================
# TICKET
# =========================
class TicketSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.full_name', read_only=True)

    class Meta:
        model = Ticket
        fields = [
            'id',
            'patient',
            'patient_name',
            'subject',
            'type',
            'message',
            'status',
            'response',
            'date'
        ]
        extra_kwargs = {
            'patient': {'read_only': True},
            'status': {'read_only': True},
            'response': {'read_only': True},
            'date': {'read_only': True},
        }