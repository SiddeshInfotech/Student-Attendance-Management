from rest_framework import serializers
from .models import Class

class ClassSerializer(serializers.ModelSerializer):
    branch_name = serializers.CharField(source="branch.branch_name", read_only=True)
    semester_name = serializers.CharField(source="semester.semester_name", read_only=True)

    class Meta:
        model = Class
        fields = "__all__"
