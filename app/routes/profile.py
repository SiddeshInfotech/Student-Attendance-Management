import os
from flask import Blueprint, request
from werkzeug.utils import secure_filename
from app.middleware.auth_middleware import admin_required
from app.utils.jwt_helper import get_current_user_id
from app.utils.validators import validate_allowed_file
from app.utils.helpers import api_response
from app.services.profile_service import ProfileService
from app.schemas.profile_schema import ProfileUpdateSchema, ChangePasswordSchema
from app.config.config import Config
from app.config.settings import STATUS_BAD_REQUEST

profile_bp = Blueprint("profile", __name__, url_prefix="/api/profile")
profile_update_schema = ProfileUpdateSchema()
change_password_schema = ChangePasswordSchema()

@profile_bp.route("", methods=["GET"])
@admin_required()
def get_profile():
    """
    Retrieves the logged-in administrator's profile data.
    """
    admin_id = get_current_user_id()
    res, status_code = ProfileService.get_profile(admin_id)
    return res, status_code

@profile_bp.route("", methods=["PUT"])
@admin_required()
def update_profile():
    """
    Updates details like name and email for the active admin.
    """
    admin_id = get_current_user_id()
    json_data = request.get_json() or {}
    validated_data = profile_update_schema.load(json_data)
    res, status_code = ProfileService.update_profile(admin_id, validated_data)
    return res, status_code

@profile_bp.route("/change-password", methods=["POST"])
@admin_required()
def change_password():
    """
    Rotates credentials for the active admin.
    """
    admin_id = get_current_user_id()
    json_data = request.get_json() or {}
    validated_data = change_password_schema.load(json_data)
    res, status_code = ProfileService.change_password(admin_id, validated_data)
    return res, status_code

@profile_bp.route("/upload-image", methods=["POST"])
@admin_required()
def upload_image():
    """
    Saves an avatar image file to disk and registers the path in profile details.
    """
    admin_id = get_current_user_id()
    
    if "image" not in request.files:
        return api_response(
            success=False, 
            message="No image file provided under key 'image'.", 
            status_code=STATUS_BAD_REQUEST
        )
        
    file = request.files["image"]
    if file.filename == "":
        return api_response(
            success=False, 
            message="Selected file has no filename.", 
            status_code=STATUS_BAD_REQUEST
        )
        
    if file and validate_allowed_file(file.filename):
        # Prefix the filename with the unique admin ID to avoid overlap conflicts
        filename = secure_filename(f"{admin_id}_{file.filename}")
        
        # Ensure uploads folder exists
        os.makedirs(Config.UPLOAD_FOLDER, exist_ok=True)
        
        file_path = os.path.join(Config.UPLOAD_FOLDER, filename)
        file.save(file_path)
        
        res, status_code = ProfileService.upload_profile_image(admin_id, filename)
        return res, status_code
        
    return api_response(
        success=False, 
        message="Invalid image format. Allowed formats: PNG, JPG, JPEG, GIF.", 
        status_code=STATUS_BAD_REQUEST
    )
