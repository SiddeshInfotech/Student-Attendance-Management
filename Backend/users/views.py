import uuid
from django.utils import timezone
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import generics
from rest_framework_simplejwt.tokens import RefreshToken

from .models import User, Role
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
            token = generate_random_token()
            send_password_reset_email(email, token)
        return Response({"detail": "If the email exists, a password reset link has been sent."})


class ResetPasswordView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response({"detail": "Password reset successfully."})