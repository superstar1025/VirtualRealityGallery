import json
from django.http import HttpResponseNotFound, HttpResponse
from django.shortcuts import render, redirect, get_object_or_404, render_to_response
from django.contrib.auth.decorators import login_required
# Create your views here.
from django.template import RequestContext
from django.views.decorators.csrf import csrf_exempt

from content.models import User, Image, Location


def post_list(request):
    domain = request.META['HTTP_HOST']
    subdomain = getattr(request, 'subdomain', None)

    if subdomain in ['admin']:
        return redirect('http://%s' % domain)

    if not subdomain:
        qs_users = User.objects.filter(is_staff=False)

        user = [user.username for user in qs_users]
        return render(request, 'content/home.html', {'users': user, 'domain': domain})

    user = get_object_or_404(User, username=subdomain)

    # if not User.objects.filter(username=subdomain).exists():
    #     return HttpResponseNotFound('<h1>No Page Here</h1>')

    result = {}

    # galleries = Gallery.objects.all().order_by('order')
    # for gallery in galleries:
    #     result.update({gallery: []})
    #
    # images = Image.objects.filter(user=user)
    # for image in images:
    #     result[image.gallery].append({'title': image.title, 'url': image.image.url})
    #
    # return render(request, 'content/user.html', {'user': user, 'galleries': result})
    return render(request, 'content/user.html', {})


@csrf_exempt
def ajax_get_data(request):
    if request.method == 'POST':
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)
        user_from_request = body.get('user', None)

        user = User.objects.filter(username=user_from_request).first()

        if not user:
            return HttpResponse(
                json.dumps({'error': 'Not found user "%s"' % user_from_request}),
                content_type="application/json"
            )

        location = Location.objects.filter(user=user).first()

        response_data = {
            'vr': {
                'enable': location.vr.enabled,
                'hotSpPos': {
                    'first': {
                        'title': location.vr.first_hotspot.title,
                        'x': location.vr.first_hotspot.x,
                        'y': location.vr.first_hotspot.y,

                    },
                    'second': {
                        'title': location.vr.second_hotspot.title,
                        'x': location.vr.second_hotspot.x,
                        'y': location.vr.second_hotspot.y,
                    }
                },
                'url': [location.vr.first.image.url, location.vr.second.image.url]
            },
            'gallery': {
                'enable': location.gallery.enabled,
                'hotSpPos': {
                    'first': {
                        'x': location.gallery.first_hotspot.x,
                        'y': location.gallery.first_hotspot.y,

                    },
                    'second': {
                        'x': location.gallery.second_hotspot.x,
                        'y': location.gallery.second_hotspot.y,
                    }
                },
                'url': [img.image.url for img in location.gallery.imagegallery_set.all().order_by('order')],
                'urlFilter': [img.image.url for img in location.gallery.imagefiltergallery_set.all().order_by('order')]
            },
            'floorPlan': {
                'enable': location.floorPlan.enabled,
                'url': [img.image.url for img in location.floorPlan.imagefloorplan_set.all().order_by('order')]
            },
        }
    else:
        return HttpResponse(
            json.dumps({'error': "Not POST request"}),
            content_type="application/json"
        )

    return HttpResponse(
        json.dumps(response_data),
        content_type="application/json"
    )
