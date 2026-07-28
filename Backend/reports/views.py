import csv
import io
from django.http import HttpResponse
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response

from students.models import Student
from teachers.models import Teacher
from attendance.models import Attendance
from departments.models import Department

class ReportViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=["get"])
    def student_report(self, request):
        students = Student.objects.select_related("user", "department", "branch").all()
        data = [
            {
                "student_id": s.student_id,
                "roll_number": s.roll_number,
                "name": s.user.full_name,
                "email": s.user.email,
                "department": s.department.department_name if s.department else "",
                "status": s.status,
            }
            for s in students
        ]
        return Response(data)

    @action(detail=False, methods=["get"])
    def teacher_report(self, request):
        teachers = Teacher.objects.select_related("user", "department").all()
        data = [
            {
                "teacher_id": t.teacher_id,
                "name": t.user.full_name,
                "email": t.user.email,
                "qualification": t.qualification,
                "department": t.department.department_name if t.department else "",
            }
            for t in teachers
        ]
        return Response(data)

    @action(detail=False, methods=["get"])
    def attendance_report(self, request):
        attendances = Attendance.objects.select_related("student__user", "student_class", "subject").all()[:500]
        data = [
            {
                "attendance_id": a.attendance_id,
                "roll_number": a.student.roll_number,
                "student_name": a.student.user.full_name,
                "date": str(a.date),
                "status": a.status,
                "class": a.student_class.class_name if a.student_class else "",
                "subject": a.subject.subject_name if a.subject else "",
            }
            for a in attendances
        ]
        return Response(data)

    @action(detail=False, methods=["get"])
    def department_report(self, request):
        depts = Department.objects.all()
        data = [
            {
                "department_id": d.department_id,
                "name": d.department_name,
                "code": d.department_code,
            }
            for d in depts
        ]
        return Response(data)

    @action(detail=False, methods=["get"])
    def export_excel(self, request):
        attendances = Attendance.objects.select_related("student__user").all()[:100]
        
        response = HttpResponse(content_type="text/csv")
        response["Content-Disposition"] = 'attachment; filename="attendance_report.csv"'
        
        writer = csv.writer(response)
        writer.writerow(["Student Name", "Roll Number", "Date", "Status"])
        for a in attendances:
            writer.writerow([a.student.user.full_name, a.student.roll_number, str(a.date), a.status])
            
        return response

    @action(detail=False, methods=["get"])
    def export_pdf(self, request):
        return Response({"detail": "PDF report generation endpoint ready."})
