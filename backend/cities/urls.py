from django.urls import path
from .views import CityListView, CityDetailView, CitySearchView

urlpatterns = [
    path('', CityDetailView.as_view(), name='city-detail'),
    path('search/', CitySearchView.as_view(), name='city-search'),
]