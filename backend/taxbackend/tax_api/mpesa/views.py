from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .client import MpesaClient
from ..models import PaymentTransaction
from ..serializers import PaymentTransactionSerializer
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
import logging
from django.http import HttpResponse
from reportlab.pdfgen import canvas
import io
from datetime import datetime
from ..serializers import PaymentTransactionSerializer

logger = logging.getLogger(__name__)

@method_decorator(csrf_exempt, name='dispatch')
class InitiateSTKPushView(APIView):
    permission_classes = [IsAuthenticated]  # Moved inside the class

    def post(self, request):
        try:
            phone_number = request.data.get('phone_number')
            amount = float(request.data.get('amount'))
            account_reference = request.data.get('account_reference', 'TAX_PAYMENT')
            transaction_desc = request.data.get('transaction_desc', 'Tax Payment')
            
            mpesa_client = MpesaClient()
            response = mpesa_client.stk_push(
                phone_number=phone_number,
                amount=amount,
                account_reference=account_reference,
                transaction_desc=transaction_desc
            )
            
            transaction = PaymentTransaction.objects.create(
                phone_number=phone_number,
                amount=amount,
                account_reference=account_reference,
                description=transaction_desc,
                merchant_request_id=response.get('MerchantRequestID'),
                checkout_request_id=response.get('CheckoutRequestID'),
                status='Pending'
            )
            
            serializer = PaymentTransactionSerializer(transaction)
            
            return Response({
                'success': True,
                'message': 'STK push initiated successfully',
                'data': serializer.data
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Error initiating STK push: {str(e)}")
            return Response({
                'success': False,
                'message': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

@method_decorator(csrf_exempt, name='dispatch')
class DownloadReceiptView(APIView):
    def get(self, request, transaction_id):
        try:
            transaction = PaymentTransaction.objects.get(id=transaction_id)
            
            # Create PDF
            buffer = io.BytesIO()
            p = canvas.Canvas(buffer)
            
            # Customize receipt (example)
            p.drawString(100, 800, "OFFICIAL RECEIPT")
            p.drawString(100, 750, f"Receipt No: {transaction.receipt_number}")
            p.drawString(100, 700, f"Amount: KES {transaction.amount}")
            p.drawString(100, 650, f"Phone: {transaction.phone_number}")
            p.drawString(100, 600, f"Date: {transaction.created_at.strftime('%Y-%m-%d %H:%M')}")
            
            p.showPage()
            p.save()
            buffer.seek(0)
            
            response = HttpResponse(buffer, content_type='application/pdf')
            response['Content-Disposition'] = f'attachment; filename="receipt_{transaction.receipt_number}.pdf"'
            return response
            
        except Exception as e:
            return Response({"error": str(e)}, status=400)

@method_decorator(csrf_exempt, name='dispatch')
class MpesaCallbackView(APIView):
    permission_classes = []

    def post(self, request):
        try:
            callback_data = request.data
            result_code = callback_data.get('Body', {}).get('stkCallback', {}).get('ResultCode')
            checkout_request_id = callback_data.get('Body', {}).get('stkCallback', {}).get('CheckoutRequestID')
            
            transaction = PaymentTransaction.objects.get(checkout_request_id=checkout_request_id)
            
            if result_code == 0:
                callback_metadata = callback_data.get('Body', {}).get('stkCallback', {}).get('CallbackMetadata', {}).get('Item', [])
                
                for item in callback_metadata:
                    if item.get('Name') == 'Amount':
                        transaction.amount = item.get('Value')
                    elif item.get('Name') == 'MpesaReceiptNumber':
                        transaction.receipt_number = item.get('Value')
                    elif item.get('Name') == 'TransactionDate':
                        transaction.transaction_date = item.get('Value')
                    elif item.get('Name') == 'PhoneNumber':
                        transaction.phone_number = item.get('Value')
                
                transaction.status = 'Completed'
                transaction.save()
            else:
                transaction.status = 'Failed'
                transaction.result_description = callback_data.get('Body', {}).get('stkCallback', {}).get('ResultDesc')
                transaction.save()
                
            return Response({'status': 'success'}, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Error processing M-Pesa callback: {str(e)}")
            return Response({'status': 'error', 'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@method_decorator(csrf_exempt, name='dispatch')
class PaymentTransactionDetailView(APIView):
    def get(self, request, transaction_id):
        try:
            transaction = PaymentTransaction.objects.get(id=transaction_id)
            serializer = PaymentTransactionSerializer(transaction)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except PaymentTransaction.DoesNotExist:
            return Response({"error": "Transaction not found"}, status=status.HTTP_404_NOT_FOUND)