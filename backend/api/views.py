from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from .serializers import (
    UserSerializer, DoctorSerializer,
    AppointmentSerializer, ConsultationSerializer, TicketSerializer
)
from .models import User, Doctor, Appointment, Consultation, Ticket
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken


# ── Helper ──
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access':  str(refresh.access_token),
    }


# ════════════════════════════════
#  AUTH
# ════════════════════════════════

@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
    data = request.data

    if User.objects.filter(national_id=data.get('nationalId')).exists():
        return Response(
            {"message": "An account with this National ID already exists"},
            status=status.HTTP_400_BAD_REQUEST
        )

    mapped_data = {
        'full_name':   data.get('fullName'),
        'dob':         data.get('dob'),
        'national_id': data.get('nationalId'),
        'gender':      data.get('gender'),
        'phone':       data.get('phone'),
        'password':    data.get('password')
    }

    serializer = UserSerializer(data=mapped_data)
    if serializer.is_valid():
        user   = serializer.save()
        tokens = get_tokens_for_user(user)
        return Response({
            'message': 'Account created successfully',
            'tokens':  tokens,
            'user': {
                'id':         user.id,
                'fullName':   user.full_name,
                'nationalId': user.national_id,
                'phone':      user.phone,
                'gender':     user.gender,
                'dob':        str(user.dob) if user.dob else None,
                'email':      user.email,
                'role':       user.role
            }
        }, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    national_id = request.data.get('nationalId')
    password    = request.data.get('password')

    if not national_id or not password:
        return Response(
            {"message": "National ID and password are required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        user_obj = User.objects.get(national_id=national_id)
    except User.DoesNotExist:
        return Response(
            {"message": "No account found with this National ID"},
            status=status.HTTP_404_NOT_FOUND
        )

    user = authenticate(username=user_obj.username, password=password)
    if user:
        tokens = get_tokens_for_user(user)
        return Response({
            'message': 'Login successful',
            'tokens':  tokens,
            'user': {
                'id':         user.id,
                'fullName':   user.full_name,
                'nationalId': user.national_id,
                'phone':      user.phone,
                'gender':     user.gender,
                'dob':        str(user.dob) if user.dob else None,
                'email':      user.email,
                'role':       user.role
            }
        }, status=status.HTTP_200_OK)

    return Response(
        {"message": "Incorrect password"},
        status=status.HTTP_401_UNAUTHORIZED
    )


# ════════════════════════════════
#  DOCTORS
# ════════════════════════════════

@api_view(['GET'])
@permission_classes([AllowAny])
def get_doctors(request):
    doctors = Doctor.objects.all()
    serializer = DoctorSerializer(doctors, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([AllowAny])
def add_doctor(request):
    serializer = DoctorSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT', 'DELETE'])
@permission_classes([AllowAny])
def doctor_detail(request, pk):
    try:
        doctor = Doctor.objects.get(pk=pk)
    except Doctor.DoesNotExist:
        return Response({"message": "Doctor not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT':
        serializer = DoctorSerializer(doctor, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        doctor.delete()
        return Response({"message": "Doctor deleted"}, status=status.HTTP_204_NO_CONTENT)


# ════════════════════════════════
#  APPOINTMENTS
# ════════════════════════════════

@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def appointments(request):

    if request.method == 'GET':
        # Return ONLY this patient's appointments
        apts = Appointment.objects.filter(patient=request.user)
        serializer = AppointmentSerializer(apts, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = AppointmentSerializer(data=request.data)
        if serializer.is_valid():
            # Automatically assign to logged-in patient
            serializer.save(patient=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT', 'DELETE'])
@permission_classes([AllowAny])
def appointment_detail(request, pk):
    try:
        apt = Appointment.objects.get(pk=pk, patient=request.user)
    except Appointment.DoesNotExist:
        return Response({"message": "Appointment not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT':
        serializer = AppointmentSerializer(apt, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        apt.delete()
        return Response({"message": "Appointment deleted"}, status=status.HTTP_204_NO_CONTENT)


# ════════════════════════════════
#  CONSULTATIONS
# ════════════════════════════════

@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def consultations(request):

    if request.method == 'GET':
        cons = Consultation.objects.filter(patient=request.user)
        serializer = ConsultationSerializer(cons, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = ConsultationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(
                patient=request.user,
                department=request.data.get('department', '')
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ════════════════════════════════
#  TICKETS
# ════════════════════════════════

@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def tickets(request):

    if request.method == 'GET':
        # Return ONLY this patient's tickets
        tks = Ticket.objects.filter(patient=request.user)
        serializer = TicketSerializer(tks, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = TicketSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(patient=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@permission_classes([AllowAny])
def ticket_detail(request, pk):
    try:
        ticket = Ticket.objects.get(pk=pk, patient=request.user)
    except Ticket.DoesNotExist:
        return Response({"message": "Ticket not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = TicketSerializer(ticket, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ════════════════════════════════
#  ADMIN ONLY
# ════════════════════════════════

@api_view(['GET'])
@permission_classes([AllowAny])
def all_appointments(request):
    # Admin sees ALL appointments
    if request.user.role != 'admin':
        return Response({"message": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)
    apts = Appointment.objects.all()
    serializer = AppointmentSerializer(apts, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def all_patients(request):
    if request.user.role != 'admin':
        return Response({"message": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)
    patients = User.objects.filter(role='patient')
    
    # Return camelCase to match frontend
    data = [{
        'id':         p.id,
        'fullName':   p.full_name,      # ← camelCase
        'nationalId': p.national_id,    # ← camelCase
        'email':      p.email,
        'gender':     p.gender,
        'phone':      p.phone,
        'dob':        str(p.dob) if p.dob else None,
        'role':       p.role
    } for p in patients]
    
    return Response(data)


@api_view(['GET'])
@permission_classes([AllowAny])
def all_tickets(request):
    # Admin sees ALL tickets
    if request.user.role != 'admin':
        return Response({"message": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)
    tks = Ticket.objects.all()
    serializer = TicketSerializer(tks, many=True)
    return Response(serializer.data)