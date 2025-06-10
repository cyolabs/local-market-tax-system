from django.urls import path
from .views import RegisterAPI, LoginAPI, VendorDashboardAPI ,AdminDashboardAPI, SuperAdminDashboardAPI
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('signup/', RegisterAPI.as_view(), name='signup'),
    path('login/', LoginAPI.as_view(), name='login'),
    path('vendor/dashboard/', VendorDashboardAPI.as_view(), name='vendor-dashboard'),
    path('admin/dashboard/', AdminDashboardAPI.as_view(), name='admin-dashboard'),
    path('superadmin/dashboard/', SuperAdminDashboardAPI.as_view(), name='superadmin-dashboard'),
]