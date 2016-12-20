from django.contrib.gis.db.models import PointField, LineStringField, GeoManager
from django.db import models

TYPES = (
    ('hicking', 'hicking'),
)

DIFFICULTIES = (
    ('easy', 'easy'),
    ('moderate', 'moderate'),
    ('difficult', 'difficult'),
    ('very difficult', 'very difficult'),
    ('expert', 'expert'),
)


class Route(models.Model):
    title = models.TextField()
    external_id = models.IntegerField()
    route_type = models.CharField(max_length=100, choices=TYPES)
    route_loop = models.BooleanField()
    technical_difficulty = models.CharField(max_length=100, choices=DIFFICULTIES)
    route_length = models.FloatField()
    route_uphill = models.FloatField()
    route_downhill = models.FloatField()
    route_height = models.FloatField()
    route_low = models.FloatField()
    time = models.CharField(max_length=100, null=True, blank=True)
    coordinates = models.CharField(max_length=100, null=True, blank=True)
    upload_date = models.CharField(max_length=100, null=True, blank=True)
    recorded_date = models.CharField(max_length=100, null=True, blank=True)
    stars = models.IntegerField(null=True)
    start_point = PointField()
    line = LineStringField()
    objects = GeoManager()
