from django.urls import path
from .views import LeaderBoardView

urlpatterns = [
    path('leaderboard/', LeaderBoardView.as_view(), name='leaderboard'),# можно изменять city limit tags
]