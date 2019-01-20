from django.conf import settings


# from django.core.urlresolvers import reverse as simple_reverse


def current_site_domain():
    from django.contrib.sites.models import Site
    domain = Site.objects.get_current().domain

    prefix = 'www.'
    if getattr(settings, 'REMOVE_WWW_FROM_DOMAIN', False) \
            and domain.startswith(prefix):
        domain = domain.replace(prefix, '', 1)

    return domain


get_domain = current_site_domain
