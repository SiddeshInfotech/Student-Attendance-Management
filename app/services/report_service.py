import io
from datetime import datetime, timedelta
from app.services.student_service import _students
from app.services.attendance_service import _attendance
from app.config.settings import STATUS_OK, STATUS_NOT_FOUND, STATUS_BAD_REQUEST

# Excel and PDF libs
from openpyxl import Workbook
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

class ReportService:
    """
    Service layer providing logic for daily, weekly, monthly, student, and overall reports.
    Generates dynamic reports in raw JSON format, Excel (via openpyxl), and PDF (via reportlab).
    """

    @staticmethod
    def get_daily_report(date_str: str) -> tuple:
        report_data = []
        for s_id, student in _students.items():
            att_key = f"att_{s_id}_{date_str}"
            record = _attendance.get(att_key)
            status = record["status"] if record else "Not Marked"
            report_data.append({
                "student_id": s_id,
                "name": student["name"],
                "roll_number": student["roll_number"],
                "class_name": student["class_name"],
                "status": status
            })

        return {
            "success": True,
            "message": f"Daily report for {date_str} generated.",
            "data": {
                "date": date_str,
                "records": report_data
            }
        }, STATUS_OK

    @staticmethod
    def get_weekly_report(start_date_str: str) -> tuple:
        try:
            start_date = datetime.strptime(start_date_str, "%Y-%m-%d").date()
        except ValueError:
            return {"success": False, "message": "Invalid date format. Use YYYY-MM-DD."}, STATUS_BAD_REQUEST

        week_dates = [(start_date + timedelta(days=i)).strftime("%Y-%m-%d") for i in range(7)]
        report_data = []

        for s_id, student in _students.items():
            student_week = {"student_id": s_id, "name": student["name"], "roll_number": student["roll_number"], "attendance": {}}
            for d_str in week_dates:
                att_key = f"att_{s_id}_{d_str}"
                record = _attendance.get(att_key)
                student_week["attendance"][d_str] = record["status"] if record else "N/A"
            report_data.append(student_week)

        return {
            "success": True,
            "message": f"Weekly report from {start_date_str} generated.",
            "data": {
                "start_date": start_date_str,
                "dates": week_dates,
                "records": report_data
            }
        }, STATUS_OK

    @staticmethod
    def get_monthly_report(year: int, month: int) -> tuple:
        # Generate all dates for the month
        try:
            start_date = datetime(year, month, 1).date()
            if month == 12:
                end_date = datetime(year + 1, 1, 1).date() - timedelta(days=1)
            else:
                end_date = datetime(year, month + 1, 1).date() - timedelta(days=1)
        except ValueError:
            return {"success": False, "message": "Invalid year or month value."}, STATUS_BAD_REQUEST

        num_days = (end_date - start_date).days + 1
        month_dates = [(start_date + timedelta(days=i)).strftime("%Y-%m-%d") for i in range(num_days)]
        report_data = []

        for s_id, student in _students.items():
            present = 0
            absent = 0
            late = 0
            excused = 0
            unmarked = 0

            for d_str in month_dates:
                att_key = f"att_{s_id}_{d_str}"
                record = _attendance.get(att_key)
                if not record:
                    unmarked += 1
                elif record["status"] == "Present":
                    present += 1
                elif record["status"] == "Absent":
                    absent += 1
                elif record["status"] == "Late":
                    late += 1
                elif record["status"] == "Excused":
                    excused += 1

            total_marked = present + absent + late + excused
            attendance_rate = round(((present + late) / total_marked) * 100, 2) if total_marked > 0 else 0.0

            report_data.append({
                "student_id": s_id,
                "name": student["name"],
                "roll_number": student["roll_number"],
                "present": present,
                "absent": absent,
                "late": late,
                "excused": excused,
                "unmarked": unmarked,
                "attendance_rate": f"{attendance_rate}%"
            })

        return {
            "success": True,
            "message": f"Monthly report for {year}-{month:02d} generated.",
            "data": {
                "year": year,
                "month": month,
                "records": report_data
            }
        }, STATUS_OK

    @staticmethod
    def get_student_report(student_id: str) -> tuple:
        if student_id not in _students:
            return {"success": False, "message": "Student not found."}, STATUS_NOT_FOUND

        student = _students[student_id]
        student_logs = [r for r in _attendance.values() if r["student_id"] == student_id]
        student_logs.sort(key=lambda x: x["date"], reverse=True)

        present = sum(1 for r in student_logs if r["status"] == "Present")
        absent = sum(1 for r in student_logs if r["status"] == "Absent")
        late = sum(1 for r in student_logs if r["status"] == "Late")
        excused = sum(1 for r in student_logs if r["status"] == "Excused")
        total = len(student_logs)

        attendance_rate = round(((present + late) / total) * 100, 2) if total > 0 else 0.0

        return {
            "success": True,
            "message": f"Attendance report for student {student['name']} generated.",
            "data": {
                "student": {
                    "id": student_id,
                    "name": student["name"],
                    "roll_number": student["roll_number"],
                    "class_name": student["class_name"]
                },
                "summary": {
                    "total_classes": total,
                    "present": present,
                    "absent": absent,
                    "late": late,
                    "excused": excused,
                    "attendance_rate": f"{attendance_rate}%"
                },
                "logs": student_logs
            }
        }, STATUS_OK

    @staticmethod
    def get_overall_report() -> tuple:
        records = []
        for s_id, student in _students.items():
            student_logs = [r for r in _attendance.values() if r["student_id"] == s_id]
            total = len(student_logs)
            present = sum(1 for r in student_logs if r["status"] in ["Present", "Late"])
            rate = round((present / total) * 100, 2) if total > 0 else 0.0
            
            records.append({
                "student_id": s_id,
                "name": student["name"],
                "roll_number": student["roll_number"],
                "class_name": student["class_name"],
                "total_days": total,
                "attended_days": present,
                "attendance_rate": f"{rate}%"
            })

        return {
            "success": True,
            "message": "Overall attendance report generated.",
            "data": records
        }, STATUS_OK

    @staticmethod
    def generate_excel_report() -> io.BytesIO:
        """
        Builds a downloadable Excel file containing the overall student attendance report.
        """
        wb = Workbook()
        ws = wb.active
        ws.title = "Attendance Summary"

        # Headers
        ws.append(["Student ID", "Student Name", "Roll Number", "Class", "Total Days", "Attended Days", "Attendance Rate"])

        # Fetch records
        res, _ = ReportService.get_overall_report()
        for row in res["data"]:
            ws.append([
                row["student_id"],
                row["name"],
                row["roll_number"],
                row["class_name"],
                row["total_days"],
                row["attended_days"],
                row["attendance_rate"]
            ])

        # Save workbook to buffer stream
        file_stream = io.BytesIO()
        wb.save(file_stream)
        file_stream.seek(0)
        return file_stream

    @staticmethod
    def generate_pdf_report() -> io.BytesIO:
        """
        Builds a downloadable PDF document containing the overall student attendance report.
        """
        file_stream = io.BytesIO()
        doc = SimpleDocTemplate(file_stream, pagesize=letter)
        story = []

        styles = getSampleStyleSheet()
        title_style = ParagraphStyle(
            'ReportTitle',
            parent=styles['Heading1'],
            fontSize=18,
            textColor=colors.HexColor('#1A365D'),
            spaceAfter=15
        )

        story.append(Paragraph("Student Attendance Management System", title_style))
        story.append(Paragraph("Overall Attendance Summary Report", styles['Normal']))
        story.append(Spacer(1, 15))

        # Build Table Data
        table_data = [["Name", "Roll No", "Class", "Total Days", "Attended Days", "Attendance Rate"]]
        res, _ = ReportService.get_overall_report()
        for row in res["data"]:
            table_data.append([
                row["name"],
                row["roll_number"],
                row["class_name"],
                str(row["total_days"]),
                str(row["attended_days"]),
                row["attendance_rate"]
            ])

        # Style Table
        summary_table = Table(table_data)
        summary_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#2B6CB0')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 8),
            ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#F7FAFC')),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#E2E8F0')),
            ('FONTSIZE', (0, 0), (-1, -1), 9),
            ('TOPPADDING', (0, 0), (-1, -1), 6),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ]))

        story.append(summary_table)
        doc.build(story)
        file_stream.seek(0)
        return file_stream
