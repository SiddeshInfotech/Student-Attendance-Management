from flask import Blueprint, request
from app.middleware.auth_middleware import admin_required
from app.schemas.student_schema import StudentSchema
from app.services.student_service import StudentService
from app.services.dashboard_service import log_dashboard_activity
from app.utils.helpers import api_response
from app.config.settings import STATUS_OK

students_bp = Blueprint("students", __name__, url_prefix="/api/students")
student_schema = StudentSchema()

@students_bp.route("", methods=["GET"])
@admin_required()
def get_all_students():
    """
    Retrieves all students, supporting class filtering, search, and pagination.
    """
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 20, type=int)
    search = request.args.get("search", None, type=str)
    class_name = request.args.get("class_name", None, type=str)
    
    res, status_code = StudentService.get_all(page, per_page, search, class_name)
    return res, status_code

@students_bp.route("/count", methods=["GET"])
@admin_required()
def get_student_count():
    """
    Returns the total number of students in the register.
    """
    count = StudentService.get_count()
    return api_response(
        success=True,
        message="Total student count retrieved.",
        data={"count": count},
        status_code=STATUS_OK
    )

@students_bp.route("/search", methods=["GET"])
@admin_required()
def search_students():
    """
    Performs quick search query matching name, roll number, or email.
    """
    query = request.args.get("q", "", type=str)
    res, status_code = StudentService.search(query)
    return res, status_code

@students_bp.route("/<student_id>", methods=["GET"])
@admin_required()
def get_student_by_id(student_id):
    """
    Retrieves a single student's details.
    """
    res, status_code = StudentService.get_by_id(student_id)
    return res, status_code

@students_bp.route("", methods=["POST"])
@admin_required()
def add_student():
    """
    Registers a new student.
    """
    json_data = request.get_json() or {}
    validated_data = student_schema.load(json_data)
    res, status_code = StudentService.add(validated_data)
    
    if status_code == 201:
        log_dashboard_activity(f"Student registered: {validated_data['name']} (Roll: {validated_data['roll_number']})")
        
    return res, status_code

@students_bp.route("/<student_id>", methods=["PUT"])
@admin_required()
def update_student(student_id):
    """
    Updates an existing student's properties.
    Supports partial updates.
    """
    json_data = request.get_json() or {}
    validated_data = StudentSchema().load(json_data, partial=True)
    res, status_code = StudentService.update(student_id, validated_data)
    
    if status_code == 200:
        log_dashboard_activity(f"Student details updated: ID {student_id}")
        
    return res, status_code

@students_bp.route("/<student_id>", methods=["DELETE"])
@admin_required()
def delete_student(student_id):
    """
    Deletes a student from registers.
    """
    res, status_code = StudentService.delete(student_id)
    
    if status_code == 200:
        log_dashboard_activity(f"Student deleted: ID {student_id}")
        
    return res, status_code
