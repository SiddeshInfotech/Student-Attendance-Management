from flask_jwt_extended import create_access_token, get_jwt_identity, get_jwt
from app.config.settings import ROLE_ADMIN

def generate_access_token(user_id: str, email: str, role: str = ROLE_ADMIN) -> str:
    """
    Generate a JWT access token for a given user ID, email, and role.
    Custom claims are added for roles and email.
    """
    additional_claims = {
        "email": email,
        "role": role
    }
    return create_access_token(identity=str(user_id), additional_claims=additional_claims)

def get_current_user_id() -> str:
    """
    Retrieve the identity (user ID) from the active JWT token.
    """
    return get_jwt_identity()

def get_current_user_claims() -> dict:
    """
    Retrieve all custom claims stored within the active JWT token.
    """
    return get_jwt()

def is_admin_user() -> bool:
    """
    Check if the current JWT caller has admin role privileges.
    """
    claims = get_current_user_claims()
    return claims.get("role") == ROLE_ADMIN
