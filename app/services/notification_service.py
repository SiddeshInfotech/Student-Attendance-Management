import uuid
from datetime import datetime
from app.utils.logger import app_logger
from app.config.settings import STATUS_OK, STATUS_NOT_FOUND

# Shared In-memory storage for notification records
_notifications = {}

def seed_notifications():
    """
    Seeds initial system notification logs.
    """
    if not _notifications:
        n1 = str(uuid.uuid4())
        n2 = str(uuid.uuid4())
        
        _notifications[n1] = {
            "id": n1,
            "title": "Welcome to Student Attendance Manager",
            "message": "System initiated. You can now register students and log daily attendance.",
            "type": "info",
            "is_read": False,
            "created_at": datetime.utcnow()
        }
        _notifications[n2] = {
            "id": n2,
            "title": "Database Seed Complete",
            "message": "Mock students and initial attendance logs have been seeded successfully.",
            "type": "success",
            "is_read": False,
            "created_at": datetime.utcnow()
        }

try:
    seed_notifications()
except Exception as e:
    app_logger.warning(f"Failed to seed notifications: {str(e)}")

class NotificationService:
    """
    Service layer handling administrator notifications and read status.
    """

    @staticmethod
    def get_notifications() -> tuple:
        # Return all notifications sorted by date (newest first)
        notification_list = list(_notifications.values())
        notification_list.sort(key=lambda x: x["created_at"], reverse=True)
        
        return {
            "success": True,
            "message": "Notifications retrieved successfully.",
            "data": notification_list
        }, STATUS_OK

    @staticmethod
    def mark_as_read(notification_id: str) -> tuple:
        notification = _notifications.get(notification_id)
        if not notification:
            return {"success": False, "message": "Notification not found."}, STATUS_NOT_FOUND

        notification["is_read"] = True
        app_logger.info(f"Notification marked as read: {notification_id}")
        
        return {
            "success": True,
            "message": "Notification marked as read.",
            "data": notification
        }, STATUS_OK

    @staticmethod
    def add_notification(title: str, message: str, type_str: str = "info"):
        """
        Utility method to insert a new system notification.
        """
        n_id = str(uuid.uuid4())
        _notifications[n_id] = {
            "id": n_id,
            "title": title,
            "message": message,
            "type": type_str,
            "is_read": False,
            "created_at": datetime.utcnow()
        }
        app_logger.info(f"New system notification generated: {title}")
        return _notifications[n_id]
