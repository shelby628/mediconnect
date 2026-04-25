from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response

from rest_framework_simplejwt.tokens import RefreshToken

from .models import User, Doctor, Appointment, Consultation, Ticket
from .serializers import (
    UserSerializer,
    DoctorSerializer,
    AppointmentSerializer,
    ConsultationSerializer,
    TicketSerializer
)
from django.http import JsonResponse

def home(request):
    return JsonResponse({"message": "API is running"})


# =========================
# JWT HELPER
# =========================
def get_tokens(user):
    refresh = RefreshToken.for_user(user)
    return {
        "refresh": str(refresh),
        "access": str(refresh.access_token),
    }


# =========================
# AUTH
# =========================
# ── Replace ONLY these two views in your views.py ──

@api_view(['POST'])
@permission_classes([AllowAny])
@authentication_classes([])
def signup(request):
    serializer = UserSerializer(data=request.data)

    if serializer.is_valid():
        user = serializer.save()
        tokens = get_tokens(user)

        return Response({
            "message": "User created",
            "tokens": tokens,
            "user": {
                "id": user.id,
                "full_name": user.full_name,
                "role": user.role,
                "phone": user.phone,
                "gender": user.gender,
                "dob": str(user.dob) if user.dob else None,
                "national_id": user.national_id,
            }
        }, status=201)

    return Response(serializer.errors, status=400)


@api_view(['POST'])
@permission_classes([AllowAny])
@authentication_classes([])
def login(request):
    national_id = request.data.get("nationalId")
    password = request.data.get("password")

    try:
        user = User.objects.get(national_id=national_id)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=404)

    if user.check_password(password):
        tokens = get_tokens(user)

        # ✅ Same structure as signup — full user object every time
        return Response({
            "message": "Login successful",
            "tokens": tokens,
            "user": {
                "id": user.id,
                "full_name": user.full_name,
                "role": user.role,
                "phone": user.phone,
                "gender": user.gender,
                "dob": str(user.dob) if user.dob else None,
                "national_id": user.national_id,
            }
        })

    return Response({"error": "Invalid credentials"}, status=401)

