from django.urls import path
from .views import (
    InitiateSTKPushView,
    TransactionHistoryView,
    DownloadReceiptView,
    mpesa_callback_view,
    PaymentTransactionDetailView
)

urlpatterns = [
    path('mpesa/initiate/', InitiateSTKPushView.as_view(), name='initiate-stk-push'),
    path('mpesa/transactions/', TransactionHistoryView.as_view(), name='transaction-history'),
    path('mpesa/receipt/<str:transaction_id>/', DownloadReceiptView.as_view(), name='download-receipt'),
    path('mpesa/callback/', mpesa_callback_view, name='mpesa-callback'),
    path('mpesa/transaction/<int:transaction_id>/', PaymentTransactionDetailView.as_view(), name='transaction-detail'),
]
