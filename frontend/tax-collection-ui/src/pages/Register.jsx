// src/pages/RegisterPage.jsx
import React from 'react';
import RegisterForm from '../components/RegisterForm';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

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
        <RegisterForm onSubmit={handleRegister} />
        <p className="mt-3">
          Already have an account? <a href="/login" className="text-primary">Login</a>
        </p>
      </div>
    </div>
  );
}
