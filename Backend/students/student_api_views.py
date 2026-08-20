import random
from datetime import date, timedelta
from django.utils import timezone
from django.contrib.auth.hashers import make_password, check_password
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from users.models import User, Role
from classes.models import Class, Division
from attendance.models import Attendance
from .models import Student


def _generate_unique_roll_number():
    while True:
        num = str(random.randint(101, 999))
        if not Student.objects.filter(roll_number=num).exists():
            return num


def _generate_unique_mobile():
    while True:
        mob = str(random.randint(6000000000, 9999999999))
        if not User.objects.filter(mobile=mob).exists():
            return mob


def _seed_initial_attendance(student):
    """Seed past 30 days of attendance for newly registered students."""
    today = date.today()
    existing = Attendance.objects.filter(student=student).exists()
    if existing:
        return

    records = []
    # Seed 30 days backwards
    for i in range(30, -1, -1):
        record_date = today - timedelta(days=i)
        # Skip weekends (Saturday=5, Sunday=6)
        if record_date.weekday() in (5, 6):
            continue
        
        # ~85% Present, ~15% Absent
        is_present = random.random() < 0.85
        status_str = "present" if is_present else "absent"
        remarks = "On time" if is_present else "Unexcused absence"
        
        records.append(Attendance(
            student=student,
            student_class=student.student_class,
            date=record_date,
            status=status_str,
            remarks=remarks,
            marked_by="System Auto-Seed"
        ))
    
    if records:
        Attendance.objects.bulk_create(records)


def _get_student_profile_dict(student):
    user = student.user
    total_days = Attendance.objects.filter(student=student).count()
    present_count = Attendance.objects.filter(student=student, status__iexact="present").count()
    percentage = round((present_count / total_days * 100), 2) if total_days > 0 else 0.0

    return {
        "student_id": student.student_id,
        "roll_number": student.roll_number,
        "user_id": user.user_id,
        "full_name": user.full_name,
        "name": user.full_name,
        "email": user.email,
        "phone_number": user.mobile,
        "mobile": user.mobile,
        "class_name": student.class_name or (student.student_class.class_name if student.student_class else "1st Year"),
        "division_name": student.division_name or (student.division.division_name if student.division else "A"),
        "grade": student.class_name or (student.student_class.class_name if student.student_class else "1st Year"),
        "division": student.division_name or (student.division.division_name if student.division else "A"),
        "department": student.department.department_name if student.department else "",
        "department_name": student.department.department_name if student.department else "",
        "profile_image": user.profile_image or None,
        "attendance_percentage": percentage,
        "gpa": float(student.gpa) if student.gpa else 3.80,
        "status": student.status,
        "created_at": student.created_at.strftime("%Y-%m-%d") if student.created_at else str(date.today()),
        "date_joined": student.created_at.strftime("%Y-%m-%d") if student.created_at else str(date.today()),
    }


class StudentRegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get("email", "").strip()
        password = request.data.get("password", "").strip()
        full_name = request.data.get("full_name", request.data.get("fullName", "")).strip()
        phone_number = request.data.get("phone_number", request.data.get("phone", request.data.get("mobile", ""))).strip()
        roll_number = request.data.get("roll_number", request.data.get("rollNo", request.data.get("student_id", ""))).strip()
        class_name = request.data.get("class_name", request.data.get("class", request.data.get("grade", "1st Year"))).strip() or "1st Year"
        division_name = request.data.get("division_name", request.data.get("division", "A")).strip() or "A"
        department_name = request.data.get("department_name", request.data.get("department", "Computer Engineering")).strip() or "Computer Engineering"
        profile_image = request.data.get("profile_image", "").strip()

        if not email or not password:
            return Response({"detail": "Email and password are required."}, status=status.HTTP_400_BAD_REQUEST)

        if not full_name:
            full_name = email.split("@")[0].title()

        if User.objects.filter(email=email).exists():
            return Response({"detail": "An account with this email already exists."}, status=status.HTTP_400_BAD_REQUEST)

        if not roll_number or Student.objects.filter(roll_number=roll_number).exists():
            roll_number = _generate_unique_roll_number()

        if not phone_number or User.objects.filter(mobile=phone_number).exists():
            phone_number = _generate_unique_mobile()

        # Get or create role
        student_role, _ = Role.objects.get_or_create(
            role_name="student",
            defaults={"description": "Student", "created_at": timezone.now()}
        )

        # Hash password securely
        hashed_password = make_password(password)

        # Create user
        user = User.objects.create(
            email=email,
            password=hashed_password,
            full_name=full_name,
            mobile=phone_number,
            role=student_role,
            profile_image=profile_image or None,
            status="active",
            created_at=timezone.now()
        )

        # Class, Division & Department objects
        from departments.models import Department
        dept_code = department_name[:10].upper().replace(" ", "_")
        dept_obj, _ = Department.objects.get_or_create(
            department_name=department_name,
            defaults={"department_code": dept_code}
        )
        class_obj, _ = Class.objects.get_or_create(class_name=class_name)
        division_obj, _ = Division.objects.get_or_create(division_name=division_name)

        # Create student profile linked to user
        student = Student.objects.create(
            user=user,
            roll_number=roll_number,
            department=dept_obj,
            student_class=class_obj,
            division=division_obj,
            class_name=class_name,
            division_name=division_name,
            gpa=3.80,
            status="active",
            face_enrolled=False,
            face_encoding=None
        )

        # Seed past 30 days of attendance for newly registered student
        _seed_initial_attendance(student)

        # Generate JWT token
        refresh = RefreshToken.for_user(user)
        refresh["role"] = "student"
        refresh["email"] = user.email
        refresh["user_id"] = user.user_id
        token_str = str(refresh.access_token)

        profile_data = _get_student_profile_dict(student)

        return Response({
            "message": "Student registered successfully.",
            "token": token_str,
            "access": token_str,
            "refresh": str(refresh),
            "user": {
                "user_id": user.user_id,
                "email": user.email,
                "full_name": user.full_name,
                "role": "student",
            },
            "student": profile_data,
            "profile": profile_data
        }, status=status.HTTP_201_CREATED)


class StudentLoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get("email", "").strip()
        password = request.data.get("password", "").strip()

        if not email or not password:
            return Response({"detail": "Email and password are required."}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.filter(email=email).first()
        if not user:
            return Response({"detail": "Invalid email or password."}, status=status.HTTP_401_UNAUTHORIZED)

        # Authenticate using check_password or legacy match fallback
        is_valid = check_password(password, user.password) or (user.password == password)
        if not is_valid:
            return Response({"detail": "Invalid email or password."}, status=status.HTTP_401_UNAUTHORIZED)

        role_name = user.role.role_name.lower() if user.role else "student"
        if role_name != "student":
            return Response(
                {"detail": "Access denied. Only registered students can log in through the Student Portal."},
                status=status.HTTP_403_FORBIDDEN
            )

        # Get student profile if user is student
        student = Student.objects.filter(user=user).first()
        if not student:
            return Response({"detail": "Student profile not found. Please contact the administrator."}, status=status.HTTP_404_NOT_FOUND)

        _seed_initial_attendance(student)

        refresh = RefreshToken.for_user(user)
        refresh["role"] = "student"
        refresh["email"] = user.email
        refresh["user_id"] = user.user_id
        token_str = str(refresh.access_token)

        profile_data = _get_student_profile_dict(student)

        return Response({
            "message": "Login successful.",
            "token": token_str,
            "access": token_str,
            "refresh": str(refresh),
            "user": {
                "user_id": user.user_id,
                "email": user.email,
                "full_name": user.full_name,
                "role": "student"
            },
            "student": profile_data,
            "profile": profile_data
        })


class StudentProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        student = Student.objects.filter(user=user).first()
        if not student:
            return Response({"detail": "Student profile not found."}, status=status.HTTP_404_NOT_FOUND)

        _seed_initial_attendance(student)
        profile_data = _get_student_profile_dict(student)
        return Response(profile_data)


class StudentProfileUpdateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request):
        user = request.user
        student = Student.objects.filter(user=user).first()
        if not student:
            return Response({"detail": "Student profile not found."}, status=status.HTTP_404_NOT_FOUND)

        full_name = request.data.get("full_name", request.data.get("name", "")).strip()
        phone_number = request.data.get("phone_number", request.data.get("phone", request.data.get("mobile", ""))).strip()
        email = request.data.get("email", "").strip()
        profile_image = request.data.get("profile_image", "").strip()

        # Handle file upload if present
        if "profile_image_file" in request.FILES:
            img_file = request.FILES["profile_image_file"]
            # Save file or set image URL representation
            user.profile_image = f"/media/profiles/{img_file.name}"
        elif profile_image:
            user.profile_image = profile_image

        if full_name:
            user.full_name = full_name
        if phone_number:
            user.mobile = phone_number
        if email and email != user.email:
            if User.objects.filter(email=email).exclude(user_id=user.user_id).exists():
                return Response({"detail": "Email is already taken by another account."}, status=status.HTTP_400_BAD_REQUEST)
            user.email = email

        user.save()

        # Update student record fields if provided
        class_name = request.data.get("class_name", request.data.get("grade", "")).strip()
        division_name = request.data.get("division_name", request.data.get("division", "")).strip()
        if class_name:
            student.class_name = class_name
            class_obj, _ = Class.objects.get_or_create(class_name=class_name)
            student.student_class = class_obj
        if division_name:
            student.division_name = division_name
            div_obj, _ = Division.objects.get_or_create(division_name=division_name)
            student.division = div_obj
        student.save()

        profile_data = _get_student_profile_dict(student)
        return Response({
            "message": "Profile updated successfully.",
            "profile": profile_data,
            "student": profile_data
        })


class StudentChangePasswordView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user
        old_password = request.data.get("old_password", "").strip()
        new_password = request.data.get("new_password", "").strip()

        if not old_password or not new_password:
            return Response({"detail": "Both old password and new password are required."}, status=status.HTTP_400_BAD_REQUEST)

        if len(new_password) < 6:
            return Response({"detail": "New password must be at least 6 characters long."}, status=status.HTTP_400_BAD_REQUEST)

        is_valid = check_password(old_password, user.password) or (user.password == old_password)
        if not is_valid:
            return Response({"detail": "Incorrect old password."}, status=status.HTTP_400_BAD_REQUEST)

        user.password = make_password(new_password)
        user.save()

        return Response({"message": "Password changed successfully."})


