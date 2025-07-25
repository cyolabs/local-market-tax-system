import logging
import uuid
import json
import io
from datetime import datetime

from django.http import JsonResponse, HttpResponse
from django.utils import timezone
from django.utils.timezone import make_aware
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.contrib.auth import get_user_model

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from reportlab.pdfgen import canvas

from .client import MpesaClient
from ..models import PaymentTransaction
from ..serializers import PaymentTransactionSerializer

logger = logging.getLogger(__name__)
User = get_user_model()

# -------------------- STK Push Initiation --------------------

@method_decorator(csrf_exempt, name='dispatch')
class InitiateSTKPushView(APIView):
    permission_classes = [IsAuthenticated]

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
                user=request.user,
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
            })

        except Exception as e:
            logger.error(f"STK Push Error: {str(e)}")
            return Response({'success': False, 'message': str(e)}, status=400)

# -------------------- Callback Handler --------------------

@csrf_exempt
def stk_callback(request):
    if request.method != "POST":
        return JsonResponse({"error": "Invalid method"}, status=405)

    try:
        data = json.loads(request.body)
        logger.info(json.dumps(data, indent=4))

        body = data.get("Body", {}).get("stkCallback", {})
        merchant_request_id = body.get("MerchantRequestID")
        checkout_request_id = body.get("CheckoutRequestID")
        result_code = body.get("ResultCode")
        result_desc = body.get("ResultDesc", "")

        if result_code == 0:
            metadata = body.get("CallbackMetadata", {}).get("Item", [])
            meta = {item['Name']: item['Value'] for item in metadata}

            transaction_id = meta.get("MpesaReceiptNumber")
            phone = str(meta.get("PhoneNumber"))
            amount = meta.get("Amount")
            tx_time = meta.get("TransactionDate")
            transaction_date = make_aware(datetime.strptime(str(tx_time), "%Y%m%d%H%M%S"))

            transaction = PaymentTransaction.objects.filter(checkout_request_id=checkout_request_id).first()
            if transaction:
                transaction.amount = amount
                transaction.phone_number = phone
                transaction.transaction_id = transaction_id
                transaction.transaction_date = transaction_date
                transaction.status = 'Completed'
                transaction.save()
            else:
                PaymentTransaction.objects.create(
                    phone_number=phone,
                    amount=amount,
                    transaction_id=transaction_id,
                    merchant_request_id=merchant_request_id,
                    checkout_request_id=checkout_request_id,
                    transaction_date=transaction_date,
                    status='Completed'
                )
        else:
            PaymentTransaction.objects.create(
                phone_number='Unknown',
                amount=0,
                transaction_id='Failed-' + str(uuid.uuid4())[:8],
                merchant_request_id=merchant_request_id,
                checkout_request_id=checkout_request_id,
                transaction_date=timezone.now(),
                status='Failed',
                result_description=result_desc
            )

        return JsonResponse({"ResultCode": 0, "ResultDesc": "Callback received successfully"})

    except Exception as e:
        logger.error(f"Callback error: {str(e)}")
        return JsonResponse({"error": str(e)}, status=400)

# -------------------- Transaction History --------------------

@method_decorator(csrf_exempt, name='dispatch')
class TransactionHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            transactions = PaymentTransaction.objects.filter(user=request.user).order_by('-created_at')
            serializer = PaymentTransactionSerializer(transactions, many=True)
            return Response({'success': True, 'data': serializer.data})
        except Exception as e:
            logger.error(f"History Error - User {request.user.id}: {str(e)}")
            return Response({'success': False, 'message': str(e)}, status=500)

# -------------------- Download Receipt --------------------

@method_decorator(csrf_exempt, name='dispatch')
class DownloadReceiptView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, transaction_id):
        try:
            transaction = PaymentTransaction.objects.get(
                transaction_id=transaction_id,
                user=request.user,
                status='Completed'
            )

            buffer = io.BytesIO()
            p = canvas.Canvas(buffer)

            # Receipt content
            p.setFont("Helvetica-Bold", 16)
            p.drawString(100, 800, "COUNTY GOVERNMENT RECEIPT")
            p.setFont("Helvetica", 12)
            p.drawString(100, 780, f"Receipt No: {transaction.receipt_number}")
            p.drawString(100, 760, f"Date: {transaction.created_at.strftime('%Y-%m-%d %H:%M')}")

            p.line(100, 750, 450, 750)
            p.setFont("Helvetica-Bold", 14)
            p.drawString(100, 730, "TRANSACTION DETAILS")

            y = 710
            fields = [
                ("Vendor", request.user.full_name),
                ("Phone", transaction.phone_number),
                ("Market", getattr(request.user, "market_of_operation", "N/A")),
                ("Category", transaction.account_reference),
                ("Amount", f"KES {transaction.amount}"),
                ("Status", transaction.status),
            ]

            for label, value in fields:
                p.drawString(100, y, f"{label}: {value}")
                y -= 20

            p.setFont("Helvetica-Oblique", 10)
            p.drawString(100, 600, "Thank you for your payment!")
            p.drawString(100, 580, "County Government Revenue System")
            p.showPage()
            p.save()

            buffer.seek(0)
            return HttpResponse(buffer, content_type='application/pdf', headers={
                'Content-Disposition': f'attachment; filename="receipt_{transaction.receipt_number}.pdf"'
            })

        except PaymentTransaction.DoesNotExist:
            return Response({"error": "Valid receipt not found"}, status=404)

# -------------------- Single Transaction Detail --------------------

@method_decorator(csrf_exempt, name='dispatch')
class PaymentTransactionDetailView(APIView):
    def get(self, request, transaction_id):
        try:
            transaction = PaymentTransaction.objects.get(transaction_id=transaction_id)
            serializer = PaymentTransactionSerializer(transaction)
            return Response(serializer.data)
        except PaymentTransaction.DoesNotExist:
            return Response({"error": "Transaction not found"}, status=404)
