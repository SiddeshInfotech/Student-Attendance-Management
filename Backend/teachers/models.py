from django.db import models
from users.models import User
from departments.models import Department

class Teacher(models.Model):
    teacher_id = models.AutoField(primary_key=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE, db_column="user_id")
    department = models.ForeignKey(Department, on_delete=models.DO_NOTHING, db_column="department_id", null=True, blank=True)
    qualification = models.CharField(max_length=100, blank=True, null=True)
    experience_years = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        managed = False
        db_table = "teachers"

    def __str__(self):
        return self.user.full_name
