from django.contrib import admin
from .models import Attraction, AttractionPhoto, PendingAttractionUpdate

@admin.register(PendingAttractionUpdate)
class PendingAttractionUpdateAdmin(admin.ModelAdmin):
    list_display = ('attraction', 'user', 'status', 'created_at', 'updated_at')
    list_filter = ('status', 'created_at')
    search_fields = ('attraction__name', 'user__username')
    actions = ['approve_updates', 'reject_updates']

    def approve_updates(self, request, queryset):
        for pending_update in queryset.filter(status='pending'):
            pending_update.apply_update()
        self.message_user(request, "Selected updates have been approved and applied.")

    approve_updates.short_description = "Approve selected updates"

    def reject_updates(self, request, queryset):
        queryset.filter(status='pending').update(status='rejected')
        self.message_user(request, "Selected updates have been rejected.")

    reject_updates.short_description = "Reject selected updates"

@admin.register(Attraction)
class AttractionAdmin(admin.ModelAdmin):
    list_display = ('name', 'city', 'average_rating', 'rating_count', 'need_photo', 'admin_reviewed')
    list_filter = ('city', 'category', 'need_photo', 'admin_reviewed')
    search_fields = ('name', 'address')

@admin.register(AttractionPhoto)
class AttractionPhotoAdmin(admin.ModelAdmin):
    list_display = ('attraction', 'user', 'uploaded_at')
    list_filter = ('uploaded_at',)
    search_fields = ('attraction__name', 'user__username')