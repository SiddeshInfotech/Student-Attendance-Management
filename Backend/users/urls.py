from django.urls import path
from authentication import CustomTokenRefreshView
from .views import (
    AdminLoginView,
    AdminSignupView,
    StudentLoginView,
    StudentSignupView,
    LogoutView,
    UserDetailView,
    ChangePasswordView,
    ForgotPasswordView,
    ResetPasswordView,
)

urlpatterns = [
    path("admin/login", AdminLoginView.as_view(), name="admin-login-noslash"),
    path("admin/login/", AdminLoginView.as_view(), name="admin-login"),
    path("admin/signup", AdminSignupView.as_view(), name="admin-signup-noslash"),
    path("admin/signup/", AdminSignupView.as_view(), name="admin-signup"),
    path("student/login", StudentLoginView.as_view(), name="student-login-noslash"),
    path("student/login/", StudentLoginView.as_view(), name="student-login"),
    path("student/signup", StudentSignupView.as_view(), name="student-signup-noslash"),
    path("student/signup/", StudentSignupView.as_view(), name="student-signup"),
    path("logout", LogoutView.as_view(), name="logout-noslash"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("token/refresh/", CustomTokenRefreshView.as_view(), name="token-refresh"),
    path("me/", UserDetailView.as_view(), name="user-detail"),
    path("change-password", ChangePasswordView.as_view(), name="change-password"),
    path("forgot-password", ForgotPasswordView.as_view(), name="forgot-password-noslash"),
    path("forgot-password/", ForgotPasswordView.as_view(), name="forgot-password"),
    path("reset-password", ResetPasswordView.as_view(), name="reset-password-noslash"),
    path("reset-password/", ResetPasswordView.as_view(), name="reset-password"),
]