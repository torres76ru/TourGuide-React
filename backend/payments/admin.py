from django.contrib import admin
from .models import Payment

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "tour", "amount", "status", "created_at")
    list_filter = ("status", "created_at")
