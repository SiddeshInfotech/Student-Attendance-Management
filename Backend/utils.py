import os
import uuid
import random
from django.core.mail import send_mail
from django.conf import settings

def generate_random_token(length=32):
    return uuid.uuid4().hex[:length]

def generate_otp(length=6):
    """Generate a random 6-digit numeric OTP."""
    return "".join(str(random.randint(0, 9)) for _ in range(length))

def send_password_reset_otp_email(email, otp, full_name="User"):
    from django.conf import settings as django_settings
    from django.core.mail import send_mail

    subject = f"{otp} is your ScholarTrack Password Reset OTP"

    plain_message = (
        f"Hello {full_name},\n\n"
        f"Your One-Time Password (OTP) for resetting your ScholarTrack password is:\n\n"
        f"    {otp}\n\n"
        f"This OTP is valid for 10 minutes. Do NOT share this code with anyone.\n\n"
        f"If you did not request this OTP, please ignore this email.\n\n"
        f"— ScholarTrack Attendance Management System"
    )

    html_message = f"""
    <html>
    <body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
        <tr>
          <td align="center">
            <table width="480" cellpadding="0" cellspacing="0"
                   style="background:#ffffff;border-radius:12px;overflow:hidden;
                          box-shadow:0 4px 24px rgba(0,0,0,0.08);">

              <!-- Header -->
              <tr>
                <td style="background:linear-gradient(135deg,#1e40af,#2563eb);
                           padding:32px;text-align:center;">
                  <h1 style="color:#ffffff;margin:0;font-size:22px;font-weight:700;">
                    🎓 ScholarTrack
                  </h1>
                  <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;font-size:14px;">
                    Password Reset Verification Code
                  </p>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding:36px 40px;">
                  <p style="font-size:16px;color:#374151;margin:0 0 12px;">
                    Hello <strong>{full_name}</strong>,
                  </p>
                  <p style="color:#6b7280;line-height:1.6;margin:0 0 24px;">
                    We received a request to reset the password for your account.
                    Please use the following One-Time Password (OTP) to proceed:
                  </p>

                  <!-- OTP Code Display -->
                  <div style="background:#eff6ff;border:2px dashed #3b82f6;border-radius:12px;
                              padding:20px;text-align:center;margin:0 0 24px;">
                    <span style="font-size:32px;font-weight:800;letter-spacing:10px;
                                 color:#1d4ed8;font-family:'Courier New',Courier,monospace;">
                      {otp}
                    </span>
                  </div>

                  <!-- Expiry Note -->
                  <div style="background:#fef3c7;border:1px solid #fcd34d;border-radius:8px;
                              padding:12px 16px;margin-bottom:20px;">
                    <p style="margin:0;color:#92400e;font-size:13px;text-align:center;">
                      ⏱️ This OTP is valid for <strong>10 minutes</strong>.
                    </p>
                  </div>

                  <!-- Security Warning -->
                  <p style="color:#dc2626;font-size:13px;margin:0 0 16px;font-weight:500;text-align:center;">
                    🔒 Never share this OTP with anyone, including teachers or staff.
                  </p>

                  <!-- Footer note -->
                  <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0 16px;">
                  <p style="color:#9ca3af;font-size:12px;margin:0;">
                    If you did not request a password reset, please ignore this email —
                    your account remains secure.
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background:#f9fafb;padding:16px 40px;text-align:center;">
                  <p style="margin:0;color:#9ca3af;font-size:12px;">
                    © 2026 ScholarTrack Attendance Management System
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
    """

    send_mail(
        subject,
        plain_message,
        getattr(django_settings, 'DEFAULT_FROM_EMAIL', 'noreply@attendance.com'),
        [email],
        fail_silently=False,
        html_message=html_message,
    )

def send_password_reset_email(email, token, full_name="User"):
    from django.conf import settings as django_settings
    from django.core.mail import send_mail

    frontend_url = getattr(django_settings, 'FRONTEND_URL', 'http://localhost:5174')
    reset_url = f"{frontend_url}/#reset-password?token={token}"

    subject = "Password Reset Request - Student Attendance System"

    plain_message = (
        f"Hello {full_name},\n\n"
        f"We received a request to reset your password.\n\n"
        f"Click the link below to reset your password (expires in 1 hour):\n"
        f"{reset_url}\n\n"
        f"If you did not request this, please ignore this email.\n\n"
        f"— Student Attendance Management System"
    )

    html_message = f"""
    <html>
    <body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
        <tr>
          <td align="center">
            <table width="480" cellpadding="0" cellspacing="0"
                   style="background:#ffffff;border-radius:12px;overflow:hidden;
                          box-shadow:0 4px 24px rgba(0,0,0,0.08);">

              <!-- Header -->
              <tr>
                <td style="background:linear-gradient(135deg,#1e40af,#2563eb);
                           padding:32px;text-align:center;">
                  <h1 style="color:#ffffff;margin:0;font-size:22px;font-weight:700;">
                    🎓 Student Attendance System
                  </h1>
                  <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;font-size:14px;">
                    Password Reset Request
                  </p>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding:36px 40px;">
                  <p style="font-size:16px;color:#374151;margin:0 0 12px;">
                    Hello <strong>{full_name}</strong>,
                  </p>
                  <p style="color:#6b7280;line-height:1.6;margin:0 0 28px;">
                    We received a request to reset the password for your account.
                    Click the button below to create a new password:
                  </p>

                  <!-- CTA Button -->
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center" style="padding:0 0 28px;">
                        <a href="{reset_url}"
                           style="background:linear-gradient(135deg,#2563eb,#1d4ed8);
                                  color:#ffffff;padding:14px 36px;border-radius:8px;
                                  text-decoration:none;font-weight:600;font-size:16px;
                                  display:inline-block;letter-spacing:0.3px;">
                          🔐 Reset My Password
                        </a>
                      </td>
                    </tr>
                  </table>

                  <!-- Expiry Note -->
                  <div style="background:#fef3c7;border:1px solid #fcd34d;border-radius:8px;
                              padding:14px 16px;margin-bottom:20px;">
                    <p style="margin:0;color:#92400e;font-size:13px;">
                      ⚠️ This link will expire in <strong>1 hour</strong>.
                      After that, you will need to request a new reset link.
                    </p>
                  </div>

                  <!-- Fallback URL -->
                  <p style="color:#9ca3af;font-size:12px;margin:0 0 6px;">
                    If the button doesn't work, copy and paste this link in your browser:
                  </p>
                  <p style="color:#2563eb;font-size:12px;
                             word-break:break-all;margin:0;">
                    {reset_url}
                  </p>

                  <!-- Footer note -->
                  <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0 16px;">
                  <p style="color:#9ca3af;font-size:12px;margin:0;">
                    If you did not request a password reset, please ignore this email —
                    your account remains secure.
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background:#f9fafb;padding:16px 40px;text-align:center;">
                  <p style="margin:0;color:#9ca3af;font-size:12px;">
                    © 2026 Student Attendance Management System
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
    """

    send_mail(
        subject,
        plain_message,
        getattr(django_settings, 'DEFAULT_FROM_EMAIL', 'noreply@attendance.com'),
        [email],
        fail_silently=False,
        html_message=html_message,
    )

def upload_to_media(instance, filename):
    ext = filename.split(".")[-1]
    filename = f"{uuid.uuid4().hex}.{ext}"
    return os.path.join(instance._meta.app_label, filename)
