import uuid
from datetime import datetime
from app.utils.logger import app_logger
from app.services.student_service import _students
from app.config.settings import (
    STATUS_OK, STATUS_CREATED, STATUS_NOT_FOUND, STATUS_BAD_REQUEST
)

# Shared In-memory storage for attendance records
# Key: "att_<student_id>_<date_str>"
_attendance = {}

def seed_attendance():
    """
    Seeds initial attendance logs linked to the loaded mock students.
    """
    if not _attendance and _students:
        s_keys = list(_students.keys())
        dates = ["2026-07-20", "2026-07-19", "2026-07-18"]
        
        # statuses index matches students index
        status_matrix = [
            ["Present", "Present", "Present"],  # student 1
            ["Absent", "Present", "Late"],     # student 2
            ["Present", "Absent", "Excused"]    # student 3
        ]
        
        for idx, s_id in enumerate(s_keys):
            if idx >= len(status_matrix):
                break
            for d_idx, d_str in enumerate(dates):
                att_id = f"att_{s_id}_{d_str}"
                status = status_matrix[idx][d_idx]
                _attendance[att_id] = {
                    "id": att_id,
                    "student_id": s_id,
                    "date": d_str,
                    "status": status,
                    "remarks": "System seeded entry.",
                    "created_at": datetime.utcnow(),
                    "updated_at": datetime.utcnow()
                }

# Try seeding attendance
try:
    seed_attendance()
except Exception as e:
    app_logger.warning(f"Failed to seed initial attendance: {str(e)}")

class AttendanceService:
    """
    Service layer handling student attendance marking, updating, and reporting metrics.
    """

    @staticmethod
    def mark_attendance(data: dict) -> tuple:
        """
        Marks attendance. Handles upserts (creates or updates if student/date matches).
        Supports bulk payloads nested inside a 'records' list or single records.
        """
        if "records" in data:
            # Bulk marking
            marked_records = []
            for item in data["records"]:
                res, code = AttendanceService._upsert_single(item)
                if code == STATUS_CREATED or code == STATUS_OK:
                    marked_records.append(res["data"])
            
            return {
                "success": True,
                "message": f"Successfully processed {len(marked_records)} attendance records.",
                "data": marked_records
            }, STATUS_OK
        else:
            # Single marking
            return AttendanceService._upsert_single(data)

    @staticmethod
    def _upsert_single(item: dict) -> tuple:
        student_id = item["student_id"]
        
        # Validate student existence
        if student_id not in _students:
            return {
                "success": False, 
                "message": f"Student with ID {student_id} does not exist."
            }, STATUS_NOT_FOUND

        # Date handling: support date objects or string format
        date_val = item["date"]
        date_str = date_val.strftime("%Y-%m-%d") if hasattr(date_val, "strftime") else str(date_val)
        
        att_key = f"att_{student_id}_{date_str}"
        status = item["status"]
        remarks = item.get("remarks", "")

        is_new = att_key not in _attendance
        timestamp = datetime.utcnow()

        if is_new:
            _attendance[att_key] = {
                "id": att_key,
                "student_id": student_id,
                "date": date_str,
                "status": status,
                "remarks": remarks,
                "created_at": timestamp,
                "updated_at": timestamp
            }
            app_logger.info(f"Attendance marked: Student {student_id} on {date_str} -> {status}")
            return {
                "success": True,
                "message": "Attendance marked successfully.",
                "data": _attendance[att_key]
            }, STATUS_CREATED
        else:
            # Update existing
            _attendance[att_key]["status"] = status
            _attendance[att_key]["remarks"] = remarks
            _attendance[att_key]["updated_at"] = timestamp
            app_logger.info(f"Attendance updated: Student {student_id} on {date_str} -> {status}")
            return {
                "success": True,
                "message": "Attendance updated successfully.",
                "data": _attendance[att_key]
            }, STATUS_OK

    @staticmethod
    def get_all() -> tuple:
        records = list(_attendance.values())
        return {
            "success": True,
            "message": "Attendance logs retrieved.",
            "data": records
        }, STATUS_OK

    @staticmethod
    def get_by_date(date_str: str) -> tuple:
        records = [r for r in _attendance.values() if r["date"] == date_str]
        return {
            "success": True,
            "message": f"Attendance logs for date {date_str} retrieved.",
            "data": records
        }, STATUS_OK

    @staticmethod
    def get_by_student(student_id: str) -> tuple:
        if student_id not in _students:
            return {"success": False, "message": "Student not found."}, STATUS_NOT_FOUND
            
        records = [r for r in _attendance.values() if r["student_id"] == student_id]
        return {
            "success": True,
            "message": f"Attendance logs for student {student_id} retrieved.",
            "data": records
        }, STATUS_OK

    @staticmethod
    def update(attendance_id: str, data: dict) -> tuple:
        # Since our IDs are mapped by student_id and date
        record = _attendance.get(attendance_id)
        if not record:
            return {"success": False, "message": "Attendance record not found."}, STATUS_NOT_FOUND
            
        if "status" in data:
            record["status"] = data["status"]
        if "remarks" in data:
            record["remarks"] = data["remarks"]
            
        record["updated_at"] = datetime.utcnow()
        app_logger.info(f"Attendance record {attendance_id} updated manually.")
        
        return {
            "success": True,
            "message": "Attendance record updated successfully.",
            "data": record
        }, STATUS_OK

    @staticmethod
    def delete(attendance_id: str) -> tuple:
        if attendance_id not in _attendance:
            return {"success": False, "message": "Attendance record not found."}, STATUS_NOT_FOUND
            
        _attendance.pop(attendance_id)
        app_logger.info(f"Attendance record {attendance_id} deleted.")
        return {
            "success": True,
            "message": "Attendance record deleted successfully."
        }, STATUS_OK

    @staticmethod
    def get_percentage(student_id: str) -> tuple:
        if student_id not in _students:
            return {"success": False, "message": "Student not found."}, STATUS_NOT_FOUND
            
        student_records = [r for r in _attendance.values() if r["student_id"] == student_id]
        total_days = len(student_records)
        
        if total_days == 0:
            return {
                "success": True,
                "message": "No attendance records found for student.",
                "data": {
                    "student_id": student_id,
                    "student_name": _students[student_id]["name"],
                    "attendance_percentage": 0.0,
                    "total_days": 0,
                    "present_days": 0
                }
            }, STATUS_OK
            
        # Count present/late/excused days
        present_days = sum(1 for r in student_records if r["status"] in ["Present", "Late"])
        percentage = round((present_days / total_days) * 100, 2)
        
        return {
            "success": True,
            "message": "Attendance percentage calculated.",
            "data": {
                "student_id": student_id,
                "student_name": _students[student_id]["name"],
                "attendance_percentage": percentage,
                "total_days": total_days,
                "present_days": present_days
            }
        }, STATUS_OK
