from django.db import models
from .category import Category
from .citizen import Citizen


class Report(models.Model):
    citizen = models.ForeignKey(Citizen, on_delete=models.CASCADE, related_name='reports')
    report_type = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='reports')
    latitude = models.DecimalField(max_digits=9, decimal_places=6, help_text="Latitude of the report location")
    longitude = models.DecimalField(max_digits=9, decimal_places=6, help_text="Longitude of the report location")
    description = models.TextField(blank=True, null=True, help_text="Optional description of the issue")
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = "reports"
        verbose_name = "Report"
        verbose_name_plural = "Reports"
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Report #{self.id} - {self.report_type.report_type} by {self.citizen.name}"