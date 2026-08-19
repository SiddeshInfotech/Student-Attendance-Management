import os
import shutil
import smtplib
import datetime
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from pathlib import Path

from django.conf import settings
from django.http import FileResponse, HttpResponse
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated

from .models import SystemSettings, Holiday
from .serializers import SystemSettingsSerializer, HolidaySerializer


class SettingsAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        setting_obj = SystemSettings.get_settings()
        serializer = SystemSettingsSerializer(setting_obj, context={'request': request})
        holidays = Holiday.objects.all()
        holiday_serializer = HolidaySerializer(holidays, many=True)
        return Response({
            "status": "success",
            "settings": serializer.data,
            "holidays": holiday_serializer.data
        }, status=status.HTTP_200_OK)

    def put(self, request):
        setting_obj = SystemSettings.get_settings()
        serializer = SystemSettingsSerializer(
            setting_obj, 
            data=request.data, 
            partial=True, 
            context={'request': request}
        )
        if serializer.is_valid():
            serializer.save()
            return Response({
                "status": "success",
                "message": "Settings updated successfully!",
                "settings": serializer.data
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class HolidayListCreateView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        holidays = Holiday.objects.all()
        serializer = HolidaySerializer(holidays, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = HolidaySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "status": "success",
                "message": f"Holiday '{serializer.data.get('name')}' created successfully!",
                "holiday": serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class HolidayDeleteView(APIView):
    permission_classes = [AllowAny]

    def delete(self, request, pk):
        try:
            holiday = Holiday.objects.get(pk=pk)
            name = holiday.name
            holiday.delete()
            return Response({
                "status": "success",
                "message": f"Holiday '{name}' deleted successfully."
            }, status=status.HTTP_200_OK)
        except Holiday.DoesNotExist:
            return Response({
                "status": "error",
                "message": "Holiday not found."
            }, status=status.HTTP_404_NOT_FOUND)


class LogoUploadView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        if 'logo' not in request.FILES:
            return Response({"status": "error", "message": "No logo file provided."}, status=status.HTTP_400_BAD_REQUEST)
        
        logo_file = request.FILES['logo']
        setting_obj = SystemSettings.get_settings()
        setting_obj.college_logo = logo_file
        setting_obj.save()

        url = request.build_absolute_uri(setting_obj.college_logo.url) if setting_obj.college_logo else ""
        return Response({
            "status": "success",
            "message": "Logo uploaded successfully!",
            "logo_url": url
        }, status=status.HTTP_200_OK)


class SendTestEmailView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        smtp_host = request.data.get("smtp_host", "").strip()
        smtp_port = request.data.get("smtp_port", "587").strip()
        admin_email = request.data.get("admin_email", "").strip()
        smtp_password = request.data.get("smtp_password", "").strip()
        encryption = request.data.get("encryption", "TLS").strip()

        if not admin_email:
            return Response({
                "status": "error",
                "message": "Target Admin Email address is required."
            }, status=status.HTTP_400_BAD_REQUEST)

        # If user left placeholder or blank credentials, use Django settings fallback
        if not smtp_host or smtp_password == "••••••••••••":
            smtp_host = getattr(settings, 'EMAIL_HOST', 'smtp.gmail.com')
            smtp_port = str(getattr(settings, 'EMAIL_PORT', 587))
            sender_email = getattr(settings, 'EMAIL_HOST_USER', '')
            smtp_password = getattr(settings, 'EMAIL_HOST_PASSWORD', '')
            use_tls = getattr(settings, 'EMAIL_USE_TLS', True)
        else:
            sender_email = admin_email
            use_tls = (encryption == "TLS")

        try:
            port = int(smtp_port) if smtp_port.isdigit() else 587
            msg = MIMEMultipart()
            msg['From'] = sender_email or admin_email
            msg['To'] = admin_email
            msg['Subject'] = "Student Attendance Management System — SMTP Test Email"

            body = (
                f"Hello Admin,\n\n"
                f"This is a test notification confirming that your SMTP Email configuration "
                f"in Student Attendance Management System is active and connected successfully!\n\n"
                f"Server: {smtp_host}:{port}\n"
                f"Timestamp: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n"
                f"Regards,\n"
                f"ScholarTrack Management System"
            )
            msg.attach(MIMEText(body, 'plain'))

            if encryption == "SSL" or port == 465:
                server = smtplib.SMTP_SSL(smtp_host, port, timeout=10)
            else:
                server = smtplib.SMTP(smtp_host, port, timeout=10)
                if use_tls:
                    server.starttls()

            if sender_email and smtp_password and smtp_password != "••••••••••••":
                server.login(sender_email, smtp_password)

            server.sendmail(sender_email or admin_email, [admin_email], msg.as_string())
            server.quit()

            return Response({
                "status": "success",
                "message": f"Test email successfully dispatched to {admin_email}!"
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({
                "status": "error",
                "message": f"SMTP Connection failed: {str(e)}"
            }, status=status.HTTP_400_BAD_REQUEST)


class DatabaseBackupView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        db_path = settings.BASE_DIR / 'db.sqlite3'
        if not os.path.exists(db_path):
            return Response({
                "status": "error",
                "message": "Database file not found on server."
            }, status=status.HTTP_404_NOT_FOUND)

        now_str = datetime.datetime.now().strftime('%d %b %Y, %I:%M %p')
        filename = f"sam_database_backup_{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}.sqlite3"

        # Update last backup in settings
        setting_obj = SystemSettings.get_settings()
        setting_obj.last_backup = now_str
        setting_obj.save()

        response = FileResponse(open(db_path, 'rb'), content_type='application/x-sqlite3')
        response['Content-Disposition'] = f'attachment; filename="{filename}"'
        return response


class DatabaseRestoreView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        if 'backup_file' not in request.FILES:
            return Response({
                "status": "error",
                "message": "Please upload a valid .sqlite3 database backup file."
            }, status=status.HTTP_400_BAD_REQUEST)

        uploaded_file = request.FILES['backup_file']
        if not uploaded_file.name.endswith(('.sqlite3', '.db', '.sqlite')):
            return Response({
                "status": "error",
                "message": "Invalid file format. Only SQLite (.sqlite3, .db) files are supported."
            }, status=status.HTTP_400_BAD_REQUEST)

        db_path = settings.BASE_DIR / 'db.sqlite3'
        temp_restore_path = settings.BASE_DIR / 'db_restore_temp.sqlite3'

        try:
            # Write uploaded file to temp path first to verify
            with open(temp_restore_path, 'wb+') as destination:
                for chunk in uploaded_file.chunks():
                    destination.write(chunk)

            # Create backup of current db before overwriting
            backup_current = settings.BASE_DIR / 'db_prev_backup.sqlite3'
            if os.path.exists(db_path):
                shutil.copyfile(db_path, backup_current)

            # Move restored file to db.sqlite3
            shutil.move(str(temp_restore_path), str(db_path))

            return Response({
                "status": "success",
                "message": "Database successfully restored from backup! Please refresh the page."
            }, status=status.HTTP_200_OK)

        except Exception as e:
            if os.path.exists(temp_restore_path):
                os.remove(temp_restore_path)
            return Response({
                "status": "error",
                "message": f"Database restoration failed: {str(e)}"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
