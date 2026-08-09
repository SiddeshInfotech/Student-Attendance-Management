from django.urls import path
from .student_api_views import (
    StudentRegisterView,
    StudentLoginView,
    StudentProfileView,
    StudentProfileUpdateView,
    StudentChangePasswordView,
    StudentDashboardView,
    StudentDailyAttendanceView,
    StudentWeeklyAttendanceView,
    StudentMonthlyAttendanceView,
)

urlpatterns = [
    path('register/', StudentRegisterView.as_view(), name='student-register'),
    path('login/', StudentLoginView.as_view(), name='student-login'),
    path('profile/', StudentProfileView.as_view(), name='student-profile'),
    path('profile/update/', StudentProfileUpdateView.as_view(), name='student-profile-update'),
    path('change-password/', StudentChangePasswordView.as_view(), name='student-change-password'),
    path('dashboard/', StudentDashboardView.as_view(), name='student-dashboard'),
    path('attendance/daily/', StudentDailyAttendanceView.as_view(), name='student-attendance-daily'),
    path('attendance/weekly/', StudentWeeklyAttendanceView.as_view(), name='student-attendance-weekly'),
    path('attendance/monthly/', StudentMonthlyAttendanceView.as_view(), name='student-attendance-monthly'),
]
