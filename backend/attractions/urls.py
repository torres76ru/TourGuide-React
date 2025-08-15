from django.urls import path
from .views import MapAttractionsView, AdminFetchPhotosView, AdminListPendingPhotosView

urlpatterns = [
    path('map/attractions/', MapAttractionsView.as_view(), name='map_attractions'),
    path('admin/attractions/pending-photos/', AdminListPendingPhotosView.as_view(), name='admin_pending_photos'),
    path('admin/attractions/fetch-photos/', AdminFetchPhotosView.as_view(), name='admin_fetch_photos'),
]