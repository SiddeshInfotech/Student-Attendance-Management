from rest_framework import viewsets, filters, permissions
from .models import Semester
from .serializers import SemesterSerializer

class SemesterViewSet(viewsets.ModelViewSet):
    queryset = Semester.objects.all()
    serializer_class = SemesterSerializer
    permission_classes = [permissions.IsAuthenticated]

    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["semester_name", "semester_code"]
    ordering_fields = ["semester_name", "created_at"]
