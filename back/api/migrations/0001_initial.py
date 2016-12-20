# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2016-12-19 13:39
from __future__ import unicode_literals

from django.contrib.gis.db.models import PointField, LineStringField
from django.contrib.postgres.operations import CreateExtension
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = [
    ]

    operations = [
        CreateExtension('postgis'),
        migrations.CreateModel(
            name='Route',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('external_id', models.IntegerField()),
                ('title', models.TextField()),
                ('route_type', models.CharField(choices=[('hicking', 'hicking')], max_length=100)),
                ('route_loop', models.BooleanField()),
                ('technical_difficulty', models.CharField(
                    choices=[('easy', 'easy'), ('moderate', 'moderate'), ('difficult', 'difficult'),
                             ('very difficult', 'very difficult'), ('expert', 'expert')], max_length=100)),
                ('route_length', models.FloatField()),
                ('route_uphill', models.FloatField()),
                ('route_downhill', models.FloatField()),
                ('route_height', models.FloatField()),
                ('route_low', models.FloatField()),
                ('time', models.CharField(blank=True, max_length=100, null=True)),
                ('coordinates', models.CharField(blank=True, max_length=100, null=True)),
                ('upload_date', models.CharField(blank=True, max_length=100, null=True)),
                ('recorded_date', models.CharField(blank=True, max_length=100, null=True)),
                ('stars', models.IntegerField(blank=True, null=True)),
                ('start_point', PointField()),
                ('line', LineStringField()),
            ],
        ),
    ]
