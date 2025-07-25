from django.urls import path
from .views import (
    InitiateSTKPushView,
    TransactionHistoryView,
    DownloadReceiptView,
    stk_callback,
    PaymentTransactionDetailView
)

urlpatterns = [
    path('api/mpesa/initiate-stk-push/', InitiateSTKPushView.as_view(), name='initiate_stk_push'),
    path('api/mpesa/transactions/history/', TransactionHistoryView.as_view(), name='transaction_history'),
    path('api/mpesa/receipt/<str:transaction_id>/', DownloadReceiptView.as_view(), name='download_receipt'),
    path('api/mpesa/callback/', stk_callback, name='stk_callback'),
    path('api/mpesa/transactions/<str:transaction_id>/', PaymentTransactionDetailView.as_view(), name='transaction_detail'),
]
