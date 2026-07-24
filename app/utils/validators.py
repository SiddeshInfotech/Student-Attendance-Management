import re
from marshmallow import ValidationError
from app.config.config import Config

def validate_email(email: str):
    """
    Validator to check if the email fits a standard pattern.
    """
    email_regex = r"^[\w\.-]+@[\w\.-]+\.\w+$"
    if not re.match(email_regex, email):
        raise ValidationError("Invalid email format.")

def validate_password_strength(password: str):
    """
    Validator to check if the password is secure enough.
    Requirements:
    - At least 8 characters long
    - At least one digit
    - At least one alphabet letter
    """
    if len(password) < 8:
        raise ValidationError("Password must be at least 8 characters long.")
    if not any(c.isdigit() for c in password):
        raise ValidationError("Password must contain at least one number.")
    if not any(c.isalpha() for c in password):
        raise ValidationError("Password must contain at least one letter.")

def validate_allowed_file(filename: str) -> bool:
    """
    Verifies if a filename contains a supported file extension format
    configured in Config.ALLOWED_EXTENSIONS.
    """
    if "." not in filename:
        return False
    ext = filename.rsplit(".", 1)[1].lower()
    return ext in Config.ALLOWED_EXTENSIONS
