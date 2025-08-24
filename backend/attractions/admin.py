from django.contrib import admin
from .models import Attraction, AttractionPhoto, PendingAttractionUpdate
from django.utils.html import format_html

@admin.register(PendingAttractionUpdate)
class PendingAttractionUpdateAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'status', 'is_creation_request', 'created_at', 'updated_at', 'get_city')
    list_filter = ('status', 'created_at')
    search_fields = ('name', 'user__username', 'attraction__name')
    actions = ['approve_updates', 'reject_updates']

    def is_creation_request(self, obj):
        return obj.attraction is None
    is_creation_request.short_description = 'Новый объект?'
    is_creation_request.boolean = True

    def get_city(self, obj):
        return obj.city.name if obj.city else None
    get_city.short_description = 'Город'

    def approve_updates(self, request, queryset):
        errors = []
        for pending_update in queryset.filter(status='pending'):
            try:
                pending_update.apply_update()
            except Exception as e:
                errors.append(f"Ошибка при обработке {pending_update.id}: {str(e)}")
        if errors:
            self.message_user(request, f"Ошибки при подтверждении: {'; '.join(errors)}", level='error')
        else:
            self.message_user(request, "Выбранные запросы подтверждены и применены.")

    approve_updates.short_description = "Подтвердить выбранные запросы"

    def reject_updates(self, request, queryset):
        queryset.filter(status='pending').update(status='rejected')
        self.message_user(request, "Выбранные запросы отклонены.")

    reject_updates.short_description = "Отклонить выбранные запросы"

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('attraction', 'user', 'city')

@admin.register(Attraction)
class AttractionAdmin(admin.ModelAdmin):
    list_display = ('name', 'get_city', 'average_rating', 'rating_count', 'need_photo', 'admin_reviewed')
    list_filter = ('city', 'category', 'need_photo', 'admin_reviewed')
    search_fields = ('name', 'address')

    def get_city(self, obj):
        return obj.city.name if obj.city else None
    get_city.short_description = 'Город'

@admin.register(AttractionPhoto)
class AttractionPhotoAdmin(admin.ModelAdmin):
    list_display = ('attraction', 'user', 'uploaded_at')
    list_filter = ('uploaded_at',)
    search_fields = ('attraction__name', 'user__username')