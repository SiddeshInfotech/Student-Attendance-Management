from functools import wraps
from flask_jwt_extended import verify_jwt_in_request
from app.utils.jwt_helper import get_current_user_claims
from app.utils.helpers import api_response
from app.config.settings import STATUS_FORBIDDEN, ROLE_ADMIN

def admin_required():
    """
    Decorator to secure API endpoints. Ensures a valid JWT is present
    and that the logged-in user possesses the Admin role.
    """
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            # Ensure JWT is verified in the request header
            verify_jwt_in_request()
            
            # Retrieve claims from the verified token
            claims = get_current_user_claims()
            
            if claims.get("role") != ROLE_ADMIN:
                return api_response(
                    success=False,
                    message="Access denied. Admin privileges required.",
                    status_code=STATUS_FORBIDDEN
                )
                
            return fn(*args, **kwargs)
        return wrapper
    return decorator
