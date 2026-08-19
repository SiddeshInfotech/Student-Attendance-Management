from rest_framework import serializers
from .models import SystemSettings, Holiday

class HolidaySerializer(serializers.ModelSerializer):
    class Meta:
        model = Holiday
        fields = ['id', 'name', 'date', 'created_at']


class SystemSettingsSerializer(serializers.ModelSerializer):
    college_logo_url = serializers.SerializerMethodField()

    class Meta:
        model = SystemSettings
        fields = '__all__'

    def get_college_logo_url(self, obj):
        if obj.college_logo:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.college_logo.url)
            return obj.college_logo.url
        return ""
