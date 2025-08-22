from rest_framework import generics
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .serializers import LeaderboardSerializer
from .utils import get_yearly_leaderboard

class LeaderBoardView(generics.ListAPIView):
    serializer_class = LeaderboardSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        limit = self.request.query_params.get('limit', 10)
        leaderboard = get_yearly_leaderboard(limit=limit, min_ratings=1)
        return [item['attraction'] for item in leaderboard]

    def list(self, request, *args, **kwargs):
        limit = request.query_params.get('limit', 10)
        leaderboard = get_yearly_leaderboard(limit=limit, min_ratings=1)
        queryset = [item['attraction'] for item in leaderboard]
        serializer = self.get_serializer(queryset, many=True)
        data = [
            {
                **serializer.data[i],
                'weighted_average': leaderboard[i]['weighted_average'],  # Используем leaderboard напрямую
                'rating_count': leaderboard[i]['rating_count']
            }
            for i in range(len(leaderboard))
        ]
        return Response(data)