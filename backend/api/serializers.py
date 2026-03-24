from rest_framework import serializers
from .models import User, Doctor, Appointment, Consultation, Ticket


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 'full_name', 'dob', 'national_id',
            'gender', 'phone', 'email', 'role', 'password'
        ]
        extra_kwargs = {
            'password': {'write_only': True},
            'role':     {'read_only': True},
            'email':    {'required': False}
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


class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = [
            'id', 'name', 'department',
            'specialty', 'status', 'phone'
        ]


class AppointmentSerializer(serializers.ModelSerializer):
    doctor_name       = serializers.CharField(source='doctor.name', read_only=True)
    doctor_department = serializers.CharField(source='doctor.department', read_only=True)

    class Meta:
        model = Appointment
        fields = [
            'id', 'doctor', 'doctor_name', 'doctor_department',
            'date_time', 'notes',
            'status', 'type', 'created_at'
        ]
        extra_kwargs = {
            'doctor':     {'write_only': True},
            'created_at': {'read_only': True},
        }


class ConsultationSerializer(serializers.ModelSerializer):
    doctor_name       = serializers.CharField(source='doctor.name', read_only=True)
    doctor_department = serializers.CharField(source='doctor.department', read_only=True)

    class Meta:
        model = Consultation
        fields = [
            'id', 'doctor', 'doctor_name', 'doctor_department',
            'date', 'notes', 'follow_up', 'created_at'
        ]
        extra_kwargs = {
            'doctor':     {'write_only': True},
            'created_at': {'read_only': True},
        }


class TicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = [
            'id', 'subject', 'type', 'message',
            'status', 'response', 'date'
        ]
        extra_kwargs = {
            'status':   {'read_only': True},
            'response': {'read_only': True},
            'date':     {'read_only': True},
        }