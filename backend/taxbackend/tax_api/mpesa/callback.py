import json
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from .models import PaymentTransaction

@csrf_exempt
def stk_callback(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            callback = data.get('Body', {}).get('stkCallback', {})
            checkout_id = callback.get("CheckoutRequestID")

            transaction = PaymentTransaction.objects.get(checkout_request_id=checkout_id)

            if callback.get("ResultCode") == 0:
                metadata = callback.get('CallbackMetadata', {}).get('Item', [])
                for item in metadata:
                    if item['Name'] == 'MpesaReceiptNumber':
                        transaction.receipt_number = item['Value']
                    elif item['Name'] == 'Amount':
                        transaction.amount = item['Value']
                    elif item['Name'] == 'TransactionDate':
                        transaction.transaction_date = item['Value']
                    elif item['Name'] == 'PhoneNumber':
                        transaction.phone_number = item['Value']

                transaction.status = 'Completed'
            else:
                transaction.status = 'Failed'
                transaction.result_description = callback.get("ResultDesc", "")

            transaction.save()
            return JsonResponse({"status": "ok"})

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "Invalid method"}, status=405)
