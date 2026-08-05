from rest_framework import serializers
from .models import Subject

class SubjectSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source="department.department_name", read_only=True)
    semester_name = serializers.CharField(source="semester.semester_name", read_only=True)

    class Meta:
        model = Subject
        fields = "__all__"
