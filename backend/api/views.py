from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import UserSerializer
from .models import User
from django.contrib.auth import authenticate

@api_view(['POST'])
def signup(request):
    data = request.data
    if User.objects.filter(national_id=data.get('nationalId')).exists():
        return Response({"message": "ACCOUNT ALREADY CREATED"}, status=status.HTTP_400_BAD_REQUEST)
    
    # Map frontend camelCase to backend snake_case
    mapped_data = {
        'full_name': data.get('fullName'),
        'dob': data.get('dob'),
        'national_id': data.get('nationalId'),
        'gender': data.get('gender'),
        'phone': data.get('phone'),
        'password': data.get('password')
    }
    
    serializer = UserSerializer(data=mapped_data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def login(request):
    full_name = request.data.get('fullName')
    password = request.data.get('password')
    
    # In a real app, we'd probably use email or ID as username, but user asked for Full Name + Password.
    # We'll try to find the user by full name first.
    try:
        user_obj = User.objects.get(full_name=full_name)
        user = authenticate(username=user_obj.username, password=password)
        if user:
            return Response({"id": user.id, "fullName": user.full_name, "role": "patient"}, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        pass
        
    return Response({"message": "Invalid Credentials"}, status=status.HTTP_401_UNAUTHORIZED)
