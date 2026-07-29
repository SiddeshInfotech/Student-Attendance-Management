from datetime import date
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status

from students.models import Student
from teachers.models import Teacher
from departments.models import Department
from subjects.models import Subject
from attendance.models import Attendance

class DashboardView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        today = date.today()
        today_att = Attendance.objects.filter(date=today)
        present_count = today_att.filter(status="present").count()
        absent_count = today_att.filter(status="absent").count()

        recent_students = Student.objects.select_related("user").order_by("-created_at")[:5]
        recent_list = [
            {
                "student_id": s.student_id,
                "name": s.user.full_name,
                "roll_number": s.roll_number,
                "status": s.status,
            }
            for s in recent_students
        ]

        data = {
            "total_students": Student.objects.count(),
            "total_teachers": Teacher.objects.count(),
            "total_departments": Department.objects.count(),
            "total_subjects": Subject.objects.count(),
            "today_attendance": str(today),
            "present_count": present_count,
            "absent_count": absent_count,
            "recent_students": recent_list,
            "charts_data": {
                "attendance_distribution": {
                    "present": present_count,
                    "absent": absent_count,
                }
            },
            "graph_data": [
                {"day": "Mon", "present": present_count},
                {"day": "Tue", "present": present_count},
                {"day": "Wed", "present": present_count},
            ]
        }
        return Response(data, status=status.HTTP_200_OK)
