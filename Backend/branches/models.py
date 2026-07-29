from django.db import models
from departments.models import Department

class Branch(models.Model):
    branch_id = models.AutoField(primary_key=True)
    department = models.ForeignKey(Department, on_delete=models.DO_NOTHING, db_column="department_id")
    branch_name = models.CharField(max_length=100)
    branch_code = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        managed = True
        db_table = "branches"

    def __str__(self):
        return self.branch_name
