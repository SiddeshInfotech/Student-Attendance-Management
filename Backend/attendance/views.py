from datetime import date, timedelta
from django.db import transaction
from django.utils import timezone
from rest_framework import viewsets, filters, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Attendance
from .serializers import AttendanceSerializer, BulkAttendanceSerializer
from students.models import Student

class AttendanceViewSet(viewsets.ModelViewSet):
    queryset = Attendance.objects.all().select_related("student", "student__user", "student__department", "student_class", "student_class__semester", "subject")
    serializer_class = AttendanceSerializer
    permission_classes = [permissions.AllowAny]

    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["student__roll_number", "student__user__full_name", "date", "status"]
    ordering_fields = ["date", "attendance_id", "created_at"]

    def get_queryset(self):
        return Attendance.objects.all().select_related(
            "student", "student__user", "student__department",
            "student_class", "subject"
        ).order_by("-created_at", "-attendance_id")

    def _determine_marked_by(self, request):
        if request.user and request.user.is_authenticated:
            if hasattr(request.user, "role") and request.user.role:
                r_name = getattr(request.user.role, "role_name", str(request.user.role))
                return r_name.capitalize()
            return request.user.full_name or "Admin"
        return "Admin"

    def _process_save_payload(self, request):
        data = request.data
        records = []
        if isinstance(data, list):
            records = data
            att_date = str(timezone.now().date())
            class_id = None
            subject_id = None
            marked_by = self._determine_marked_by(request)
        elif isinstance(data, dict) and "records" in data:
            records = data.get("records", [])
            att_date = data.get("date") or str(timezone.now().date())
            class_id = data.get("class_id")
            subject_id = data.get("subject_id")
            marked_by = data.get("marked_by") or self._determine_marked_by(request)
        else:
            records = [data]
            att_date = data.get("date") or str(timezone.now().date())
            class_id = data.get("class_id") or data.get("student_class")
            subject_id = data.get("subject_id") or data.get("subject")
            marked_by = data.get("marked_by") or self._determine_marked_by(request)

        # Parse att_date securely
        try:
            parsed_date = date.fromisoformat(str(att_date).split("T")[0])
        except (ValueError, TypeError):
            parsed_date = timezone.now().date()

        saved_objects = []
        with transaction.atomic():
            for rec in records:
                s_id = rec.get("student_id") or rec.get("studentId") or rec.get("student")
                if not s_id:
                    continue

                att_status = rec.get("status", "Present")
                # Normalize status: Present, Absent, Late
                if str(att_status).lower() == "present":
                    att_status = "Present"
                elif str(att_status).lower() == "absent":
                    att_status = "Absent"
                elif str(att_status).lower() == "late":
                    att_status = "Late"

                remarks = rec.get("remarks", "")
                r_subject_id = rec.get("subject_id") or subject_id
                r_class_id = rec.get("class_id") or class_id

                # Robust student resolution (by PK, roll_number, or auto-creation)
                student_obj = None
                if isinstance(s_id, int) or (isinstance(s_id, str) and s_id.isdigit()):
                    student_obj = Student.objects.filter(pk=int(s_id)).first()

                roll = rec.get("roll_number") or rec.get("rollNo")
                if not student_obj and roll:
                    student_obj = Student.objects.filter(roll_number=roll).first()

                if not student_obj and isinstance(s_id, str):
                    student_obj = Student.objects.filter(roll_number=s_id).first()

                if not student_obj:
                    try:
                        from users.models import User, Role
                        st_role, _ = Role.objects.get_or_create(role_name="Student", defaults={"description": "Student role"})
                        s_name = rec.get("student_name") or rec.get("name") or f"Student {s_id}"
                        clean_id = str(s_id).replace("s", "")
                        u_email = f"student_{clean_id}@school.com"
                        user_obj = User.objects.filter(email=u_email).first()
                        if not user_obj:
                            user_obj = User.objects.create(
                                email=u_email,
                                full_name=s_name,
                                mobile=f"98{abs(hash(str(s_id))) % 100000000:08d}",
                                password="pass",
                                role=st_role,
                                status="active"
                            )
                        r_num = str(roll or s_id)
                        student_obj = Student.objects.create(
                            user=user_obj,
                            roll_number=r_num,
                            status="Active"
                        )
                    except Exception as e:
                        print("Failed to auto-create student:", e)
                        continue

                s_id = student_obj.pk

                # Verify subject exists before using in lookup
                valid_subject_id = None
                if r_subject_id:
                    try:
                        from subjects.models import Subject as SubjectModel
                        if SubjectModel.objects.filter(pk=r_subject_id).exists():
                            valid_subject_id = r_subject_id
                    except Exception:
                        pass

                # Prevent duplicate entries using update_or_create
                lookup_kwargs = {
                    "student_id": s_id,
                    "date": parsed_date,
                }
                if valid_subject_id:
                    lookup_kwargs["subject_id"] = valid_subject_id

                defaults = {
                    "status": att_status,
                    "remarks": remarks,
                    "marked_by": marked_by,
                }

                # Verify class exists before assigning
                if r_class_id:
                    try:
                        from classes.models import Class as ClassModel
                        if ClassModel.objects.filter(pk=r_class_id).exists():
                            defaults["student_class_id"] = r_class_id
                    except Exception:
                        pass

                obj, created = Attendance.objects.update_or_create(
                    **lookup_kwargs,
                    defaults=defaults
                )

                # Ensure created_at / timestamp is fresh for ordering
                if not created:
                    Attendance.objects.filter(pk=obj.attendance_id).update(created_at=timezone.now())
                    obj.refresh_from_db()

                saved_objects.append(obj)

        return saved_objects

    def create(self, request, *args, **kwargs):
        saved_objects = self._process_save_payload(request)
        serializer = self.get_serializer(saved_objects, many=True)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=["post"])
    def mark(self, request):
        saved_objects = self._process_save_payload(request)
        serializer = self.get_serializer(saved_objects, many=True)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=["post"])
    def bulk(self, request):
        saved_objects = self._process_save_payload(request)
        serializer = self.get_serializer(saved_objects, many=True)
        return Response({
            "detail": f"{len(saved_objects)} attendance records processed successfully.",
            "records": serializer.data
        }, status=status.HTTP_200_OK)

    @action(detail=False, methods=["get"])
    def today(self, request):
        today_date = timezone.now().date()
        qs = self.get_queryset().filter(date=today_date).order_by("-created_at", "-attendance_id")
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def daily(self, request):
        target_date_str = request.query_params.get("date")
        if target_date_str:
            try:
                target_date = date.fromisoformat(target_date_str)
            except ValueError:
                target_date = timezone.now().date()
        else:
            target_date = timezone.now().date()

        qs = self.get_queryset().filter(date=target_date).order_by("-created_at", "-attendance_id")
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

        qs = qs.order_by("-created_at", "-attendance_id")
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def history(self, request):
        today = timezone.now().date()
        period = request.query_params.get("period", "").lower()
        student_id = request.query_params.get("student_id")
        start_date = request.query_params.get("start_date")
        end_date = request.query_params.get("end_date")
        status_filter = request.query_params.get("status")

        qs = self.get_queryset()

        if student_id:
            qs = qs.filter(student_id=student_id)

        if period == "today":
            qs = qs.filter(date=today)
        elif period == "7days":
            qs = qs.filter(date__range=[today - timedelta(days=6), today])
        elif period == "10days":
            qs = qs.filter(date__range=[today - timedelta(days=9), today])
        elif period == "30days":
            qs = qs.filter(date__range=[today - timedelta(days=29), today])
        elif period == "custom" and start_date and end_date:
            try:
                s_date = date.fromisoformat(start_date)
                e_date = min(date.fromisoformat(end_date), today)
                qs = qs.filter(date__range=[s_date, e_date])
            except ValueError:
                qs = qs.filter(date__lte=today)
        elif start_date and end_date:
            try:
                s_date = date.fromisoformat(start_date)
                e_date = min(date.fromisoformat(end_date), today)
                qs = qs.filter(date__range=[s_date, e_date])
            except ValueError:
                qs = qs.filter(date__lte=today)
        else:
            # Default to no future records
            qs = qs.filter(date__lte=today)

        if status_filter and status_filter.lower() != "all":
            qs = qs.filter(status__iexact=status_filter)

        qs = qs.order_by("-created_at", "-attendance_id")
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def percentage(self, request):
        student_id = request.query_params.get("student_id")
        if not student_id:
            return Response({"detail": "student_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        total = Attendance.objects.filter(student_id=student_id).count()
        present = Attendance.objects.filter(student_id=student_id, status__iexact="present").count()
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

        qs = qs.order_by("-created_at", "-attendance_id")
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)
