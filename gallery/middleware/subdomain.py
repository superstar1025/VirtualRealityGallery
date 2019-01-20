import operator
import re

from gallery.middleware.utils import get_domain
from django.utils.deprecation import MiddlewareMixin

lower = operator.methodcaller('lower')


class SubdomainMiddleware(MiddlewareMixin):
    """
    A middleware class that adds a ``subdomain`` attribute to the current request.
    """

    def get_domain_for_request(self, request):
        """
        Returns the domain that will be used to identify the subdomain part
        for this request.
        """
        return get_domain()

    def process_request(self, request):
        """
        Adds a ``subdomain`` attribute to the ``request`` parameter.
        """
        domain, host = map(lower,
                           (self.get_domain_for_request(request), request.get_host()))

        pattern = r'^(?:(?P<subdomain>.*?)\.)?%s(?::.*)?$' % re.escape(domain)
        matches = re.match(pattern, host)

        if matches:
            request.subdomain = matches.group('subdomain')
        else:
            request.subdomain = None
