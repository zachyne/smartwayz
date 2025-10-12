from django.db import models
from .category import Category


class SubCategory(models.Model):
    class SubCategoryType(models.TextChoices):
        # Infrastructure categories
        ROAD_DAMAGE = 'ROAD_DAMAGE', 'Road damage/Potholes'
        STREETLIGHTS = 'STREETLIGHTS', 'Streetlights/Electrical Issues'
        SIDEWALKS = 'SIDEWALKS', 'Sidewalks/Pedestrian Paths'
        BUILDING = 'BUILDING', 'Building/Structural Concerns'
        BRIDGE = 'BRIDGE', 'Bridge/Overpass Issues'
        STRUCTURAL_COLLAPSE = 'STRUCTURAL_COLLAPSE', 'Structural Collapses/Weak infrastructure'
        SAFETY_SECURITY = 'SAFETY_SECURITY', 'Safety and Security Concerns'
        INFRA_OTHER = 'INFRA_OTHER', 'Other (specify)'
        
        # Hazard Subcategories
        FLOODING = 'FLOODING', 'Flooding/Water Overflow'
        LANDSLIDE = 'LANDSLIDE', 'Landslide/Soil Erosion'
        FIRE_HAZARD = 'FIRE_HAZARD', 'Fire Hazard'
        ELECTRICAL_HAZARD = 'ELECTRICAL_HAZARD', 'Electrical Hazard'
        FALLEN_TREES = 'FALLEN_TREES', 'Fallen Trees/Debris Blocking Road'
        ROAD_ACCIDENT = 'ROAD_ACCIDENT', 'Road accident'
        BLOCKED_DRAINAGE = 'BLOCKED_DRAINAGE', 'Blocked Drainage/Clogged Gutter'
        EARTHQUAKE = 'EARTHQUAKE', 'Earthquake Damage'
        SINKHOLE = 'SINKHOLE', 'Sinkhole'
        PUBLIC_HEALTH = 'PUBLIC_HEALTH', 'Public Health Hazard'
        HAZARD_OTHER = 'HAZARD_OTHER', 'Other Hazard (specify)'
        
            # ✅ Mapping to know which subcategories belong to which category
    CATEGORY_MAPPING = {
        'Infrastructure': [
            SubCategoryType.ROAD_DAMAGE,
            SubCategoryType.STREETLIGHTS,
            SubCategoryType.SIDEWALKS,
            SubCategoryType.BUILDING,
            SubCategoryType.BRIDGE,
            SubCategoryType.STRUCTURAL_COLLAPSE,
            SubCategoryType.SAFETY_SECURITY,
            SubCategoryType.INFRA_OTHER,
        ],
        'Hazard': [
            SubCategoryType.FLOODING,
            SubCategoryType.LANDSLIDE,
            SubCategoryType.FIRE_HAZARD,
            SubCategoryType.ELECTRICAL_HAZARD,
            SubCategoryType.FALLEN_TREES,
            SubCategoryType.ROAD_ACCIDENT,
            SubCategoryType.BLOCKED_DRAINAGE,
            SubCategoryType.EARTHQUAKE,
            SubCategoryType.SINKHOLE,
            SubCategoryType.PUBLIC_HEALTH,
            SubCategoryType.HAZARD_OTHER,
        ],
    }
        
    report_type = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name='subcategories'
        )
    
    sub_category = models.CharField(
        max_length=64,
        choices=SubCategoryType.choices
    )
    
    class Meta:
        db_table = "sub_categories"
        verbose_name = "Sub Category"
        verbose_name_plural = "Sub Categories"
    
    def __str__(self):
        return f"{self.get_sub_category_display()} ({self.report_type.report_type})"