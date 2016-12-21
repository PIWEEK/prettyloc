from django.contrib.gis.db.models import PointField, LineStringField, GeoManager
from django.db import models

DIFFICULTIES = (
    (1, 'easy'),
    (2, 'moderate'),
    (3, 'difficult'),
    (4, 'very difficult'),
    (5, 'expert'),
)


class Route(models.Model):
    title = models.TextField()
    external_id = models.IntegerField()
    route_type = models.CharField(max_length=100)
    route_loop = models.BooleanField()
    technical_difficulty = models.IntegerField(choices=DIFFICULTIES)
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
