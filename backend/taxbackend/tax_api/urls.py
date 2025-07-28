from django.urls import path
from .views import (
    RegisterAPI,
    LoginAPI,
    VendorDashboardAPI,
    AdminDashboardAPI,
    RegisteredUsersAPI,
    SubmitFeedbackView,
    UserFeedbackListView,
    AdminFeedbackListView,
    AdminFeedbackResponseView,
    TaxHistoryAPI,
    CreateMpesaPaymentAPI,
    generate_pdf_receipt,
    DebugAPI,  # Add this
    DebugAuthAPI,  # Add this
)

urlpatterns = [
    path('signup/', RegisterAPI.as_view(), name='signup'),
    path('login/', LoginAPI.as_view(), name='login'),
    path('vendor/dashboard/', VendorDashboardAPI.as_view(), name='vendor-dashboard'),
    path('admin/dashboard/', AdminDashboardAPI.as_view(), name='admin-dashboard'),
    path('admin/vendors/', RegisteredUsersAPI.as_view(), name='registered-users'),
    path('tax-history/', TaxHistoryAPI.as_view(), name='tax-history'),  # This is your main endpoint
    path('create-mpesa-payment/', CreateMpesaPaymentAPI.as_view(), name='create-mpesa-payment'),
    path('receipt/<str:tx_id>/', generate_pdf_receipt, name='generate-pdf-receipt'),
    # Debug endpoints
    path('debug/', DebugAPI.as_view(), name='debug'),
    path('debug-auth/', DebugAuthAPI.as_view(), name='debug-auth'),

        # Feedback endpoints
    path('feedback/', SubmitFeedbackView.as_view(), name='submit-feedback'),
    path('feedback/my/', UserFeedbackListView.as_view(), name='user-feedback-list'),
    path('admin/feedback/', AdminFeedbackListView.as_view(), name='admin-feedback-list'),
    path('admin/feedback/<int:feedback_id>/respond/', AdminFeedbackResponseView.as_view(), name='admin-feedback-respond'),
    
]