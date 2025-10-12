from rest_framework import serializers
from api.models import Report, Category, Citizen


class ReportSerializer(serializers.ModelSerializer):
    """
    Serializer for Report model.
    
    Handles creation and retrieval of reports by citizens.
    Automatically captures location (latitude/longitude) and citizen info.
    """
    
    category_name = serializers.CharField(source='report_type.report_type', read_only=True)
    citizen_name = serializers.CharField(source='citizen.name', read_only=True)
    citizen_email = serializers.CharField(source='citizen.email', read_only=True)
    
    class Meta:
        model = Report
        fields = [
            'id', 
            'citizen', 
            'citizen_name', 
            'citizen_email',
            'report_type', 
            'category_name',
            'latitude', 
            'longitude',
            'description',
            'created_at'
        ]
        read_only_fields = ['id', 'citizen', 'created_at']
    
    def validate_report_type(self, value):
        """Validate that the category exists"""
        if not Category.objects.filter(id=value.id).exists():
            raise serializers.ValidationError("Invalid category selected.")
        return value
    
    def validate_latitude(self, value):
        """Validate latitude is within valid range"""
        if value < -90 or value > 90:
            raise serializers.ValidationError("Latitude must be between -90 and 90 degrees.")
        return value
    
    def validate_longitude(self, value):
        """Validate longitude is within valid range"""
        if value < -180 or value > 180:
            raise serializers.ValidationError("Longitude must be between -180 and 180 degrees.")
        return value
