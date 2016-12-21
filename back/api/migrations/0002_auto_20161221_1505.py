# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2016-12-21 14:05
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='route',
            name='route_type',
            field=models.CharField(max_length=100),
        ),
        migrations.AlterField(
            model_name='route',
            name='stars',
            field=models.IntegerField(null=True),
        ),
        migrations.AlterField(
            model_name='route',
            name='technical_difficulty',
            field=models.IntegerField(),
        ),
    ]