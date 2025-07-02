import React, { useState } from "react";
import { Person, Envelope, Lock } from "react-bootstrap-icons";

export default function RegisterForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    username: "",
    national_id: "",
    business_type: "retail",
    gender: "M",
    market_of_operation: "",
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
    <div
      className="p-4"
      style={{
        backgroundColor: '#ffffff',
        color: '#333',
        borderRadius: '10px',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        maxWidth: '500px',
        width: '100%',
      }}
    >
      <form onSubmit={handleSubmit}>
        <div className="mb-3 position-relative">
          <Person className="position-absolute top-50 start-0 translate-middle-y ms-2 text-muted" />
          <input
            type="text"
            name="full_name"
            placeholder="Full Name"
            required
            onChange={handleChange}
            className="form-control ps-5"
            style={{ backgroundColor: '#f8f9fa' }}
          />
        </div>

        <div className="mb-3 position-relative">
          <Envelope className="position-absolute top-50 start-0 translate-middle-y ms-2 text-muted" />
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            onChange={handleChange}
            className="form-control ps-5"
            style={{ backgroundColor: '#f8f9fa' }}
          />
        </div>

        <div className="mb-3">
          <input
            type="text"
            name="username"
            placeholder="Username"
            required
            onChange={handleChange}
            className="form-control"
            style={{ backgroundColor: '#f8f9fa' }}
          />
        </div>

        <div className="mb-3">
          <input
            type="text"
            name="national_id"
            placeholder="National ID"
            required
            onChange={handleChange}
            className="form-control"
            style={{ backgroundColor: '#f8f9fa' }}
          />
        </div>

        <div className="mb-3">
          <select
            name="business_type"
            required
            onChange={handleChange}
            className="form-select"
            defaultValue=""
          >
            <option value="" disabled>Business Type</option>
            <option value="retail">Retail</option>
            <option value="wholesale">Wholesale</option>
            <option value="service">Service Provider</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="mb-3">
          <select
            name="gender"
            required
            onChange={handleChange}
            className="form-select"
            defaultValue=""
          >
            <option value="" disabled>Gender</option>
            <option value="M">Male</option>
            <option value="F">Female</option>
            <option value="O">Other</option>
          </select>
        </div>

        <div className="mb-3">
          <select
            name="market_of_operation"
            required
            onChange={handleChange}
            className="form-select"
            defaultValue=""
          >
            <option value="" disabled>Market of Operation</option>
            <option value="kapsabet">Kapsabet Market</option>
            <option value="mosoriot">Mosoriot Market</option>
            <option value="nandi_hills">Nandi Hills Market</option>
            <option value="kabiyet">Kabiyet Market</option>
            <option value="kebulonik">Kebulonik Market</option>
            <option value="lessos">Lessos Market</option>
            <option value="kaiboi">Kaiboi Market</option>
            <option value="chepterit">Chepterit Market</option>
            <option value="baraton">Baraton Market</option>
            <option value="kipkaren">Kipkaren Market</option>
          </select>
        </div>

        <div className="mb-3 position-relative">
          <Lock className="position-absolute top-50 start-0 translate-middle-y ms-2 text-muted" />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            onChange={handleChange}
            className="form-control ps-5"
            style={{ backgroundColor: '#f8f9fa' }}
          />
        </div>

        <div className="mb-3 position-relative">
          <Lock className="position-absolute top-50 start-0 translate-middle-y ms-2 text-muted" />
          <input
            type="password"
            name="password2"
            placeholder="Confirm Password"
            required
            onChange={handleChange}
            className="form-control ps-5"
            style={{ backgroundColor: '#f8f9fa' }}
          />
        </div>

        <button
          type="submit"
          className="btn w-100"
          style={{
            backgroundColor: '#b30000',
            color: '#fff',
            fontWeight: 'bold',
          }}
        >
          Create Account
        </button>
      </form>
    </div>
  );
}
