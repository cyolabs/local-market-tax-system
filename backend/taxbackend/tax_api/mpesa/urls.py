from django.urls import path
from .views import (
    InitiateSTKPushView,
    MpesaCallbackView,
    DownloadReceiptView,
    TransactionHistoryView,
    PaymentTransactionDetailView
)

urlpatterns = [
    # Keep existing STK push endpoints
    path('initiate-stk-push/', InitiateSTKPushView.as_view(), name='initiate-stk-push'),
    path('callback/', MpesaCallbackView.as_view(), name='mpesa-callback'),
    
    # Update receipt endpoint to match frontend
    path('receipt/<str:transaction_id>/', DownloadReceiptView.as_view(), name='download-receipt'),
    
    # Transaction endpoints (now under /api/mpesa/ prefix)
    path('api/mpesa/transactions/history/', TransactionHistoryView.as_view(), name='transaction-history'),
    path('api/mpesa/payment-transactions/<str:transaction_id>/', 
         PaymentTransactionDetailView.as_view(), name='transaction-detail'),
]