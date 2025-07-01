from datetime import datetime
import base64
import requests

def initiate_stk_push():
    # 1. Get access token
    consumer_key = "hHoazCnAmgQjICzpji6Ut3S0mi0C1qKFEl9I1gU0JV0F0UZf"
    consumer_secret = "vevcPj3FZnAmOHcMkH9MLEMX7nhAJBBeeUnWam6ptWOfBGXvlfilAW8iNVs9oFYi"
    auth_url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"

    auth_response = requests.get(
        auth_url,
        auth=(consumer_key, consumer_secret),
        headers={"Content-Type": "application/json"}
    )

    access_token = auth_response.json().get("access_token")

    if not access_token:
        print("Failed to get access token")
        print(auth_response.json())
        return

    # 2. Prepare STK Push
    phone = "254708374149"  # Test number
    amount = 1
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    passkey = "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919"  # Replace with actual passkey
    business_short_code = "174379"

    password = base64.b64encode(f"{business_short_code}{passkey}{timestamp}".encode()).decode()

    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }

    payload = {
        "BusinessShortCode": int(business_short_code),
        "Password": password,
        "Timestamp": timestamp,
        "TransactionType": "CustomerPayBillOnline",
        "Amount": amount,
        "PartyA": phone,
        "PartyB": int(business_short_code),
        "PhoneNumber": phone,
        "CallBackURL": "https://local-market-tax-system-7fuw.onrender.com/mpesa-callback/",
        "AccountReference": "TEST",
        "TransactionDesc": "Test Payment"
    }

    # 3. Make the request
    response = requests.post(
        "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
        json=payload,
        headers=headers
    )

    print("Status Code:", response.status_code)
    print("Response:", response.json())

# Run the function
initiate_stk_push()
