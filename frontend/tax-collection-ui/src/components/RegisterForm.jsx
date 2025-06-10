// src/components/RegisterForm.jsx
import React, { useState } from "react";
import { Person, Envelope, Lock } from "react-bootstrap-icons";
import "../custom.css";

export default function RegisterForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    username: "",
    national_id: "",
    business_type: "retail",
    gender: "M",
    password: "",
    password2: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className="signup-form" onSubmit={handleSubmit}>
      <div className="input-group">
        <Person className="icon" />
        <input
          type="text"
          name="full_name"
          placeholder="Full Name"
          required
          onChange={handleChange}
        />
      </div>
      <div className="input-group">
        <Envelope className="icon" />
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          onChange={handleChange}
        />
      </div>
      <div className="input-group">
        <input
          type="text"
          name="username"
          placeholder="Username"
          required
          onChange={handleChange}
        />
      </div>
      <div className="input-group">
        <input
          type="text"
          name="national_id"
          placeholder="National ID"
          required
          onChange={handleChange}
        />
      </div>
      <div className="input-group">
        <select
          name="business_type"
          required
          onChange={handleChange}
          defaultValue=""
        >
          <option value="" disabled>
            Business Type
          </option>
          <option value="retail">Retail</option>
          <option value="wholesale">Wholesale</option>
          <option value="service">Service Provider</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="input-group">
        <select name="gender" required onChange={handleChange} defaultValue="">
          <option value="" disabled>
            Gender
          </option>
          <option value="M">Male</option>
          <option value="F">Female</option>
          <option value="O">Other</option>
        </select>
      </div>

      <div className="input-group">
        <Lock className="icon" />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          onChange={handleChange}
        />
      </div>
      <div className="input-group">
        <Lock className="icon" />
        <input
          type="password"
          name="password2"
          placeholder="Confirm Password"
          required
          onChange={handleChange}
        />
      </div>
      <button type="submit" className="signup-btn">
        Create Account
      </button>
    </form>
  );
}
