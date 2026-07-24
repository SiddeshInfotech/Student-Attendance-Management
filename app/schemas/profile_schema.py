from marshmallow import Schema, fields, validate
from app.utils.validators import validate_email, validate_password_strength

class ProfileSchema(Schema):
    """
    Schema for displaying and serializing full Admin Profile details.
    """
    id = fields.Str(dump_only=True)
    name = fields.Str(
        required=True,
        validate=validate.Length(min=2),
        error_messages={"required": "Name is required."}
    )
    email = fields.Str(
        required=True,
        validate=validate_email,
        error_messages={"required": "Email is required."}
    )
    profile_image = fields.Str(dump_only=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)

class ProfileUpdateSchema(Schema):
    """
    Schema for validating profile update requests.
    """
    name = fields.Str(required=False, validate=validate.Length(min=2))
    email = fields.Str(required=False, validate=validate_email)

class ChangePasswordSchema(Schema):
    """
    Schema for validating password change requests.
    """
    current_password = fields.Str(
        required=True, 
        error_messages={"required": "Current password is required."}
    )
    new_password = fields.Str(
        required=True, 
        validate=validate_password_strength, 
        error_messages={"required": "New password is required."}
    )
