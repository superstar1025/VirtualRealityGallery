from django.conf.urls import url
from django.conf.urls.static import static
from django.conf import settings
from . import views

from django.contrib.auth import views as view_admin

urlpatterns = [
    url(r'^$', views.post_list, name='post_list'),
    url(r'^get_data$', views.ajax_get_data, name='ajax_get_data'),
]

urlpatterns += static('/media/', document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)