from api.models import Route
from rest_framework import viewsets
from rest_framework_gis.filters import InBBoxFilter, DistanceToPointFilter
from api.serializers import RouteSerializer


class RouteViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = Route.objects.all()
    serializer_class = RouteSerializer
    distance_filter_field = 'start_point'
    filter_backends = (InBBoxFilter, DistanceToPointFilter)
    bbox_filter_include_overlapping = True
