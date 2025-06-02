import React from 'react';
import { Person, Envelope, Lock } from 'react-bootstrap-icons';
import '../custom.css';

function Signup() {
  return (
    <div className="signup-container">
      {/* Left Side */}
      <div className="signup-left">
        <div className="logo-circle">
          <img src="/logo.png" alt="Logo" className="logo-icon" />
        </div>
        <h2>Local market Tax collection System</h2>
        <img
          src="/market-illustration.png"
          alt="Market Illustration"
          className="illustration"
        />
        <p>Simplify Your Local Tax Payments</p>
      </div>

      {/* Right Side */}
      <div className="signup-right">
        <div className="admin-logo-circle">
          <img src="/building-icon.png" alt="Building Icon" className="building-icon" />
        </div>
        <h2>Sign Up</h2>
        <form className="signup-form">
          <div className="input-group">
            <Person className="icon" />
            <input type="text" placeholder="Full Name" required />
          </div>
          <div className="input-group">
            <Envelope className="icon" />
            <input type="email" placeholder="Email" required />
          </div>
          <div className="input-group">
            <Lock className="icon" />
            <input type="password" placeholder="Password" required />
          </div>
          <div className="input-group">
            <Lock className="icon" />
            <input type="password" placeholder="Confirm Password" required />
          </div>

          <button type="submit" className="signup-btn">Create Account</button>
        </form>
        <p className="login-link">Already have an account? <a href="/login">Login</a></p>
      </div>
    </div>
  );
}

export default Signup;
