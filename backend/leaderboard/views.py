from datetime import datetime, timedelta
from django.db.models import Avg
from django.utils import timezone
from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .serializers import LeaderboardSerializer
from .utils import get_yearly_leaderboard

class LeaderBoardView(generics.ListAPIView):

    permission_classes = [AllowAny]

    def post(self, request):

        limit = request.data.get('limit', 10)
        tags = request.data.get('tags', '')
        city = request.data.get('city', '')


        tags = tags.split(',') if isinstance(tags, str) and tags else []

        leaderboard = get_yearly_leaderboard(limit=limit, min_ratings=1, tags=tags, city=city)
        queryset = [item['attraction'] for item in leaderboard]
        serializer = LeaderboardSerializer(queryset, many=True)
        data = [
            {
                **serializer.data[i],
                'weighted_average': leaderboard[i]['weighted_average'],
                'rating_count': leaderboard[i]['rating_count']
            }
            for i in range(len(leaderboard))
        ]
        return Response(data, status=status.HTTP_200_OK)