import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Make sure bootstrap-icons is installed

const Header = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-light bg-light justify-content-between px-4 py-2 shadow-sm">
      <div className="d-flex align-items-center">
        <img src="/logo.png" alt="Logo" width="40" className="me-2" />
        <h5 className="mb-0 fw-bold">Local Market Tax Collection System</h5>
      </div>

      <div>
        {currentUser ? (
          <>
            <Link to="/profile" className="btn btn-outline-primary me-2">
              <i className="bi bi-person-circle"></i> {currentUser?.username || 'Profile'}
            </Link>
            <button onClick={handleLogout} className="btn btn-danger">
              Logout
            </button>
          </>
        ) : (
          <>
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
