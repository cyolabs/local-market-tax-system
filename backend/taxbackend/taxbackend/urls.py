# backend/taxbackend/taxbackend/urls.py - ALTERNATIVE SIMPLER VERSION

from django.urls import path, re_path, include
from django.http import HttpResponse
from django.contrib import admin
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from django.views.generic import TemplateView
from django.conf import settings
from django.conf.urls.static import static

def home(request):
    return HttpResponse("""
        <h1>Market Tax System API</h1>
        <p>Available endpoints:</p>
        <ul>
            <li><a href="/api/signup/">/api/signup/</a> - User registration</li>
            <li><a href="/api/login/">/api/login/</a> - User login</li>
            <li><a href="/api/debug/">/api/debug/</a> - Debug endpoint</li>
            <li><a href="/api/tax-history/">/api/tax-history/</a> - Tax history</li>
            <li><a href="/admin/">Admin Panel</a></li>
        </ul>
    """)

urlpatterns = [
    path('', home, name='home'),
    path('admin/', admin.site.urls),
    
    # JWT Token endpoints
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # API routes
    path('api/', include('tax_api.urls')),
    path('mpesa/', include('mpesa_express.urls')),
]

# Serve static files in development
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# Add the catch-all ONLY if you need it for React frontend
# Comment this out if you don't need it, or use it only for specific routes
# urlpatterns += [
#     re_path(r'^(?!api/|admin/|mpesa/).*$', TemplateView.as_view(template_name="index.html")),
# ]