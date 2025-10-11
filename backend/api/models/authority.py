from django.db import models

class Authority(models.Model):
    authority_name = models.TextField(max_length=64)
    email = models.EmailField(max_length=64)
    password = models.TextField(max_length=64)
    
    class Meta:
        db_table = 'authorities'