from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from .models import PaymentTransaction

@csrf_exempt
def stk_callback(request):
    if request.method == "POST":
        data = json.loads(request.body)
        
        # Update transaction status
        checkout_id = data.get("Body").get("stkCallback").get("CheckoutRequestID")
        transaction = PaymentTransaction.objects.get(checkout_request_id=checkout_id)
        
        if data.get("Body").get("stkCallback").get("ResultCode") == 0:
            transaction.status = "Completed"
            # Add tax payment logic here
        else:
            transaction.status = "Failed"
        
        transaction.save()
        return JsonResponse({"status": "ok"})
    