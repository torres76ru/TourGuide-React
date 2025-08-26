from django.urls import path
from .views import MapAttractionsView, AttractionDetailCitiesView

urlpatterns = [
    path('attractions/', MapAttractionsView.as_view(), name='map_attractions'),
    path('attractions/city/', AttractionDetailCitiesView.as_view(), name='map_attractions_cities'),
]