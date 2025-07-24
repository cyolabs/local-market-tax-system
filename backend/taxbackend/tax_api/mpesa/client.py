import os
import base64
import requests
from datetime import datetime
from dotenv import load_dotenv
import logging

load_dotenv()
logger = logging.getLogger(__name__)

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
            logger.error(f"Network error during access token request: {str(e)}")
            raise

    def stk_push(self, phone, amount, account_reference="TaxPayment", transaction_desc="Payment for local market tax"):
        try:
            access_token = self.generate_access_token()
            timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
            stk_password = base64.b64encode(
                (self.business_shortcode + self.passkey + timestamp).encode()).decode()

            headers = {
                "Authorization": f"Bearer {access_token}",
                "Content-Type": "application/json",
            }

            payload = {
                "BusinessShortCode": self.business_shortcode,
                "Password": stk_password,
                "Timestamp": timestamp,
                "TransactionType": "CustomerPayBillOnline",
                "Amount": amount,
                "PartyA": phone,
                "PartyB": self.business_shortcode,
                "PhoneNumber": phone,
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
            logger.error(f"STK push error: {str(e)}")
            raise