# =========================
# DOCTORS
# =========================
@api_view(['GET'])
@permission_classes([AllowAny])
def get_doctors(request):
    doctors = Doctor.objects.all()
    serializer = DoctorSerializer(doctors, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_doctor(request):
    if request.user.role != "admin":
        return Response({"error": "Only admin allowed"}, status=403)

    user_id = request.data.get("user")

    try:
        user = User.objects.get(id=user_id, role="doctor")
    except User.DoesNotExist:
        return Response({"error": "Doctor user not found"}, status=404)

    doctor = Doctor.objects.create(
        user=user,
        department=request.data.get("department"),
        specialty=request.data.get("specialty"),
        phone=request.data.get("phone"),
    )

    serializer = DoctorSerializer(doctor)
    return Response(serializer.data, status=201)


@api_view(['GET'])
@permission_classes([AllowAny])
def doctor_detail(request, pk):
    try:
        doctor = Doctor.objects.get(pk=pk)
    except Doctor.DoesNotExist:
        return Response({"error": "Doctor not found"}, status=404)

    serializer = DoctorSerializer(doctor)
    return Response(serializer.data)


# =========================
# APPOINTMENTS
# =========================
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def appointments(request):
    if request.method == "GET":
        appts = Appointment.objects.filter(patient=request.user)
        serializer = AppointmentSerializer(appts, many=True)
        return Response(serializer.data)

    doctor_id = request.data.get("doctor")

    try:
        doctor = Doctor.objects.get(id=doctor_id)
    except Doctor.DoesNotExist:
        return Response({"error": "Doctor not found"}, status=404)

    serializer = AppointmentSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save(patient=request.user, doctor=doctor)
        return Response(serializer.data, status=201)

    return Response(serializer.errors, status=400)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def appointment_detail(request, pk):
    try:
        appointment = Appointment.objects.get(pk=pk)
    except Appointment.DoesNotExist:
        return Response({"error": "Appointment not found"}, status=404)

    if appointment.patient != request.user and request.user.role != "admin":
        return Response({"error": "Unauthorized"}, status=403)

    if request.method == "GET":
        serializer = AppointmentSerializer(appointment)
        return Response(serializer.data)

    if request.method == "PUT":
        serializer = AppointmentSerializer(appointment, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    if request.method == "DELETE":
        appointment.delete()
        return Response({"message": "Deleted"})


# =========================
# DOCTOR DASHBOARD ENDPOINTS
# =========================

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def doctor_appointments(request):
    """
    Doctor views all appointments assigned to them.
    GET /doctors/me/appointments/
    """
    if request.user.role != "doctor":
        return Response({"error": "Only doctors can access this"}, status=403)

    try:
        doctor = Doctor.objects.get(user=request.user)
    except Doctor.DoesNotExist:
        return Response({"error": "Doctor profile not found"}, status=404)

    appts = Appointment.objects.filter(doctor=doctor).order_by('-created_at')
    serializer = AppointmentSerializer(appts, many=True)
    return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_appointment_status(request, pk):
    """
    PUT /appointments/<pk>/status/

    - Doctor: Approved, Cancelled, Completed — only their own appointments
    - Patient: Cancelled only — only their own appointments
    - Admin: any status on any appointment
    """
    try:
        appointment = Appointment.objects.get(pk=pk)
    except Appointment.DoesNotExist:
        return Response({"error": "Appointment not found"}, status=404)

    new_status = request.data.get("status")
    role = request.user.role

    if role == "doctor":
        try:
            doctor = Doctor.objects.get(user=request.user)
        except Doctor.DoesNotExist:
            return Response({"error": "Doctor profile not found"}, status=404)

        if appointment.doctor != doctor:
            return Response({"error": "This appointment is not assigned to you"}, status=403)

        allowed = ["Approved", "Cancelled", "Completed"]
        if new_status not in allowed:
            return Response({"error": f"Status must be one of: {', '.join(allowed)}"}, status=400)

    elif role == "patient":
        if appointment.patient != request.user:
            return Response({"error": "Unauthorized"}, status=403)

        if new_status != "Cancelled":
            return Response({"error": "Patients can only cancel appointments"}, status=403)

    elif role == "admin":
        allowed = ["Pending", "Approved", "Completed", "Cancelled"]
        if new_status not in allowed:
            return Response({"error": f"Status must be one of: {', '.join(allowed)}"}, status=400)

    else:
        return Response({"error": "Unauthorized"}, status=403)

    appointment.status = new_status
    appointment.save()

    serializer = AppointmentSerializer(appointment)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def write_consultation(request):
    """
    Doctor writes consultation notes after seeing a patient.
    POST /consultations/write/
    Body: { "appointment": <id>, "notes": "...", "follow_up": true/false }
    """
    if request.user.role != "doctor":
        return Response({"error": "Only doctors can write consultations"}, status=403)

    try:
        doctor = Doctor.objects.get(user=request.user)
    except Doctor.DoesNotExist:
        return Response({"error": "Doctor profile not found"}, status=404)

    appointment_id = request.data.get("appointment")

    try:
        appointment = Appointment.objects.get(
            pk=appointment_id,
            doctor=doctor,
            status="Approved"
        )
    except Appointment.DoesNotExist:
        return Response(
            {"error": "Appointment not found, not assigned to you, or not yet approved"},
            status=404
        )

    if hasattr(appointment, 'consultation'):
        return Response({"error": "Consultation already exists for this appointment"}, status=400)

    serializer = ConsultationSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save(appointment=appointment)
        appointment.status = "Completed"
        appointment.save()
        return Response(serializer.data, status=201)

    return Response(serializer.errors, status=400)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def consultations(request):
    """
    GET /consultations/
    - Patient: sees their own consultation notes
    - Doctor: sees notes they wrote
    - Admin: sees all
    """
    if request.user.role == "patient":
        data = Consultation.objects.filter(appointment__patient=request.user)

    elif request.user.role == "doctor":
        try:
            doctor = Doctor.objects.get(user=request.user)
        except Doctor.DoesNotExist:
            return Response({"error": "Doctor profile not found"}, status=404)
        data = Consultation.objects.filter(appointment__doctor=doctor)

    else:
        data = Consultation.objects.all()

    serializer = ConsultationSerializer(data, many=True)
    return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_doctor_status(request):
    """
    Doctor updates their own availability status.
    PUT /doctors/me/status/
    Body: { "status": "Available" | "Fully Booked" | "Unavailable" }
    """
    if request.user.role != "doctor":
        return Response({"error": "Only doctors can update their status"}, status=403)

    try:
        doctor = Doctor.objects.get(user=request.user)
    except Doctor.DoesNotExist:
        return Response({"error": "Doctor profile not found"}, status=404)

    new_status = request.data.get("status")
    allowed = ["Available", "Fully Booked", "Unavailable"]

    if new_status not in allowed:
        return Response({"error": f"Status must be one of: {', '.join(allowed)}"}, status=400)

    doctor.status = new_status
    doctor.save()

    serializer = DoctorSerializer(doctor)
    return Response(serializer.data)


# =========================
# TICKETS
# =========================
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def tickets(request):
    if request.method == "GET":
        data = Ticket.objects.filter(patient=request.user)
        serializer = TicketSerializer(data, many=True)
        return Response(serializer.data)

    serializer = TicketSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save(patient=request.user)
        return Response(serializer.data, status=201)

    return Response(serializer.errors, status=400)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def ticket_respond(request, pk):
    """
    Admin responds to a support ticket.
    PUT /tickets/<pk>/respond/
    Body: { "response": "..." }
    """
    if request.user.role != "admin":
        return Response({"error": "Only admin can respond to tickets"}, status=403)

    try:
        ticket = Ticket.objects.get(pk=pk)
    except Ticket.DoesNotExist:
        return Response({"error": "Ticket not found"}, status=404)

    response_text = request.data.get("response")
    if not response_text:
        return Response({"error": "Response text is required"}, status=400)

    ticket.response = response_text
    ticket.status = "Responded"
    ticket.save()

    serializer = TicketSerializer(ticket)
    return Response(serializer.data)


# =========================
# ADMIN ONLY
# =========================
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def all_appointments(request):
    if request.user.role != "admin":
        return Response({"error": "Unauthorized"}, status=403)

    data = Appointment.objects.all()
    serializer = AppointmentSerializer(data, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def all_patients(request):
    if request.user.role != "admin":
        return Response({"error": "Unauthorized"}, status=403)

    patients = User.objects.filter(role="patient")
    data = [{"id": p.id, "name": p.full_name, "phone": p.phone} for p in patients]
    return Response(data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def all_tickets(request):
    if request.user.role != "admin":
        return Response({"error": "Unauthorized"}, status=403)

    data = Ticket.objects.all()
    serializer = TicketSerializer(data, many=True)
    return Response(serializer.data)