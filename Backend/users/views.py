import uuid
from django.utils import timezone
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import generics
from rest_framework_simplejwt.tokens import RefreshToken

from .models import User, Role, PasswordResetToken
from .serializers import (
    UserSerializer,
    LoginSerializer,
    ChangePasswordSerializer,
    ForgotPasswordSerializer,
    ResetPasswordSerializer,
)
from utils import generate_random_token, send_password_reset_email


def _generate_unique_mobile():
    """Generate a unique placeholder mobile number."""
    import random
    while True:
        mob = str(random.randint(6000000000, 9999999999))
        if not User.objects.filter(mobile=mob).exists():
            return mob


class AdminSignupView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get("email", "").strip()
        password = request.data.get("password", "").strip()
        full_name = request.data.get("fullName", request.data.get("full_name", "Admin User"))
        mobile = request.data.get("mobile", "").strip() or _generate_unique_mobile()

        if not email or not password:
            return Response({"detail": "Email and password are required."}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(email=email).exists():
            return Response({"detail": "An account with this email already exists."}, status=status.HTTP_400_BAD_REQUEST)

        admin_role, _ = Role.objects.get_or_create(
            role_name="admin",
            defaults={"description": "Administrator", "created_at": timezone.now()}
        )

        user = User.objects.create(
            email=email,
            password=password,
            full_name=full_name,
            mobile=mobile,
            role=admin_role,
            status="active",
            created_at=timezone.now()
        )

        refresh = RefreshToken.for_user(user)
        refresh["role"] = "admin"
        refresh["email"] = user.email
        token_str = str(refresh.access_token)

        return Response({
            "token": token_str,
            "access": token_str,
            "refresh": str(refresh),
            "user": UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)


class StudentSignupView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get("email", "").strip()
        password = request.data.get("password", "").strip()
        full_name = request.data.get("fullName", request.data.get("full_name", "Student User"))
        mobile = request.data.get("mobile", "").strip() or _generate_unique_mobile()

        if not email or not password:
            return Response({"detail": "Email and password are required."}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(email=email).exists():
            return Response({"detail": "An account with this email already exists."}, status=status.HTTP_400_BAD_REQUEST)

        student_role, _ = Role.objects.get_or_create(
            role_name="student",
            defaults={"description": "Student", "created_at": timezone.now()}
        )

        user = User.objects.create(
            email=email,
            password=password,
            full_name=full_name,
            mobile=mobile,
            role=student_role,
            status="active",
            created_at=timezone.now()
        )

        # Auto-create Student record with generated roll number
        from students.models import Student
        roll_number = f"STU{user.user_id:04d}"
        # Ensure roll number is unique
        counter = 1
        base_roll = roll_number
        while Student.objects.filter(roll_number=roll_number).exists():
            roll_number = f"{base_roll}_{counter}"
            counter += 1

        Student.objects.create(
            user=user,
            roll_number=roll_number,
            status="active",
        )

        refresh = RefreshToken.for_user(user)
        refresh["role"] = "student"
        refresh["email"] = user.email
        token_str = str(refresh.access_token)

        return Response({
            "token": token_str,
            "access": token_str,
            "refresh": str(refresh),
            "user": UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)


class AdminLoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]
        password = serializer.validated_data["password"]

        user = User.objects.filter(email=email).first()
        if not user or user.password != password:
            return Response({"detail": "Invalid email or password."}, status=status.HTTP_401_UNAUTHORIZED)

        role_name = user.role.role_name.lower() if user.role else "admin"

        refresh = RefreshToken.for_user(user)
        refresh["role"] = role_name
        refresh["email"] = user.email
        token_str = str(refresh.access_token)

        return Response({
            "token": token_str,
            "access": token_str,
            "refresh": str(refresh),
            "user": UserSerializer(user).data
        })


class StudentLoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]
        password = serializer.validated_data["password"]

        user = User.objects.filter(email=email).first()
        if not user or user.password != password:
            return Response({"detail": "Invalid email or password."}, status=status.HTTP_401_UNAUTHORIZED)

        role_name = user.role.role_name.lower() if user.role else "student"

        refresh = RefreshToken.for_user(user)
        refresh["role"] = role_name
        refresh["email"] = user.email
        token_str = str(refresh.access_token)

        return Response({
            "token": token_str,
            "access": token_str,
            "refresh": str(refresh),
            "user": UserSerializer(user).data
        })


class LogoutView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        return Response({"detail": "Logged out successfully."}, status=status.HTTP_200_OK)


class UserDetailView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        user_id = getattr(self.request.user, "user_id", getattr(self.request.user, "id", None))
        return User.objects.filter(user_id=user_id).first()


class StudentProfileView(APIView):
    """
    GET /api/auth/me/student/
    Returns the logged-in student's complete profile + attendance stats.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user_id = getattr(request.user, "user_id", getattr(request.user, "id", None))
        user = User.objects.filter(user_id=user_id).first()
        if not user:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        from students.models import Student
        from attendance.models import Attendance

        student = Student.objects.filter(user=user).select_related(
            "department", "branch", "student_class"
        ).first()

        if not student:
            return Response({"detail": "Student profile not found."}, status=status.HTTP_404_NOT_FOUND)

        # Attendance stats
        total = Attendance.objects.filter(student=student).count()
        present = Attendance.objects.filter(student=student, status="present").count()
        absent = total - present
        percentage = round((present / total * 100), 2) if total > 0 else 0.0

        data = {
            "student_id": student.student_id,
            "user_id": user.user_id,
            "full_name": user.full_name,
            "email": user.email,
            "mobile": user.mobile,
            "profile_image": user.profile_image,
            "roll_number": student.roll_number,
            "department": student.department.department_name if student.department else None,
            "department_id": student.department_id,
            "branch": student.branch.branch_name if student.branch else None,
            "branch_id": student.branch_id,
            "class_name": student.student_class.class_name if student.student_class else None,
            "class_id": student.student_class_id,
            "student_status": student.status,
            "created_at": str(user.created_at),
            "attendance": {
                "total_days": total,
                "present_days": present,
                "absent_days": absent,
                "percentage": percentage,
            }
        }
        return Response(data)


class ChangePasswordView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user_id = getattr(request.user, "user_id", getattr(request.user, "id", None))
        user = User.objects.filter(user_id=user_id).first()
        if not user:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)
        if user.password != serializer.validated_data["old_password"]:
            return Response({"detail": "Incorrect old password."}, status=status.HTTP_400_BAD_REQUEST)
        user.password = serializer.validated_data["new_password"]
        user.save()
        return Response({"detail": "Password updated successfully."})


class ForgotPasswordView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]
        user = User.objects.filter(email=email).first()
        if user:
            # Delete all old tokens for this user
            PasswordResetToken.objects.filter(user=user).delete()
            # Create new token and save to DB
            token = generate_random_token()
            PasswordResetToken.objects.create(user=user, token=token)
            try:
                send_password_reset_email(email, token, user.full_name)
            except Exception as e:
                # Log error but don't expose it to the user
                import logging
                logging.getLogger(__name__).error(f"Email send failed: {e}")
        return Response({"detail": "If the email exists, a password reset link has been sent."})


class ResetPasswordView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        token_str = serializer.validated_data["token"]
        new_password = serializer.validated_data["new_password"]

        reset_token = PasswordResetToken.objects.filter(token=token_str, is_used=False).first()

        if not reset_token:
            return Response(
                {"detail": "Invalid or already used reset token."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if reset_token.is_expired():
            reset_token.delete()
            return Response(
                {"detail": "Reset token has expired. Please request a new one."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Reset the password
        user = reset_token.user
        user.password = new_password
        user.save()

        # Mark token as used
        reset_token.is_used = True
        reset_token.save()

        return Response({"detail": "Password reset successfully. You can now log in."})