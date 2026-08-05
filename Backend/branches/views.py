from rest_framework import viewsets, filters, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Branch
from .serializers import BranchSerializer

class BranchViewSet(viewsets.ModelViewSet):
    queryset = Branch.objects.all()
    serializer_class = BranchSerializer
    permission_classes = [permissions.IsAuthenticated]

    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["branch_name", "branch_code"]
    ordering_fields = ["branch_name", "created_at"]

    @action(detail=False, methods=["get"], url_path="by-department/(?P<dept_id>[^/.]+)")
    def by_department(self, request, dept_id=None):
        branches = Branch.objects.filter(department_id=dept_id)
        serializer = self.get_serializer(branches, many=True)
        return Response(serializer.data)
