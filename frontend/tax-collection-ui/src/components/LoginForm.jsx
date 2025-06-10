// src/components/LoginForm.jsx
import React, { useState } from 'react';
import { PersonFill, LockFill } from 'react-bootstrap-icons';

export default function LoginForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    remember: false,
  });

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className="signup-form" onSubmit={handleSubmit}>
      <div className="input-group">
        <PersonFill className="icon" />
        <input
          type="text"
          name="username"
          placeholder="Username"
          required
          onChange={handleChange}
        />
      </div>

      <div className="input-group">
        <LockFill className="icon" />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          onChange={handleChange}
        />
      </div>

      <div className="d-flex justify-content-between w-100 mb-3">
        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="remember"
            name="remember"
            onChange={handleChange}
          />
          <label className="form-check-label" htmlFor="remember">
            Remember me
          </label>
        </div>
        <a href="#" className="text-primary small text-decoration-none">
          Forgot password?
        </a>
      </div>

      <button type="submit" className="signup-btn">Login</button>
    </form>
  );
}
