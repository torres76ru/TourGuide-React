from django.urls import path
from .views import (
    MapAttractionsView,
    AdminFetchPhotosView,
    AdminListPendingPhotosView,
    AttractionListView,
    AttractionDetailView,
    AttractionCreateView,
    PhotoUploadView,
    AttractionSearchView,
    AttractionDetailCitiesView,
    AttractionUpdateView
)

urlpatterns = [
    # Публичные эндпоинты
    path('attractions/', AttractionListView.as_view(), name='attraction-list'), #
    path('attractions/create/', AttractionCreateView.as_view(), name='attraction-create'),
    path('attractions/<int:pk>/', AttractionDetailView.as_view(), name='attraction-detail'),
    path('attractions/<str:name>/', AttractionSearchView.as_view(), name='attraction-search'),
    path('attractions/<int:attraction_id>/photos/', PhotoUploadView.as_view(), name='photo-upload'),
    path('map/attractions/', MapAttractionsView.as_view(), name='map_attractions'),
    path('map/attractions/cities/', AttractionDetailCitiesView.as_view(), name='map_attractions_cities'),
    path('attractions/update/<int:id>/', AttractionUpdateView.as_view(), name='attraction-update'),
    # Админские эндпоинты
    path('admin/attractions/pending-photos/', AdminListPendingPhotosView.as_view(), name='admin_pending_photos'),
    path('admin/attractions/fetch-photos/', AdminFetchPhotosView.as_view(), name='admin_fetch_photos')
]