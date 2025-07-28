import React from 'react';
import LoginForm from '../components/LoginForm';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../custom.css'; // Optional, if you still use it

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
        localStorage.setItem('access_token', result.access);
        localStorage.setItem('refresh_token', result.refresh);
        localStorage.setItem('username', result.username);
        localStorage.setItem('user_role', result.role);

        window.location.href =
          result.role === 'admin' ? '/admin-dashboard' : '/vendor-dashboard';
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    }
  };

  return (
    <div
      className="d-flex"
      style={{ height: '100vh', overflow: 'hidden' }}
    >
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
          <h2 className="fw-bold mt-2">Login</h2>
        </div>
        <LoginForm onSubmit={handleLogin} />
        <p className="mt-3">
          Don’t have an account? <a href="/register" className="text-primary">Sign up</a>
        </p>
      </div>
    </div>
  );
}
