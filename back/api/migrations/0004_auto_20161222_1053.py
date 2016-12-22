# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2016-12-22 09:53
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_auto_20161221_1509'),
    ]

    operations = [
        migrations.AlterField(
            model_name='route',
            name='route_type',
            field=models.CharField(choices=[('mountain-biking', 'mountain-biking'), ('hiking', 'hiking'), ('cycling', 'cycling'), ('running', 'running'), ('trail-running', 'trail-running'), ('mountaineering', 'mountaineering'), ('bicycle-touring', 'bicycle-touring'), ('walking', 'walking'), ('motorcycling', 'motorcycling'), ('back-country-skiing', 'back-country-skiing'), ('trail-bike', 'trail-bike'), ('atv', 'atv'), ('kayaking-canoeing', 'kayaking-canoeing'), ('sailing', 'sailing'), ('snowshoeing', 'snowshoeing'), ('cross-country-skiing', 'cross-country-skiing'), ('alpine-skiing', 'alpine-skiing'), ('flying', 'flying'), ('horseback-riding', 'horseback-riding'), ('dog-sledging', 'dog-sledging'), ('rock-climbing', 'rock-climbing'), ('inline-skating', 'inline-skating'), ('skating', 'skating'), ('train', 'train'), ('canyoneering', 'canyoneering'), ('diving', 'diving'), ('caving', 'caving'), ('hang-gliding', 'hang-gliding'), ('ballooning', 'ballooning'), ('snowboarding', 'snowboarding'), ('ice-climbing', 'ice-climbing'), ('snowmobiling', 'snowmobiling'), ('accessible', 'accessible'), ('offroading', 'offroading'), ('rowing', 'rowing'), ('car', 'car'), ('kiteboarding', 'kiteboarding'), ('kite-skiing', 'kite-skiing'), ('sledge', 'sledge'), ('kickbike', 'kickbike'), ('paragliding', 'paragliding'), ('for-blind', 'for-blind'), ('nordic-walking', 'nordic-walking'), ('motorcycle-trials', 'motorcycle-trials'), ('enduro', 'enduro'), ('via-ferrata', 'via-ferrata'), ('swimming', 'swimming'), ('orienteering', 'orienteering'), ('multisport', 'multisport'), ('stand-up-paddle-sup', 'stand-up-paddle-sup'), ('barefoot', 'barefoot'), ('canicross', 'canicross'), ('roller-skiing', 'roller-skiing'), ('longboarding', 'longboarding'), ('mountain-unicycling', 'mountain-unicycling'), ('golf', 'golf'), ('recreational-vehicle', 'recreational-vehicle'), ('airboat', 'airboat'), ('segway', 'segway'), ('camel', 'camel'), ('freeride', 'freeride'), ('unmanned-aerial-vehicle-uav', 'unmanned-aerial-vehicle-uav'), ('motorboat', 'motorboat'), ('birdwatching-birding', 'birdwatching-birding'), ('trailer-bike', 'trailer-bike'), ('water-scooter-pwc', 'water-scooter-pwc'), ('handbike', 'handbike'), ('rafting', 'rafting'), ('downhill-mountain-biking-dh', 'downhill-mountain-biking-dh'), ('electric-vehicle', 'electric-vehicle'), ('base-jumping', 'base-jumping'), ('joelette', 'joelette'), ('with-baby-carriage', 'with-baby-carriage'), ('splitboard', 'splitboard'), ('cyclocross', 'cyclocross')], max_length=100),
        ),
    ]