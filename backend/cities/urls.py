from django.urls import path
from .views import CityListView, CityDetailView

urlpatterns = [
    path('', CityListView.as_view(), name='city-list'),
    path('<str:name>/', CityDetailView.as_view(), name='city-detail'),
]