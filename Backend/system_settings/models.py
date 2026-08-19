from django.db import models

class SystemSettings(models.Model):
    # --- 1. General Settings ---
    college_name = models.CharField(max_length=255, default="Siddesh Infotech College")
    system_title = models.CharField(max_length=255, default="Student Attendance Management System")
    academic_year = models.CharField(max_length=50, default="2024 - 2025")
    language = models.CharField(max_length=50, default="English")
    timezone = models.CharField(max_length=100, default="Asia/Kolkata")
    date_format = models.CharField(max_length=50, default="DD MMM YYYY")
    college_logo = models.ImageField(upload_to="logos/", null=True, blank=True)

    # --- 2. Appearance ---
    theme_mode = models.CharField(max_length=20, default="light")
    primary_color = models.CharField(max_length=20, default="#3b82f6")
    sidebar_style = models.CharField(max_length=20, default="default")
    layout_style = models.CharField(max_length=20, default="modern")

    # --- 3. Notification Settings ---
    enable_notifications = models.BooleanField(default=True)
    email_notifications = models.BooleanField(default=True)
    attendance_alerts = models.BooleanField(default=True)
    exam_notifications = models.BooleanField(default=True)
    report_notifications = models.BooleanField(default=False)

    # --- 4. Email / SMTP Configuration ---
    smtp_host = models.CharField(max_length=255, default="smtp.gmail.com")
    smtp_port = models.CharField(max_length=10, default="587")
    admin_email = models.EmailField(default="admin@siddeshinfotech.edu.in")
    smtp_password = models.CharField(max_length=255, default="••••••••••••")
    encryption = models.CharField(max_length=20, default="TLS")

    # --- 5. Backup & Restore State ---
    auto_backup = models.BooleanField(default=True)
    backup_frequency = models.CharField(max_length=50, default="daily")
    backup_retention = models.CharField(max_length=50, default="30 days")
    last_backup = models.CharField(max_length=100, default="Never")

    # --- 6. Security Settings ---
    enable_2fa = models.BooleanField(default=False)
    session_timeout = models.BooleanField(default=True)
    password_expiry = models.BooleanField(default=True)
    password_expiry_days = models.CharField(max_length=10, default="90")
    max_login_attempts = models.CharField(max_length=10, default="5")

    # --- 7. Roles and Permissions JSON ---
    roles = models.JSONField(default=list, blank=True)
    permissions_matrix = models.JSONField(default=dict, blank=True)

    # --- 8. Attendance Rules ---
    min_attendance = models.CharField(max_length=10, default="75%")
    working_days = models.JSONField(default=list, blank=True)
    attendance_window = models.CharField(max_length=50, default="09:00 AM")
    late_grace_period = models.CharField(max_length=10, default="15")
    auto_attendance = models.BooleanField(default=False)
    attendance_lock_date = models.CharField(max_length=50, default="2026-08-31")

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "System Setting"
        verbose_name_plural = "System Settings"

    def __str__(self):
        return f"SystemSettings ({self.college_name})"

    @classmethod
    def get_settings(cls):
        obj, created = cls.objects.get_or_create(id=1)
        if created:
            obj.roles = ["Admin", "Student", "Teacher"]
            obj.permissions_matrix = {
                "Admin": {"read": True, "write": True, "edit": True, "delete": True},
                "Teacher": {"read": True, "write": True, "edit": True, "delete": False},
                "Student": {"read": True, "write": False, "edit": False, "delete": False},
            }
            obj.working_days = ["Mon", "Tue", "Wed", "Thu", "Fri"]
            obj.save()
        return obj


class Holiday(models.Model):
    name = models.CharField(max_length=200)
    date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['date']

    def __str__(self):
        return f"{self.name} ({self.date})"
