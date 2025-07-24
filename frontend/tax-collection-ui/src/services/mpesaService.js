import api from './api';

/**
 * Initiates an STK Push and polls for transaction history after delay
 */
export const initiateSTKPush = async (phoneNumber, amount) => {
  try {
    const response = await api.post('/api/mpesa/initiate-stk-push/', {
      phone_number: phoneNumber,
      amount: parseFloat(amount),
    });

    const checkoutRequestId = response.data.data?.checkout_request_id;

    // Wait 7 seconds before checking transaction status
    await delay(7000);

    // Fetch user transactions
    const transactionResult = await getPaymentTransactions();

    return {
      success: true,
      message: 'STK Push initiated and transactions fetched',
      data: transactionResult.data || [],
      transactionId: checkoutRequestId
    };

  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Payment failed"
    };
  }
};

/**
 * Downloads the payment receipt PDF for a given transaction
 */
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

/**
 * Fetches all transactions for the currently logged-in user
 */
export const getPaymentTransactions = async () => {
  try {
    const response = await api.get('/api/mpesa/transactions/history/');
    return {
      success: true,
      data: response.data.data || response.data
    };
  } catch (error) {
    console.error('Transaction History Error:', {
      status: error.response?.status,
      data: error.response?.data,
      config: error.config
    });
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch transactions'
    };
  }
};

/**
 * Utility to delay execution (used for waiting before fetching transactions)
 */
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
