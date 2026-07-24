from flask import Blueprint, request
from app.schemas.auth_schema import SignupSchema, LoginSchema, ForgotPasswordSchema, ResetPasswordSchema
from app.services.auth_service import AuthService

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

signup_schema = SignupSchema()
login_schema = LoginSchema()
forgot_password_schema = ForgotPasswordSchema()
reset_password_schema = ResetPasswordSchema()

@auth_bp.route("/signup", methods=["POST"])
def signup():
    """
    Registers a new administrator profile.
    """
    json_data = request.get_json() or {}
    validated_data = signup_schema.load(json_data)
    res, status_code = AuthService.signup(validated_data)
    return res, status_code

@auth_bp.route("/login", methods=["POST"])
def login():
    """
    Authenticates administrator and returns a JWT access token.
    """
    json_data = request.get_json() or {}
    validated_data = login_schema.load(json_data)
    res, status_code = AuthService.login(validated_data)
    return res, status_code

@auth_bp.route("/forgot-password", methods=["POST"])
def forgot_password():
    """
    Initiates password recovery and returns a recovery token.
    """
    json_data = request.get_json() or {}
    validated_data = forgot_password_schema.load(json_data)
    res, status_code = AuthService.forgot_password(validated_data)
    return res, status_code

@auth_bp.route("/reset-password", methods=["POST"])
def reset_password():
    """
    Resets the administrator's password.
    """
    json_data = request.get_json() or {}
    validated_data = reset_password_schema.load(json_data)
    res, status_code = AuthService.reset_password(validated_data)
    return res, status_code

@auth_bp.route("/logout", methods=["POST"])
def logout():
    """
    Logs out the active administrator session.
    """
    res, status_code = AuthService.logout()
    return res, status_code
