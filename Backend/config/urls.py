from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny

@api_view(['GET'])
@permission_classes([AllowAny])
def api_root(request):
    return Response({
        "status": "success",
        "message": "Student Attendance Management System API is Running 🚀",
        "endpoints": {
            "auth": "/api/auth/",
            "departments": "/api/departments/",
            "branches": "/api/branches/",
            "semesters": "/api/semesters/",
            "classes": "/api/classes/",
            "subjects": "/api/subjects/",
            "students": "/api/students/",
            "teachers": "/api/teachers/",
            "attendance": "/api/attendance/",
            "dashboard": "/api/dashboard/",
            "reports": "/api/reports/",
            "notifications": "/api/notifications/",
            "leave_requests": "/api/leave-requests/",
            "django_admin": "/admin/"
        }
    })

urlpatterns = [
    path("", api_root, name="api-root"),
    path('admin/', admin.site.urls),

    # Authentication & Users
    path('api/auth/', include('users.urls')),

    # Core Modules
    path('api/departments/', include('departments.urls')),
    path('api/branches/', include('branches.urls')),
    path('api/semesters/', include('semesters.urls')),
    path('api/classes/', include('classes.urls')),
    path('api/subjects/', include('subjects.urls')),
    path('api/students/', include('students.urls')),
    path('api/teachers/', include('teachers.urls')),
    path('api/attendance/', include('attendance.urls')),
    path('api/dashboard/', include('dashboard.urls')),
    path('api/reports/', include('reports.urls')),
    path('api/notifications/', include('notifications.urls')),
    path('api/leave-requests/', include('leave_requests.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
