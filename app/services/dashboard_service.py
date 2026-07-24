from datetime import datetime
from app.services.student_service import _students
from app.services.attendance_service import _attendance
from app.config.settings import STATUS_OK

# Global list of recent activities to display on the dashboard
_activities = [
    {
        "id": "act-1",
        "description": "System database initialized with mock student registers.",
        "timestamp": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
    },
    {
        "id": "act-2",
        "description": "Initial attendance records loaded.",
        "timestamp": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
    }
]

def log_dashboard_activity(description: str):
    """
    Appends a new system activity log to the dashboard's feed.
    Capped at the most recent 20 activities.
    """
    act_id = f"act-{len(_activities) + 1}"
    _activities.insert(0, {
        "id": act_id,
        "description": description,
        "timestamp": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
    })
    if len(_activities) > 20:
        _activities.pop()

class DashboardService:
    """
    Service layer providing stats, graphs aggregates, and recent audit logs.
    """

    @staticmethod
    def get_summary() -> tuple:
        total_students = len(_students)
        total_logs = len(_attendance)
        
        # Calculate overall present rate
        present_count = sum(1 for r in _attendance.values() if r["status"] in ["Present", "Late"])
        overall_attendance_rate = round((present_count / total_logs) * 100, 2) if total_logs > 0 else 0.0

        return {
            "success": True,
            "message": "Dashboard summary retrieved successfully.",
            "data": {
                "total_students": total_students,
                "total_attendance_logs": total_logs,
                "overall_attendance_rate": f"{overall_attendance_rate}%",
                "active_classes_count": len(set(s["class_name"] for s in _students.values())) if _students else 0
            }
        }, STATUS_OK

    @staticmethod
    def get_statistics() -> tuple:
        # Build status distribution count
        distribution = {"Present": 0, "Absent": 0, "Late": 0, "Excused": 0}
        for log in _attendance.values():
            status = log["status"]
            if status in distribution:
                distribution[status] += 1
                
        # Group attendance rates by Class Section
        class_stats = {}
        for student_id, student in _students.items():
            c_name = student["class_name"]
            if c_name not in class_stats:
                class_stats[c_name] = {"present_days": 0, "total_days": 0}
                
            student_logs = [r for r in _attendance.values() if r["student_id"] == student_id]
            for r in student_logs:
                class_stats[c_name]["total_days"] += 1
                if r["status"] in ["Present", "Late"]:
                    class_stats[c_name]["present_days"] += 1
                    
        class_rates = {}
        for c_name, counts in class_stats.items():
            rate = round((counts["present_days"] / counts["total_days"]) * 100, 2) if counts["total_days"] > 0 else 0.0
            class_rates[c_name] = f"{rate}%"

        return {
            "success": True,
            "message": "Dashboard statistics retrieved successfully.",
            "data": {
                "status_distribution": distribution,
                "attendance_rates_by_class": class_rates
            }
        }, STATUS_OK

    @staticmethod
    def get_recent_activities() -> tuple:
        return {
            "success": True,
            "message": "Recent activities retrieved successfully.",
            "data": _activities
        }, STATUS_OK
