from django.db import models
from students.models import Student
from classes.models import Class
from subjects.models import Subject

class Attendance(models.Model):
    attendance_id = models.AutoField(primary_key=True)
    student = models.ForeignKey(Student, on_delete=models.CASCADE, db_column="student_id")
    student_class = models.ForeignKey(Class, on_delete=models.DO_NOTHING, db_column="class_id", null=True, blank=True)
    subject = models.ForeignKey(Subject, on_delete=models.DO_NOTHING, db_column="subject_id", null=True, blank=True)
    date = models.DateField()
    status = models.CharField(max_length=10)  # present, absent, late
    remarks = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        managed = True
        db_table = "attendance"

    def __str__(self):
        return f"{self.student.roll_number} - {self.date} - {self.status}"
