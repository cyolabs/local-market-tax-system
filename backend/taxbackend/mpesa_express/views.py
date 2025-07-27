import requests, base64, json, re, os
from datetime import datetime,timezone
from django.shortcuts import render, redirect
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse, HttpResponseBadRequest
from .models import Transaction
from .forms import PaymentForm
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Retrieve variables from the environment
# Hardcoded M-Pesa configuration constants
MPESA_BASE_URL = "https://sandbox.safaricom.co.ke"
CONSUMER_KEY = "hHoazCnAmgQjICzpji6Ut3S0mi0C1qKFEl9I1gU0JV0F0UZf"
CONSUMER_SECRET = "vevcPj3FZnAmOHcMkH9MLEMX7nhAJBBeeUnWam6ptWOfBGXvlfilAW8iNVs9oFYi"
MPESA_SHORTCODE = "174379"
MPESA_PASSKEY = "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919"
CALLBACK_URL = "https://local-market-tax-system-7fuw.onrender.com/mpesa/callback/"
MPESA_TOKEN_API_URL="https://sandbox.safaricom.co.ke/oauth/v1/generate"


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

        url = f"{MPESA_TOKEN_API_URL}?grant_type=client_credentials"
        response = requests.get(url, headers=headers)
        response.raise_for_status()  # Optional but recommended for catching HTTP errors
        response_json = response.json()

        if "access_token" in response_json:
            return response_json["access_token"]
        else:
            raise Exception("Access token missing in response.")

    except requests.RequestException as e:
        raise Exception(f"Failed to connect to M-Pesa: {str(e)}")

# Initiate STK Push and handle response
def initiate_stk_push(phone, amount):
    try:
        token = generate_access_token()
        headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}

        timestamp = datetime.now(timezone.utc).strftime('%Y%m%d%H%M%S')
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
            "AccountReference": "account",
            "TransactionDesc": "Payment for goods",
        }

        response = requests.post(
            f"{MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest",
            json=request_body,
            headers=headers,
        ).json()

        return response

    except Exception as e:
        print(f"Failed to initiate STK Push: {str(e)}")
        return e

# Payment View
def payment_view(request):
    if request.method == "POST":
        form = PaymentForm(request.POST)
        if form.is_valid():
            try:
                phone = format_phone_number(form.cleaned_data["phone_number"])
                amount = form.cleaned_data["amount"]
                response = initiate_stk_push(phone, amount)
                print(response)

                if response.get("ResponseCode") == "0":
                    checkout_request_id = response["CheckoutRequestID"]
                    return render(request, "pending.html", {"checkout_request_id": checkout_request_id})
                else:
                    error_message = response.get("errorMessage", "Failed to send STK push. Please try again.")
                    return render(request, "payment_form.html", {"form": form, "error_message": error_message})

            except ValueError as e:
                return render(request, "payment_form.html", {"form": form, "error_message": str(e)})
            except Exception as e:
                return render(request, "payment_form.html", {"form": form, "error_message": f"An unexpected error occurred: {str(e)}"})

    else:
        # Pre-fill form using GET parameters
        initial_data = {
            "account_reference": request.GET.get("category", ""),
            "amount": request.GET.get("amount", "")
        }
        form = PaymentForm(initial=initial_data)

    return render(request, "payment_form.html", {"form": form})

# Query STK Push status
def query_stk_push(checkout_request_id):
    print("Querying...")
    try:
        token = generate_access_token()
        headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}

        timestamp = datetime.now(timezone.utc).strftime('%Y%m%d%H%M%S')
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
        print("STK Query Response:", response.json())
        return response.json()

    except requests.RequestException as e:
        print(f"Error querying STK status: {str(e)}")
        return {"error": str(e)}

# Improved view to query the STK status and return it to the frontend
def stk_status_view(request):
    if request.method == 'POST':
        try:
            # Parse the JSON body
            data = json.loads(request.body)
            checkout_request_id = data.get('checkout_request_id')
            print("CheckoutRequestID:", checkout_request_id)

            # First check if we have this transaction in our database (from callback)
            try:
                transaction = Transaction.objects.get(checkout_id=checkout_request_id)
                if transaction.status == "Success":
                    return JsonResponse({
                        "status": {
                            "ResultCode": "0",
                            "ResultDesc": "Payment successful",
                            "from_database": True
                        }
                    })
            except Transaction.DoesNotExist:
                pass

            # Query the STK push status using M-Pesa API
            status = query_stk_push(checkout_request_id)
            
            # Handle different response scenarios from M-Pesa
            if "ResultCode" in status:
                # Successful query response
                return JsonResponse({"status": status})
            elif "errorCode" in status:
                # M-Pesa API error
                return JsonResponse({"status": status})
            elif "error" in status:
                # Network or other errors
                return JsonResponse({"status": {"error": status["error"]}})
            else:
                # Unknown response format
                print("Unknown M-Pesa response format:", status)
                return JsonResponse({
                    "status": {
                        "ResultCode": "1",
                        "ResultDesc": "Unknown response format from M-Pesa"
                    }
                })

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON body"}, status=400)
        except Exception as e:
            print(f"Error in stk_status_view: {str(e)}")
            return JsonResponse({
                "status": {
                    "ResultCode": "1",
                    "ResultDesc": f"Server error: {str(e)}"
                }
            })

    return JsonResponse({"error": "Invalid request method"}, status=405)

@csrf_exempt  # To allow POST requests from external sources like M-Pesa
def payment_callback(request):
    if request.method != "POST":
        return HttpResponseBadRequest("Only POST requests are allowed")

    try:
        callback_data = json.loads(request.body)  # Parse the request body
        print("M-Pesa Callback Data:", callback_data)  # Debug log
        
        result_code = callback_data["Body"]["stkCallback"]["ResultCode"]

        if result_code == 0:
            # Successful transaction
            checkout_id = callback_data["Body"]["stkCallback"]["CheckoutRequestID"]
            metadata = callback_data["Body"]["stkCallback"]["CallbackMetadata"]["Item"]

            amount = next(item["Value"] for item in metadata if item["Name"] == "Amount")
            mpesa_code = next(item["Value"] for item in metadata if item["Name"] == "MpesaReceiptNumber")
            phone = next(item["Value"] for item in metadata if item["Name"] == "PhoneNumber")

            # Save transaction to the database
            transaction, created = Transaction.objects.get_or_create(
                checkout_id=checkout_id,
                defaults={
                    'amount': amount,
                    'mpesa_code': mpesa_code,
                    'phone_number': phone,
                    'status': "Success"
                }
            )
            
            if created:
                print(f"Transaction saved: {transaction}")
            else:
                print(f"Transaction already exists: {transaction}")
                
            return JsonResponse({"ResultCode": 0, "ResultDesc": "Payment successful"})
        else:
            # Payment failed - also save to database for tracking
            checkout_id = callback_data["Body"]["stkCallback"]["CheckoutRequestID"]
            result_desc = callback_data["Body"]["stkCallback"].get("ResultDesc", "Payment failed")
            
            Transaction.objects.get_or_create(
                checkout_id=checkout_id,
                defaults={
                    'amount': 0,
                    'mpesa_code': '',
                    'phone_number': '',
                    'status': "Failed"
                }
            )

        # Payment failed
        return JsonResponse({"ResultCode": result_code, "ResultDesc": "Payment failed"})

    except (json.JSONDecodeError, KeyError) as e:
        print(f"Callback error: {str(e)}")
        return HttpResponseBadRequest(f"Invalid request data: {str(e)}")