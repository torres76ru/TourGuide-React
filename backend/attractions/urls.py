from django.urls import path
from .views import MapAttractionsView

urlpatterns = [
    path('map/attractions/', MapAttractionsView.as_view(), name='map_attractions'),
]