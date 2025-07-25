from django.urls import path
from .views import (
    InitiateSTKPushView,
    TransactionHistoryView,
    DownloadReceiptView,
    stk_callback,
    stk_status_view,
    PaymentTransactionDetailView
)

urlpatterns = [
    path('initiate-stk-push/', InitiateSTKPushView.as_view(), name='initiate_stk_push'),
    path('transactions/history/', TransactionHistoryView.as_view(), name='transaction_history'),
    path('receipt/<str:transaction_id>/', DownloadReceiptView.as_view(), name='download_receipt'),
    path('callback/', stk_callback, name='stk_callback'),
    path('transactions/<str:transaction_id>/', PaymentTransactionDetailView.as_view(), name='transaction_detail'),
    path('stk_status/', stk_status_view, name='stk_status'),
]
