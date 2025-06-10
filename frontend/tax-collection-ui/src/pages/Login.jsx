import React from 'react';
import { PersonFill, LockFill, Building } from 'react-bootstrap-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../custom.css';

const Login = () => {
  return (
    <div className="signup-container">
      {/* Left Side */}
      <div className="signup-left">
        <div className="logo-circle">
          <img src="/logo.png" alt="Logo" className="logo-icon" />
        </div>
        <h2>Local Market Tax Collection System</h2>
        <img
          src="market-illustration.jpg"
          alt="Market Illustration"
          className="illustration"
          style={{ minWidth: '500px' }}
        />
        <p>Simplify Your Local Tax Payments</p>
      </div>

      {/* Right Side */}
      <div className="signup-right">
        <div className="admin-logo-circle">
          <img src="/icon.png" alt="Building Icon" className="building-icon" />
        </div>
        <h2>Admin Login</h2>
        <form className="signup-form">
          <div className="input-group">
            <PersonFill className="icon" />
            <input type="text" placeholder="Username" required />
          </div>
          <div className="input-group">
            <LockFill className="icon" />
            <input type="password" placeholder="Password" required />
          </div>

          <div className="d-flex justify-content-between w-100 mb-3">
            <div className="form-check">
              <input type="checkbox" className="form-check-input" id="remember" />
              <label className="form-check-label" htmlFor="remember">
                Remember me
              </label>
            </div>
            <a href="#" className="text-primary small text-decoration-none">Forgot password?</a>
          </div>

          <button type="submit" className="signup-btn">Login</button>
        </form>
        <p className="login-link">Don’t have an account? <a href="/register">Sign up</a></p>
      </div>
    </div>
  );
};

export default Login;
