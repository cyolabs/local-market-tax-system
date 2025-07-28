// src/components/LoginForm.jsx
import React, { useState } from 'react';
import { PersonFill, LockFill, Building } from 'react-bootstrap-icons';
import PropTypes from 'prop-types';

export default function LoginForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    remember: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      username: formData.username,
      password: formData.password
    });
  };

  return (
    <div
      className="p-3 p-sm-4 mx-2 mx-sm-auto"
      style={{
        backgroundColor: '#ffffff',
        color: '#333',
        borderRadius: '10px',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        maxWidth: '400px',
        width: '100%',
      }}
    >
      <form onSubmit={handleSubmit}>
        {/* Username Input */}
        <div className="mb-3 position-relative">
          <PersonFill 
            className="position-absolute ms-2 text-muted"
            size={16}
            style={{ top: '12px', left: '0' }}
          />
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            required
            onChange={handleChange}
            autoComplete="username"
            className="form-control ps-4 ps-sm-5"
            style={{ 
              backgroundColor: '#f8f9fa',
              fontSize: '16px', // Prevents zoom on iOS
              minHeight: '44px' // Better touch target
            }}
          />
        </div>

        {/* Password Input */}
        <div className="mb-3 position-relative">
          <LockFill 
            className="position-absolute ms-2 text-muted"
            size={16}
            style={{ top: '12px', left: '0' }}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            required
            onChange={handleChange}
            autoComplete="current-password"
            className="form-control ps-4 ps-sm-5"
            style={{ 
              backgroundColor: '#f8f9fa',
              fontSize: '16px', // Prevents zoom on iOS
              minHeight: '44px' // Better touch target
            }}
          />
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-3 gap-2 gap-sm-0">
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="remember"
              name="remember"
              checked={formData.remember}
              onChange={handleChange}
              style={{ minWidth: '16px', minHeight: '16px' }} // Better touch target
            />
            <label className="form-check-label text-secondary ms-1" htmlFor="remember">
              Remember me
            </label>
          </div>
          <a 
            href="#" 
            className="text-decoration-none small text-secondary"
            style={{ minHeight: '44px', lineHeight: '44px' }} // Better touch target
          >
            Forgot password?
          </a>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          className="btn w-100"
          style={{
            backgroundColor: '#b30000', // Deep red
            color: '#fff',
            fontWeight: 'bold',
            minHeight: '48px', // Better touch target for mobile
            fontSize: '16px', // Consistent sizing
            borderRadius: '6px'
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
}

LoginForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};