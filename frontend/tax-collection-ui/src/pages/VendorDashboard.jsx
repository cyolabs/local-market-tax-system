import React, { useState, useEffect } from "react";
import { submitFeedback, getTaxHistory } from "../services/api";
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
  Spinner,
  Badge
} from "react-bootstrap";
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
                <td>{transaction.mpesa_code || transaction.checkout_id}</td>
              </tr>
              <tr>
                <td><strong>Date:</strong></td>
                <td>{new Date(transaction.timestamp || transaction.created_at).toLocaleString()}</td>
              </tr>
              <tr className="border-top">
                <td colSpan="2"><strong>TRANSACTION DETAILS</strong></td>
              </tr>
              <tr>
                <td><strong>Amount:</strong></td>
                <td>KES {parseFloat(transaction.amount).toLocaleString()}</td>
              </tr>
              <tr>
                <td><strong>Category:</strong></td>
                <td>{transaction.account_reference || transaction.category || "Market Tax"}</td>
              </tr>
              <tr>
                <td><strong>Phone:</strong></td>
                <td>{transaction.phone_number}</td>
              </tr>
              <tr>
                <td><strong>Status:</strong></td>
                <td>
                  <Badge bg={
                    transaction.status === 'Completed' || transaction.status === 'Success' ? 'success' : 
                    transaction.status === 'Failed' ? 'danger' : 'warning'
                  }>
                    {transaction.status}
                  </Badge>
                </td>
              </tr>
              {transaction.mpesa_code && (
                <tr>
                  <td><strong>M-Pesa Code:</strong></td>
                  <td>{transaction.mpesa_code}</td>
                </tr>
              )}
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

  // Tax history filters
  const [statusFilter, setStatusFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handlePayClick = (category) => {
    const url = `https://local-market-tax-system-7fuw.onrender.com/mpesa/?category=${encodeURIComponent(category.title)}&amount=${category.amount}`;
    const popup = window.open(url, '_blank', 'width=500,height=650');
    if (!popup || popup.closed || typeof popup.closed === 'undefined') {
      alert('Popup blocked. Please allow popups for this site.');
    }
  };

 // Add this debug version of fetchTransactions to your VendorDashboard

// Replace just the fetchTransactions function in your VendorDashboard.jsx

// Replace your fetchTransactions function with this improved version
const fetchTransactions = async (filters = {}) => {
  console.log('🔍 fetchTransactions called with filters:', filters);
  
  try {
    setLoading(true);
    setError(null);
    
    const API_BASE_URL = 'https://local-market-tax-system-7fuw.onrender.com/api';
    const token = localStorage.getItem('access_token');
    
    // Build query string from filters
    const queryParams = new URLSearchParams();
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.start_date) queryParams.append('start_date', filters.start_date);
    if (filters.end_date) queryParams.append('end_date', filters.end_date);
    
    const url = `${API_BASE_URL}/tax-history/${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    console.log('📍 Making request to:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
    });

    console.log('📨 Response status:', response.status);
    console.log('📨 Response headers:', Object.fromEntries(response.headers.entries()));

    // First, let's see what we actually got
    const responseText = await response.text();
    console.log('📄 Raw response:', responseText.substring(0, 500));

    // Check if it's actually an HTML error page (common Django issue)
    if (responseText.includes('<!DOCTYPE html>') || responseText.includes('<html')) {
      console.error('❌ Received HTML instead of JSON - likely a 404 or error page');
      
      // Try to extract error information from HTML
      const titleMatch = responseText.match(/<title>(.*?)<\/title>/i);
      const errorTitle = titleMatch ? titleMatch[1] : 'Unknown error';
      
      if (responseText.includes('404') || errorTitle.includes('404')) {
        throw new Error('API endpoint not found. Please check if the backend server is running and the URL is correct.');
      } else if (responseText.includes('500') || errorTitle.includes('500')) {
        throw new Error('Server error occurred. Please try again later.');
      } else {
        throw new Error(`Server returned an error page: ${errorTitle}`);
      }
    }

    // Check for plain text errors
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('text/plain')) {
      console.error('❌ Received plain text instead of JSON');
      
      // If it's a short plain text response, it might be an error message
      if (responseText.length < 200) {
        throw new Error(`Server error: ${responseText}`);
      } else {
        throw new Error('Server returned plain text instead of JSON. This usually means the API endpoint is not configured correctly.');
      }
    }

    // Now try to parse as JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('❌ JSON parse error:', parseError);
      console.error('❌ Response preview:', responseText.substring(0, 200));
      
      // If parse fails, show a helpful error
      throw new Error('Server returned invalid JSON. This usually means there\'s an error in the backend API.');
    }

    // Handle HTTP errors with JSON response
    if (!response.ok) {
      console.error('❌ HTTP error with JSON response:', data);
      
      if (response.status === 401) {
        localStorage.removeItem('access_token');
        throw new Error('Session expired. Please login again.');
      } else if (response.status === 403) {
        throw new Error('You do not have permission to view this data.');
      } else if (response.status === 404) {
        throw new Error('Tax history endpoint not found. Please contact support.');
      }
      
      const errorMessage = data?.message || data?.error || data?.detail || `HTTP ${response.status}`;
      throw new Error(errorMessage);
    }

    // Handle successful response - extract transaction data
    let transactionData = [];
    
    if (data.success === true && data.data) {
      transactionData = Array.isArray(data.data) ? data.data : [];
    } else if (data.success === false) {
      throw new Error(data.message || 'Server indicated failure');
    } else if (Array.isArray(data)) {
      transactionData = data;
    } else if (data.results && Array.isArray(data.results)) {
      transactionData = data.results;
    } else if (data.transactions && Array.isArray(data.transactions)) {
      transactionData = data.transactions;
    } else {
      console.warn('⚠️ Unexpected response structure:', data);
      transactionData = [];
    }
    
    console.log('✅ Successfully loaded transactions:', transactionData.length);
    setTransactions(transactionData);
    
    if (transactionData.length > 0) {
      setSuccess(`Loaded ${transactionData.length} transaction${transactionData.length !== 1 ? 's' : ''}`);
      setTimeout(() => setSuccess(null), 3000);
    }
    
  } catch (err) {
    console.error("❌ Fetch error:", err);
    
    // User-friendly error messages
    let errorMessage = "Failed to load transactions";
    
    if (err.name === 'TypeError' && err.message.includes('Failed to fetch')) {
      errorMessage = "Cannot connect to server. Please check if the backend is running.";
    } else if (err.message.includes('NetworkError')) {
      errorMessage = "Network error. Please check your internet connection.";
    } else if (err.message) {
      errorMessage = err.message;
    }
    
    setError(errorMessage);
  } finally {
    setLoading(false);
  }
};



  const handleFilterChange = () => {
    const filters = {};
    if (statusFilter) filters.status = statusFilter;
    if (startDate) filters.start_date = startDate;
    if (endDate) filters.end_date = endDate;
    
    fetchTransactions(filters);
  };

  const clearFilters = () => {
    setStatusFilter("");
    setStartDate("");
    setEndDate("");
    fetchTransactions();
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await submitFeedback(feedbackSubject, feedbackMessage);
      if (result.success) {
        setFeedbackSuccess("Thank you for your feedback!");
        setFeedbackSubject("");
        setFeedbackMessage("");
        setTimeout(() => setFeedbackSuccess(""), 3000);
      } else {
        setError(result.message || "Failed to submit feedback");
      }
    } catch (error) {
      setError("Failed to submit feedback. Please try again.");
    }
  };

  const handleViewReceipt = (transaction) => {
    setSelectedTransaction(transaction);
    setShowReceipt(true);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Completed': { bg: 'success', text: 'Completed' },
      'Success': { bg: 'success', text: 'Success' },
      'Pending': { bg: 'warning', text: 'Pending' },
      'Failed': { bg: 'danger', text: 'Failed' },
      'Cancelled': { bg: 'secondary', text: 'Cancelled' }
    };
    
    const config = statusConfig[status] || { bg: 'secondary', text: status };
    return <Badge bg={config.bg}>{config.text}</Badge>;
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
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="mb-0">Tax Payment History</h4>
              <Button 
                variant="outline-primary" 
                size="sm"
                onClick={() => fetchTransactions()}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" className="me-2" />
                    Refreshing...
                  </>
                ) : (
                  "Refresh"
                )}
              </Button>
            </div>

            {/* Filters */}
            <Card className="mb-4">
              <Card.Body>
                <h6 className="mb-3">Filter Transactions</h6>
                <Row>
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>Status</Form.Label>
                      <Form.Select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                      >
                        <option value="">All Status</option>
                        <option value="Completed">Completed</option>
                        <option value="Success">Success</option>
                        <option value="Pending">Pending</option>
                        <option value="Failed">Failed</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>Start Date</Form.Label>
                      <Form.Control
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>End Date</Form.Label>
                      <Form.Control
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3} className="d-flex align-items-end">
                    <div className="d-flex gap-2">
                      <Button 
                        variant="primary" 
                        size="sm"
                        onClick={handleFilterChange}
                      >
                        Apply
                      </Button>
                      <Button 
                        variant="outline-secondary" 
                        size="sm"
                        onClick={clearFilters}
                      >
                        Clear
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2">Loading transactions...</p>
              </div>
            ) : error ? (
              <Alert variant="danger">
                {error}
                <Button 
                  variant="link" 
                  onClick={() => fetchTransactions()}
                  className="p-0 ms-2"
                >
                  Retry
                </Button>
              </Alert>
            ) : transactions.length > 0 ? (
              <>
                <div className="mb-3">
                  <small className="text-muted">
                    Showing {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
                  </small>
                </div>
                <div className="table-responsive">
                  <Table striped bordered hover>
                    <thead className="table-dark">
                      <tr>
                        <th>Date</th>
                        <th>Receipt/Transaction ID</th>
                        <th>Amount</th>
                        <th>Category</th>
                        <th>Phone</th>
                        <th>Status</th>
                        <th>M-Pesa Code</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((txn, index) => (
                        <tr key={txn.id || index}>
                          <td>
                            {new Date(
                              txn.timestamp || txn.created_at || txn.transaction_date
                            ).toLocaleDateString('en-GB', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </td>
                          <td>
                            <small className="font-monospace">
                              {txn.receipt_number || txn.transaction_id || txn.checkout_id}
                            </small>
                          </td>
                          <td>
                            <strong>KES {parseFloat(txn.amount).toLocaleString()}</strong>
                          </td>
                          <td>
                            <small>
                              {txn.account_reference || txn.category || "Market Tax"}
                            </small>
                          </td>
                          <td>{txn.phone_number}</td>
                          <td>{getStatusBadge(txn.status)}</td>
                          <td>
                            {txn.mpesa_code ? (
                              <small className="font-monospace text-success">
                                {txn.mpesa_code}
                              </small>
                            ) : (
                              <small className="text-muted">-</small>
                            )}
                          </td>
                          <td>
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => handleViewReceipt(txn)}
                            >
                              View Receipt
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </>
            ) : (
              <Alert variant="info" className="text-center py-5">
                <h5>No transactions found</h5>
                <p className="mb-0">
                  You haven't made any payments yet. Make a payment to see your transaction history.
                </p>
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
            {error && (
              <Alert variant="danger" dismissible onClose={() => setError("")}>
                {error}
              </Alert>
            )}
            <Form onSubmit={handleFeedbackSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Subject:</Form.Label>
                <Form.Control
                  type="text"
                  value={feedbackSubject}
                  onChange={(e) => setFeedbackSubject(e.target.value)}
                  placeholder="Enter feedback subject"
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
                  placeholder="Share your thoughts, suggestions, or concerns..."
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
                  Submit Feedback
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
            src="/username.png"
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
            Tax History
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