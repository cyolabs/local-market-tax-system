from django import forms
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User
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
