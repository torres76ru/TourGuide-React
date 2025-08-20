from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('users.urls')),
    path('api/', include('attractions.urls')),
    path('api/ratings/', include('ratings.urls')),
    path('api/', include('tours.urls')),
    path('api/', include('attractions.urls')),
    path('api/cities/', include('cities.urls')),
    path("api/", include("routes.urls")),

    # Регистрация / авторизация через соцсети
    path('dj-rest-auth/', include('dj_rest_auth.urls')),
    path('dj-rest-auth/registration/', include('dj_rest_auth.registration.urls')),

    # allauth (Google, etc.)
    path('accounts/', include('allauth.urls')),
    #обновление токена
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),



] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
