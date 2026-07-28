from rest_framework import viewsets, filters, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Teacher
from .serializers import TeacherSerializer
from subjects.models import TeacherSubject, Subject

class TeacherViewSet(viewsets.ModelViewSet):
    queryset = Teacher.objects.all()
    serializer_class = TeacherSerializer
    permission_classes = [permissions.IsAuthenticated]

    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["user__full_name", "user__email", "qualification"]
    ordering_fields = ["teacher_id", "created_at"]

    @action(detail=True, methods=["post"])
    def assign_subjects(self, request, pk=None):
        teacher = self.get_object()
        subject_ids = request.data.get("subject_ids", [])
        if not isinstance(subject_ids, list):
            return Response({"detail": "subject_ids must be a list"}, status=status.HTTP_400_BAD_REQUEST)

        TeacherSubject.objects.filter(teacher_id=teacher.teacher_id).delete()
        for sid in subject_ids:
            subject = Subject.objects.filter(subject_id=sid).first()
            if subject:
                TeacherSubject.objects.create(teacher_id=teacher.teacher_id, subject=subject)

        return Response({"detail": "Subjects assigned to teacher successfully"})

    @action(detail=True, methods=["get"])
    def profile(self, request, pk=None):
        teacher = self.get_object()
        serializer = self.get_serializer(teacher)
        return Response(serializer.data)

    @action(detail=True, methods=["get"])
    def dashboard(self, request, pk=None):
        teacher = self.get_object()
        assigned_subjects = TeacherSubject.objects.filter(teacher_id=teacher.teacher_id).count()

        return Response({
            "teacher_id": teacher.teacher_id,
            "name": teacher.user.full_name,
            "assigned_subjects_count": assigned_subjects,
            "department": teacher.department.department_name if teacher.department else None
        })
