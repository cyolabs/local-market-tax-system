// frontend/tax-collection-ui/src/pages/Register.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { register, testConnection } from '../services/AuthService';
import RegisterForm from '../components/RegisterForm';

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [connectionStatus, setConnectionStatus] = useState(null);
  
  const navigate = useNavigate();
  const { currentUser, login: authLogin } = useAuth();

  // Test API connection on component mount
  useEffect(() => {
    const checkConnection = async () => {
      const result = await testConnection();
      setConnectionStatus(result);
      
      if (!result.success) {
        setError('Unable to connect to server. Please check your internet connection.');
      }
    };
    
    checkConnection();
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      const redirectPath = currentUser.role === 'admin' ? '/admin-dashboard' : '/dashboard';
      navigate(redirectPath, { replace: true });
    }
  }, [currentUser, navigate]);

  const handleRegister = async (formData) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      console.log('📝 Attempting registration...');
      
      // Validate passwords match
      if (formData.password !== formData.password2) {
        throw new Error('Passwords do not match');
      }

      // Remove password2 before sending to API
      const { password2, ...registrationData } = formData;
      
      const response = await register(registrationData);
      
      console.log('✅ Registration successful:', response.data);
      
      setSuccess('Account created successfully! You are now logged in.');
      
      // Auto-login after successful registration
      if (response.data.access) {
        authLogin(response.data);
        
        // Redirect after short delay to show success message
        setTimeout(() => {
          const redirectPath = response.data.user?.role === 'admin' ? '/admin-dashboard' : '/dashboard';
          navigate(redirectPath, { replace: true });
        }, 1500);
      } else {
        // If no auto-login, redirect to login page
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 2000);
      }

    } catch (error) {
      console.error('❌ Registration failed:', error);
      
      // Handle different types of errors
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error.response?.data) {
        const data = error.response.data;
        if (typeof data === 'object') {
          // Handle field-specific errors
          const fieldErrors = [];
          for (const [field, errors] of Object.entries(data)) {
            if (Array.isArray(errors)) {
              fieldErrors.push(`${field}: ${errors.join(', ')}`);
            } else if (typeof errors === 'string') {
              fieldErrors.push(`${field}: ${errors}`);
            }
          }
          if (fieldErrors.length > 0) {
            errorMessage = fieldErrors.join('\n');
          }
        } else if (typeof data === 'string') {
          errorMessage = data;
        }
      } else {
        errorMessage = error.message || errorMessage;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-vh-100 d-flex align-items-center justify-content-center py-4"
      style={{
        backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-8 col-lg-6">
            {/* Header */}
            <div className="text-center mb-4">
              <img 
                src="/logo.png" 
                alt="Logo" 
                className="mb-3"
                style={{ height: '60px' }}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <h2 className="text-white fw-bold mb-2">Create Account</h2>
              <p className="text-light opacity-75">
                Join the Local Market Tax System
              </p>
            </div>

            {/* Connection Status */}
            {connectionStatus && !connectionStatus.success && (
              <div className="alert alert-warning mb-3" role="alert">
                <small>
                  ⚠️ Server connection issue. Please check your internet connection.
                </small>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="alert alert-success mb-3" role="alert">
                <div className="d-flex align-items-center">
                  <span className="me-2">✅</span>
                  <div>
                    <strong>Success!</strong><br />
                    <small>{success}</small>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="alert alert-danger mb-3" role="alert">
                <div className="d-flex align-items-center">
                  <span className="me-2">❌</span>
                  <div>
                    <strong>Registration Failed</strong><br />
                    <small style={{ whiteSpace: 'pre-line' }}>{error}</small>
                  </div>
                </div>
              </div>
            )}

            {/* Registration Form */}
            <RegisterForm onSubmit={handleRegister} />

            {/* Loading State */}
            {loading && (
              <div className="text-center mt-3">
                <div className="spinner-border text-light" role="status">
                  <span className="visually-hidden">Creating account...</span>
                </div>
                <p className="text-light mt-2">Creating your account...</p>
              </div>
            )}

            {/* Sign In Link */}
            <div className="text-center mt-4">
              <p className="text-light mb-0">
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className="text-white fw-bold text-decoration-none"
                  style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}
                >
                  Sign In
                </Link>
              </p>
            </div>

            {/* Debug Info (only in development) */}
            {process.env.NODE_ENV === 'development' && connectionStatus && (
              <div className="mt-4">
                <details>
                  <summary className="text-light small">Debug Info</summary>
                  <pre className="text-light small mt-2">
                    {JSON.stringify(connectionStatus, null, 2)}
                  </pre>
                </details>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}