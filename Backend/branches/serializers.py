from rest_framework import serializers
from .models import Branch

class BranchSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source="department.department_name", read_only=True)

    class Meta:
        model = Branch
        fields = "__all__"
