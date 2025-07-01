import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  ListGroup,
  Alert,
  Table,
  Form,
} from "react-bootstrap";
import PaymentModal from "../components/PaymentModal";
import {
  initiateSTKPush,
  getPaymentTransactions,
} from "../services/mpesaService";
import { useAuth } from "../contexts/AuthContext";

const categories = [
  { title: "Fresh products traders", image: "/images/fresh.jpg", amount: 1000 },
  { title: "Livestock and meat", image: "/images/livestock.jpg", amount: 1500 },
  { title: "Fish vendors", image: "/images/fish.jpg", amount: 800 },
  { title: "Clothes and textile", image: "/images/clothes.jpg", amount: 600 },
  { title: "Clothing and textile", image: "/images/clothing.jpg", amount: 600 },
  { title: "Household goods", image: "/images/household.jpg", amount: 700 },
];

const VendorDashboard = () => {
  const [activeSection, setActiveSection] = useState("payments");
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const { user } = useAuth();

  const [feedbackSubject, setFeedbackSubject] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackSuccess, setFeedbackSuccess] = useState("");

  const handlePayClick = (category) => {
    setSelectedCategory(category);
    setShowModal(true);
  };

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await getPaymentTransactions();
      setTransactions(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch transactions");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    setShowModal(false);
    setSuccess(
      "Payment initiated successfully. Please check your phone to complete the transaction."
    );
    fetchTransactions();
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    // TODO: Send feedback to API
    setFeedbackSuccess("Thank you for your feedback!");
    setFeedbackSubject("");
    setFeedbackMessage("");
    setTimeout(() => setFeedbackSuccess(""), 3000);
  };

  useEffect(() => {
    if (activeSection === "tax-history") {
      fetchTransactions();
    }
  }, [activeSection]);

  const renderContent = () => {
    switch (activeSection) {
      case "payments":
        return (
          <>
            <h4 className="mb-4 text-center">Select payment category</h4>
            {success && (
              <Alert
                variant="success"
                onClose={() => setSuccess(null)}
                dismissible
              >
                {success}
              </Alert>
            )}
            {error && (
              <Alert
                variant="danger"
                onClose={() => setError(null)}
                dismissible
              >
                {error}
              </Alert>
            )}
            <Row>
              {categories.map((item, idx) => (
                <Col xs={6} md={4} className="mb-4" key={idx}>
                  <Card className="text-center shadow-sm h-100">
                    <Card.Body>
                      <div className="mb-3 d-flex justify-content-center">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="rounded-circle"
                          style={{
                            width: "100px",
                            height: "100px",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                      <Card.Title className="mb-2">{item.title}</Card.Title>
                      <Card.Text className="text-muted mb-3">
                        KES {item.amount.toLocaleString()}
                      </Card.Text>
                      <Button
                        variant="outline-dark"
                        onClick={() => handlePayClick(item)}
                        disabled={loading}
                        className="fw-bold px-4 py-2"
                      >
                        {loading ? "Processing..." : "PAY"}
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </>
        );

      case "tax-history":
        return (
          <>
            <h4 className="mb-4 text-center">Tax History</h4>
            {loading ? (
              <div className="text-center">Loading transactions...</div>
            ) : (
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Category</th>
                    <th>Amount (KES)</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th>Receipt</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.length > 0 ? (
                    transactions.map((txn) => (
                      <tr key={txn.id}>
                        <td>{new Date(txn.created_at).toLocaleDateString()}</td>
                        <td>{txn.account_reference}</td>
                        <td>{txn.amount.toLocaleString()}</td>
                        <td>{txn.phone_number}</td>
                        <td>
                          <span
                            className={`badge ${
                              txn.status === "Completed"
                                ? "bg-success"
                                : txn.status === "Failed"
                                ? "bg-danger"
                                : "bg-warning"
                            }`}
                          >
                            {txn.status}
                          </span>
                        </td>
                        <td>{txn.receipt_number || "N/A"}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center">
                        No transactions found
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            )}
          </>
        );

      case "feedback":
        return (
          <>
            <div className="mb-3 d-flex align-items-center">
              <Button
                variant="link"
                className="text-dark p-0 me-2"
                onClick={() => setActiveSection("payments")}
              >
                ←
              </Button>
              <h4 className="mb-0 text-center flex-grow-1">
                Your feedback will be much appreciated
              </h4>
            </div>
            {feedbackSuccess && (
              <Alert variant="success" dismissible onClose={() => setFeedbackSuccess("")}>
                {feedbackSuccess}
              </Alert>
            )}
            <Form onSubmit={handleFeedbackSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Subject:</Form.Label>
                <Form.Control
                  type="text"
                  value={feedbackSubject}
                  onChange={(e) => setFeedbackSubject(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Feedback:</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={feedbackMessage}
                  onChange={(e) => setFeedbackMessage(e.target.value)}
                  required
                />
              </Form.Group>
              <div className="d-flex justify-content-end gap-2">
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => {
                    setFeedbackSubject("");
                    setFeedbackMessage("");
                  }}
                >
                  Clear
                </Button>
                <Button variant="danger" type="submit">
                  Submit
                </Button>
              </div>
            </Form>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <PaymentModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        category={selectedCategory}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Mobile Header */}
      <div
        className="d-block d-md-none text-white px-3 py-3"
        style={{ background: "linear-gradient(to right, #d16ba5, #86a8e7)" }}
      >
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <div className="fw-bold">OLIVIA JEPTUM</div>
            <small>Grocery seller</small>
          </div>
          <img
            src="/images/profile.jpg"
            alt="Profile"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        </div>
        <div className="d-flex justify-content-around mt-3">
          <Button
            size="sm"
            variant={activeSection === "payments" ? "secondary" : "light"}
            onClick={() => setActiveSection("payments")}
          >
            Payments
          </Button>
          <Button
            size="sm"
            variant={activeSection === "feedback" ? "secondary" : "light"}
            onClick={() => setActiveSection("feedback")}
          >
            Feedback
          </Button>
          <Button
            size="sm"
            variant={activeSection === "tax-history" ? "secondary" : "light"}
            onClick={() => setActiveSection("tax-history")}
          >
            Tax history
          </Button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="d-flex flex-column flex-md-row" style={{ maxHeight: "72vh" }}>
        {/* Sidebar for desktop */}
        <div
          className="d-none d-md-flex flex-column"
          style={{
            width: "250px",
            backgroundColor: "#f8f9fa",
            borderRight: "1px solid #dee2e6",
            padding: "1.5rem",
          }}
        >
          <h5 className="mb-4">Dashboard</h5>
          <ListGroup variant="flush">
            <ListGroup.Item
              action
              active={activeSection === "payments"}
              onClick={() => setActiveSection("payments")}
            >
              Payments
            </ListGroup.Item>
            <ListGroup.Item
              action
              active={activeSection === "tax-history"}
              onClick={() => setActiveSection("tax-history")}
            >
              Tax History
            </ListGroup.Item>
            <ListGroup.Item
              action
              active={activeSection === "feedback"}
              onClick={() => setActiveSection("feedback")}
            >
              Feedback
            </ListGroup.Item>
          </ListGroup>
        </div>

        {/* Main Content */}
        <div className="flex-grow-1 bg-white" style={{ overflowY: "auto" }}>
          <Container className="py-4">{renderContent()}</Container>
        </div>
      </div>
    </>
  );
};

export default VendorDashboard;
