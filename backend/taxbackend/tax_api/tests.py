from rest_framework.test import APITestCase
from django.urls import reverse
from rest_framework import status

class AuthTestCase(APITestCase):
    def setUp(self):
        self.signup_url = reverse('signup')   # The name in your URLConf
        self.login_url = reverse('token_obtain_pair')  # JWT login
        self.vendor_data = {
            "username": "vendor1",
            "email": "vendor1@example.com",
            "password": "Vendor@123",
            "role": "vendor"
        }

    def test_vendor_signup(self):
        response = self.client.post(self.signup_url, self.vendor_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_vendor_login(self):
        # First, sign up
        self.client.post(self.signup_url, self.vendor_data)
        # Now login
        login_data = {
            "email": self.vendor_data["email"],
            "password": self.vendor_data["password"]
        }
        response = self.client.post(self.login_url, login_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
