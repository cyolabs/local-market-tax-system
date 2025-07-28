
// src/pages/RegisterPage.jsx - FIXED VERSION
import React, { useState } from 'react';
import RegisterForm from '../components/RegisterForm';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

// API Configuration
const API_BASE_URL = 'https://local-market-tax-system-7fuw.onrender.com/api/';

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (data) => {
    setIsLoading(true);
    setError('');

    try {
      console.log('📝 Attempting registration with:', { 
        username: data.username, 
        email: data.email 
      });

      // FIXED: Use correct API endpoint
      const response = await fetch(`${API_BASE_URL}register/`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          username: data.username,
          email: data.email,
          password: data.password,
          full_name: data.full_name || data.fullName, // Handle different field names
        }),
      });

      console.log('📡 Response status:', response.status);
      
      const result = await response.json();
      console.log('📦 Response data:', result);

      if (response.ok && result.success) {
        console.log('✅ Registration successful!');
        alert('Registration successful! Please login with your credentials.');
        window.location.href = '/login';
        
      } else {
        // Handle API error response
        const errorMessage = result.error || result.message || 'Registration failed';
        setError(errorMessage);
        alert(`Registration failed: ${errorMessage}`);
      }

    } catch (error) {
      console.error('❌ Registration error:', error);
      const errorMessage = 'Network error. Please check your connection and try again.';
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="d-flex" style={{ height: '100vh', overflow: 'hidden' }}>
      {/* Left Panel */}
      <div
        className="d-flex flex-column align-items-center justify-content-center text-white p-4"
        style={{
          backgroundColor: '#754B57',
          flex: 1,
          textAlign: 'center',
        }}
      >
        <div className="mb-3">
          <img src="/logo.png" alt="Logo" className="logo-icon" style={{ width: '60px' }} />
        </div>
        <h2 className="fw-bold mb-3">Local Market Tax Collection System</h2>
        <img
          src="/market-illustration.jpg"
          alt="Market Illustration"
          className="img-fluid mb-3"
          style={{ maxHeight: '400px', borderRadius: '10px' }}
        />
        <p className="fs-5">Simplify Your Local Tax Payments</p>
      </div>

      {/* Right Panel */}
      <div
        className="d-flex flex-column align-items-center justify-content-center p-4"
        style={{
          backgroundColor: '#EEECEC',
          flex: 1,
        }}
      >
        <div className="text-center mb-4">
          <img src="/icon.png" alt="Building Icon" className="building-icon" style={{ width: '40px' }} />
          <h2 className="fw-bold mt-2">Sign Up</h2>
        </div>

        {/* Show error message */}
        {error && (
          <div className="alert alert-danger w-100 mb-3" role="alert">
            {error}
          </div>
        )}

        <RegisterForm onSubmit={handleRegister} isLoading={isLoading} />
        
        <p className="mt-3">
          Already have an account? <a href="/login" className="text-primary">Login</a>
        </p>
      </div>
    </div>
  );
}