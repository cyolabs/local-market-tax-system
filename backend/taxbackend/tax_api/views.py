from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate

from .serializers import UserSerializer
from .permissions import IsVendor, IsAdmin

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
        try:
            username = request.data.get('username')
            password = request.data.get('password')

            if not username or not password:
                return Response(
                    {'error': 'Username and password are required.'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            user = authenticate(request, username=username, password=password)

            if user is None:
                return Response(
                    {'error': 'Invalid Credentials'}, 
                    status=status.HTTP_401_UNAUTHORIZED
                )

            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'username': user.username,
                'role': user.role
            }, status=status.HTTP_200_OK)

        except Exception as e:
            print(f"Login error: {str(e)}")
            return Response(
                {'error': 'Internal server error'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
class AdminDashboardAPI(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        return Response({"message": "Welcome to the Admin Dashboard!"})


class VendorDashboardAPI(APIView):
    permission_classes = [IsVendor]

    def get(self, request):
        return Response({"message": "Welcome to the Vendor Dashboard!"})
