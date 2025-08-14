from django.urls import path
from .views import (
    RatingCreateView,
    RatingListView,
    RatingDetailView,
    RatingUpdateView,
    RatingDeleteView
)
urlpatterns = [
    # Создание нового рейтинга
    path('create/', RatingCreateView.as_view(), name='rating-create'),
    # Список рейтингов (attraction_id)
    path('list/', RatingListView.as_view(), name='rating-list'),
    # Получение деталей конкретного рейтинга
    path('<int:pk>/', RatingDetailView.as_view(), name='rating-detail'),
    # Обновление рейтинга
    path('<int:pk>/update/', RatingUpdateView.as_view(), name='rating-update'),
    # Удаление рейтинга (только автор или админ)
    path('<int:pk>/delete/', RatingDeleteView.as_view(), name='rating-delete'),
]