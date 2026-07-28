from django.db import models
from students.models import Student

class LeaveRequest(models.Model):
    request_id = models.AutoField(primary_key=True)
    student = models.ForeignKey(Student, on_delete=models.CASCADE, db_column="student_id")
    start_date = models.DateField()
    end_date = models.DateField()
    reason = models.TextField()
    status = models.CharField(max_length=20, default="pending")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        managed = False
        db_table = "leave_requests"
