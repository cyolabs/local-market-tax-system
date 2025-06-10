import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../custom.css'; 

export default function Home() {
  return (
    <div>

      {/* Hero Section */}
      <div className="container py-5">
        <div className="row align-items-center">
          {/* Text */}
          <div className="col-md-6 text-center text-md-start">
            <div className="mb-3">
              <img src="/icon.png" alt="Icon" width="50" />
            </div>
            <h2 className="fw-bold">Simplify Your Local Tax Payments</h2>
            <p className="text-muted">
              A <span className="text-primary fw-bold">secure</span> and <span className="text-primary fw-bold">convenient</span> way to manage your taxes — <span className="text-primary">anytime, anywhere</span>.
            </p>
            <Link to="/register" className="btn btn-success btn-lg mt-3">Get Started</Link>
          </div>

          {/* Hero Image */}
          <div className="col-md-6 mt-4 mt-md-0 text-center">
            <img
              src="/hero.png"
              alt="Tax illustration"
              className="img-fluid rounded custom-shadow"
            />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container py-5 bg-light">
        <h4 className="fw-bold text-center mb-4">
          <span className="text-primary">Why</span> <u>Choose us?</u>
        </h4>
        <div className="row align-items-center">
          <div className="col-md-6 text-center mb-4 mb-md-0">
            <img src="/chart.png" alt="Chart" className="img-fluid rounded shadow-sm" />
          </div>
          <div className="col-md-6">
            <h5 className="text-success fw-bold mb-2">✅ Reliable and Secure</h5>
            <p className="text-muted">
              We understand that handling taxes involves sensitive data and critical transactions.
              That’s why our system is built with top-grade security protocols and regular audits to
              ensure your information is always protected. With encrypted data storage and secure
              login processes, you can trust that your personal and financial details are in safe
              hands.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
