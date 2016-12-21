from api.filters import RouteFilter
from api.models import Route
from api.serializers import RouteSerializer
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics
from rest_framework import viewsets
from rest_framework_gis.filters import InBBoxFilter, DistanceToPointFilter

class RouteView(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that allows view routes
    """
    queryset = Route.objects.all()
    serializer_class = RouteSerializer
    filter_backends = (InBBoxFilter, DistanceToPointFilter, DjangoFilterBackend)
    filter_class = RouteFilter
    distance_filter_field = 'start_point'
    bbox_filter_field = 'start_point'
    bbox_filter_include_overlapping = True
    #filter_fields = ('route_type', 'route_loop')
