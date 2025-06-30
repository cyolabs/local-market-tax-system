import api from './api';

export const initiateSTKPush = async (phoneNumber, amount, accountReference = 'TAX_PAYMENT', transactionDesc = 'Tax Payment') => {
  try {
    const response = await api.post('/api/mpesa/initiate-stk-push/', {
      phone_number: phoneNumber,
      amount,
      account_reference: accountReference,
      transaction_desc: transactionDesc
    });
    return response.data;
  } catch (error) {
    console.error('Error initiating STK push:', error);
    throw error;
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