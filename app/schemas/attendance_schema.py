from marshmallow import Schema, fields, validate

class AttendanceSchema(Schema):
    """
    Validation and serialization schema for single attendance records.
    """
    id = fields.Str(dump_only=True)
    student_id = fields.Str(
        required=True, 
        error_messages={"required": "Student ID is required."}
    )
    date = fields.Date(
        required=True, 
        format="%Y-%m-%d",
        error_messages={"required": "Date is required (YYYY-MM-DD format)."}
    )
    status = fields.Str(
        required=True,
        validate=validate.OneOf(
            ["Present", "Absent", "Late", "Excused"],
            error="Status must be one of: Present, Absent, Late, Excused."
        ),
        error_messages={"required": "Attendance status is required."}
    )
    remarks = fields.Str(required=False, allow_none=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)

class BulkAttendanceSchema(Schema):
    """
    Schema for marking attendance in bulk (e.g., for a class).
    """
    records = fields.List(
        fields.Nested(AttendanceSchema), 
        required=True,
        error_messages={"required": "List of attendance records is required."}
    )
