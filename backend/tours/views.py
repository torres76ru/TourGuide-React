from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied, ValidationError
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from .models import Tour
from .serializers import TourSerializer, TourCreateSerializer


class IsGuideOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.guide == request.user


class TourViewSet(viewsets.ModelViewSet):
    queryset = Tour.objects.all()
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ["date"]
    search_fields = ["title", "content", "meeting_address"]
    ordering_fields = ["date", "created_at"]

    def get_serializer_class(self):
        if self.action == "create":
            return TourCreateSerializer
        return TourSerializer

    def get_permissions(self):
        if self.action in ["create"]:
            return [permissions.IsAuthenticated()]
        elif self.action in ["leave"]:
            return [permissions.IsAuthenticated()]
        return [permissions.IsAuthenticated(), IsGuideOrReadOnly()]

    def perform_create(self, serializer):
        if not self.request.user.is_guide:
            raise PermissionDenied("Только гид может создавать экскурсии.")
        serializer.save(guide=self.request.user)

    @action(detail=True, methods=["post"])
    def leave(self, request, pk=None):
        tour = self.get_object()
        try:
            tour.remove_participant(request.user)
        except ValidationError as e:
            return Response({"error": str(e.detail[0])}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"detail": "Вы успешно отписались от экскурсии."}, status=status.HTTP_200_OK)
