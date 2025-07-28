# backend/taxbackend/tax_api/urls.py - FIXED VERSION

from django.urls import path
from . import views

urlpatterns = [
    # =================== DEBUG ENDPOINTS ===================
    path('debug/', views.DebugAPI.as_view(), name='debug_api'),
    path('debug-func/', views.debug_view, name='debug_func'),
    
    # =================== AUTHENTICATION ENDPOINTS ===================
    # Class-based views (recommended)
    path('register/', views.RegisterAPI.as_view(), name='register_api'),
    path('login/', views.LoginAPI.as_view(), name='login_api'),
    
    # Function-based fallbacks
    path('signup/', views.signup_view, name='signup_func'),  # Alternative endpoint
    path('auth/login/', views.login_view, name='login_func'),  # Alternative endpoint
    path('auth/signup/', views.signup_view, name='signup_alt'),  # Alternative endpoint
    
    # =================== DASHBOARD ENDPOINTS ===================
    path('admin-dashboard/', views.AdminDashboardAPI.as_view(), name='admin_dashboard'),
    path('vendor-dashboard/', views.VendorDashboardAPI.as_view(), name='vendor_dashboard'),
    path('dashboard/', views.VendorDashboardAPI.as_view(), name='dashboard'),  # General dashboard
    
    # =================== DATA ENDPOINTS ===================
    path('tax-history/', views.TaxHistoryAPI.as_view(), name='tax_history'),
    path('tax-history-func/', views.tax_history_view, name='tax_history_func'),  # Fallback
    
    # =================== ALTERNATIVE ENDPOINTS ===================
    # Add these if your frontend expects different URL patterns
    path('users/register/', views.RegisterAPI.as_view(), name='users_register'),
    path('users/login/', views.LoginAPI.as_view(), name='users_login'),
    path('transactions/', views.TaxHistoryAPI.as_view(), name='transactions'),
]