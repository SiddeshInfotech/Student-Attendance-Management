from werkzeug.exceptions import HTTPException
from marshmallow import ValidationError
from app.utils.helpers import api_response
from app.utils.logger import app_logger
from app.config.settings import STATUS_BAD_REQUEST, STATUS_INTERNAL_SERVER_ERROR

def register_error_handlers(app):
    """
    Registers global error handlers on the Flask application instance to trap
    validation, HTTP, and unexpected server errors, formatting them as standard
    JSON REST outputs.
    """

    @app.errorhandler(ValidationError)
    def handle_validation_error(error):
        """
        Catches Marshmallow schema validation errors.
        Returns a HTTP 400 Bad Request response with the exact field errors.
        """
        app_logger.warning(f"Schema Validation Failure: {error.messages}")
        return api_response(
            success=False,
            message="Input validation failed.",
            data=error.messages,
            status_code=STATUS_BAD_REQUEST
        )

    @app.errorhandler(HTTPException)
    def handle_http_exception(error):
        """
        Catches standard Flask/Werkzeug HTTP exceptions.
        """
        app_logger.warning(f"HTTP Exception Occurred: {error.code} - {error.description}")
        return api_response(
            success=False,
            message=error.description,
            status_code=error.code
        )

    @app.errorhandler(Exception)
    def handle_generic_exception(error):
        """
        Catches all other unhandled runtime exceptions.
        Logs details with traceback and outputs a generic error message.
        """
        app_logger.error(f"Unhandled Server Exception: {str(error)}", exc_info=True)
        return api_response(
            success=False,
            message="An unexpected server error occurred.",
            status_code=STATUS_INTERNAL_SERVER_ERROR
        )
