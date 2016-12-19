from api.models import Route
from rest_framework import serializers


class RouteSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Route
        fields = ('title', 'external_id', 'route_type', 'route_length')
