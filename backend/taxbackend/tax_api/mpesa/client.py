import base64
from datetime import datetime
import requests
from Crypto.PublicKey import RSA
from Crypto.Cipher import PKCS1_v1_5
import json
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

class MpesaClient:
    def __init__(self):
        self.consumer_key = settings.MPESA_CONSUMER_KEY
        self.consumer_secret = settings.MPESA_CONSUMER_SECRET
        self.passkey = settings.MPESA_PASSKEY
        self.business_shortcode = settings.MPESA_BUSINESS_SHORTCODE
        self.callback_url = settings.MPESA_CALLBACK_URL
        self.token_api_url = settings.MPESA_TOKEN_API_URL
        self.stk_push_url = settings.MPESA_STK_PUSH_URL
        self.access_token = None
        
    def get_access_token(self):
        try:
            auth_string = f"{self.consumer_key}:{self.consumer_secret}"
            encoded_auth = base64.b64encode(auth_string.encode()).decode()
            
            headers = {
                "Authorization": f"Basic {encoded_auth}"
            }
            
            response = requests.get(self.token_api_url, headers=headers)
            response.raise_for_status()
            
            self.access_token = response.json().get("access_token")
            return self.access_token
            
        except Exception as e:
            logger.error(f"Error getting access token: {str(e)}")
            raise
            
    def generate_password(self):
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        password_string = f"{self.business_shortcode}{self.passkey}{timestamp}"
        encoded_password = base64.b64encode(password_string.encode()).decode()
        return encoded_password, timestamp
        
    def stk_push(self, phone_number, amount, account_reference, transaction_desc):
        try:
            if not self.access_token:
                self.get_access_token()
                
            password, timestamp = self.generate_password()
            
            headers = {
                "Authorization": f"Bearer {self.access_token}",
                "Content-Type": "application/json"
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
            
            response = requests.post(self.stk_push_url, headers=headers, json=payload)
            response.raise_for_status()
            
            return response.json()
            
        except Exception as e:
            logger.error(f"Error in STK push: {str(e)}")
            raise