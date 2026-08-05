from rest_framework import serializers
from .models import Teacher
from users.serializers import UserSerializer

class TeacherSerializer(serializers.ModelSerializer):
    user_details = UserSerializer(source="user", read_only=True)
    department_name = serializers.CharField(source="department.department_name", read_only=True)

    class Meta:
        model = Teacher
        fields = "__all__"
