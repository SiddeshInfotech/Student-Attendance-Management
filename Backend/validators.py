import re
from django.core.exceptions import ValidationError

def validate_strong_password(value):
    pattern = r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$'
    if not re.match(pattern, value):
        raise ValidationError(
            "Password must be at least 8 characters long and contain uppercase, lowercase, and numeric characters."
        )
