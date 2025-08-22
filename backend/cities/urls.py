from django.urls import path
from .views import CityListView, CityDetailView, CitySearchView

urlpatterns = [
    path('', CityListView.as_view(), name='city-list'),
    path('<str:name>/', CityDetailView.as_view(), name='city-detail'),
    path('search/<str:query>/', CitySearchView.as_view(), name='city-search'),
]