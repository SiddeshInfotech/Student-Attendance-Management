from flask import Blueprint
from app.middleware.auth_middleware import admin_required
from app.services.notification_service import NotificationService

notifications_bp = Blueprint("notifications", __name__, url_prefix="/api/notifications")

@notifications_bp.route("", methods=["GET"])
@admin_required()
def get_notifications():
    """
    Retrieves all system notification records.
    """
    res, status_code = NotificationService.get_notifications()
    return res, status_code

@notifications_bp.route("/<notification_id>/read", methods=["PUT"])
@admin_required()
def mark_read(notification_id):
    """
    Marks a specific notification as read.
    """
    res, status_code = NotificationService.mark_as_read(notification_id)
    return res, status_code