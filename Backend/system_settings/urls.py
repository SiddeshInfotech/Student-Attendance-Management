from django.urls import path
from .views import (
    SettingsAPIView,
    HolidayListCreateView,
    HolidayDeleteView,
    LogoUploadView,
    SendTestEmailView,
    DatabaseBackupView,
    DatabaseRestoreView
)

urlpatterns = [
    path('', SettingsAPIView.as_view(), name='system-settings'),
    path('logo/', LogoUploadView.as_view(), name='system-settings-logo'),
    path('test-email/', SendTestEmailView.as_view(), name='system-settings-test-email'),
    path('backup/', DatabaseBackupView.as_view(), name='system-settings-backup'),
    path('restore/', DatabaseRestoreView.as_view(), name='system-settings-restore'),
    path('holidays/', HolidayListCreateView.as_view(), name='system-settings-holidays'),
    path('holidays/<int:pk>/', HolidayDeleteView.as_view(), name='system-settings-holiday-delete'),
]
