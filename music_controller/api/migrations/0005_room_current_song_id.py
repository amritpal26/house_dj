# Generated by Django 3.1.7 on 2021-05-10 09:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_auto_20210509_0224'),
    ]

    operations = [
        migrations.AddField(
            model_name='room',
            name='current_song_id',
            field=models.CharField(max_length=50, null=True),
        ),
    ]
