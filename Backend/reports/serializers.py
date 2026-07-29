from rest_framework import serializers

class ReportFilterSerializer(serializers.Serializer):
    start_date = serializers.DateField(required=False)
    end_date = serializers.DateField(required=False)
    department_id = serializers.IntegerField(required=False)
    class_id = serializers.IntegerField(required=False)
    format = serializers.ChoiceField(choices=["json", "excel", "pdf"], default="json")
