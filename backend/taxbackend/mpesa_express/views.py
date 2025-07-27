import requests, base64, json, re, os
from datetime import datetime
from django.shortcuts import render, redirect
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse, HttpResponseBadRequest
from .models import Transaction
from .forms import PaymentForm

# Retrieve variables from the environment
CONSUMER_KEY = os.getenv("CONSUMER_KEY")
CONSUMER_SECRET = os.getenv("CONSUMER_SECRET")
MPESA_PASSKEY = os.getenv("MPESA_PASSKEY")

MPESA_SHORTCODE = os.getenv("MPESA_SHORTCODE")
CALLBACK_URL = os.getenv("CALLBACK_URL")
MPESA_BASE_URL = os.getenv('MPESA_BASE_URL')
MPESA_TOKEN_API_URL = os.getenv('MPESA_TOKEN_API_URL')
MPESA_STK_PUSH_URL = os.getenv('MPESA_STK_PUSH_URL')
MPESA_REGISTER_URL = os.getenv('MPESA_REGISTER_URL')


# Phone number formatting and validation
def format_phone_number(phone):
    phone = phone.replace("+", "")
    if re.match(r"^254\d{9}$", phone):
        return phone
    elif phone.startswith("0") and len(phone) == 10:
        return "254" + phone[1:]
    else:
        raise ValueError("Invalid phone number format")

# Generate M-Pesa access token

def generate_access_token():
    try:
        credentials = f"{CONSUMER_KEY}:{CONSUMER_SECRET}"
        encoded_credentials = base64.b64encode(credentials.encode()).decode()

        headers = {
            "Authorization": f"Basic {encoded_credentials}",
            "Content-Type": "application/json",
        }
        
        response = requests.get(
            f"{MPESA_TOKEN_API_URL}?grant_type=client_credentials",
            headers=headers,
            timeout=30
        )
        response.raise_for_status()
        data = response.json()
        
        if "access_token" in data:
            return data["access_token"]
        raise Exception("Access token missing in response")

    except requests.RequestException as e:
        raise Exception(f"Failed to connect to M-Pesa token API: {str(e)}")
    except Exception as e:
        raise Exception(f"Unexpected error generating token: {str(e)}")
    
# Initiate STK Push and handle response
def initiate_stk_push(phone, amount, account_reference="MarketPayment"):
    try:
        token = generate_access_token()
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }

        timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
        stk_password = base64.b64encode(
            (MPESA_SHORTCODE + MPESA_PASSKEY + timestamp).encode()
        ).decode()

        request_body = {
            "BusinessShortCode": MPESA_SHORTCODE,
            "Password": stk_password,
            "Timestamp": timestamp,
            "TransactionType": "CustomerPayBillOnline",
            "Amount": amount,
            "PartyA": phone,
            "PartyB": MPESA_SHORTCODE,
            "PhoneNumber": phone,
            "CallBackURL": CALLBACK_URL,
            "AccountReference": account_reference,
            "TransactionDesc": "Local Market Payment",
        }

        response = requests.post(
            MPESA_STK_PUSH_URL,
            json=request_body,
            headers=headers,
            timeout=30
        )
        response.raise_for_status()
        return response.json()

    except requests.RequestException as e:
        raise Exception(f"STK Push request failed: {str(e)}")
    except Exception as e:
        raise Exception(f"Unexpected error in STK Push: {str(e)}")
# Payment View
def payment_view(request):
    if request.method == "POST":
        form = PaymentForm(request.POST)
        if form.is_valid():
            try:
                phone = format_phone_number(form.cleaned_data["phone_number"])
                amount = form.cleaned_data["amount"]
                category = form.cleaned_data.get("account_reference", "MarketPayment")
                
                response = initiate_stk_push(phone, amount, category)
                print("M-Pesa Response:", response)

                if response.get("ResponseCode") == "0":
                    return render(request, "pending.html", {
                        "checkout_request_id": response["CheckoutRequestID"],
                        "amount": amount,
                        "phone": phone,
                        "category": category
                    })
                else:
                    error_message = response.get("errorMessage", "Payment initiation failed")
                    return render(request, "payment_form.html", {
                        "form": form,
                        "error_message": error_message
                    })

            except ValueError as e:
                return render(request, "payment_form.html", {
                    "form": form,
                    "error_message": f"Invalid input: {str(e)}"
                })
            except Exception as e:
                return render(request, "payment_form.html", {
                    "form": form,
                    "error_message": f"Payment failed: {str(e)}"
                })

    else:
        form = PaymentForm(initial={
            "account_reference": request.GET.get("category", "MarketPayment"),
            "amount": request.GET.get("amount", "")
        })

    return render(request, "payment_form.html", {"form": form})
# Query STK Push status
def query_stk_push(checkout_request_id):
    print("Quering...")
    try:
        token = generate_access_token()
        headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}

        timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
        password = base64.b64encode(
            (MPESA_SHORTCODE + MPESA_PASSKEY + timestamp).encode()
        ).decode()

        request_body = {
            "BusinessShortCode": MPESA_SHORTCODE,
            "Password": password,
            "Timestamp": timestamp,
            "CheckoutRequestID": checkout_request_id
        }

        response = requests.post(
            f"{MPESA_BASE_URL}/mpesa/stkpushquery/v1/query",
            json=request_body,
            headers=headers,
        )
        print(response.json())
        return response.json()

    except requests.RequestException as e:
        print(f"Error querying STK status: {str(e)}")
        return {"error": str(e)}

# View to query the STK status and return it to the frontend
def stk_status_view(request):
    if request.method == 'POST':
        try:
            # Parse the JSON body
            data = json.loads(request.body)
            checkout_request_id = data.get('checkout_request_id')
            print("CheckoutRequestID:", checkout_request_id)

            # Query the STK push status using your backend function
            status = query_stk_push(checkout_request_id)

            # Return the status as a JSON response
            return JsonResponse({"status": status})
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON body"}, status=400)

    return JsonResponse({"error": "Invalid request method"}, status=405)

@csrf_exempt  # To allow POST requests from external sources like M-Pesa
def payment_callback(request):
    if request.method != "POST":
        return HttpResponseBadRequest("Only POST requests are allowed")

    try:
        callback_data = json.loads(request.body)  # Parse the request body
        result_code = callback_data["Body"]["stkCallback"]["ResultCode"]

        if result_code == 0:
            # Successful transaction
            checkout_id = callback_data["Body"]["stkCallback"]["CheckoutRequestID"]
            metadata = callback_data["Body"]["stkCallback"]["CallbackMetadata"]["Item"]

            amount = next(item["Value"] for item in metadata if item["Name"] == "Amount")
            mpesa_code = next(item["Value"] for item in metadata if item["Name"] == "MpesaReceiptNumber")
            phone = next(item["Value"] for item in metadata if item["Name"] == "PhoneNumber")

            # Save transaction to the database
            Transaction.objects.create(
                amount=amount, 
                checkout_id=checkout_id, 
                mpesa_code=mpesa_code, 
                phone_number=phone, 
                status="Success"
            )
            return JsonResponse({"ResultCode": 0, "ResultDesc": "Payment successful"})

        # Payment failed
        return JsonResponse({"ResultCode": result_code, "ResultDesc": "Payment failed"})

    except (json.JSONDecodeError, KeyError) as e:
        return HttpResponseBadRequest(f"Invalid request data: {str(e)}")