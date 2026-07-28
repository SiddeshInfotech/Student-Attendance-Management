from rest_framework import viewsets, filters, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Subject, TeacherSubject
from .serializers import SubjectSerializer

class SubjectViewSet(viewsets.ModelViewSet):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer
    permission_classes = [permissions.IsAuthenticated]

    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["subject_name", "subject_code"]
    ordering_fields = ["subject_name", "created_at"]

    @action(detail=True, methods=["post"])
    def assign(self, request, pk=None):
        subject = self.get_object()
        teacher_ids = request.data.get("teacher_ids", [])
        if not isinstance(teacher_ids, list):
            return Response({"detail": "teacher_ids must be a list"}, status=status.HTTP_400_BAD_REQUEST)

        TeacherSubject.objects.filter(subject=subject).delete()
        for tid in teacher_ids:
            TeacherSubject.objects.create(teacher_id=tid, subject=subject)

        return Response({"detail": "Teachers assigned to subject successfully"})
