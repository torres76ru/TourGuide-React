from django.urls import path
from .views import RegisterView, LoginView, MeView, ActivateAccountView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('me/', MeView.as_view(), name='me'),
    path('activate/<uidb64>/<token>/', ActivateAccountView.as_view(), name='activate'),
]