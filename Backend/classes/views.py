from rest_framework import viewsets, filters, permissions
from .models import Class
from .serializers import ClassSerializer

class ClassViewSet(viewsets.ModelViewSet):
    queryset = Class.objects.all()
    serializer_class = ClassSerializer
    permission_classes = [permissions.IsAuthenticated]

    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["class_name"]
    ordering_fields = ["class_name", "created_at"]
