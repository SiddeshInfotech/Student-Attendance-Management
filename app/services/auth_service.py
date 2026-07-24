import hashlib
import uuid
from app.utils.jwt_helper import generate_access_token
from app.utils.logger import app_logger
from app.config.settings import STATUS_CREATED, STATUS_OK, STATUS_UNAUTHORIZED, STATUS_CONFLICT, STATUS_BAD_REQUEST

# Shared In-memory storage for admin accounts and password reset tokens
_admins = {}
_reset_tokens = {}

class AuthService:
    """
    Service layer handling all Admin Authentication business logic.
    """
    
    @staticmethod
    def signup(data: dict) -> tuple:
        email = data["email"].strip().lower()
        if email in _admins:
            app_logger.warning(f"Signup conflict: Email {email} already registered.")
            return {
                "success": False, 
                "message": "Email address already registered."
            }, STATUS_CONFLICT
            
        hashed_password = hashlib.sha256(data["password"].encode()).hexdigest()
        admin_id = str(uuid.uuid4())
        
        # Save record
        _admins[email] = {
            "id": admin_id,
            "name": data["name"],
            "email": email,
            "password": hashed_password,
            "profile_image": None
        }
        
        app_logger.info(f"New Admin registered: {email}")
        return {
            "success": True,
            "message": "Admin signed up successfully.",
            "data": {
                "id": admin_id,
                "name": data["name"],
                "email": email
            }
        }, STATUS_CREATED

    @staticmethod
    def login(data: dict) -> tuple:
        email = data["email"].strip().lower()
        password = data["password"]
        
        admin = _admins.get(email)
        if not admin:
            app_logger.warning(f"Login failed: Email {email} not found.")
            return {
                "success": False, 
                "message": "Invalid email or password."
            }, STATUS_UNAUTHORIZED
            
        hashed_input = hashlib.sha256(password.encode()).hexdigest()
        if admin["password"] != hashed_input:
            app_logger.warning(f"Login failed: Incorrect password for {email}.")
            return {
                "success": False, 
                "message": "Invalid email or password."
            }, STATUS_UNAUTHORIZED
            
        # Generate token
        token = generate_access_token(user_id=admin["id"], email=admin["email"])
        app_logger.info(f"Admin logged in: {email}")
        
        return {
            "success": True,
            "message": "Login successful.",
            "data": {
                "access_token": token,
                "admin": {
                    "id": admin["id"],
                    "name": admin["name"],
                    "email": admin["email"]
                }
            }
        }, STATUS_OK

    @staticmethod
    def forgot_password(data: dict) -> tuple:
        email = data["email"].strip().lower()
        admin = _admins.get(email)
        
        if not admin:
            app_logger.info(f"Forgot password request for non-existent email: {email}")
            return {
                "success": True,
                "message": "If the email is registered, a password reset token has been generated."
            }, STATUS_OK
            
        reset_token = str(uuid.uuid4())
        _reset_tokens[reset_token] = email
        app_logger.info(f"Reset token generated for {email}: {reset_token}")
        
        return {
            "success": True,
            "message": "Password reset token generated.",
            "data": {
                "reset_token": reset_token
            }
        }, STATUS_OK

    @staticmethod
    def reset_password(data: dict) -> tuple:
        token = data["token"]
        new_password = data["new_password"]
        
        email = _reset_tokens.get(token)
        if not email or email not in _admins:
            app_logger.warning(f"Attempted password reset with invalid/expired token.")
            return {
                "success": False, 
                "message": "Invalid or expired password reset token."
            }, STATUS_BAD_REQUEST
            
        hashed_password = hashlib.sha256(new_password.encode()).hexdigest()
        _admins[email]["password"] = hashed_password
        
        # Invalidate token
        _reset_tokens.pop(token)
        app_logger.info(f"Password reset successfully for user: {email}")
        
        return {
            "success": True,
            "message": "Password reset successfully."
        }, STATUS_OK

    @staticmethod
    def logout() -> tuple:
        # JWT is stateless, handled client-side by purging token.
        return {
            "success": True,
            "message": "Logout successful. Purge token on client-side."
        }, STATUS_OK
