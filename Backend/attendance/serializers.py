from rest_framework import serializers
from .models import Attendance

class AttendanceSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source="student.user.full_name", read_only=True)
    roll_number = serializers.CharField(source="student.roll_number", read_only=True)
    subject_name = serializers.CharField(source="subject.subject_name", read_only=True)
    class_name = serializers.CharField(source="student_class.class_name", read_only=True)

    class Meta:
        model = Attendance
        fields = "__all__"

class BulkAttendanceSerializer(serializers.Serializer):
    date = serializers.DateField()
    class_id = serializers.IntegerField()
    subject_id = serializers.IntegerField(required=False, allow_null=True)
    records = serializers.ListField(
        child=serializers.DictField()
    )
