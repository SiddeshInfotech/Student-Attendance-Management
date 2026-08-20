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
from utils import generate_random_token, generate_otp, send_password_reset_otp_email, send_password_reset_email


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
        from django.contrib.auth.hashers import check_password
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"].strip().lower()
        password = serializer.validated_data["password"]

        user = User.objects.filter(email__iexact=email).first()
        if not user:
            return Response({"detail": "Invalid email or password."}, status=status.HTTP_401_UNAUTHORIZED)

        is_valid = check_password(password, user.password) or (user.password == password)
        if not is_valid:
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
        from django.contrib.auth.hashers import check_password
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"].strip().lower()
        password = serializer.validated_data["password"]

        user = User.objects.filter(email__iexact=email).first()
        if not user:
            return Response({"detail": "Invalid email or password."}, status=status.HTTP_401_UNAUTHORIZED)

        is_valid = check_password(password, user.password) or (user.password == password)
        if not is_valid:
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
        from django.contrib.auth.hashers import check_password, make_password
        serializer = ChangePasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user_id = getattr(request.user, "user_id", getattr(request.user, "id", None))
        user = User.objects.filter(user_id=user_id).first()
        if not user:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)
        
        is_valid = check_password(serializer.validated_data["old_password"], user.password) or (user.password == serializer.validated_data["old_password"])
        if not is_valid:
            return Response({"detail": "Incorrect old password."}, status=status.HTTP_400_BAD_REQUEST)
        user.password = make_password(serializer.validated_data["new_password"])
        user.save()
        return Response({"detail": "Password updated successfully."})


class ForgotPasswordView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"].strip().lower()
        user = User.objects.filter(email__iexact=email).first()
        if not user:
            return Response(
                {"detail": f"No registered account found with email '{email}'."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Delete all old tokens for this user
        PasswordResetToken.objects.filter(user=user).delete()
        # Create new 6-digit numeric OTP and save to DB
        otp = generate_otp(6)
        PasswordResetToken.objects.create(user=user, token=otp)
        try:
            send_password_reset_otp_email(user.email, otp, user.full_name)
        except Exception as e:
            import logging
            logging.getLogger(__name__).error(f"Email OTP send failed: {e}")
            return Response(
                {"detail": "Failed to send email. Please verify internet connection or contact admin."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        return Response({
            "detail": f"A 6-digit OTP has been sent to {user.email}.",
            "email": user.email
        })


class ResetPasswordView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        token_or_otp = (serializer.validated_data.get("otp") or serializer.validated_data.get("token") or "").strip()
        email = (serializer.validated_data.get("email") or "").strip().lower()
        new_password = serializer.validated_data["new_password"]

        if not token_or_otp:
            return Response({"detail": "OTP is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Filter token
        token_query = PasswordResetToken.objects.filter(token=token_or_otp, is_used=False)
        if email:
            token_query = token_query.filter(user__email__iexact=email)

        reset_token = token_query.first()

        if not reset_token:
            return Response(
                {"detail": "Invalid or already used OTP. Please check and try again."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if reset_token.is_expired():
            reset_token.delete()
            return Response(
                {"detail": "OTP has expired. Please request a new OTP."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Reset the password
        from django.contrib.auth.hashers import make_password
        user = reset_token.user
        user.password = make_password(new_password)
        user.save()

        # Mark token as used
        reset_token.is_used = True
        reset_token.save()

        return Response({"detail": "Password reset successfully. You can now log in."})