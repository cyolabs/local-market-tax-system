// frontend/tax-collection-ui/src/pages/Login.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { login, testConnection } from '../services/AuthService';
import LoginForm from '../components/LoginForm';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
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

  const handleLogin = async (credentials) => {
    setLoading(true);
    setError('');

    try {
      console.log('🔐 Attempting login...');
      
      const response = await login(credentials);
      
      console.log('✅ Login response:', response.data);
      
      // Use AuthContext login method
      authLogin(response.data);
      
      console.log('✅ Login successful, redirecting...');
      
      // Redirect based on role
      const redirectPath = response.data.role === 'admin' ? '/admin-dashboard' : '/dashboard';
      navigate(redirectPath, { replace: true });

    } catch (error) {
      console.error('❌ Login failed:', error);
      setError(error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-8 col-md-6 col-lg-4">
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
              <h2 className="text-white fw-bold mb-2">Welcome Back</h2>
              <p className="text-light opacity-75">
                Sign in to your account
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

            {/* Error Message */}
            {error && (
              <div className="alert alert-danger mb-3" role="alert">
                <div className="d-flex align-items-center">
                  <span className="me-2">❌</span>
                  <div>
                    <strong>Login Failed</strong><br />
                    <small>{error}</small>
                  </div>
                </div>
              </div>
            )}

            {/* Login Form */}
            <LoginForm onSubmit={handleLogin} />

            {/* Loading State */}
            {loading && (
              <div className="text-center mt-3">
                <div className="spinner-border text-light" role="status">
                  <span className="visually-hidden">Signing in...</span>
                </div>
                <p className="text-light mt-2">Signing you in...</p>
              </div>
            )}

            {/* Sign Up Link */}
            <div className="text-center mt-4">
              <p className="text-light mb-0">
                Don't have an account?{' '}
                <Link 
                  to="/register" 
                  className="text-white fw-bold text-decoration-none"
                  style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}
                >
                  Create Account
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