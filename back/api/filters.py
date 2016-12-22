import django_filters
from api.models import Route, DIFFICULTIES, TYPES

types_with_icon = [
        'hiking',
        'walking',
        'nordic-walking',
        'mountain-biking',
        'cyclocross',
        'cycling',
        'bicycle-touring',
        'running trail-running'
]

class RouteFilter(django_filters.FilterSet):
    min_dist = django_filters.NumberFilter(name="route_length", lookup_expr='gte')
    max_dist = django_filters.NumberFilter(name="route_length", lookup_expr='lte')
    technical_difficulty = django_filters.MultipleChoiceFilter(
            name="technical_difficulty",
            lookup_expr='in',
            choices=DIFFICULTIES)
    route_type = django_filters.MultipleChoiceFilter(
            method='route_type_filter',
            name="route_type",
            choices=TYPES + (('other', 'other'),))

    class Meta:
        model = Route
        fields = ['route_loop', 'route_type', 'min_dist', 'max_dist', 'technical_difficulty']

    def route_type_filter(self, queryset, name, choices):
        route_type = self.request.query_params.getlist('route_type', None)
        if route_type:
            if 'other' in route_type:
                queryset = queryset.exclude(route_type__in=types_with_icon)
            else:
                queryset = queryset.filter(route_type__in=route_type)
        return queryset
