from django.urls import path, re_path
from django.views.generic import TemplateView
from .views import (
    RegisterAPI, 
    LoginAPI, 
    VendorDashboardAPI, 
    AdminDashboardAPI,
    RegisteredUsersAPI,
    SubmitFeedbackView
)

urlpatterns = [
    path('signup/', RegisterAPI.as_view(), name='signup'),
    path('login/', LoginAPI.as_view(), name='login'),
    path('vendor/dashboard/', VendorDashboardAPI.as_view(), name='vendor-dashboard'),
    path('admin/dashboard/', AdminDashboardAPI.as_view(), name='admin-dashboard'),
    path('admin/vendors/', RegisteredUsersAPI.as_view(), name='registered-users'),
    path('feedback/', SubmitFeedbackView.as_view(), name='submit-feedback'),
    re_path(r'^.*$', TemplateView.as_view(template_name="index.html")),
]