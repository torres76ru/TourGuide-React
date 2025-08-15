from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('users.urls')),
    path('api/', include('attractions.urls')),
    path('api/ratings/', include('ratings.urls')),

    # Регистрация / авторизация через соцсети
    path('dj-rest-auth/', include('dj_rest_auth.urls')),
    path('dj-rest-auth/registration/', include('dj_rest_auth.registration.urls')),

    # allauth (Google, etc.)
    path('accounts/', include('allauth.urls')),



] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
