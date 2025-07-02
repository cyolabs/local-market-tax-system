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
      className="p-4"
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
        <div className="mb-3 position-relative">
          <PersonFill className="position-absolute top-50 start-0 translate-middle-y ms-2 text-muted" />
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            required
            onChange={handleChange}
            autoComplete="username"
            className="form-control ps-5"
            style={{ backgroundColor: '#f8f9fa' }}
          />
        </div>

        <div className="mb-3 position-relative">
          <LockFill className="position-absolute top-50 start-0 translate-middle-y ms-2 text-muted" />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            required
            onChange={handleChange}
            autoComplete="current-password"
            className="form-control ps-5"
            style={{ backgroundColor: '#f8f9fa' }}
          />
        </div>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="remember"
              name="remember"
              checked={formData.remember}
              onChange={handleChange}
            />
            <label className="form-check-label text-secondary" htmlFor="remember">
              Remember me
            </label>
          </div>
          <a href="#" className="text-decoration-none small text-secondary">
            Forgot password?
          </a>
        </div>

        <button
          type="submit"
          className="btn w-100"
          style={{
            backgroundColor: '#b30000', // Deep red
            color: '#fff',
            fontWeight: 'bold',
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
