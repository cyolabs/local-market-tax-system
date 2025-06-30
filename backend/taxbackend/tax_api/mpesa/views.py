from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .client import MpesaClient
from ..models import PaymentTransaction
from ..serializers import PaymentTransactionSerializer
import logging

logger = logging.getLogger(__name__)

class InitiateSTKPushView(APIView):
    def post(self, request):
        try:
            phone_number = request.data.get('phone_number')
            amount = request.data.get('amount')
            account_reference = request.data.get('account_reference', 'TAX_PAYMENT')
            transaction_desc = request.data.get('transaction_desc', 'Tax Payment')
            
            mpesa_client = MpesaClient()
            response = mpesa_client.stk_push(
                phone_number=phone_number,
                amount=amount,
                account_reference=account_reference,
                transaction_desc=transaction_desc
            )
            
            # Save initial transaction data
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

class MpesaCallbackView(APIView):
    def post(self, request):
        try:
            callback_data = request.data
            
            # Process the callback data
            result_code = callback_data.get('Body', {}).get('stkCallback', {}).get('ResultCode')
            checkout_request_id = callback_data.get('Body', {}).get('stkCallback', {}).get('CheckoutRequestID')
            
            transaction = PaymentTransaction.objects.get(checkout_request_id=checkout_request_id)
            
            if result_code == 0:
                # Success
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
                
                # Here you can add additional logic like updating vendor balance, etc.
                
            else:
                # Failed
                transaction.status = 'Failed'
                transaction.result_description = callback_data.get('Body', {}).get('stkCallback', {}).get('ResultDesc')
                transaction.save()
                
            return Response({'status': 'success'}, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Error processing M-Pesa callback: {str(e)}")
            return Response({'status': 'error', 'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)

