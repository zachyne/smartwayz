from rest_framework import serializers
from api.models import Report, Category, Citizen, SubCategory


class ReportSerializer(serializers.ModelSerializer):
    """
    Serializer for Report model.
    
    Handles creation and retrieval of reports by citizens.
    Automatically captures location (latitude/longitude) and citizen info.
    Validates that sub_category is required for Hazard reports.
    """
    
    category_name = serializers.CharField(source='report_type.report_type', read_only=True)
    sub_category_name = serializers.CharField(source='sub_category.get_sub_category_display', read_only=True)
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
            'sub_category',
            'sub_category_name',
            'title',
            'latitude', 
            'longitude',
            'description',
            'created_at'
        ]
        read_only_fields = ['id', 'created_at']
    
    def validate_report_type(self, value):
        """Validate that the category exists"""
        if not Category.objects.filter(id=value.id).exists():
            raise serializers.ValidationError("Invalid category selected.")
        return value
    
    def validate_sub_category(self, value):
        """Validate that the sub_category exists if provided"""
        if value and not SubCategory.objects.filter(id=value.id).exists():
            raise serializers.ValidationError("Invalid sub category selected.")
        return value
    
    def validate(self, data):
        """
        Cross-field validation to ensure:
        1. Sub category is required for Hazard reports
        2. Sub category belongs to the selected report_type
        """
        report_type = data.get('report_type')
        sub_category = data.get('sub_category')
        
        # Check if sub_category is required for Hazard category
        if report_type and report_type.report_type == 'Hazard':
            if not sub_category:
                raise serializers.ValidationError({
                    'sub_category': 'Sub category is required for Hazard reports.'
                })
        
        # Validate that sub_category belongs to the correct report_type
        if sub_category and report_type:
            if sub_category.report_type != report_type:
                raise serializers.ValidationError({
                    'sub_category': f'Sub category must belong to {report_type.report_type} category.'
                })
        
        return data
    
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