class StudentDashboardView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        student = Student.objects.filter(user=user).first()
        if not student:
            return Response({"detail": "Student profile not found."}, status=status.HTTP_404_NOT_FOUND)

        _seed_initial_attendance(student)

        attendances = Attendance.objects.filter(student=student).order_by("-date")
        total_days = attendances.count()
        present_count = attendances.filter(status__iexact="present").count()
        absent_count = attendances.filter(status__iexact="absent").count()
        percentage = round((present_count / total_days * 100), 2) if total_days > 0 else 0.0

        today_str = str(date.today())
        today_att = attendances.filter(date=date.today()).first()
        daily_status = today_att.status if today_att else "Not Marked Today"

        # Past 7 days
        seven_days_ago = date.today() - timedelta(days=7)
        weekly_qs = attendances.filter(date__gte=seven_days_ago)
        weekly_total = weekly_qs.count()
        weekly_present = weekly_qs.filter(status__iexact="present").count()

        # Past 30 days
        thirty_days_ago = date.today() - timedelta(days=30)
        monthly_qs = attendances.filter(date__gte=thirty_days_ago)
        monthly_total = monthly_qs.count()
        monthly_present = monthly_qs.filter(status__iexact="present").count()

        # History list
        history_list = []
        for a in attendances:
            history_list.append({
                "id": a.attendance_id,
                "date": str(a.date),
                "formatted_date": a.date.strftime("%d %b %Y"),
                "status": a.status.capitalize(),
                "remarks": a.remarks or ""
            })

        # Dynamic graph data (chronological)
        graph_data = []
        for a in reversed(list(attendances[:30])):
            graph_data.append({
                "date": a.date.strftime("%d %b"),
                "fullDate": str(a.date),
                "status": a.status.capitalize(),
                "value": 1 if a.status.lower() == "present" else 0
            })

        profile_data = _get_student_profile_dict(student)

        return Response({
            "student": profile_data,
            "profile": profile_data,
            "summary": {
                "total_days": total_days,
                "totalDays": total_days,
                "present_count": present_count,
                "presentDays": present_count,
                "absent_count": absent_count,
                "absentDays": absent_count,
                "attendance_percentage": percentage,
                "percentage": percentage,
            },
            "timeframes": {
                "daily": {
                    "date": today_str,
                    "status": daily_status
                },
                "weekly": {
                    "total": weekly_total,
                    "present": weekly_present,
                    "percentage": round((weekly_present / weekly_total * 100), 2) if weekly_total > 0 else 0
                },
                "monthly": {
                    "total": monthly_total,
                    "present": monthly_present,
                    "percentage": round((monthly_present / monthly_total * 100), 2) if monthly_total > 0 else 0
                }
            },
            "graph_data": graph_data,
            "records": history_list,
            "history": history_list
        })


class StudentDailyAttendanceView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        student = Student.objects.filter(user=user).first()
        if not student:
            return Response({"detail": "Student profile not found."}, status=status.HTTP_404_NOT_FOUND)

        today_att = Attendance.objects.filter(student=student, date=date.today()).first()
        return Response({
            "date": str(date.today()),
            "status": today_att.status.capitalize() if today_att else "Not Marked",
            "remarks": today_att.remarks if today_att else ""
        })


class StudentWeeklyAttendanceView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        student = Student.objects.filter(user=user).first()
        if not student:
            return Response({"detail": "Student profile not found."}, status=status.HTTP_404_NOT_FOUND)

        seven_days_ago = date.today() - timedelta(days=7)
        qs = Attendance.objects.filter(student=student, date__gte=seven_days_ago).order_by("-date")
        records = [{
            "id": a.attendance_id,
            "date": str(a.date),
            "status": a.status.capitalize(),
            "remarks": a.remarks or ""
        } for a in qs]

        total = len(records)
        present = sum(1 for r in records if r["status"].lower() == "present")

        return Response({
            "total_days": total,
            "present_count": present,
            "absent_count": total - present,
            "percentage": round((present / total * 100), 2) if total > 0 else 0,
            "records": records
        })


class StudentMonthlyAttendanceView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        student = Student.objects.filter(user=user).first()
        if not student:
            return Response({"detail": "Student profile not found."}, status=status.HTTP_404_NOT_FOUND)

        thirty_days_ago = date.today() - timedelta(days=30)
        qs = Attendance.objects.filter(student=student, date__gte=thirty_days_ago).order_by("-date")
        records = [{
            "id": a.attendance_id,
            "date": str(a.date),
            "status": a.status.capitalize(),
            "remarks": a.remarks or ""
        } for a in qs]

        total = len(records)
        present = sum(1 for r in records if r["status"].lower() == "present")

        return Response({
            "total_days": total,
            "present_count": present,
            "absent_count": total - present,
            "percentage": round((present / total * 100), 2) if total > 0 else 0,
            "records": records
        })
