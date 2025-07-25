from django.urls import path, include, re_path
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
    # Auth & dashboard routes
    path('signup/', RegisterAPI.as_view(), name='signup'),
    path('login/', LoginAPI.as_view(), name='login'),
    path('vendor/dashboard/', VendorDashboardAPI.as_view(), name='vendor-dashboard'),
    path('admin/dashboard/', AdminDashboardAPI.as_view(), name='admin-dashboard'),
    path('admin/vendors/', RegisteredUsersAPI.as_view(), name='registered-users'),

    # Feedback route
    path('feedback/', SubmitFeedbackView.as_view(), name='submit-feedback'),

    # ✅ Include all mpesa-related routes here
    path('mpesa/', include('tax_api.mpesa.urls')),

    # Frontend catch-all for React/Vue/SPA
    re_path(r'^.*$', TemplateView.as_view(template_name="index.html")),
]
