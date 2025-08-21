from rest_framework import viewsets, permissions
from .models import Route
from .serializers import RouteSerializer
from django.db.models import Q


class RouteViewSet(viewsets.ModelViewSet):
    serializer_class = RouteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Route.objects.filter(Q(creator=user) | Q(is_public=True))
