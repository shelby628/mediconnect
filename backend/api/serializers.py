from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'full_name', 'dob', 'national_id', 'gender', 'phone', 'password']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        # Use national_id as the username
        user = User(
            username=validated_data['national_id'],
            full_name=validated_data['full_name'],
            dob=validated_data.get('dob'),
            national_id=validated_data['national_id'],
            gender=validated_data['gender'],
            phone=validated_data['phone']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user
