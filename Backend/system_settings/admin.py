from django.contrib import admin
from .models import SystemSettings, Holiday

@admin.register(SystemSettings)
class SystemSettingsAdmin(admin.ModelAdmin):
    list_display = ('college_name', 'system_title', 'academic_year', 'updated_at')

@admin.register(Holiday)
class HolidayAdmin(admin.ModelAdmin):
    list_display = ('name', 'date', 'created_at')
