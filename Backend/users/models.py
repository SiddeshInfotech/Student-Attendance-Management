from django.db import models
from django.utils import timezone

class Role(models.Model):
    role_id = models.AutoField(primary_key=True)
    role_name = models.CharField(max_length=50, unique=True)
    description = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        managed = True
        db_table = "roles"

    def __str__(self):
        return self.role_name


class User(models.Model):
    user_id = models.AutoField(primary_key=True)

    role = models.ForeignKey(
        Role,
        on_delete=models.DO_NOTHING,
        db_column="role_id"
    )

    full_name = models.CharField(max_length=100)
    email = models.CharField(max_length=254, unique=True)
    mobile = models.CharField(max_length=15, unique=True)
    password = models.CharField(max_length=255)
    profile_image = models.CharField(max_length=255, blank=True, null=True)
    status = models.CharField(max_length=10, default="active")
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        managed = True
        db_table = "users"

    @property
    def id(self):
        """SimpleJWT requires user.id — map it to user_id."""
        return self.user_id

    def __str__(self):
        return self.full_name