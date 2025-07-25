import logging
import uuid
import json
import io
import os
import base64
import requests
from datetime import datetime

from dotenv import load_dotenv

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

from ..models import PaymentTransaction
from ..serializers import PaymentTransactionSerializer

# Load .env variables
load_dotenv()

logger = logging.getLogger(__name__)
User = get_user_model()


# -------------------- Mpesa Client --------------------

class MpesaClient:
    def __init__(self):
        self.consumer_key = os.getenv('MPESA_CONSUMER_KEY')
        self.consumer_secret = os.getenv('MPESA_CONSUMER_SECRET')
        self.business_shortcode = os.getenv('MPESA_BUSINESS_SHORTCODE')
        self.passkey = os.getenv('MPESA_PASSKEY')
        self.callback_url = os.getenv('MPESA_CALLBACK_URL')
        self.base_url = os.getenv('MPESA_BASE_URL')

    def generate_access_token(self):
        try:
            credentials = f"{self.consumer_key}:{self.consumer_secret}"
            encoded_credentials = base64.b64encode(credentials.encode()).decode()

            headers = {
                "Authorization": f"Basic {encoded_credentials}",
                "Content-Type": "application/json",
            }

            response = requests.get(
                f"{self.base_url}/oauth/v1/generate?grant_type=client_credentials",
                headers=headers
            ).json()

            if 'access_token' in response:
                return response['access_token']
            else:
                raise Exception("Access token error: " + str(response))
        except requests.RequestException as e:
            logger.error(f"Network error during token request: {str(e)}")
            raise

    def stk_push(self, phone_number, amount, account_reference="TaxPayment", transaction_desc="Payment for local market tax"):
        try:
            access_token = self.generate_access_token()
            timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
            password = base64.b64encode(
                (self.business_shortcode + self.passkey + timestamp).encode()).decode()

            headers = {
                "Authorization": f"Bearer {access_token}",
                "Content-Type": "application/json",
            }

            payload = {
                "BusinessShortCode": self.business_shortcode,
                "Password": password,
                "Timestamp": timestamp,
                "TransactionType": "CustomerPayBillOnline",
                "Amount": amount,
                "PartyA": phone_number,
                "PartyB": self.business_shortcode,
                "PhoneNumber": phone_number,
                "CallBackURL": self.callback_url,
                "AccountReference": account_reference,
                "TransactionDesc": transaction_desc
            }

            response = requests.post(
                f"{self.base_url}/mpesa/stkpush/v1/processrequest",
                headers=headers,
                json=payload
            ).json()

            return response
        except Exception as e:
            logger.error(f"STK Push error: {str(e)}")
            raise

    def query_stk_push(self, checkout_request_id):
        try:
            access_token = self.generate_access_token()
            headers = {
                "Authorization": f"Bearer {access_token}",
                "Content-Type": "application/json",
            }

            timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
            password = base64.b64encode(
                (self.business_shortcode + self.passkey + timestamp).encode()).decode()
            
            request_body = {
                "BusinessShortCode": self.business_shortcode,
                "Password": password,
                "Timestamp": timestamp,
                "CheckoutRequestID": checkout_request_id
            }
            response = requests.post(
                f"{self.base_url}/mpesa/stkpushquery/v1/query",
                json=request_body,
                headers=headers
            )
            print(response.json())
            return response.json()
        except requests.RequestException as e:
            print(f"Error querying STK Push: {str(e)}")
            return {"error": str(e)}
        






# -------------------- STK Push Initiation --------------------

@method_decorator(csrf_exempt, name='dispatch')
class InitiateSTKPushView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            phone_number = request.data.get('phone_number')
            amount = float(request.data.get('amount', 0))
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
        logger.info("STK Callback:\n" + json.dumps(data, indent=4))

        callback = data.get("Body", {}).get("stkCallback", {})
        merchant_request_id = callback.get("MerchantRequestID")
        checkout_request_id = callback.get("CheckoutRequestID")
        result_code = callback.get("ResultCode")
        result_desc = callback.get("ResultDesc", "")

        if result_code == 0:
            metadata = callback.get("CallbackMetadata", {}).get("Item", [])
            meta = {item.get("Name"): item.get("Value") for item in metadata}

            transaction_id = meta.get("MpesaReceiptNumber", "N/A")
            phone = str(meta.get("PhoneNumber", "Unknown"))
            amount = meta.get("Amount", 0)
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
    
# -------------------- STK Status Query --------------------
       
def stk_status_view(request):
    if request.method != "POST":
        return JsonResponse({"error": "Invalid method"}, status=405)

    try:
        data = json.loads(request.body)
        checkout_request_id = data.get("CheckoutRequestID")

        if not checkout_request_id:
            return JsonResponse({"error": "CheckoutRequestID is required"}, status=400)

        mpesa_client = MpesaClient()
        status = mpesa_client.query_stk_push(checkout_request_id)

        return JsonResponse(status)

    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)
    except Exception as e:
        logger.error(f"STK Status Error: {str(e)}")
        return JsonResponse({"error": str(e)}, status=500)


# -------------------- Transaction History --------------------

@method_decorator(csrf_exempt,name='dispatch')
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
