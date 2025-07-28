// services/mpesaService.js - Updated and fixed

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://local-market-tax-system-7fuw.onrender.com';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  let data;
  try {
    data = await response.json();
  } catch (jsonError) {
    console.error('Failed to parse JSON response:', jsonError);
    throw new Error(`Invalid response format: ${response.status} ${response.statusText}`);
  }
  
  if (!response.ok) {
    throw new Error(data.message || data.error || data.detail || `HTTP ${response.status}: ${response.statusText}`);
  }
  
  return data;
};

// =============================================================================
// MPESA TRANSACTION FUNCTIONS
// =============================================================================

export const getPaymentTransactions = async () => {
  try {
    console.log('getPaymentTransactions called');
    console.log('Using M-Pesa API base URL:', API_BASE_URL);
    
    // Try multiple possible endpoints for M-Pesa transactions
    const possibleEndpoints = [
      '/mpesa/transactions/',
      '/api/mpesa/transactions/',
      '/mpesa_express/transactions/',
      '/api/mpesa_express/transactions/',
      '/api/payments/',
      '/payments/'
    ];
    
    for (const endpoint of possibleEndpoints) {
      try {
        const url = `${API_BASE_URL}${endpoint}`;
        console.log(`Trying M-Pesa endpoint: ${url}`);
        
        const response = await fetch(url, {
          method: 'GET',
          headers: getAuthHeaders(),
        });
        
        console.log(`M-Pesa endpoint ${endpoint} - Status:`, response.status);
        
        if (response.ok) {
          const data = await handleResponse(response);
          console.log(`M-Pesa data from ${endpoint}:`, data);
          
          // Handle different response formats
          let transactions = [];
          if (Array.isArray(data)) {
            transactions = data;
          } else if (data.results && Array.isArray(data.results)) {
            transactions = data.results;
          } else if (data.data && Array.isArray(data.data)) {
            transactions = data.data;
          } else if (data.transactions && Array.isArray(data.transactions)) {
            transactions = data.transactions;
          }
          
          return {
            success: true,
            data: transactions,
            endpoint: endpoint
          };
        } else if (response.status === 404) {
          console.log(`Endpoint ${endpoint} not found, trying next...`);
          continue;
        } else {
          // For other errors, try to get the error message
          try {
            const errorData = await response.json();
            console.error(`Endpoint ${endpoint} error:`, errorData);
          } catch (e) {
            console.error(`Endpoint ${endpoint} error: ${response.status} ${response.statusText}`);
          }
          continue;
        }
      } catch (endpointError) {
        console.error(`Error trying endpoint ${endpoint}:`, endpointError.message);
        continue;
      }
    }
    
    // If all endpoints failed
    throw new Error('No M-Pesa transaction endpoints are available');
    
  } catch (error) {
    console.error('getPaymentTransactions error:', error);
    
    return {
      success: false,
      message: error.message || 'Failed to fetch M-Pesa transactions',
      data: []
    };
  }
};

export const initiateSTKPush = async (phoneNumber, amount, accountReference = 'Market Tax') => {
  try {
    console.log('Initiating STK Push:', { phoneNumber, amount, accountReference });
    
    const url = `${API_BASE_URL}/mpesa/stk-push/`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        phone_number: phoneNumber,
        amount: amount,
        account_reference: accountReference,
        transaction_desc: `Payment for ${accountReference}`
      }),
    });
    
    const data = await handleResponse(response);
    console.log('STK Push response:', data);
    
    return {
      success: true,
      data: data
    };
  } catch (error) {
    console.error('STK Push error:', error);
    return {
      success: false,
      message: error.message || 'Failed to initiate STK Push'
    };
  }
};

export const checkSTKPushStatus = async (checkoutRequestId) => {
  try {
    console.log('Checking STK Push status:', checkoutRequestId);
    
    const url = `${API_BASE_URL}/mpesa/stk-push-status/`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        checkout_request_id: checkoutRequestId
      }),
    });
    
    const data = await handleResponse(response);
    console.log('STK Push status response:', data);
    
    return {
      success: true,
      data: data
    };
  } catch (error) {
    console.error('STK Push status check error:', error);
    return {
      success: false,
      message: error.message || 'Failed to check STK Push status'
    };
  }
};

export const downloadReceipt = async (transactionId) => {
  try {
    console.log('Downloading receipt for transaction:', transactionId);
    
    const url = `${API_BASE_URL}/mpesa/receipt/${transactionId}/`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to download receipt: ${response.status} ${response.statusText}`);
    }
    
    // Handle PDF download
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `receipt-${transactionId}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(downloadUrl);
    
    return {
      success: true,
      message: 'Receipt downloaded successfully'
    };
  } catch (error) {
    console.error('Receipt download error:', error);
    return {
      success: false,
      message: error.message || 'Failed to download receipt'
    };
  }
};

// =============================================================================
// DEBUGGING FUNCTIONS
// =============================================================================

export const debugMpesaEndpoints = async () => {
  console.log('=== M-Pesa Endpoints Debug ===');
  console.log('Base URL:', API_BASE_URL);
  
  const endpoints = [
    '/mpesa/',
    '/mpesa/transactions/',
    '/mpesa/stk-push/',
    '/api/mpesa/',
    '/api/mpesa/transactions/',
    '/mpesa_express/',
    '/mpesa_express/transactions/'
  ];
  
  for (const endpoint of endpoints) {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      console.log(`Testing: ${url}`);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      
      console.log(`${endpoint}: ${response.status} ${response.statusText}`);
      
      if (response.status === 200) {
        try {
          const data = await response.json();
          console.log(`${endpoint} data:`, data);
        } catch (e) {
          console.log(`${endpoint}: Response not JSON`);
        }
      }
    } catch (error) {
      console.log(`${endpoint}: Error - ${error.message}`);
    }
  }
  console.log('=== End Debug ===');
};

// Export the debug function for use in components
export { debugMpesaEndpoints };

export default {
  getPaymentTransactions,
  initiateSTKPush,
  checkSTKPushStatus,
  downloadReceipt,
  debugMpesaEndpoints
};