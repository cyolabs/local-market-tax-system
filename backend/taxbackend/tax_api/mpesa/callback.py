import json
import uuid
from datetime import datetime
from django.http import JsonResponse
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.utils.timezone import make_aware
from .models import PaymentTransaction

@csrf_exempt
def stk_callback(request):
    if request.method != "POST":
        return JsonResponse({"error": "Invalid method"}, status=405)

    try:
        data = json.loads(request.body)
        print(json.dumps(data, indent=4))  # For debugging

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

            # Format date
            transaction_date = make_aware(datetime.strptime(str(tx_time), "%Y%m%d%H%M%S"))

            # Save to DB
            PaymentTransaction.objects.create(
                phone_number=phone,
                amount=amount,
                transaction_id=transaction_id,
                checkout_request_id=checkout_request_id,
                merchant_request_id=merchant_request_id,
                transaction_date=transaction_date,
                status='Completed'
            )
        else:
            # Save failed transaction attempt
            PaymentTransaction.objects.create(
                phone_number='Unknown',
                amount=0,
                transaction_id='Failed-' + str(uuid.uuid4())[:8],
                checkout_request_id=checkout_request_id,
                merchant_request_id=merchant_request_id,
                transaction_date=timezone.now(),
                status='Failed',
                result_description=result_desc
            )

        return JsonResponse({"ResultCode": 0, "ResultDesc": "Success"})

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)
