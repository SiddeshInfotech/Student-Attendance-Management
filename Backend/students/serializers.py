from rest_framework import serializers
from .models import Student
from users.serializers import UserSerializer

class StudentSerializer(serializers.ModelSerializer):
    user_details = UserSerializer(source="user", read_only=True)
    department_name = serializers.CharField(source="department.department_name", read_only=True)
    branch_name = serializers.CharField(source="branch.branch_name", read_only=True)
    class_name = serializers.CharField(source="student_class.class_name", read_only=True)

    class Meta:
        model = Student
        fields = "__all__"
