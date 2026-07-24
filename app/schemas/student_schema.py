from marshmallow import Schema, fields, validate
from app.utils.validators import validate_email

class StudentSchema(Schema):
    """
    Validation and serialization schema for Student operations.
    """
    id = fields.Str(dump_only=True)
    name = fields.Str(
        required=True, 
        validate=validate.Length(min=2), 
        error_messages={"required": "Name is required (min 2 chars)."}
    )
    roll_number = fields.Str(
        required=True, 
        validate=validate.Length(min=1), 
        error_messages={"required": "Roll number is required."}
    )
    email = fields.Str(
        required=True, 
        validate=validate_email, 
        error_messages={"required": "Email is required."}
    )
    class_name = fields.Str(
        required=True, 
        validate=validate.Length(min=1), 
        error_messages={"required": "Class/Grade name is required."}
    )
    phone = fields.Str(
        required=False, 
        allow_none=True,
        validate=validate.Regexp(r"^\+?1?\d{9,15}$", error="Invalid phone number format.")
    )
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)
