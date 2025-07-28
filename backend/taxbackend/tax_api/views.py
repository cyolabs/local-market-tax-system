# backend/taxbackend/tax_api/views.py - FIXED VERSION

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.http import JsonResponse
from datetime import datetime
import traceback
import json

# Try to import optional models - won't crash if they don't exist
try:
    from .models import PaymentTransaction
    HAS_PAYMENT_MODEL = True
except ImportError:
    HAS_PAYMENT_MODEL = False
    print("⚠️ PaymentTransaction model not found - using basic functionality")

try:
    from mpesa_express.models import Transaction as MpesaTransaction
    HAS_MPESA_MODEL = True
except ImportError:
    HAS_MPESA_MODEL = False
    print("⚠️ MpesaTransaction model not found - using test data")

try:
    from .serializers import UserSerializer
    HAS_USER_SERIALIZER = True
except ImportError:
    HAS_USER_SERIALIZER = False
    print("⚠️ UserSerializer not found - using basic user creation")

# =================== ESSENTIAL DEBUG ENDPOINTS ===================

class DebugAPI(APIView):
    """Debug endpoint to test API functionality"""
    permission_classes = [AllowAny]  # No authentication required
    
    def get(self, request):
        return Response({
            'success': True,
            'message': 'Debug API is working!',
            'server_time': datetime.now().isoformat(),
            'user_authenticated': request.user.is_authenticated,
            'user': str(request.user) if request.user.is_authenticated else 'Anonymous',
            'request_method': request.method,
        }, status=status.HTTP_200_OK)

    def post(self, request):
        return Response({
            'success': True,
            'message': 'Debug POST is working!',
            'data_received': request.data,
            'server_time': datetime.now().isoformat(),
        }, status=status.HTTP_200_OK)

# =================== AUTHENTICATION ENDPOINTS ===================

