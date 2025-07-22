import React, { useState, useEffect } from "react";

import { submitFeedback } from "../services/api";
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
  Modal,
  Spinner
} from "react-bootstrap";
import PaymentModal from "../components/PaymentModal";
import {
  initiateSTKPush,
  getPaymentTransactions,
  downloadReceipt
} from "../services/mpesaService";
import { useAuth } from "../contexts/AuthContext";

const categories = [
  { title: "Fresh products traders", image: "/images/fresh.jpg", amount: 1 },
  { title: "Livestock and meat", image: "/images/livestock.jpg", amount: 1500 },
  { title: "Fish vendors", image: "/images/fish.jpg", amount: 800 },
  { title: "Clothes and textile", image: "/images/clothes.jpg", amount: 600 },
  { title: "Household goods", image: "/images/household.jpg", amount: 700 },
];


const Receipt = ({ transaction, show, onHide }) => {
  if (!transaction) return null;

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Payment Receipt</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="receipt-container">
          <h4 className="text-center mb-4">COUNTY GOVERNMENT RECEIPT</h4>
          
          <Table borderless>
            <tbody>
              <tr>
                <td><strong>Receipt No:</strong></td>
                <td>{transaction.receipt_number}</td>
              </tr>
              <tr>
                <td><strong>Date:</strong></td>
                <td>{new Date(transaction.created_at).toLocaleString()}</td>
              </tr>
              <tr className="border-top">
                <td colSpan="2"><strong>TRANSACTION DETAILS</strong></td>
              </tr>
              <tr>
                <td><strong>Amount:</strong></td>
                <td>KES {transaction.amount.toLocaleString()}</td>
              </tr>
              <tr>
                <td><strong>Category:</strong></td>
                <td>{transaction.account_reference}</td>
              </tr>
              <tr>
                <td><strong>Phone:</strong></td>
                <td>{transaction.phone_number}</td>
              </tr>
              <tr>
                <td><strong>Status:</strong></td>
                <td>
                  <span className={`badge ${
                    transaction.status === 'Completed' ? 'bg-success' : 
                    transaction.status === 'Failed' ? 'bg-danger' : 'bg-warning'
                  }`}>
                    {transaction.status}
                  </span>
                </td>
              </tr>
            </tbody>
          </Table>
          
          <div className="text-center mt-4">
            <p className="text-muted">Thank you for your payment!</p>
            <p className="text-muted">County Government Revenue System</p>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button 
          variant="primary" 
          onClick={() => window.print()}
          className="no-print"
        >
          Print Receipt
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const VendorDashboard = () => {
  const [activeSection, setActiveSection] = useState("payments");
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const { user } = useAuth();
  const [showReceipt, setShowReceipt] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

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
    setError(null);
    
    const response = await getPaymentTransactions();
    console.log('Transactions Response:', response); // Debug
    
    if (response.success) {
      setTransactions(response.data || []);
    } else {
      setError(response.message);
    }
  } catch (err) {
    console.error("Unexpected error:", err);
    setError("An unexpected error occurred");
  } finally {
    setLoading(false);
  }
};
  const handlePaymentSuccess = async (transactionData) => {
    setShowModal(false);
    setSuccess(
      "Payment initiated successfully. Please check your phone to complete the transaction."
    );
    // Wait 5 seconds before refreshing to allow backend to process
    setTimeout(() => {
      fetchTransactions();
    }, 5000);
  };

  const handleViewReceipt = (transaction) => {
    setSelectedTransaction(transaction);
    setShowReceipt(true);
  };

  const handleDownloadReceipt = async (transactionId) => {
    try {
      const result = await downloadReceipt(transactionId);
      if (result.success) {
        const url = window.URL.createObjectURL(result.blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = result.fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to download receipt');
      console.error(err);
    }
  };


const handleFeedbackSubmit = async (e) => {
  e.preventDefault();
  const result = await submitFeedback(feedbackSubject, feedbackMessage);
  if (result.success) {
    setFeedbackSuccess("Thank you for your feedback!");
    setFeedbackSubject("");
    setFeedbackMessage("");
    setTimeout(() => setFeedbackSuccess(""), 3000);
  } else {
    setError(result.message || "Failed to submit feedback");
  }
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
                        disabled={paymentLoading}
                        className="fw-bold px-4 py-2"
                      >
                        {paymentLoading ? (
                          <>
                            <Spinner as="span" animation="border" size="sm" />
                            {" Processing..."}
                          </>
                        ) : "PAY"}
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
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p>Loading transactions...</p>
        </div>
      ) : error ? (
        <Alert variant="danger">
          {error}
          <Button 
            variant="link" 
            onClick={fetchTransactions}
            className="p-0 ms-2"
          >
            Retry
          </Button>
        </Alert>
      ) : transactions.length > 0 ? (
        <Table striped bordered hover responsive>
          {/* Table headers */}
          <tbody>
            {transactions.map((txn) => (
              <tr key={txn.id}>
                {/* Table cells */}
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <Alert variant="info">
          No transactions found. Make a payment to see your history.
        </Alert>
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
        setPaymentLoading={setPaymentLoading}
      />

      <Receipt 
        transaction={selectedTransaction}
        show={showReceipt}
        onHide={() => setShowReceipt(false)}
      />

      {/* Mobile Header */}
      <div
        className="d-block d-md-none text-white px-3 py-3"
        style={{ background: "linear-gradient(to right, #d16ba5, #86a8e7)" }}
      >
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <div className="fw-bold">{user?.full_name || "VENDOR"}</div>
            <small>{user?.business_type || "Vendor"}</small>
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