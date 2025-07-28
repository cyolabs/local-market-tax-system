from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from rest_framework.permissions import IsAdminUser

from .serializers import UserSerializer
from .permissions import IsVendor, IsAdmin

from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from .serializers import FeedbackSerializer

from .models import User
from rest_framework.permissions import IsAdminUser

def generate_pdf_receipt(request, tx_id):
    transaction = get_object_or_404(PaymentTransaction, transaction_id=tx_id)

    # Create the PDF in memory
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = f'inline; filename="Receipt_{transaction.transaction_id}.pdf"'

    p = canvas.Canvas(response, pagesize=A4)
    width, height = A4

    # PDF Content
    y = height - 50
    p.setFont("Helvetica-Bold", 16)
    p.drawString(50, y, "Local Market Tax Payment Receipt")
    p.setFont("Helvetica", 12)
    y -= 30

    p.drawString(50, y, f"Receipt Number: {transaction.transaction_id}")
    y -= 20
    p.drawString(50, y, f"Phone Number: {transaction.phone_number}")
    y -= 20
    p.drawString(50, y, f"Amount Paid: KES {transaction.amount}")
    y -= 20
    p.drawString(50, y, f"Transaction Date: {transaction.transaction_date.strftime('%Y-%m-%d %H:%M:%S')}")
    y -= 20
    p.drawString(50, y, f"Status: {transaction.status}")
    y -= 40

    p.setFont("Helvetica-Oblique", 10)
    p.drawString(50, y, "Thank you for your payment.")

    # Finalize PDF
    p.showPage()
    p.save()

    return response


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

class RegisteredUsersAPI(APIView):
    permission_classes = [IsAdmin] 

    def get(self, request):
        users = User.objects.all().order_by('-date_registered')
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

class SubmitFeedbackView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = FeedbackSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response({'success': True, 'message': 'Feedback submitted successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)