from django.db import models

class Semester(models.Model):
    semester_id = models.AutoField(primary_key=True)
    semester_name = models.CharField(max_length=50)
    semester_code = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        managed = False
        db_table = "semesters"

    def __str__(self):
        return self.semester_name
