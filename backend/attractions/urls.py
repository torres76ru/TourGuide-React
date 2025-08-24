from django.urls import path
from .views import (
    AdminFetchPhotosView,
    AdminListPendingPhotosView,
    AttractionListView,
    AttractionDetailView,
    AttractionCreateView,
    PhotoUploadView,
    AttractionSearchView,
    AttractionUpdateView
)

urlpatterns = [
    # Публичные эндпоинты
    path('attractions/', AttractionListView.as_view(), name='attraction-list'), # список достопримечательностей
    path('attractions/create/', AttractionCreateView.as_view(), name='attraction-create'),# Запрос на создание объекта на карте
    path('attractions/<int:pk>/', AttractionDetailView.as_view(), name='attraction-detail'),# детали места
    path('attractions/search/', AttractionSearchView.as_view(), name='attraction-search'),  # Поиск по названию
    path('attractions/<int:attraction_id>/photos/', PhotoUploadView.as_view(), name='photo-upload'),#Пользователь отправляет фото свое
    path('attractions/update/<int:id>/', AttractionUpdateView.as_view(), name='attraction-update'),#Обновления данных от пользователя для достопримечательности
    # Админские эндпоинты
    path('admin/attractions/pending-photos/', AdminListPendingPhotosView.as_view(), name='admin_pending_photos'),
    path('admin/attractions/fetch-photos/', AdminFetchPhotosView.as_view(), name='admin_fetch_photos')
]