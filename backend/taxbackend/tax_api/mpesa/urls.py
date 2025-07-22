from django.urls import path
from .views import (
    InitiateSTKPushView,
    MpesaCallbackView,
    DownloadReceiptView,
    TransactionHistoryView,
    PaymentTransactionDetailView
)

urlpatterns = [
    path('initiate-stk-push/', InitiateSTKPushView.as_view(), name='initiate-stk-push'),
    path('callback/', MpesaCallbackView.as_view(), name='mpesa-callback'),
    path('receipt/<str:transaction_id>/', DownloadReceiptView.as_view(), name='download-receipt'),
    
   
    path('transactions/history/', TransactionHistoryView.as_view(), name='transaction-history'),
    path('payment-transactions/<str:transaction_id>/', 
         PaymentTransactionDetailView.as_view(), name='transaction-detail'),
]
