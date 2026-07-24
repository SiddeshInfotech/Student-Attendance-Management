from marshmallow import Schema, fields, validate

class NotificationSchema(Schema):
    """
    Validation and serialization schema for notification alerts.
    """
    id = fields.Str(dump_only=True)
    title = fields.Str(
        required=True,
        validate=validate.Length(min=1),
        error_messages={"required": "Notification title is required."}
    )
    message = fields.Str(
        required=True,
        validate=validate.Length(min=1),
        error_messages={"required": "Notification body message is required."}
    )
    type = fields.Str(
        required=True,
        validate=validate.OneOf(
            ["info", "warning", "success"],
            error="Type must be one of: info, warning, success."
        ),
        error_messages={"required": "Notification type is required."}
    )
    is_read = fields.Bool(dump_only=True)
    created_at = fields.DateTime(dump_only=True)
