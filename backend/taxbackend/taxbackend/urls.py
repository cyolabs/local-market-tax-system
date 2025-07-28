from django.urls import path,re_path, include
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
            <li><a href="/signup/">/signup/</a> - User registration</li>
            <li><a href="/login/">/login/</a> - User login</li>
            <li><a href="/admin/">Admin Panel</a></li>
        </ul>
    """)

urlpatterns = [
    path('', home, name='home'),
    path('admin/', admin.site.urls),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api', include('tax_api.urls')),
    path('mpesa/', include('mpesa_express.urls')),
    re_path(r'^.*$', TemplateView.as_view(template_name="index.html")),
]