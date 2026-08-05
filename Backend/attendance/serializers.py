from rest_framework import serializers
from .models import Attendance

class AttendanceSerializer(serializers.ModelSerializer):
    student_name = serializers.SerializerMethodField()
    roll_number = serializers.SerializerMethodField()
    department_name = serializers.SerializerMethodField()
    class_name = serializers.SerializerMethodField()
    semester_name = serializers.SerializerMethodField()
    subject_name = serializers.SerializerMethodField()
    attendance_date = serializers.DateField(source="date", read_only=True)
    attendance_time = serializers.SerializerMethodField()
    marked_by = serializers.SerializerMethodField()

    class Meta:
        model = Attendance
        fields = [
            "attendance_id",
            "student",
            "student_class",
            "subject",
            "date",
            "status",
            "remarks",
            "marked_by",
            "created_at",
            "student_name",
            "roll_number",
            "department_name",
            "class_name",
            "semester_name",
            "subject_name",
            "attendance_date",
            "attendance_time",
        ]

    def get_student_name(self, obj):
        if obj.student and obj.student.user:
            return obj.student.user.full_name
        return ""

    def get_roll_number(self, obj):
        if obj.student:
            return obj.student.roll_number
        return ""

    def get_department_name(self, obj):
        if obj.student and obj.student.department:
            return obj.student.department.department_name
        return ""

    def get_class_name(self, obj):
        if obj.student_class and obj.student_class.class_name:
            return obj.student_class.class_name
        if obj.student and obj.student.student_class:
            return obj.student.student_class.class_name
        return ""

    def get_semester_name(self, obj):
        if obj.student_class and obj.student_class.semester:
            return obj.student_class.semester.semester_name
        if obj.student and obj.student.student_class and obj.student.student_class.semester:
            return obj.student.student_class.semester.semester_name
        return ""

    def get_subject_name(self, obj):
        if obj.subject:
            return obj.subject.subject_name
        return ""

    def get_attendance_time(self, obj):
        if obj.created_at:
            return obj.created_at.strftime("%I:%M %p")
        return ""

    def get_marked_by(self, obj):
        val = getattr(obj, "marked_by", None)
        return val if val else "Admin"


class BulkAttendanceSerializer(serializers.Serializer):
    date = serializers.DateField(required=False, allow_null=True)
    class_id = serializers.IntegerField(required=False, allow_null=True)
    subject_id = serializers.IntegerField(required=False, allow_null=True)
    marked_by = serializers.CharField(required=False, allow_blank=True, default="Admin")
    records = serializers.ListField(
        child=serializers.DictField()
    )

