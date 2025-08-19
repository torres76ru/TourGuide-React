from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TourViewSet

router = DefaultRouter()
router.register(r'tours', TourViewSet, basename='tour')

urlpatterns = [
    path('', include(router.urls)),
]
