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
      className="d-flex align-items-center justify-content-between px-4"
      style={{ backgroundColor: "#f8f1f1", height: "60px" }}
    >
      {/* Left - Logo and System Name */}
      <div className="d-flex align-items-center">
        <img src="/logo.png" alt="Logo" width="25" className="me-2" />
        <div style={{ lineHeight: "1rem" }}>
          <div style={{ fontSize: "0.9rem", fontWeight: "bold" }}>
            Local Market Tax
          </div>
          <div style={{ fontSize: "0.8rem" }}>Collection System</div>
        </div>
      </div>

      {/* Right - Notification + User Info OR Login/Signup */}
      <div className="d-flex align-items-center">
        {currentUser ? (
          <>
            {/* Notification Bell */}
            <div
              className="d-flex align-items-center justify-content-center me-3"
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

            {/* User Info */}
            <div className="d-flex flex-column text-end me-2">
              <strong style={{ fontSize: "0.85rem" }}>
                {currentUser.username}
              </strong>
              <small className="text-muted">{currentUser.role}</small>
            </div>
            <img
              src={
                currentUser.profilePic ||
                process.env.PUBLIC_URL + "/username.png"
              }
              alt="Profile"
              width="35"
              height="35"
              className="rounded-circle"
              style={{ objectFit: "cover" }}
            />

            {/* ✅ Hide Logout if user is admin */}
            {currentUser.role !== "admin" && (
              <button onClick={handleLogout} className="btn btn-danger ms-3">
                Logout
              </button>
            )}
          </>
        ) : (
          <>
            {/* Shown when not logged in */}
            <Link to="/login" className="btn btn-outline-dark me-2">
              Login
            </Link>
            <Link to="/register" className="btn btn-danger">
              Sign up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Header;
