from django.db import models

class Citizen(models.Model):
    name = models.CharField(max_length=64)
    email = models.EmailField(max_length=64, unique=True)
    password = models.CharField(max_length=64)
    
    class Meta:
        db_table = "citizens"