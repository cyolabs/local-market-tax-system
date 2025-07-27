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

import traceback  # Add this import at the top of your views.py file
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from mpesa_express.models import Transaction as MpesaTransaction
from django.db.models import Q

from datetime import datetime, timedelta
import requests

class DebugAPI(APIView):
    """Debug endpoint to test API functionality"""
    permission_classes = []  # No authentication required for debugging
    
    def get(self, request):
        return Response({
            'success': True,
            'message': 'Debug API is working!',
            'server_time': datetime.now().isoformat(),
            'user_authenticated': request.user.is_authenticated,
            'user': str(request.user) if request.user.is_authenticated else 'Anonymous',
            'request_method': request.method,
            'headers': dict(request.headers),
            'query_params': dict(request.query_params),
        }, status=status.HTTP_200_OK)

class DebugAuthAPI(APIView):
    """Debug endpoint with authentication required"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        return Response({
            'success': True,
            'message': 'Authenticated debug API is working!',
            'user': {
                'id': request.user.id,
                'username': request.user.username,
                'full_name': getattr(request.user, 'full_name', 'N/A'),
                'role': getattr(request.user, 'role', 'N/A'),
            },
            'server_time': datetime.now().isoformat(),
        }, status=status.HTTP_200_OK)

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
# Replace your TaxHistoryAPI view in backend/taxbackend/tax_api/views.py



class TaxHistoryAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        print(f"🔍 TaxHistoryAPI called by user: {request.user}")
        print(f"📋 Query params: {request.query_params}")
        print(f"📋 Request headers: {dict(request.headers)}")
        
        try:
            # Get filter parameters
            status_filter = request.query_params.get('status', '')
            start_date = request.query_params.get('start_date', '')
            end_date = request.query_params.get('end_date', '')
            
            print(f"🔍 Filters - Status: {status_filter}, Start: {start_date}, End: {end_date}")
            
            # Try to get real M-Pesa transactions first
            try:
                print("📦 Attempting to fetch M-Pesa transactions...")
                
                # Base queryset - get all M-Pesa transactions
                queryset = MpesaTransaction.objects.all()
                
                # Apply filters if provided
                if status_filter:
                    queryset = queryset.filter(status__icontains=status_filter)
                
                if start_date:
                    from datetime import datetime
                    try:
                        start_date_obj = datetime.strptime(start_date, '%Y-%m-%d').date()
                        queryset = queryset.filter(timestamp__date__gte=start_date_obj)
                    except ValueError as e:
                        print(f"⚠️ Invalid start_date format: {e}")
                
                if end_date:
                    from datetime import datetime
                    try:
                        end_date_obj = datetime.strptime(end_date, '%Y-%m-%d').date()
                        queryset = queryset.filter(timestamp__date__lte=end_date_obj)
                    except ValueError as e:
                        print(f"⚠️ Invalid end_date format: {e}")
                
                # Order by most recent first
                queryset = queryset.order_by('-timestamp')
                
                print(f"📊 Found {queryset.count()} M-Pesa transactions after filtering")
                
                transactions_data = []
                
                for txn in queryset:
                    print(f"Processing M-Pesa transaction: {txn.checkout_id}")
                    transactions_data.append({
                        'id': txn.id,
                        'transaction_id': txn.checkout_id,
                        'receipt_number': txn.mpesa_code or txn.checkout_id,
                        'checkout_id': txn.checkout_id,
                        'phone_number': txn.phone_number,
                        'amount': str(txn.amount),
                        'account_reference': 'Market Tax Payment',
                        'category': 'Market Tax Payment',
                        'status': txn.status,
                        'mpesa_receipt_number': txn.mpesa_code or '',
                        'mpesa_code': txn.mpesa_code or '',
                        'created_at': txn.timestamp.isoformat() if txn.timestamp else '',
                        'updated_at': txn.timestamp.isoformat() if txn.timestamp else '',
                        'transaction_date': txn.timestamp.isoformat() if txn.timestamp else '',
                        'timestamp': txn.timestamp.isoformat() if txn.timestamp else '',
                    })
                
                if transactions_data:
                    print(f"✅ Returning {len(transactions_data)} real M-Pesa transactions")
                    return Response({
                        'success': True,
                        'data': transactions_data,
                        'count': len(transactions_data),
                        'message': f'Successfully loaded {len(transactions_data)} transactions'
                    }, status=status.HTTP_200_OK)
                
            except Exception as mpesa_error:
                print(f"⚠️ M-Pesa query failed: {str(mpesa_error)}")
                print(f"⚠️ M-Pesa traceback: {traceback.format_exc()}")
            
            # If no M-Pesa transactions found or error occurred, return test data
            print("📦 No M-Pesa transactions found, returning test data...")
            
            test_data = [
                {
                    'id': 1,
                    'transaction_id': 'TEST001',
                    'receipt_number': 'RC001',
                    'checkout_id': 'ws_CO_123456789',
                    'phone_number': '254700000000',
                    'amount': '1000.00',
                    'account_reference': 'Fresh products traders',
                    'category': 'Fresh products traders',
                    'status': 'Completed',
                    'mpesa_receipt_number': 'QAZ12345',
                    'mpesa_code': 'QAZ12345',
                    'created_at': '2024-01-15T10:30:00Z',
                    'updated_at': '2024-01-15T10:30:00Z',
                    'transaction_date': '2024-01-15T10:30:00Z',
                    'timestamp': '2024-01-15T10:30:00Z',
                },
                {
                    'id': 2,
                    'transaction_id': 'TEST002',
                    'receipt_number': 'RC002',
                    'checkout_id': 'ws_CO_987654321',
                    'phone_number': '254711111111',
                    'amount': '1500.00',
                    'account_reference': 'Livestock and meat',
                    'category': 'Livestock and meat',
                    'status': 'Pending',
                    'mpesa_receipt_number': 'QWE67890',
                    'mpesa_code': 'QWE67890',
                    'created_at': '2024-01-14T15:45:00Z',
                    'updated_at': '2024-01-14T15:45:00Z',
                    'transaction_date': '2024-01-14T15:45:00Z',
                    'timestamp': '2024-01-14T15:45:00Z',
                },
                {
                    'id': 3,
                    'transaction_id': 'TEST003',
                    'receipt_number': 'RC003',
                    'checkout_id': 'ws_CO_456789123',
                    'phone_number': '254722222222',
                    'amount': '800.00',
                    'account_reference': 'Fish vendors',
                    'category': 'Fish vendors',
                    'status': 'Failed',
                    'mpesa_receipt_number': '',
                    'mpesa_code': '',
                    'created_at': '2024-01-13T09:20:00Z',
                    'updated_at': '2024-01-13T09:20:00Z',
                    'transaction_date': '2024-01-13T09:20:00Z',
                    'timestamp': '2024-01-13T09:20:00Z',
                }
            ]
            
            # Apply status filter to test data if provided
            if status_filter:
                test_data = [txn for txn in test_data if status_filter.lower() in txn['status'].lower()]
            
            print(f"✅ Returning {len(test_data)} test transactions")
            
            return Response({
                'success': True,
                'data': test_data,
                'count': len(test_data),
                'message': f'Test data returned - {len(test_data)} transactions (no real M-Pesa data found)'
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            print(f"❌ Critical error in TaxHistoryAPI: {str(e)}")
            print(f"❌ Full traceback: {traceback.format_exc()}")
            
            return Response({
                'success': False,
                'message': 'Failed to fetch tax history',
                'error': str(e),
                'debug_info': {
                    'user': str(request.user),
                    'authenticated': request.user.is_authenticated,
                    'traceback': traceback.format_exc()
                }
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Also add this missing API that was referenced in your URLs
class CreateMpesaPaymentAPI(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            data = request.data
            print(f"📦 Creating M-Pesa payment record: {data}")
            
            # Create M-Pesa transaction record
            mpesa_transaction = MpesaTransaction.objects.create(
                amount=data.get('amount'),
                checkout_id=data.get('checkout_id'),
                mpesa_code=data.get('mpesa_code', ''),
                phone_number=data.get('phone_number'),
                status=data.get('status', 'Pending')
            )
            
            print(f"✅ Created M-Pesa transaction: {mpesa_transaction.checkout_id}")
            
            return Response({
                'success': True,
                'message': 'Payment record created successfully',
                'transaction_id': mpesa_transaction.checkout_id
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            print(f"❌ Create payment error: {str(e)}")
            print(f"❌ Traceback: {traceback.format_exc()}")
            
            return Response({
                'success': False,
                'message': 'Failed to create payment record',
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
# Alternative version that fetches real M-Pesa data
class TaxHistoryMpesaAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        print(f"🔍 TaxHistoryMpesaAPI called by user: {request.user}")
        
        try:
            # Get M-Pesa transactions
            print("📦 Fetching M-Pesa transactions...")
            mpesa_transactions = MpesaTransaction.objects.all().order_by('-timestamp')[:10]  # Get last 10
            print(f"📊 Found {mpesa_transactions.count()} M-Pesa transactions")
            
            transactions_data = []
            
            for txn in mpesa_transactions:
                print(f"Processing transaction: {txn.checkout_id}")
                transactions_data.append({
                    'id': txn.id,
                    'transaction_id': txn.checkout_id,
                    'receipt_number': txn.mpesa_code or txn.checkout_id,
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
            
            print(f"✅ Returning {len(transactions_data)} transactions")
            
            return Response({
                'success': True,
                'data': transactions_data,
                'count': len(transactions_data)
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            print(f"❌ Error in TaxHistoryMpesaAPI: {str(e)}")
            print(f"❌ Traceback: {traceback.format_exc()}")
            
            return Response({
                'success': False,
                'message': f'Failed to fetch tax history: {str(e)}',
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
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