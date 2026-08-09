from rest_framework import serializers
from .models import Student
from users.serializers import UserSerializer

class StudentSerializer(serializers.ModelSerializer):
    user_details = UserSerializer(source="user", read_only=True)
    department_name = serializers.CharField(source="department.department_name", read_only=True)
    branch_name = serializers.CharField(source="branch.branch_name", read_only=True)
    class_name = serializers.SerializerMethodField()
    division_name = serializers.SerializerMethodField()

    class Meta:
        model = Student
        fields = "__all__"

    def get_class_name(self, obj):
        if obj.student_class and obj.student_class.class_name:
            return obj.student_class.class_name
        return obj.class_name or ""

    def get_division_name(self, obj):
        if obj.division and obj.division.division_name:
            return obj.division.division_name
        return obj.division_name or ""

