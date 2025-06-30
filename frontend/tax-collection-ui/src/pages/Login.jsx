import React from 'react';
import LoginForm from '../components/LoginForm';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../custom.css';

export default function LoginPage() {
 const handleLogin = async (data) => {
  try {
    const response = await fetch('https://local-market-tax-system-7fuw.onrender.com/login/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.ok) {
      // Store all necessary data
      localStorage.setItem('access_token', result.access);
      localStorage.setItem('refresh_token', result.refresh);
      localStorage.setItem('username', result.username);
      localStorage.setItem('user_role', result.role);
      
      // Force full page reload to reset app state
      window.location.href = result.role === 'admin' 
        ? '/admin-dashboard' 
        : '/vendor-dashboard';
    }
  } catch (error) {
    console.error('Login error:', error);
    alert('Login failed. Please try again.');
  }
};

  return (
    <div className="signup-container">
      <div className="signup-left">
        <div className="logo-circle">
          <img src="/logo.png" alt="Logo" className="logo-icon" />
        </div>
        <h2>Local Market Tax Collection System</h2>
        <img
          src="market-illustration.jpg"
          alt="Market Illustration"
          className="illustration"
          style={{ minWidth: '500px' }}
        />
        <p>Simplify Your Local Tax Payments</p>
      </div>

      <div className="signup-right">
        <div className="admin-logo-circle">
          <img src="/icon.png" alt="Building Icon" className="building-icon" />
        </div>
        <h2>Login</h2>
        <LoginForm onSubmit={handleLogin} />
        <p className="login-link">
          Don’t have an account? <a href="/register">Sign up</a>
        </p>
      </div>
    </div>
  );
}
