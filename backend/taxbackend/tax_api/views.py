# Add this to your existing views.py file

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from rest_framework.permissions import IsAdminUser

from .serializers import UserSerializer, FeedbackSerializer, PaymentTransactionSerializer
from .permissions import IsVendor, IsAdmin
from .models import User, PaymentTransaction

from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
# Add these imports to your existing views.py
from mpesa_express.models import Transaction as MpesaTransaction

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

# ADD THIS NEW VIEW


# Update your TaxHistoryAPI view to include M-Pesa transactions
class TaxHistoryAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            # Get transactions from both models
            transactions_data = []
            
            # Get from PaymentTransaction model (if it exists)
            try:
                payment_transactions = PaymentTransaction.objects.filter(user=request.user).order_by('-created_at')
                
                # Apply filters
                status_filter = request.query_params.get('status')
                if status_filter:
                    payment_transactions = payment_transactions.filter(status=status_filter)
                
                start_date = request.query_params.get('start_date')
                end_date = request.query_params.get('end_date')
                if start_date:
                    payment_transactions = payment_transactions.filter(created_at__gte=start_date)
                if end_date:
                    payment_transactions = payment_transactions.filter(created_at__lte=end_date)
                
                payment_serializer = PaymentTransactionSerializer(payment_transactions, many=True)
                transactions_data.extend(payment_serializer.data)
            except:
                # PaymentTransaction model doesn't exist, skip
                pass
            
            # Get from M-Pesa Transaction model
            try:
                # Since M-Pesa transactions don't have user field, we'll get all for now
                # You might want to link them by phone number if you store user's phone
                mpesa_transactions = MpesaTransaction.objects.all().order_by('-timestamp')
                
                # Apply status filter if provided
                if status_filter:
                    mpesa_transactions = mpesa_transactions.filter(status__icontains=status_filter)
                
                # Apply date filters
                if start_date:
                    mpesa_transactions = mpesa_transactions.filter(timestamp__gte=start_date)
                if end_date:
                    mpesa_transactions = mpesa_transactions.filter(timestamp__lte=end_date)
                
                # Convert M-Pesa transactions to compatible format
                for txn in mpesa_transactions:
                    transactions_data.append({
                        'id': txn.id,
                        'transaction_id': txn.checkout_id,
                        'receipt_number': txn.mpesa_code,
                        'user': request.user.id,
                        'user_name': request.user.full_name,
                        'phone_number': txn.phone_number,
                        'amount': str(txn.amount),
                        'account_reference': 'Market Tax Payment',
                        'category': 'Market Tax Payment',
                        'status': txn.status,
                        'mpesa_receipt_number': txn.mpesa_code,
                        'created_at': txn.timestamp.isoformat(),
                        'updated_at': txn.timestamp.isoformat(),
                        'transaction_date': txn.timestamp.isoformat(),
                        'timestamp': txn.timestamp.isoformat(),
                        'checkout_id': txn.checkout_id,
                        'mpesa_code': txn.mpesa_code,
                    })
            except Exception as e:
                print(f"Error fetching M-Pesa transactions: {e}")
            
            # Sort all transactions by date (most recent first)
            transactions_data = sorted(
                transactions_data, 
                key=lambda x: x.get('created_at', x.get('timestamp', '')), 
                reverse=True
            )
            
            return Response({
                'success': True,
                'data': transactions_data,
                'count': len(transactions_data)
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            print(f"Tax history error: {str(e)}")
            return Response({
                'success': False,
                'message': 'Failed to fetch tax history',
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Add this new view to create payment records when M-Pesa payment is successful
class CreateMpesaPaymentAPI(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            data = request.data
            
            # Create M-Pesa transaction record
            mpesa_transaction = MpesaTransaction.objects.create(
                amount=data.get('amount'),
                checkout_id=data.get('checkout_id'),
                mpesa_code=data.get('mpesa_code', ''),
                phone_number=data.get('phone_number'),
                status=data.get('status', 'Pending')
            )
            
            # Also create PaymentTransaction record if model exists
            try:
                payment_transaction = PaymentTransaction.objects.create(
                    transaction_id=data.get('checkout_id'),
                    receipt_number=data.get('mpesa_code', ''),
                    user=request.user,
                    phone_number=data.get('phone_number'),
                    amount=data.get('amount'),
                    account_reference=data.get('category', 'Market Tax Payment'),
                    category=data.get('category', 'Market Tax Payment'),
                    status=data.get('status', 'Pending'),
                    mpesa_receipt_number=data.get('mpesa_code', '')
                )
            except:
                # PaymentTransaction model doesn't exist
                pass
            
            return Response({
                'success': True,
                'message': 'Payment record created successfully',
                'transaction_id': mpesa_transaction.checkout_id
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            print(f"Create payment error: {str(e)}")
            return Response({
                'success': False,
                'message': 'Failed to create payment record',
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)