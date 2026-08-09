from django.db import models
from users.models import User
from departments.models import Department
from branches.models import Branch
from classes.models import Class, Division

class Student(models.Model):
    student_id = models.AutoField(primary_key=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE, db_column="user_id", related_name="student_profile")
    roll_number = models.CharField(max_length=30, unique=True)
    department = models.ForeignKey(Department, on_delete=models.DO_NOTHING, db_column="department_id", null=True, blank=True)
    branch = models.ForeignKey(Branch, on_delete=models.DO_NOTHING, db_column="branch_id", null=True, blank=True)
    student_class = models.ForeignKey(Class, on_delete=models.DO_NOTHING, db_column="class_id", null=True, blank=True)
    division = models.ForeignKey(Division, on_delete=models.DO_NOTHING, db_column="division_id", null=True, blank=True)
    class_name = models.CharField(max_length=50, default="10th", blank=True, null=True)
    division_name = models.CharField(max_length=20, default="A", blank=True, null=True)
    gpa = models.DecimalField(max_digits=3, decimal_places=2, default=3.80, null=True, blank=True)
    status = models.CharField(max_length=20, default="active")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        managed = True
        db_table = "students"

    def __str__(self):
        return f"{self.user.full_name} ({self.roll_number})"

