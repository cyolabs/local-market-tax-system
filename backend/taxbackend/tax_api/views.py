from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate

from .serializers import UserSerializer
from .permissions import IsVendor
from .permissions import IsSuperAdmin
from .permissions import IsAdmin


class RegisterAPI(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': serializer.data,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginAPI(APIView):
    def post(self, request):
        user = authenticate(
            username=request.data.get('username'),
            password=request.data.get('password')
        )
        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user_type': 'vendor' if user.is_vendor else 'officer'
            })
        return Response(
            {'error': 'Invalid Credentials'},
            status=status.HTTP_401_UNAUTHORIZED
        )


class SuperAdminDashboardAPI(APIView):
    permission_classes = [IsSuperAdmin]

    def get(self, request):
        return Response({"message": "Welcome Super Admin!"})

class AdminDashboardAPI(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        return Response({"message": "Welcome Admin!"})

class VendorDashboardAPI(APIView):
    permission_classes = [IsVendor]

    def get(self, request):
        return Response({"message": "Welcome to the vendor dashboard!"})