import React, { useState } from "react";
import { Person, Envelope, Lock, Building, CreditCard, GeoAlt } from "react-bootstrap-icons";

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
      className="p-3 p-sm-4 mx-2 mx-sm-auto"
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
        {/* Full Name */}
        <div className="mb-3 position-relative">
          <Person 
            className="position-absolute ms-2 text-muted" 
            size={16}
            style={{ top: '12px', left: '0' }}
          />
          <input
            type="text"
            name="full_name"
            placeholder="Full Name"
            required
            onChange={handleChange}
            className="form-control ps-4 ps-sm-5"
            style={{ 
              backgroundColor: '#f8f9fa',
              fontSize: '16px',
              minHeight: '44px'
            }}
          />
        </div>

        {/* Email */}
        <div className="mb-3 position-relative">
          <Envelope 
            className="position-absolute ms-2 text-muted" 
            size={16}
            style={{ top: '12px', left: '0' }}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            onChange={handleChange}
            className="form-control ps-4 ps-sm-5"
            style={{ 
              backgroundColor: '#f8f9fa',
              fontSize: '16px',
              minHeight: '44px'
            }}
          />
        </div>

        {/* Two-column layout for larger screens */}
        <div className="row">
          {/* Username */}
          <div className="col-12 col-md-6 mb-3">
            <input
              type="text"
              name="username"
              placeholder="Username"
              required
              onChange={handleChange}
              className="form-control"
              style={{ 
                backgroundColor: '#f8f9fa',
                fontSize: '16px',
                minHeight: '44px'
              }}
            />
          </div>

          {/* National ID */}
          <div className="col-12 col-md-6 mb-3 position-relative">
            <CreditCard 
              className="position-absolute ms-2 text-muted d-none d-md-block" 
              size={16}
              style={{ top: '12px', left: '0' }}
            />
            <input
              type="text"
              name="national_id"
              placeholder="National ID"
              required
              onChange={handleChange}
              className="form-control ps-md-5"
              style={{ 
                backgroundColor: '#f8f9fa',
                fontSize: '16px',
                minHeight: '44px'
              }}
            />
          </div>
        </div>

        {/* Two-column layout for selects */}
        <div className="row">
          {/* Business Type */}
          <div className="col-12 col-md-6 mb-3 position-relative">
            <Building 
              className="position-absolute ms-2 text-muted d-none d-md-block" 
              size={16}
              style={{ top: '12px', left: '0', zIndex: 5 }}
            />
            <select
              name="business_type"
              required
              onChange={handleChange}
              className="form-select ps-md-5"
              defaultValue=""
              style={{ 
                fontSize: '16px',
                minHeight: '44px'
              }}
            >
              <option value="" disabled>Business Type</option>
              <option value="retail">Retail</option>
              <option value="wholesale">Wholesale</option>
              <option value="service">Service Provider</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Gender */}
          <div className="col-12 col-md-6 mb-3">
            <select
              name="gender"
              required
              onChange={handleChange}
              className="form-select"
              defaultValue=""
              style={{ 
                fontSize: '16px',
                minHeight: '44px'
              }}
            >
              <option value="" disabled>Gender</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
              <option value="O">Other</option>
            </select>
          </div>
        </div>

        {/* Market of Operation */}
        <div className="mb-3 position-relative">
          <GeoAlt 
            className="position-absolute ms-2 text-muted" 
            size={16}
            style={{ top: '12px', left: '0', zIndex: 5 }}
          />
          <select
            name="market_of_operation"
            required
            onChange={handleChange}
            className="form-select ps-4 ps-sm-5"
            defaultValue=""
            style={{ 
              fontSize: '16px',
              minHeight: '44px'
            }}
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

        {/* Password Fields */}
        <div className="row">
          {/* Password */}
          <div className="col-12 col-md-6 mb-3 position-relative">
            <Lock 
              className="position-absolute ms-2 text-muted" 
              size={16}
              style={{ top: '12px', left: '0' }}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              onChange={handleChange}
              className="form-control ps-4 ps-sm-5"
              style={{ 
                backgroundColor: '#f8f9fa',
                fontSize: '16px',
                minHeight: '44px'
              }}
            />
          </div>

          {/* Confirm Password */}
          <div className="col-12 col-md-6 mb-3 position-relative">
            <Lock 
              className="position-absolute ms-2 text-muted" 
              size={16}
              style={{ top: '12px', left: '0' }}
            />
            <input
              type="password"
              name="password2"
              placeholder="Confirm Password"
              required
              onChange={handleChange}
              className="form-control ps-4 ps-sm-5"
              style={{ 
                backgroundColor: '#f8f9fa',
                fontSize: '16px',
                minHeight: '44px'
              }}
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn w-100 mt-2"
          style={{
            backgroundColor: '#b30000',
            color: '#fff',
            fontWeight: 'bold',
            minHeight: '48px',
            fontSize: '16px',
            borderRadius: '6px'
          }}
        >
          Create Account
        </button>
      </form>
    </div>
  );
}