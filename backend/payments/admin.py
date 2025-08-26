from django.contrib import admin
from tours.models import TourRegistration

@admin.register(TourRegistration)
class TourRegistrationAdmin(admin.ModelAdmin):
    list_display = ("user", "tour", "paid", "created_at")
    list_filter = ("paid", "created_at")
