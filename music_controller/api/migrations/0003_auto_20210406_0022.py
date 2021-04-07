# Generated by Django 3.1.7 on 2021-04-06 00:22

import api.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_auto_20210318_2355'),
    ]

    operations = [
        migrations.AlterField(
            model_name='room',
            name='code',
            field=models.CharField(default=api.models.generate_code, max_length=20, unique=True),
        ),
    ]