import hashlib
from app.services.auth_service import _admins
from app.utils.logger import app_logger
from app.config.settings import STATUS_OK, STATUS_NOT_FOUND, STATUS_CONFLICT, STATUS_BAD_REQUEST

class ProfileService:
    """
    Service layer handling admin profile data operations, profile pictures,
    and passwords updates.
    """

    @staticmethod
    def get_profile(admin_id: str) -> tuple:
        admin = next((a for a in _admins.values() if a["id"] == admin_id), None)
        if not admin:
            return {"success": False, "message": "Admin profile not found."}, STATUS_NOT_FOUND

        # Return profile without sensitive credentials
        return {
            "success": True,
            "message": "Profile details retrieved.",
            "data": {
                "id": admin["id"],
                "name": admin["name"],
                "email": admin["email"],
                "profile_image": admin["profile_image"]
            }
        }, STATUS_OK

    @staticmethod
    def update_profile(admin_id: str, data: dict) -> tuple:
        admin = next((a for a in _admins.values() if a["id"] == admin_id), None)
        if not admin:
            return {"success": False, "message": "Admin profile not found."}, STATUS_NOT_FOUND

        new_email = data.get("email", "").strip().lower()
        new_name = data.get("name", "").strip()

        # Check conflict if email changes
        if new_email and new_email != admin["email"]:
            if new_email in _admins:
                return {"success": False, "message": "Email address already in use."}, STATUS_CONFLICT
            
            # Since _admins dict is keyed by email, re-key the dictionary
            old_email = admin["email"]
            admin["email"] = new_email
            _admins[new_email] = admin
            _admins.pop(old_email)
            app_logger.info(f"Admin email updated from {old_email} to {new_email}")

        if new_name:
            admin["name"] = new_name

        app_logger.info(f"Admin profile updated: {admin_id}")
        return {
            "success": True,
            "message": "Profile updated successfully.",
            "data": {
                "id": admin["id"],
                "name": admin["name"],
                "email": admin["email"],
                "profile_image": admin["profile_image"]
            }
        }, STATUS_OK

    @staticmethod
    def change_password(admin_id: str, data: dict) -> tuple:
        admin = next((a for a in _admins.values() if a["id"] == admin_id), None)
        if not admin:
            return {"success": False, "message": "Admin profile not found."}, STATUS_NOT_FOUND

        current_password = data["current_password"]
        new_password = data["new_password"]

        # Validate current password
        hashed_current = hashlib.sha256(current_password.encode()).hexdigest()
        if admin["password"] != hashed_current:
            return {"success": False, "message": "Incorrect current password."}, STATUS_BAD_REQUEST

        # Save new password
        hashed_new = hashlib.sha256(new_password.encode()).hexdigest()
        admin["password"] = hashed_new
        app_logger.info(f"Admin password changed: {admin_id}")

        return {
            "success": True,
            "message": "Password changed successfully."
        }, STATUS_OK

    @staticmethod
    def upload_profile_image(admin_id: str, filename: str) -> tuple:
        admin = next((a for a in _admins.values() if a["id"] == admin_id), None)
        if not admin:
            return {"success": False, "message": "Admin profile not found."}, STATUS_NOT_FOUND

        admin["profile_image"] = filename
        app_logger.info(f"Admin profile image updated: {admin_id} -> {filename}")

        return {
            "success": True,
            "message": "Profile image uploaded successfully.",
            "data": {
                "profile_image": filename
            }
        }, STATUS_OK
