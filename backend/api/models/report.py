from django.db import models
from category import Category

class Report(models.Model):
    report_type = models.ForeignKey(Category, on_delete=models.CASCADE)
    
    class Meta:
        db_table = "reports"