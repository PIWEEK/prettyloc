import django_filters
from api.models import Route

class RouteFilter(django_filters.FilterSet):
    min_dist = django_filters.NumberFilter(name="route_length", lookup_expr='gte')
    max_dist = django_filters.NumberFilter(name="route_length", lookup_expr='lte')
    class Meta:
        model = Route
        fields = ['route_loop', 'route_type', 'min_dist', 'max_dist', 'technical_difficulty']
