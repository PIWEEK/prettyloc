from api.models import Route
from rest_framework import serializers


class RouteSerializer(serializers.HyperlinkedModelSerializer):

    def get_start_point(self, obj):
        return obj.start_point.json

    #def get_line(self, obj):
    #    return obj.line.json

    class Meta:
        model = Route
        #fields = '__all__'
        exclude = ('line',)
