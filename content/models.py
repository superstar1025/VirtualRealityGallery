from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models import deletion
from django.utils.translation import ugettext_lazy as _


# Create your models here.

class User(AbstractUser):
    username = models.CharField(_('username'), max_length=150, unique=True)


class Image(models.Model):
    title = models.CharField(max_length=100, default=None, null=True, blank=True)
    image = models.ImageField()

    def __str__(self):
        return '#%s: %s' % (self.pk, self.title)


class Hotspot(models.Model):
    title = models.CharField(max_length=100, default=None, null=True, blank=True)
    x = models.FloatField(default=0)
    y = models.FloatField(default=0)

    def __str__(self):
        return '#%s: (%s; %s)' % (self.pk, self.x, self.y)


class ModuleVR(models.Model):
    enabled = models.BooleanField(default=False)

    first_hotspot = models.OneToOneField(Hotspot, on_delete=models.CASCADE, related_name='vr_first_hotspot')
    second_hotspot = models.OneToOneField(Hotspot, on_delete=models.CASCADE, related_name='vr_second_hotspot')

    first = models.OneToOneField(Image, on_delete=models.CASCADE, related_name='vr_first')
    second = models.OneToOneField(Image, on_delete=models.CASCADE, related_name='vr_second')

    class Meta:
        verbose_name = verbose_name_plural = 'VR'

    def __str__(self):
        return '#%s: [%s, %s]' % (self.pk, self.first.title, self.second.title)


class ModuleGallery(models.Model):
    enabled = models.BooleanField(default=False)

    first_hotspot = models.OneToOneField(Hotspot, on_delete=models.CASCADE, related_name='gallery_first_hotspot')
    second_hotspot = models.OneToOneField(Hotspot, on_delete=models.CASCADE, related_name='gallery_second_hotspot')

    class Meta:
        verbose_name = 'Gallery'
        verbose_name_plural = 'Galleries'

    def __str__(self):
        return '#%s: Galleries' % self.pk


class ImageGallery(models.Model):
    title = models.CharField(max_length=100, default=None, null=True, blank=True)
    image = models.ImageField()
    order = models.IntegerField(default=0)
    gallery = models.ForeignKey(ModuleGallery, default=None, null=True, blank=False, on_delete=deletion.CASCADE)

    def __str__(self):
        return '#%s: %s' % (self.pk, self.title)


class ImageFilterGallery(models.Model):
    title = models.CharField(max_length=100, default=None, null=True, blank=True)
    image = models.ImageField()
    order = models.IntegerField(default=0)
    gallery = models.ForeignKey(ModuleGallery, default=None, null=True, blank=False, on_delete=deletion.CASCADE)

    def __str__(self):
        return '#%s: %s' % (self.pk, self.title)


class ModuleFloorPlan(models.Model):
    enabled = models.BooleanField(default=False)

    class floorPlan:
        verbose_name = verbose_name_plural = 'Floor Plan'

    def __str__(self):
        return '#%s: Floor Plan' % self.pk


class ImageFloorPlan(models.Model):
    title = models.CharField(max_length=100, default=None, null=True, blank=True)
    image = models.ImageField()
    order = models.IntegerField(default=0)
    floorPlan = models.ForeignKey(ModuleFloorPlan, default=None, null=True, blank=False, on_delete=deletion.CASCADE)

    def __str__(self):
        return '#%s: %s' % (self.pk, self.title)


class Location(models.Model):
    user = models.ForeignKey(User, default=None, null=True, blank=False, on_delete=deletion.CASCADE)
    vr = models.OneToOneField(ModuleVR, on_delete=models.CASCADE)
    gallery = models.OneToOneField(ModuleGallery, on_delete=models.CASCADE)
    floorPlan = models.OneToOneField(ModuleFloorPlan, on_delete=models.CASCADE)

    def __str__(self):
        return '#%s [%s]: Location' % (self.pk, self.user.username)