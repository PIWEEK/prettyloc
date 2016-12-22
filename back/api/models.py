from django.contrib.gis.db.models import PointField, LineStringField, GeoManager
from django.db import models

DIFFICULTIES = (
    (1, 'easy'),
    (2, 'moderate'),
    (3, 'difficult'),
    (4, 'very difficult'),
    (5, 'expert'),
)

TYPES = (
    ('mountain-biking','mountain-biking'),
    ('hiking','hiking'),
    ('cycling','cycling'),
    ('running','running'),
    ('trail-running','trail-running'),
    ('mountaineering','mountaineering'),
    ('bicycle-touring','bicycle-touring'),
    ('walking','walking'),
    ('motorcycling','motorcycling'),
    ('back-country-skiing','back-country-skiing'),
    ('trail-bike','trail-bike'),
    ('atv','atv'),
    ('kayaking-canoeing','kayaking-canoeing'),
    ('sailing','sailing'),
    ('snowshoeing','snowshoeing'),
    ('cross-country-skiing','cross-country-skiing'),
    ('alpine-skiing','alpine-skiing'),
    ('flying','flying'),
    ('horseback-riding','horseback-riding'),
    ('dog-sledging','dog-sledging'),
    ('rock-climbing','rock-climbing'),
    ('inline-skating','inline-skating'),
    ('skating','skating'),
    ('train','train'),
    ('canyoneering','canyoneering'),
    ('diving','diving'),
    ('caving','caving'),
    ('hang-gliding','hang-gliding'),
    ('ballooning','ballooning'),
    ('snowboarding','snowboarding'),
    ('ice-climbing','ice-climbing'),
    ('snowmobiling','snowmobiling'),
    ('accessible','accessible'),
    ('offroading','offroading'),
    ('rowing','rowing'),
    ('car','car'),
    ('kiteboarding','kiteboarding'),
    ('kite-skiing','kite-skiing'),
    ('sledge','sledge'),
    ('kickbike','kickbike'),
    ('paragliding','paragliding'),
    ('for-blind','for-blind'),
    ('nordic-walking','nordic-walking'),
    ('motorcycle-trials','motorcycle-trials'),
    ('enduro','enduro'),
    ('via-ferrata','via-ferrata'),
    ('swimming','swimming'),
    ('orienteering','orienteering'),
    ('multisport','multisport'),
    ('stand-up-paddle-sup','stand-up-paddle-sup'),
    ('barefoot','barefoot'),
    ('canicross','canicross'),
    ('roller-skiing','roller-skiing'),
    ('longboarding','longboarding'),
    ('mountain-unicycling','mountain-unicycling'),
    ('golf','golf'),
    ('recreational-vehicle','recreational-vehicle'),
    ('airboat','airboat'),
    ('segway','segway'),
    ('camel','camel'),
    ('freeride','freeride'),
    ('unmanned-aerial-vehicle-uav','unmanned-aerial-vehicle-uav'),
    ('motorboat','motorboat'),
    ('birdwatching-birding','birdwatching-birding'),
    ('trailer-bike','trailer-bike'),
    ('water-scooter-pwc','water-scooter-pwc'),
    ('handbike','handbike'),
    ('rafting','rafting'),
    ('downhill-mountain-biking-dh','downhill-mountain-biking-dh'),
    ('electric-vehicle','electric-vehicle'),
    ('base-jumping','base-jumping'),
    ('joelette','joelette'),
    ('with-baby-carriage','with-baby-carriage'),
    ('splitboard','splitboard'),
    ('cyclocross','cyclocross')
)


class Route(models.Model):
    title = models.TextField()
    external_id = models.IntegerField()
    route_type = models.CharField(max_length=100, choices=TYPES)
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


