# Global application constants and non-environment configurations.

# HTTP Status Codes for consistent REST responses
STATUS_OK = 200
STATUS_CREATED = 201
STATUS_NO_CONTENT = 204
STATUS_BAD_REQUEST = 400
STATUS_UNAUTHORIZED = 401
STATUS_FORBIDDEN = 403
STATUS_NOT_FOUND = 404
STATUS_CONFLICT = 409
STATUS_INTERNAL_SERVER_ERROR = 500

# User roles (Backend focuses on Admin-driven Student Attendance)
ROLE_ADMIN = "admin"

# Date and Time Formats used system-wide
DATE_FORMAT = "%Y-%m-%d"
DATETIME_FORMAT = "%Y-%m-%d %H:%M:%S"

# Pagination settings
DEFAULT_PAGE = 1
DEFAULT_PER_PAGE = 20

# Notification types
NOTIFICATION_INFO = "info"
NOTIFICATION_WARNING = "warning"
NOTIFICATION_SUCCESS = "success"
