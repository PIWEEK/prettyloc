import django_filters
from api.models import Route, DIFFICULTIES, TYPES

class RouteFilter(django_filters.FilterSet):
    min_dist = django_filters.NumberFilter(name="route_length", lookup_expr='gte')
    max_dist = django_filters.NumberFilter(name="route_length", lookup_expr='lte')
    technical_difficulty = django_filters.MultipleChoiceFilter(
            name="technical_difficulty",
            lookup_expr='in',
            choices=DIFFICULTIES)
    route_type = django_filters.MultipleChoiceFilter(
            name="route_type",
            lookup_expr='in',
            choices=TYPES)

    class Meta:
        model = Route
        fields = ['route_loop', 'route_type', 'min_dist', 'max_dist', 'technical_difficulty']
