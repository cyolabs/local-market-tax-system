// frontend/tax-collection-ui/src/services/api.js - Debug Version

const API_BASE_URL = 'https://local-market-tax-system-7fuw.onrender.com/api/';

// Helper function to get auth token
const getAuthToken = () => {
  const token = localStorage.getItem('access_token');
  console.log('Auth token:', token ? 'Token exists' : 'No token found');
  return token;
};

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Tax History API with detailed debugging
export const getTaxHistory = async (filters = {}) => {
  console.log('🔍 getTaxHistory called with filters:', filters);
  
  try {
    const queryParams = new URLSearchParams();
    
    // Add filters if provided
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.start_date) queryParams.append('start_date', filters.start_date);
    if (filters.end_date) queryParams.append('end_date', filters.end_date);
    
    const url = `${API_BASE_URL}/tax-history/${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    console.log('📍 Request URL:', url);
    
    const headers = getAuthHeaders();
    console.log('📋 Request headers:', headers);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: headers,
    });

    console.log('📨 Response status:', response.status);
    console.log('📨 Response ok:', response.ok);
    
    let data;
    try {
      data = await response.json();
      console.log('📦 Response data:', data);
    } catch (jsonError) {
      console.error('❌ JSON parsing error:', jsonError);
      const textResponse = await response.text();
      console.error('📄 Raw response:', textResponse);
      throw new Error('Invalid JSON response from server');
    }
    
    if (!response.ok) {
      console.error('❌ Response not ok:', data);
      throw new Error(data.message || data.error || `HTTP ${response.status}: ${response.statusText}`);
    }
    
    console.log('✅ Success response:', data);
    return {
      success: true,
      data: data.data || [],
      count: data.count || 0
    };
    
  } catch (error) {
    console.error('❌ Tax history fetch error:', error);
    console.error('❌ Error stack:', error.stack);
    return {
      success: false,
      message: error.message || 'Failed to fetch tax history',
      data: []
    };
  }
};

// Submit Feedback API
export const submitFeedback = async (subject, message) => {
  console.log('🔍 submitFeedback called');
  try {
    const response = await fetch(`${API_BASE_URL}/feedback/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        subject,
        message
      }),
    });

    console.log('📨 Feedback response status:', response.status);
    const data = await response.json();
    console.log('📦 Feedback response data:', data);

    if (!response.ok) {
      throw new Error(data.message || data.error || 'Failed to submit feedback');
    }

    return {
      success: true,
      message: data.message || 'Feedback submitted successfully'
    };
  } catch (error) {
    console.error('❌ Feedback submission error:', error);
    return {
      success: false,
      message: error.message || 'Failed to submit feedback'
    };
  }
};

// Simple test function to check if API is reachable
export const testApiConnection = async () => {
  console.log('🔍 Testing API connection...');
  try {
    const response = await fetch(`${API_BASE_URL}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('📨 Test response status:', response.status);
    return {
      success: response.ok,
      status: response.status,
      statusText: response.statusText
    };
  } catch (error) {
    console.error('❌ API connection test failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};