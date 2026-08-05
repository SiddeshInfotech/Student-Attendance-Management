from django.db import models


class Department(models.Model):
    department_id = models.AutoField(primary_key=True)
    department_name = models.CharField(max_length=100)
    department_code = models.CharField(max_length=20, unique=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        managed = True
        db_table = "departments"

    def __str__(self):
        return self.department_name