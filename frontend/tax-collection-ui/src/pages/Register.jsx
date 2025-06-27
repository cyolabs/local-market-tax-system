// src/pages/RegisterPage.jsx
import React from 'react';
import RegisterForm from '../components/RegisterForm';

export default function RegisterPage() {
  const handleRegister = async (data) => {
    try {
      const response = await fetch('https://local-market-tax-system-7fuw.onrender.com/signup/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        alert('Registration successful!');
        window.location.href = '/login';
      } else {
        alert('Signup failed: ' + JSON.stringify(result));
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
        <img src="market-illustration.jpg" alt="Market" className="illustration" style={{ minWidth: '500px' }} />
        <p>Simplify Your Local Tax Payments</p>
      </div>

      <div className="signup-right">
        <div className="admin-logo-circle">
          <img src="icon.png" alt="Icon" className="building-icon" />
        </div>
        <h2>Sign Up</h2>
        <RegisterForm onSubmit={handleRegister} />
        <p className="login-link">Already have an account? <a href="/login">Login</a></p>
      </div>
    </div>
  );
}
