from django.urls import path
from .views import InitiateSTKPushView, MpesaCallbackView,DownloadReceiptView,TransactionHistoryView,PaymentTransactionDetailView

urlpatterns = [
    path('initiate-stk-push/', InitiateSTKPushView.as_view(), name='initiate-stk-push'),
    path('callback/', MpesaCallbackView.as_view(), name='mpesa-callback'),
    path('receipt/<int:transaction_id>/', DownloadReceiptView.as_view(), name='download-receipt'),
    path('payment-transactions/<int:transaction_id>/', PaymentTransactionDetailView.as_view(), name='transaction-detail'),
    path('transactions/history/', TransactionHistoryView.as_view(), name='transaction-history'),
]

