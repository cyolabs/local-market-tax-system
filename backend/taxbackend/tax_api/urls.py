from django.urls import path
from .views import RegisterAPI, LoginAPI, VendorDashboardAPI 
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('signup/', RegisterAPI.as_view(), name='signup'),
    path('login/', LoginAPI.as_view(), name='login'),
    path('vendor/dashboard/', VendorDashboardAPI.as_view(), name='vendor-dashboard'),
]

