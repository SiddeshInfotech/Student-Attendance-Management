from marshmallow import Schema, fields
from app.utils.validators import validate_email, validate_password_strength

class SignupSchema(Schema):
    """
    Validation schema for admin signup requests.
    """
    name = fields.Str(
        required=True, 
        error_messages={"required": "Name is required."}
    )
    email = fields.Str(
        required=True, 
        validate=validate_email, 
        error_messages={"required": "Email is required."}
    )
    password = fields.Str(
        required=True, 
        validate=validate_password_strength, 
        error_messages={"required": "Password is required."}
    )

class LoginSchema(Schema):
    """
    Validation schema for admin login requests.
    """
    email = fields.Str(
        required=True, 
        validate=validate_email, 
        error_messages={"required": "Email is required."}
    )
    password = fields.Str(
        required=True, 
        error_messages={"required": "Password is required."}
    )

class ForgotPasswordSchema(Schema):
    """
    Validation schema for trigger forgot password email requests.
    """
    email = fields.Str(
        required=True, 
        validate=validate_email, 
        error_messages={"required": "Email is required."}
    )

class ResetPasswordSchema(Schema):
    """
    Validation schema for performing password reset requests.
    """
    token = fields.Str(
        required=True, 
        error_messages={"required": "Reset token is required."}
    )
    new_password = fields.Str(
        required=True, 
        validate=validate_password_strength, 
        error_messages={"required": "New password is required."}
    )
