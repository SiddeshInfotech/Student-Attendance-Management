from rest_framework import viewsets, filters, permissions
from .models import Department
from .serializers import DepartmentSerializer
from permissions import IsAdmin

class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["department_name", "department_code"]
    ordering_fields = ["department_name", "created_at"]