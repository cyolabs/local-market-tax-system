# backend/taxbackend/tax_api/urls.py - FIXED VERSION

from django.urls import path
from .views import (
    RegisterAPI,
    LoginAPI,
    VendorDashboardAPI,
    AdminDashboardAPI,
    RegisteredUsersAPI,
    SubmitFeedbackView,
    TaxHistoryAPI,
    CreateMpesaPaymentAPI,
    generate_pdf_receipt,
    DebugAPI,  # Add this
    DebugAuthAPI,  # Add this
)
from . import views

urlpatterns = [
    path('signup/', RegisterAPI.as_view(), name='signup'),
    path('login/', LoginAPI.as_view(), name='login'),
    path('vendor/dashboard/', VendorDashboardAPI.as_view(), name='vendor-dashboard'),
    path('admin/dashboard/', AdminDashboardAPI.as_view(), name='admin-dashboard'),
    path('admin/vendors/', RegisteredUsersAPI.as_view(), name='registered-users'),
    path('feedback/', SubmitFeedbackView.as_view(), name='submit-feedback'),
    path('tax-history/', TaxHistoryAPI.as_view(), name='tax-history'),  # This is your main endpoint
    path('create-mpesa-payment/', CreateMpesaPaymentAPI.as_view(), name='create-mpesa-payment'),
    path('receipt/<str:tx_id>/', generate_pdf_receipt, name='generate-pdf-receipt'),
    # Debug endpoints
    path('debug/', DebugAPI.as_view(), name='debug'),
    path('debug-auth/', DebugAuthAPI.as_view(), name='debug-auth'),
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