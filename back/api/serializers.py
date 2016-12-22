from api.models import Route
from rest_framework import serializers


class ListRouteSerializer(serializers.HyperlinkedModelSerializer):

    def get_start_point(self, obj):
        return obj.start_point.json

    #def get_line(self, obj):
    #    return obj.line.json

    class Meta:
        model = Route
        exclude = ('line',)


class DetailRouteSerializer(serializers.HyperlinkedModelSerializer):

    def get_start_point(self, obj):
        return obj.start_point.json

    def get_line(self, obj):
        return obj.line.json

    class Meta:
        model = Route
        fields = '__all__'
