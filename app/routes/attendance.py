from flask import Blueprint, request
from app.middleware.auth_middleware import admin_required
from app.schemas.attendance_schema import AttendanceSchema, BulkAttendanceSchema
from app.services.attendance_service import AttendanceService
from app.services.dashboard_service import log_dashboard_activity

attendance_bp = Blueprint("attendance", __name__, url_prefix="/api/attendance")
attendance_schema = AttendanceSchema()
bulk_attendance_schema = BulkAttendanceSchema()

@attendance_bp.route("", methods=["POST"])
@admin_required()
def mark_attendance():
    """
    Records student attendance. Supports marking single student entries
    or class-wide bulk entries (by structuring payload in a 'records' array).
    """
    json_data = request.get_json() or {}
    
    if "records" in json_data:
        validated_data = bulk_attendance_schema.load(json_data)
        res, status_code = AttendanceService.mark_attendance(validated_data)
        if status_code == 200:
            log_dashboard_activity(f"Logged bulk attendance list ({len(validated_data['records'])} records).")
    else:
        validated_data = attendance_schema.load(json_data)
        res, status_code = AttendanceService.mark_attendance(validated_data)
        if status_code in [200, 201]:
            log_dashboard_activity(
                f"Logged attendance: ID {validated_data['student_id']} on {validated_data['date']} -> {validated_data['status']}"
            )
            
    return res, status_code

@attendance_bp.route("", methods=["GET"])
@admin_required()
def get_all_attendance():
    """
    Retrieves all attendance logs.
    """
    res, status_code = AttendanceService.get_all()
    return res, status_code

@attendance_bp.route("/date/<date_str>", methods=["GET"])
@admin_required()
def get_attendance_by_date(date_str):
    """
    Retrieves attendance logs for a specific calendar date (YYYY-MM-DD).
    """
    res, status_code = AttendanceService.get_by_date(date_str)
    return res, status_code

@attendance_bp.route("/student/<student_id>", methods=["GET"])
@admin_required()
def get_attendance_by_student(student_id):
    """
    Retrieves attendance logs for a single student.
    """
    res, status_code = AttendanceService.get_by_student(student_id)
    return res, status_code

@attendance_bp.route("/<attendance_id>", methods=["PUT"])
@admin_required()
def update_attendance(attendance_id):
    """
    Modifies status/remarks on a logged attendance item.
    """
    json_data = request.get_json() or {}
    validated_data = AttendanceSchema().load(json_data, partial=True)
    res, status_code = AttendanceService.update(attendance_id, validated_data)
    
    if status_code == 200:
        log_dashboard_activity(f"Attendance log updated: Record ID {attendance_id}")
        
    return res, status_code

@attendance_bp.route("/<attendance_id>", methods=["DELETE"])
@admin_required()
def delete_attendance(attendance_id):
    """
    Deletes an attendance log.
    """
    res, status_code = AttendanceService.delete(attendance_id)
    
    if status_code == 200:
        log_dashboard_activity(f"Attendance log deleted: Record ID {attendance_id}")
        
    return res, status_code

@attendance_bp.route("/percentage/<student_id>", methods=["GET"])
@admin_required()
def get_attendance_percentage(student_id):
    """
    Calculates a student's present percentage rate.
    """
    res, status_code = AttendanceService.get_percentage(student_id)
    return res, status_code
