from rest_framework import viewsets, permissions
from .models import Tour
from .serializers import TourSerializer


class TourViewSet(viewsets.ModelViewSet):
    queryset = Tour.objects.all()
    serializer_class = TourSerializer
    permission_classes = [permissions.IsAuthenticated]  # доступ только авторизованным

    def perform_create(self, serializer):
        serializer.save(guide=self.request.user)  # гид = текущий юзер
