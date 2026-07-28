from django.db import models
from semesters.models import Semester
from branches.models import Branch

class Class(models.Model):
    class_id = models.AutoField(primary_key=True)
    class_name = models.CharField(max_length=50)
    branch = models.ForeignKey(Branch, on_delete=models.DO_NOTHING, db_column="branch_id", null=True, blank=True)
    semester = models.ForeignKey(Semester, on_delete=models.DO_NOTHING, db_column="semester_id", null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        managed = False
        db_table = "classes"

    def __str__(self):
        return self.class_name
