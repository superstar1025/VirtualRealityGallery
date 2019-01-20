from django.contrib import admin
from django.contrib.sites.models import Site
from django.contrib.auth.models import Group
from content.models import User, Image, ModuleGallery, ModuleVR, ModuleFloorPlan, Location, Hotspot, ImageGallery, \
    ImageFloorPlan, ImageFilterGallery

# admin.site.unregister(Site)
# admin.site.unregister(Group)

admin.site.register(User)


@admin.register(Image)
class ImageAdmin(admin.ModelAdmin):
    list_display = ('id', 'title')
    # , 'user', 'gallery'
    # list_editable = ('order',)

    # fields = (
    #     'title',
    #     'first',
    #     'second',
    #     ('potspot_first', 'potspot_second'),
    #     'user',
    #     'gallery',
    # )


@admin.register(ImageGallery)
class ImageAdmin(admin.ModelAdmin):
    list_display = ('id', 'title')


@admin.register(ImageFilterGallery)
class ImageAdmin(admin.ModelAdmin):
    list_display = ('id', 'title')


@admin.register(ImageFloorPlan)
class ImageAdmin(admin.ModelAdmin):
    list_display = ('id', 'title')


admin.site.register(ModuleGallery)
admin.site.register(ModuleVR)
admin.site.register(ModuleFloorPlan)
admin.site.register(Location)
admin.site.register(Hotspot)

# @admin.register(Gallery)
# class GalleryAdmin(admin.ModelAdmin):
#     list_display = ('id', 'title', 'order')
#     list_editable = ('order',)
