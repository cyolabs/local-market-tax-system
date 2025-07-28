from django import forms
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Feedback, PaymentTransaction
from django.contrib import admin

class CustomUserCreationForm(forms.ModelForm):
    class Meta:
        model = User
        fields = '__all__'

    def clean_national_id(self):
        national_id = self.cleaned_data.get('national_id')
        if not national_id:
            raise forms.ValidationError("National ID is required.")
        return national_id

class UserAdmin(BaseUserAdmin):
    add_form = CustomUserCreationForm

    list_display = ('username', 'email', 'role', 'is_staff', 'is_active', 'is_superuser')
    list_filter = ('role', 'is_staff', 'is_active', 'is_superuser')

    fieldsets = (
        (None, {'fields': ('username', 'email', 'password')}),
        ('Personal info', {'fields': ('full_name', 'national_id', 'business_type', 'gender')}),
        ('Permissions', {'fields': ('role', 'is_staff', 'is_active', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password', 'national_id', 'role', 'is_staff', 'is_active', 'is_superuser')}
        ),
    )

    search_fields = ('email', 'username', 'national_id')
    ordering = ('email',)

admin.site.register(User, UserAdmin)

@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = ['subject', 'user', 'status', 'priority', 'created_at', 'is_resolved']
    list_filter = ['status', 'priority', 'created_at', 'resolved_at']
    search_fields = ['subject', 'message', 'user__username', 'user__full_name']
    readonly_fields = ['created_at', 'updated_at', 'resolved_at']
    
    fieldsets = (
        ('Feedback Details', {
            'fields': ('user', 'subject', 'message', 'status', 'priority')
        }),
        ('Admin Response', {
            'fields': ('admin_response', 'admin_user')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at', 'resolved_at'),
            'classes': ('collapse',)
        }),
    )
    
    def save_model(self, request, obj, form, change):
        # Automatically set admin_user when admin responds
        if obj.admin_response and not obj.admin_user:
            obj.admin_user = request.user
        
        # Set resolved_at when status changes to resolved/closed
        if obj.status in ['resolved', 'closed'] and not obj.resolved_at:
            from django.utils import timezone
            obj.resolved_at = timezone.now()
        
        super().save_model(request, obj, form, change)
    
    # Custom admin actions
    def mark_as_reviewed(self, request, queryset):
        updated = queryset.update(status='reviewed')
        self.message_user(request, f'{updated} feedback(s) marked as reviewed.')
    mark_as_reviewed.short_description = 'Mark selected feedback as reviewed'
    
    def mark_as_resolved(self, request, queryset):
        from django.utils import timezone
        updated = queryset.update(status='resolved', resolved_at=timezone.now())
        self.message_user(request, f'{updated} feedback(s) marked as resolved.')
    mark_as_resolved.short_description = 'Mark selected feedback as resolved'
    
    actions = ['mark_as_reviewed', 'mark_as_resolved']

# Register PaymentTransaction if it exists
try:
    @admin.register(PaymentTransaction)
    class PaymentTransactionAdmin(admin.ModelAdmin):
        list_display = ['transaction_id', 'user', 'amount', 'status', 'transaction_date']
        list_filter = ['status', 'transaction_date']
        search_fields = ['transaction_id', 'user__username', 'phone_number']
        readonly_fields = ['transaction_id', 'transaction_date']
except:
    # PaymentTransaction model doesn't exist
    pass