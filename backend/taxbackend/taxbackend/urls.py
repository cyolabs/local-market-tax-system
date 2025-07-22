from django.urls import path, include
from django.http import HttpResponse
from django.contrib import admin
from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

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
    path('', include('tax_api.urls')), 
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/mpesa/', include('mpesa.urls')),
]

