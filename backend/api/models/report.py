from django.db import models
from django.core.exceptions import ValidationError
from .category import Category
from .citizen import Citizen
from .sub_category import SubCategory


class Report(models.Model):
    citizen = models.ForeignKey(Citizen, on_delete=models.CASCADE, related_name='reports')
    title = models.TextField(blank=True, help_text='Title of report')
    report_type = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='reports')
    sub_category = models.ForeignKey(
        SubCategory, 
        on_delete=models.SET_NULL, 
        related_name='reports',
        null=True,
        blank=True,
        help_text="Sub category of the report (required for Hazard category)"
    )
    description = models.TextField(blank=True, null=True, help_text="Optional description of the issue")
    latitude = models.DecimalField(max_digits=9, decimal_places=6, help_text="Latitude of the report location")
    longitude = models.DecimalField(max_digits=9, decimal_places=6, help_text="Longitude of the report location")
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = "reports"
        verbose_name = "Report"
        verbose_name_plural = "Reports"
        ordering = ['-created_at']
    
    def clean(self):
        """
        Custom validation to ensure:
        1. Sub category is required for Hazard reports
        2. Sub category matches the report_type category
        """
        super().clean()
        
        # Check if sub_category is required for Hazard category
        if self.report_type and self.report_type.report_type == 'Hazard':
            if not self.sub_category:
                raise ValidationError({
                    'sub_category': 'Sub category is required for Hazard reports.'
                })
        
        # Validate that sub_category belongs to the correct report_type
        if self.sub_category and self.report_type:
            if self.sub_category.report_type != self.report_type:
                raise ValidationError({
                    'sub_category': f'Sub category must belong to {self.report_type.report_type} category.'
                })
    
    def save(self, *args, **kwargs):
        """Override save to call clean validation"""
        self.full_clean()
        super().save(*args, **kwargs)
    
    def __str__(self):
        sub_cat_str = f" - {self.sub_category.get_sub_category_display()}" if self.sub_category else ""
        return f"Report #{self.id} - {self.report_type.report_type}{sub_cat_str} by {self.citizen.name}"