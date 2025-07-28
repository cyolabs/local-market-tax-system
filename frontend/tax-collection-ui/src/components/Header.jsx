import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const Header = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav
      className="d-flex align-items-center justify-content-between px-2 px-md-4"
      style={{ backgroundColor: "#f8f1f1", height: "60px" }}
    >
      {/* Left - Logo and System Name */}
      <div className="d-flex align-items-center">
        <img src="/logo.png" alt="Logo" width="25" className="me-2" />
        <div style={{ lineHeight: "1rem" }}>
          <div 
            className="d-none d-sm-block"
            style={{ fontSize: "0.9rem", fontWeight: "bold" }}
          >
            Local Market Tax Collection System
          </div>
          <div 
            className="d-block d-sm-none"
            style={{ fontSize: "0.8rem", fontWeight: "bold" }}
          >
            Tax System
          </div>
        </div>
      </div>

      {/* Right - Notification + User Info OR Login/Signup */}
      <div className="d-flex align-items-center">
        {currentUser ? (
          <>
            {/* Notification Bell */}
            <div
              className="d-flex align-items-center justify-content-center me-2 me-md-3"
              style={{
                width: "25px",
                height: "25px",
                borderRadius: "50%",
                backgroundColor: "black",
                color: "white",
                fontSize: "14px",
              }}
            >
              <i className="bi bi-bell"></i>
            </div>

            {/* User Info - Hidden on small screens */}
            <div className="d-none d-md-flex flex-column text-end me-2">
              <strong style={{ fontSize: "0.85rem" }}>
                {currentUser.username}
              </strong>
              <small className="text-muted">{currentUser.role}</small>
            </div>

            {/* Profile Picture */}
            <img
              src={
                currentUser.profilePic ||
                process.env.PUBLIC_URL + "/username.png"
              }
              alt="Profile"
              width="35"
              height="35"
              className="rounded-circle me-2"
              style={{ objectFit: "cover" }}
              title={`${currentUser.username} (${currentUser.role})`} // Tooltip for mobile
            />

            {/* Logout Button - Hide if admin, responsive sizing */}
            {currentUser.role !== "admin" && (
              <button 
                onClick={handleLogout} 
                className="btn btn-danger btn-sm d-none d-sm-inline-block"
              >
                Logout
              </button>
            )}

            {/* Mobile Logout - Icon only on very small screens */}
            {currentUser.role !== "admin" && (
              <button 
                onClick={handleLogout} 
                className="btn btn-danger btn-sm d-inline-block d-sm-none p-1"
                title="Logout"
                style={{ width: "32px", height: "32px" }}
              >
                <i className="bi bi-box-arrow-right" style={{ fontSize: "14px" }}></i>
              </button>
            )}
          </>
        ) : (
          <>
            {/* Login/Signup buttons - responsive sizing */}
            <Link 
              to="/login" 
              className="btn btn-outline-dark btn-sm me-2"
            >
              <span className="d-none d-sm-inline">Login</span>
              <i className="bi bi-box-arrow-in-right d-inline d-sm-none"></i>
            </Link>
            <Link 
              to="/register" 
              className="btn btn-danger btn-sm"
            >
              <span className="d-none d-sm-inline">Sign up</span>
              <i className="bi bi-person-plus d-inline d-sm-none"></i>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Header;