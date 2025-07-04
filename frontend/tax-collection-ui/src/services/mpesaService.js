import api from './api';

export const initiateSTKPush = async (phoneNumber, amount) => {
  try {
    const response = await api.post('/api/mpesa/initiate-stk-push/', {
      phone_number: phoneNumber,
      amount: parseFloat(amount),
    });
    return {
      success: true,
      data: response.data,
      transactionId: response.data.checkout_request_id // Return transaction ID
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Payment failed"
    };
  }
};

export const downloadReceipt = async (transactionId) => {
  try {
    const response = await api.get(`/api/mpesa/receipt/${transactionId}/`, {
      responseType: 'blob'
    });
    return {
      success: true,
      blob: response.data,
      fileName: `receipt_${transactionId}.pdf`
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Receipt download failed"
    };
  }
};

export const getPaymentTransactions = async () => {
  try {
    const response = await api.get('/api/transactions/history/'); // Changed endpoint
    return response.data;
  } catch (error) {
    console.error('Error details:', {
      status: error.response?.status,
      data: error.response?.data,
      config: error.config
    });
    throw new Error(error.response?.data?.message || 'Failed to fetch transactions. Please try again.');
  }
};