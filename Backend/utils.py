import os
import uuid
from django.core.mail import send_mail
from django.conf import settings

def generate_random_token(length=32):
    return uuid.uuid4().hex[:length]

def send_password_reset_email(email, token):
    subject = "Password Reset Request - Student Attendance System"
    reset_url = f"{getattr(settings, 'FRONTEND_URL', 'http://localhost:3000')}/reset-password?token={token}"
    message = f"Hello,\n\nYou requested a password reset. Please use the following link to reset your password:\n{reset_url}\n\nIf you did not request this, please ignore this email."
    from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', 'no-reply@attendance.com')
    send_mail(subject, message, from_email, [email], fail_silently=True)

def upload_to_media(instance, filename):
    ext = filename.split(".")[-1]
    filename = f"{uuid.uuid4().hex}.{ext}"
    return os.path.join(instance._meta.app_label, filename)
