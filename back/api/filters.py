import django_filters
from api.models import Route, DIFFICULTIES

class RouteFilter(django_filters.FilterSet):
    min_dist = django_filters.NumberFilter(name="route_length", lookup_expr='gte')
    max_dist = django_filters.NumberFilter(name="route_length", lookup_expr='lte')
    technical_difficulty = django_filters.MultipleChoiceFilter(
            name="technical_difficulty",
            lookup_expr='in',
            choices=DIFFICULTIES)

    class Meta:
        model = Route
        fields = ['route_loop', 'route_type', 'min_dist', 'max_dist', 'technical_difficulty']
