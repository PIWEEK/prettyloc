from rest_framework import pagination
from rest_framework.response import Response

class LinkHeaderPagination(pagination.PageNumberPagination):
    def get_paginated_response(self, data):
        count = self.page.paginator.count
        headers = {'count': count}

        next_url = self.get_next_link()
        if next_url is not None:
            headers.update({'next': '{}'.format(next_url)})

        previous_url = self.get_previous_link()
        if previous_url is not None:
            headers.update({'previous': '{}'.format(previous_url)})

        return Response(data, headers=headers)
