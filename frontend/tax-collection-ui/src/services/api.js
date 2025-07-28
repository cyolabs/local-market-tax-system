// frontend/tax-collection-ui/src/services/api.js
const API_BASE_URL = 'https://local-market-tax-system-7fuw.onrender.com/api';

// Get auth token with consistent key
const getAuthToken = () => {
  return localStorage.getItem('access_token'); // Changed to match AuthContext
};

// Get auth headers
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Enhanced fetch with better error handling
const apiRequest = async (url, options = {}) => {
  const config = {
    headers: getAuthHeaders(),
    ...options,
  };

  console.log(`🌐 API Request: ${config.method || 'GET'} ${url}`);
  console.log('🔑 Headers:', config.headers);

  try {
    const response = await fetch(url, config);
    
    console.log(`📡 Response Status: ${response.status} ${response.statusText}`);
    
    // Try to parse JSON response
    let data;
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = { message: await response.text() };
    }
    
    console.log('📦 Response Data:', data);

    if (!response.ok) {
      // Handle different error formats
      const errorMessage = data.error || 
                          data.message || 
                          data.detail || 
                          `HTTP ${response.status}: ${response.statusText}`;
      
      throw new Error(errorMessage);
    }

    return data;

  } catch (error) {
    console.error('❌ API Request Error:', error);
    
    // Network error
    if (!error.response && error.name === 'TypeError') {
      throw new Error('Network error: Unable to connect to server. Please check your internet connection.');
    }
    
    throw error;
  }
};

// Test API connection
export const testApiConnection = async () => {
  console.log('🔍 Testing API connection...');
  try {
    const data = await apiRequest(`${API_BASE_URL}/debug/`, {
      method: 'GET',
    });
    
    console.log('✅ API connection successful');
    return {
      success: true,
      status: 200,
      data: data
    };
  } catch (error) {
    console.error('❌ API connection test failed:', error);
    return {
      success: false,
      error: error.message,
      details: error
    };
  }
};

// Test authenticated API connection
export const testAuthApiConnection = async () => {
  console.log('🔍 Testing authenticated API connection...');
  try {
    const data = await apiRequest(`${API_BASE_URL}/debug-auth/`, {
      method: 'GET',
    });
    
    console.log('✅ Authenticated API connection successful');
    return {
      success: true,
      status: 200,
      data: data
    };
  } catch (error) {
    console.error('❌ Authenticated API connection test failed:', error);
    return {
      success: false,
      error: error.message,
      details: error
    };
  }
};

// Submit feedback
export const submitFeedback = async (subject, message) => {
  try {
    console.log('📤 Submitting feedback:', { subject, message });
    
    const data = await apiRequest(`${API_BASE_URL}/feedback/`, {
      method: 'POST',
      body: JSON.stringify({
        subject: subject.trim(),
        message: message.trim()
      })
    });

    return {
      success: data.success || true,
      message: data.message || 'Feedback submitted successfully',
      feedback: data.feedback
    };

  } catch (error) {
    console.error('❌ Feedback submission error:', error);
    
    return {
      success: false,
      message: error.message || 'Failed to submit feedback. Please try again.'
    };
  }
};

// Get user's feedback history
export const getUserFeedback = async () => {
  try {
    console.log('📤 Fetching user feedback...');
    
    const data = await apiRequest(`${API_BASE_URL}/feedback/my/`, {
      method: 'GET'
    });

    return {
      success: data.success || true,
      data: data.data || [],
      count: data.count || 0
    };

  } catch (error) {
    console.error('❌ Get user feedback error:', error);
    
    return {
      success: false,
      message: error.message || 'Failed to fetch feedback history.',
      data: []
    };
  }
};

// Get tax history
export const getTaxHistory = async (filters = {}) => {
  try {
    console.log('📤 Fetching tax history with filters:', filters);
    
    const queryParams = new URLSearchParams();
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.start_date) queryParams.append('start_date', filters.start_date);
    if (filters.end_date) queryParams.append('end_date', filters.end_date);
    
    const url = `${API_BASE_URL}/tax-history/${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    
    const data = await apiRequest(url, {
      method: 'GET'
    });

    return {
      success: data.success || true,
      data: data.data || [],
      count: data.count || 0,
      message: data.message
    };

  } catch (error) {
    console.error('❌ Get tax history error:', error);
    
    return {
      success: false,
      message: error.message || 'Failed to fetch tax history.',
      data: []
    };
  }
};

// Create M-Pesa payment record
export const createMpesaPayment = async (paymentData) => {
  try {
    console.log('📤 Creating M-Pesa payment record:', paymentData);
    
    const data = await apiRequest(`${API_BASE_URL}/create-mpesa-payment/`, {
      method: 'POST',
      body: JSON.stringify(paymentData)
    });

    return {
      success: data.success || true,
      message: data.message || 'Payment record created successfully',
      transaction_id: data.transaction_id
    };

  } catch (error) {
    console.error('❌ Create M-Pesa payment error:', error);
    
    return {
      success: false,
      message: error.message || 'Failed to create payment record.'
    };
  }
};

// Get registered users (admin only)
export const getRegisteredUsers = async () => {
  try {
    console.log('📤 Fetching registered users...');
    
    const data = await apiRequest(`${API_BASE_URL}/admin/vendors/`, {
      method: 'GET'
    });

    return {
      success: true,
      data: Array.isArray(data) ? data : [],
      count: Array.isArray(data) ? data.length : 0
    };

  } catch (error) {
    console.error('❌ Get registered users error:', error);
    
    return {
      success: false,
      message: error.message || 'Failed to fetch registered users.',
      data: []
    };
  }
};

// Export the base URL for use in other services
export { API_BASE_URL };