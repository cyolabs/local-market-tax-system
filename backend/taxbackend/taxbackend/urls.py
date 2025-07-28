# backend/taxbackend/taxbackend/urls.py - FIXED VERSION

from django.urls import path, re_path, include
from django.http import HttpResponse
from django.contrib import admin
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from django.views.generic import TemplateView

def home(request):
    return HttpResponse("""
        <h1>Market Tax System API</h1>
        <p>Available endpoints:</p>
        <ul>
            <li><a href="/api/signup/">/api/signup/</a> - User registration</li>
            <li><a href="/api/login/">/api/login/</a> - User login</li>
            <li><a href="/api/debug/">/api/debug/</a> - Debug endpoint</li>
            <li><a href="/admin/">Admin Panel</a></li>
        </ul>
    """)

urlpatterns = [
    path('', home, name='home'),
    path('admin/', admin.site.urls),
    
    # JWT Token endpoints
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # API routes - THESE MUST COME BEFORE THE CATCH-ALL
    path('api/', include('tax_api.urls')),
    path('mpesa/', include('mpesa_express.urls')),
    
    # Catch-all for React frontend - THIS MUST BE LAST
    # Only catch routes that don't start with 'api/' or 'admin/' or 'mpesa/'
    re_path(r'^(?!api/|admin/|mpesa/).*$', TemplateView.as_view(template_name="index.html")),
]