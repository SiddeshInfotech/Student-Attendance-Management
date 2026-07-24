from flask import Blueprint, request, send_file
from app.middleware.auth_middleware import admin_required
from app.services.report_service import ReportService
from app.utils.helpers import api_response
from app.config.settings import STATUS_BAD_REQUEST

reports_bp = Blueprint("reports", __name__, url_prefix="/api/reports")

@reports_bp.route("/daily", methods=["GET"])
@admin_required()
def daily_report():
    """
    Returns daily attendance status metrics. Query parameter: date (YYYY-MM-DD).
    """
    date_str = request.args.get("date")
    if not date_str:
        return api_response(
            success=False, 
            message="Date query parameter is required.", 
            status_code=STATUS_BAD_REQUEST
        )
    res, status_code = ReportService.get_daily_report(date_str)
    return res, status_code

@reports_bp.route("/weekly", methods=["GET"])
@admin_required()
def weekly_report():
    """
    Returns weekly class log summaries. Query parameter: start_date (YYYY-MM-DD).
    """
    start_date_str = request.args.get("start_date")
    if not start_date_str:
        return api_response(
            success=False, 
            message="Start date query parameter is required.", 
            status_code=STATUS_BAD_REQUEST
        )
    res, status_code = ReportService.get_weekly_report(start_date_str)
    return res, status_code

@reports_bp.route("/monthly", methods=["GET"])
@admin_required()
def monthly_report():
    """
    Returns monthly attendance percentages. Query parameters: year, month.
    """
    year = request.args.get("year", type=int)
    month = request.args.get("month", type=int)
    if not year or not month:
        return api_response(
            success=False, 
            message="Year and month query parameters are required.", 
            status_code=STATUS_BAD_REQUEST
        )
    res, status_code = ReportService.get_monthly_report(year, month)
    return res, status_code

@reports_bp.route("/student/<student_id>", methods=["GET"])
@admin_required()
def student_report(student_id):
    """
    Returns attendance profile analysis logs for a specific student.
    """
    res, status_code = ReportService.get_student_report(student_id)
    return res, status_code

@reports_bp.route("/overall", methods=["GET"])
@admin_required()
def overall_report():
    """
    Returns aggregated overall attendance data for all students.
    """
    res, status_code = ReportService.get_overall_report()
    return res, status_code

@reports_bp.route("/download/pdf", methods=["GET"])
@admin_required()
def download_pdf_report():
    """
    Triggers overall attendance report download in PDF document format.
    """
    pdf_buffer = ReportService.generate_pdf_report()
    return send_file(
        pdf_buffer,
        mimetype="application/pdf",
        as_attachment=True,
        download_name="attendance_overall_report.pdf"
    )

@reports_bp.route("/download/excel", methods=["GET"])
@admin_required()
def download_excel_report():
    """
    Triggers overall attendance report download in Excel sheet format.
    """
    excel_buffer = ReportService.generate_excel_report()
    return send_file(
        excel_buffer,
        mimetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        as_attachment=True,
        download_name="attendance_overall_report.xlsx"
    )
