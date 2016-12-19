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
    name = models.TextField()
    type = models.CharField(max_length=100, choices=TYPES)
    is_circular = models.BooleanField()
    difficulty = models.CharField(max_length=100, choices=DIFFICULTIES)
    distance = models.FloatField()
    elevation_up = models.FloatField()
    elevation_down = models.FloatField()
    max_altitude = models.FloatField()
    min_altitude = models.FloatField()
    duration = models.CharField(max_length=100, null=True, blank=True)
