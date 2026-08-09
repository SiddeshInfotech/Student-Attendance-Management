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
    pagination_class = None

    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["roll_number", "user__full_name", "user__email"]
    ordering_fields = ["roll_number", "created_at"]

    def create(self, request, *args, **kwargs):
        data = request.data
        name = data.get("name") or data.get("full_name") or data.get("student_name") or "New Student"
        roll_number = str(data.get("rollNo") or data.get("roll_number") or "").strip()
        grade = data.get("grade") or data.get("class_name") or "Grade 10"
        division = data.get("division") or data.get("division_name") or "A"
        phone = data.get("phone") or data.get("mobile") or ""

        if not roll_number:
            return Response({"detail": "Roll number is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Check existing
        existing = Student.objects.filter(roll_number=roll_number).first()
        if existing:
            serializer = self.get_serializer(existing)
            return Response(serializer.data, status=status.HTTP_200_OK)

        # Create or find User
        from users.models import User, Role
        st_role, _ = Role.objects.get_or_create(role_name="Student", defaults={"description": "Student role"})
        clean_roll = roll_number.replace(" ", "_")
        user_email = f"student_{clean_roll}@school.com"

        user_obj = User.objects.filter(email=user_email).first()
        if not user_obj:
            user_obj = User.objects.create(
                email=user_email,
                full_name=name,
                mobile=phone or f"98{abs(hash(roll_number)) % 100000000:08d}",
                password="pass",
                role=st_role,
                status="active"
            )
        else:
            user_obj.full_name = name
            if phone:
                user_obj.mobile = phone
            user_obj.save()

        # Create or find Class
        from classes.models import Class as ClassModel
        class_obj, _ = ClassModel.objects.get_or_create(class_name=grade)

        student_obj = Student.objects.create(
            user=user_obj,
            roll_number=roll_number,
            student_class=class_obj,
            class_name=grade,
            division_name=division,
            status="active"
        )

        serializer = self.get_serializer(student_obj)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        data = request.data

        from users.models import User, Role
        from django.contrib.auth.hashers import make_password

        email = (data.get("email") or "").strip()
        password = (data.get("password") or "").strip()
        name = (data.get("name") or data.get("full_name") or "").strip()
        phone = (data.get("phone") or data.get("mobile") or "").strip()

        user = instance.user
        if not user:
            if email:
                if User.objects.filter(email=email).exists():
                    user = User.objects.filter(email=email).first()
                else:
                    st_role, _ = Role.objects.get_or_create(role_name="student", defaults={"description": "Student"})
                    user = User.objects.create(
                        email=email,
                        full_name=name or f"Student {instance.roll_number}",
                        mobile=phone or "9999999999",
                        password=make_password(password) if password else make_password("password123"),
                        role=st_role,
                        status="active"
                    )
                instance.user = user
        else:
            if name:
                user.full_name = name
            if email and email != user.email:
                if User.objects.filter(email=email).exclude(user_id=user.user_id).exists():
                    return Response({"detail": "An account with this email already exists."}, status=status.HTTP_400_BAD_REQUEST)
                user.email = email
            if password and len(password) >= 6:
                user.password = make_password(password)
            if phone:
                user.mobile = phone
            user.save()

        roll_number = data.get("rollNo") or data.get("roll_number")
        if roll_number:
            instance.roll_number = roll_number
        grade = data.get("grade") or data.get("class_name")
        if grade:
            from classes.models import Class as ClassModel
            class_obj, _ = ClassModel.objects.get_or_create(class_name=grade)
            instance.student_class = class_obj
            instance.class_name = grade
        division = data.get("division") or data.get("division_name")
        if division:
            instance.division_name = division

        instance.save()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

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
        present_count = attendances.filter(status__iexact="present").count()
        absent_count = attendances.filter(status__iexact="absent").count()
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
