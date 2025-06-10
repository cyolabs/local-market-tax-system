// src/pages/LoginPage.jsx
import React from 'react';
import LoginForm from '../components/LoginForm';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../custom.css';

export default function LoginPage() {
  const handleLogin = async (data) => {
    try {
      const response = await fetch('http://localhost:8000/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: data.username,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        const { access, refresh, user_type, username } = result;

        // Save tokens and role
        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);
        localStorage.setItem('user_role', user_type);
        localStorage.setItem('username', username);

        // Redirect user based on role
        if (user_type === 'superadmin') {
          window.location.href = '/superadmin-dashboard';
        } else if (user_type === 'admin') {
          window.location.href = '/admin-dashboard';
        } else if (user_type === 'vendor') {
          window.location.href = '/vendor-dashboard';
        } else {
          alert('Unknown role. Contact support.');
        }
      } else {
        alert('Login failed: ' + (result.detail || JSON.stringify(result)));
      }
    } catch (error) {
      alert('Network error. Please try again.');
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
        <h2>Admin Login</h2>
        <LoginForm onSubmit={handleLogin} />
        <p className="login-link">
          Don’t have an account? <a href="/register">Sign up</a>
        </p>
      </div>
    </div>
  );
}
