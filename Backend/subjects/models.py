from django.db import models
from departments.models import Department
from semesters.models import Semester

class Subject(models.Model):
    subject_id = models.AutoField(primary_key=True)
    subject_name = models.CharField(max_length=100)
    subject_code = models.CharField(max_length=20)
    department = models.ForeignKey(Department, on_delete=models.DO_NOTHING, db_column="department_id", null=True, blank=True)
    semester = models.ForeignKey(Semester, on_delete=models.DO_NOTHING, db_column="semester_id", null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        managed = False
        db_table = "subjects"

    def __str__(self):
        return self.subject_name

class TeacherSubject(models.Model):
    id = models.AutoField(primary_key=True)
    teacher_id = models.IntegerField()
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, db_column="subject_id")

    class Meta:
        managed = False
        db_table = "teacher_subjects"
