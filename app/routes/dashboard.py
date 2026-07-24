from flask import Blueprint
from app.middleware.auth_middleware import admin_required
from app.services.dashboard_service import DashboardService

dashboard_bp = Blueprint("dashboard", __name__, url_prefix="/api/dashboard")

@dashboard_bp.route("/summary", methods=["GET"])
@admin_required()
def get_summary():
    """
    Returns dashboard highlights, including counts and average rates.
    """
    res, status_code = DashboardService.get_summary()
    return res, status_code

@dashboard_bp.route("/statistics", methods=["GET"])
@admin_required()
def get_statistics():
    """
    Returns detailed statistics (status distribution, class ratios).
    """
    res, status_code = DashboardService.get_statistics()
    return res, status_code

@dashboard_bp.route("/activities", methods=["GET"])
@admin_required()
def get_activities():
    """
    Returns the feed of recent administrative activities.
    """
    res, status_code = DashboardService.get_recent_activities()
    return res, status_code
