from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Rating
from .serializers import RatingSerializer
from .permissions import IsOwnerOrAdmin

class RatingCreateView(generics.CreateAPIView):
    queryset = Rating.objects.all()
    serializer_class = RatingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):

        serializer.save(user=self.request.user)

class RatingListView(generics.ListAPIView):
    serializer_class = RatingSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):

        queryset = Rating.objects.all()
        attraction_id = self.request.query_params.get('attraction_id')
        if attraction_id:
            queryset = queryset.filter(attraction_id=attraction_id)
        return queryset

class RatingDetailView(generics.RetrieveAPIView):
    queryset = Rating.objects.all()
    serializer_class = RatingSerializer
    permission_classes = [permissions.AllowAny]

class RatingUpdateView(generics.UpdateAPIView):
    queryset = Rating.objects.all()
    serializer_class = RatingSerializer
    permission_classes = [IsOwnerOrAdmin]

class RatingDeleteView(generics.DestroyAPIView):
    queryset = Rating.objects.all()
    serializer_class = RatingSerializer
    permission_classes = [IsOwnerOrAdmin]

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)