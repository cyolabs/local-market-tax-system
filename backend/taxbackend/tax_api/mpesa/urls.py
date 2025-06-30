from django.urls import path
from .views import InitiateSTKPushView, MpesaCallbackView

urlpatterns = [
    path('initiate-stk-push/', InitiateSTKPushView.as_view(), name='initiate-stk-push'),
    path('callback/', MpesaCallbackView.as_view(), name='mpesa-callback'),
]