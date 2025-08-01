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
    generate_pdf_receipt
)

urlpatterns = [
    path('signup/', RegisterAPI.as_view(), name='signup'),
    path('login/', LoginAPI.as_view(), name='login'),
    path('vendor/dashboard/', VendorDashboardAPI.as_view(), name='vendor-dashboard'),
    path('admin/dashboard/', AdminDashboardAPI.as_view(), name='admin-dashboard'),
    path('admin/vendors/', RegisteredUsersAPI.as_view(), name='registered-users'),
    path('feedback/', SubmitFeedbackView.as_view(), name='submit-feedback'),
    path('tax-history/', TaxHistoryAPI.as_view(), name='tax-history'),
    path('create-mpesa-payment/', CreateMpesaPaymentAPI.as_view(), name='create-mpesa-payment'),
    path('receipt/<str:tx_id>/', generate_pdf_receipt, name='generate-pdf-receipt'),
]