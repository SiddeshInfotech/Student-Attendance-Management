from flask import jsonify
from datetime import datetime
from app.config.settings import DATE_FORMAT, STATUS_OK

def api_response(success: bool, message: str, data=None, status_code: int = STATUS_OK):
    """
    Constructs a uniform JSON response structure for all API endpoints.
    """
    response_payload = {
        "success": success,
        "message": message
    }
    if data is not None:
        response_payload["data"] = data
        
    return jsonify(response_payload), status_code

def parse_date(date_string: str):
    """
    Safely parses a string date in the standard system date format.
    Returns a datetime.date object or None if the input is invalid.
    """
    try:
        return datetime.strptime(date_string, DATE_FORMAT).date()
    except (ValueError, TypeError):
        return None

def format_date(date_object) -> str:
    """
    Converts a date object to its standard string representation.
    """
    if not date_object:
        return ""
    return date_object.strftime(DATE_FORMAT)
