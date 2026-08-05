from rest_framework import viewsets, filters, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Student
from .serializers import StudentSerializer
from attendance.models import Attendance

class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    permission_classes = [permissions.AllowAny]

    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["roll_number", "user__full_name", "user__email"]
    ordering_fields = ["roll_number", "created_at"]

    @action(detail=True, methods=["get"])
    def profile(self, request, pk=None):
        student = self.get_object()
        serializer = self.get_serializer(student)
        return Response(serializer.data)

    @action(detail=True, methods=["patch"])
    def update_status(self, request, pk=None):
        student = self.get_object()
        new_status = request.data.get("status")
        if not new_status:
            return Response({"detail": "Status field is required"}, status=status.HTTP_400_BAD_REQUEST)

        student.status = new_status
        student.save()
        return Response({"detail": "Student status updated successfully", "status": new_status})

    @action(detail=True, methods=["get"])
    def dashboard_data(self, request, pk=None):
        student = self.get_object()
        attendances = Attendance.objects.filter(student=student)
        total_days = attendances.count()
        present_count = attendances.filter(status="present").count()
        absent_count = attendances.filter(status="absent").count()
        percentage = (present_count / total_days * 100) if total_days > 0 else 0

        return Response({
            "student_id": student.student_id,
            "roll_number": student.roll_number,
            "name": student.user.full_name,
            "total_days": total_days,
            "present_count": present_count,
            "absent_count": absent_count,
            "attendance_percentage": round(percentage, 2)
        })