class RegisterAPI(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        try:
            print(f"📝 Registration attempt: {request.data}")
            
            # Get required fields
            username = request.data.get('username', '').strip()
            email = request.data.get('email', '').strip()
            password = request.data.get('password', '')
            full_name = request.data.get('full_name', '').strip()
            
            # Validation
            if not username:
                return Response({'error': 'Username is required'}, status=status.HTTP_400_BAD_REQUEST)
            
            if not email:
                return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)
                
            if not password or len(password) < 6:
                return Response({'error': 'Password must be at least 6 characters'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Check if user already exists
            if User.objects.filter(username=username).exists():
                return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)
                
            if User.objects.filter(email=email).exists():
                return Response({'error': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Create user
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password
            )
            
            # Set additional fields if provided
            if full_name:
                user.first_name = full_name.split(' ')[0] if ' ' in full_name else full_name
                if ' ' in full_name:
                    user.last_name = ' '.join(full_name.split(' ')[1:])
                user.save()
            
            # Generate tokens
            refresh = RefreshToken.for_user(user)
            
            print(f"✅ User created successfully: {username}")
            
            return Response({
                'success': True,
                'message': 'User registered successfully',
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'full_name': f"{user.first_name} {user.last_name}".strip(),
                },
                'access_token': str(refresh.access_token),
                'refresh_token': str(refresh),
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            print(f"❌ Registration error: {str(e)}")
            print(f"❌ Traceback: {traceback.format_exc()}")
            
            return Response({
                'error': 'Registration failed. Please try again.',
                'debug': str(e) if hasattr(request, 'debug') else None
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class LoginAPI(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        try:
            print(f"🔐 Login attempt: {request.data}")
            
            username = request.data.get('username', '').strip()
            password = request.data.get('password', '')
            
            # Validation
            if not username:
                return Response({'error': 'Username is required'}, status=status.HTTP_400_BAD_REQUEST)
                
            if not password:
                return Response({'error': 'Password is required'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Authenticate user
            user = authenticate(request, username=username, password=password)
            
            if user is None:
                print(f"❌ Authentication failed for: {username}")
                return Response({'error': 'Invalid username or password'}, status=status.HTTP_401_UNAUTHORIZED)
            
            if not user.is_active:
                return Response({'error': 'Account is disabled'}, status=status.HTTP_403_FORBIDDEN)
            
            # Generate tokens
            refresh = RefreshToken.for_user(user)
            
            print(f"✅ Login successful: {username}")
            
            # Get user role (with fallback)
            user_role = 'vendor'  # default role
            if hasattr(user, 'role'):
                user_role = user.role
            elif user.is_superuser:
                user_role = 'admin'
            
            return Response({
                'success': True,
                'message': 'Login successful',
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'full_name': f"{user.first_name} {user.last_name}".strip(),
                    'role': user_role,
                    'is_staff': user.is_staff,
                    'is_superuser': user.is_superuser,
                },
                'access_token': str(refresh.access_token),
                'refresh_token': str(refresh),
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            print(f"❌ Login error: {str(e)}")
            print(f"❌ Traceback: {traceback.format_exc()}")
            
            return Response({
                'error': 'Login failed. Please try again.',
                'debug': str(e) if hasattr(request, 'debug') else None
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# =================== DASHBOARD ENDPOINTS ===================

class AdminDashboardAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            # Check if user is admin
            if not (request.user.is_staff or request.user.is_superuser):
                return Response({
                    'error': 'Admin access required'
                }, status=status.HTTP_403_FORBIDDEN)
            
            return Response({
                'success': True,
                'message': 'Welcome to the Admin Dashboard!',
                'user': {
                    'username': request.user.username,
                    'role': 'admin'
                }
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            print(f"❌ Admin dashboard error: {str(e)}")
            return Response({
                'error': 'Failed to load admin dashboard'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class VendorDashboardAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            return Response({
                'success': True,
                'message': 'Welcome to the Vendor Dashboard!',
                'user': {
                    'username': request.user.username,
                    'role': 'vendor'
                }
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            print(f"❌ Vendor dashboard error: {str(e)}")
            return Response({
                'error': 'Failed to load vendor dashboard'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# =================== TAX HISTORY ENDPOINT ===================

class TaxHistoryAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            print(f"🔍 TaxHistoryAPI called by user: {request.user}")
            
            # Get filter parameters
            status_filter = request.query_params.get('status', '')
            start_date = request.query_params.get('start_date', '')
            end_date = request.query_params.get('end_date', '')
            
            transactions_data = []
            
            # Try to get real M-Pesa transactions if model exists
            if HAS_MPESA_MODEL:
                try:
                    print("📦 Fetching M-Pesa transactions...")
                    queryset = MpesaTransaction.objects.all().order_by('-timestamp')
                    
                    # Apply filters
                    if status_filter:
                        queryset = queryset.filter(status__icontains=status_filter)
                    
                    for txn in queryset[:10]:  # Limit to 10 recent transactions
                        transactions_data.append({
                            'id': txn.id,
                            'transaction_id': txn.checkout_id,
                            'receipt_number': txn.mpesa_code or txn.checkout_id,
                            'phone_number': txn.phone_number,
                            'amount': str(txn.amount),
                            'category': 'Market Tax Payment',
                            'status': txn.status,
                            'mpesa_receipt_number': txn.mpesa_code or '',
                            'transaction_date': txn.timestamp.isoformat() if txn.timestamp else '',
                            'created_at': txn.timestamp.isoformat() if txn.timestamp else '',
                        })
                    
                    if transactions_data:
                        print(f"✅ Returning {len(transactions_data)} M-Pesa transactions")
                        return Response({
                            'success': True,
                            'data': transactions_data,
                            'count': len(transactions_data),
                            'message': f'Found {len(transactions_data)} transactions'
                        }, status=status.HTTP_200_OK)
                        
                except Exception as mpesa_error:
                    print(f"⚠️ M-Pesa query failed: {str(mpesa_error)}")
            
            # Return test data if no real transactions found
            print("📦 Returning test data...")
            test_data = [
                {
                    'id': 1,
                    'transaction_id': 'TEST001',
                    'receipt_number': 'RC001',
                    'phone_number': '254700000000',
                    'amount': '1000.00',
                    'category': 'Fresh products traders',
                    'status': 'Completed',
                    'mpesa_receipt_number': 'QAZ12345',
                    'transaction_date': '2024-01-15T10:30:00Z',
                    'created_at': '2024-01-15T10:30:00Z',
                },
                {
                    'id': 2,
                    'transaction_id': 'TEST002',
                    'receipt_number': 'RC002',
                    'phone_number': '254711111111',
                    'amount': '1500.00',
                    'category': 'Livestock and meat',
                    'status': 'Pending',
                    'mpesa_receipt_number': 'QWE67890',
                    'transaction_date': '2024-01-14T15:45:00Z',
                    'created_at': '2024-01-14T15:45:00Z',
                }
            ]
            
            # Apply status filter to test data
            if status_filter:
                test_data = [txn for txn in test_data if status_filter.lower() in txn['status'].lower()]
            
            return Response({
                'success': True,
                'data': test_data,
                'count': len(test_data),
                'message': f'Test data - {len(test_data)} transactions'
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            print(f"❌ TaxHistoryAPI error: {str(e)}")
            print(f"❌ Traceback: {traceback.format_exc()}")
            
            return Response({
                'success': False,
                'message': 'Failed to fetch tax history',
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# =================== HELPER FUNCTION VIEWS ===================

def debug_view(request):
    """Simple function-based view for debugging"""
    return JsonResponse({
        'success': True,
        'message': 'Function-based debug view working',
        'method': request.method,
        'user': str(request.user),
        'authenticated': request.user.is_authenticated,
    })

def signup_view(request):
    """Function-based signup view as fallback"""
    if request.method == 'POST':
        try:
            import json
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')
            email = data.get('email')
            
            if User.objects.filter(username=username).exists():
                return JsonResponse({'error': 'Username already exists'}, status=400)
            
            user = User.objects.create_user(username=username, password=password, email=email)
            refresh = RefreshToken.for_user(user)
            
            return JsonResponse({
                'success': True,
                'access_token': str(refresh.access_token),
                'refresh_token': str(refresh),
            })
            
        except Exception as e:
            print(f"Function signup error: {str(e)}")
            return JsonResponse({'error': str(e)}, status=500)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)

def login_view(request):
    """Function-based login view as fallback"""
    if request.method == 'POST':
        try:
            import json
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')
            
            user = authenticate(request, username=username, password=password)
            if user:
                refresh = RefreshToken.for_user(user)
                return JsonResponse({
                    'success': True,
                    'access_token': str(refresh.access_token),
                    'refresh_token': str(refresh),
                    'user': {
                        'username': user.username,
                        'id': user.id
                    }
                })
            else:
                return JsonResponse({'error': 'Invalid credentials'}, status=401)
                
        except Exception as e:
            print(f"Function login error: {str(e)}")
            return JsonResponse({'error': str(e)}, status=500)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)

def tax_history_view(request):
    """Function-based tax history view as fallback"""
    return JsonResponse({
        'success': True,
        'data': [
            {
                'id': 1,
                'transaction_id': 'FUNC001',
                'amount': '500.00',
                'status': 'Completed',
                'created_at': datetime.now().isoformat()
            }
        ],
        'message': 'Function-based view working'
    })