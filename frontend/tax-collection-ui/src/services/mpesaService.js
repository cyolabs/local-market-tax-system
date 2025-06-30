import api from './api';

export const initiateSTKPush = async (phoneNumber, amount) => {
  try {
    const response = await api.post('/api/mpesa/initiate-stk-push/', {
      phone_number: phoneNumber,
      amount: parseFloat(amount),  // Ensure number format
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Payment failed");
  }
};

export const getPaymentTransactions = async () => {
  try {
    const response = await api.get('/api/payment-transactions/');
    return response.data;
  } catch (error) {
    console.error('Error fetching payment transactions:', error);
    throw error;
  }
};