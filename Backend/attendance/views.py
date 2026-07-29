from datetime import date
from django.db.models import Count, Q
from rest_framework import viewsets, filters, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Attendance
from .serializers import AttendanceSerializer, BulkAttendanceSerializer
from students.models import Student

class AttendanceViewSet(viewsets.ModelViewSet):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer
    permission_classes = [permissions.IsAuthenticated]

    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["student__roll_number", "student__user__full_name", "date", "status"]
    ordering_fields = ["date", "attendance_id"]

    @action(detail=False, methods=["post"])
    def mark(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=["post"])
    def bulk(self, request):
        serializer = BulkAttendanceSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        att_date = serializer.validated_data["date"]
        class_id = serializer.validated_data["class_id"]
        subject_id = serializer.validated_data.get("subject_id")
        records = serializer.validated_data["records"]

        created_records = []
        for rec in records:
            student_id = rec.get("student_id")
            att_status = rec.get("status", "absent")
            remarks = rec.get("remarks", "")

            obj, created = Attendance.objects.update_or_create(
                student_id=student_id,
                date=att_date,
                student_class_id=class_id,
                subject_id=subject_id,
                defaults={"status": att_status, "remarks": remarks}
            )
            created_records.append(obj.attendance_id)

        return Response({"detail": f"{len(created_records)} attendance records processed successfully."})

    @action(detail=False, methods=["get"])
    def daily(self, request):
        target_date = request.query_params.get("date", str(date.today()))
        qs = self.get_queryset().filter(date=target_date)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def monthly(self, request):
        month = request.query_params.get("month")  # Format YYYY-MM
        student_id = request.query_params.get("student_id")
        qs = self.get_queryset()
        if month:
            qs = qs.filter(date__startswith=month)
        if student_id:
            qs = qs.filter(student_id=student_id)

        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def history(self, request):
        student_id = request.query_params.get("student_id")
        if not student_id:
            return Response({"detail": "student_id is required"}, status=status.HTTP_400_BAD_REQUEST)
        qs = self.get_queryset().filter(student_id=student_id).order_by("-date")
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def percentage(self, request):
        student_id = request.query_params.get("student_id")
        if not student_id:
            return Response({"detail": "student_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        total = Attendance.objects.filter(student_id=student_id).count()
        present = Attendance.objects.filter(student_id=student_id, status="present").count()
        percentage = (present / total * 100) if total > 0 else 0.0

        return Response({
            "student_id": student_id,
            "total_classes": total,
            "present_classes": present,
            "attendance_percentage": round(percentage, 2)
        })

    @action(detail=False, methods=["get"])
    def report(self, request):
        class_id = request.query_params.get("class_id")
        subject_id = request.query_params.get("subject_id")
        start_date = request.query_params.get("start_date")
        end_date = request.query_params.get("end_date")

        qs = self.get_queryset()
        if class_id:
            qs = qs.filter(student_class_id=class_id)
        if subject_id:
            qs = qs.filter(subject_id=subject_id)
        if start_date and end_date:
            qs = qs.filter(date__range=[start_date, end_date])

        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)
