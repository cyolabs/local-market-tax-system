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

// Add this to the top of your VendorDashboard.jsx file - Updated fetchTransactions function

const fetchTransactions = async (filters = {}) => {
  try {
    setLoading(true);
    setError(null);
    
    console.log('=== TRANSACTION FETCH DEBUG ===');
    console.log('Fetching transactions with filters:', filters);
    console.log('Current API Base URL:', process.env.REACT_APP_API_URL);
    console.log('================================');
    
    // First, test API connectivity
    try {
      const connectivityTest = await testApiConnectivity();
      console.log('API Connectivity Test:', connectivityTest);
      if (!connectivityTest.success) {
        throw new Error(`API connectivity failed: ${connectivityTest.message}`);
      }
    } catch (connectivityError) {
      console.error('Connectivity test failed:', connectivityError);
      // Continue anyway, maybe it will work
    }
    
    let transactionsFound = false;
    let lastError = null;
    
    // Try to get from your tax_api first
    try {
      console.log('Attempting to fetch from Tax API...');
      const response = await getTaxHistory(filters);
      console.log('Tax History Response:', response);
      
      if (response && response.success && response.data) {
        if (Array.isArray(response.data) && response.data.length > 0) {
          console.log('✅ Tax API returned data:', response.data.length, 'transactions');
          setTransactions(response.data);
          transactionsFound = true;
          return; // Exit early if we got data
        } else {
          console.log('⚠️ Tax API returned empty data array');
          lastError = 'Tax API returned no transactions';
        }
      } else {
        console.log('❌ Tax API response not successful:', response);
        lastError = response?.message || 'Tax API failed';
      }
    } catch (taxApiError) {
      console.error('❌ Tax API error:', taxApiError);
      lastError = `Tax API error: ${taxApiError.message}`;
    }
    
    // If tax API didn't return data, try M-Pesa service
    if (!transactionsFound) {
      try {
        console.log('Attempting to fetch from M-Pesa service...');
        const mpesaResponse = await getPaymentTransactions();
        console.log('M-Pesa Response:', mpesaResponse);
        
        if (mpesaResponse && mpesaResponse.success) {
          const transactions = mpesaResponse.data || [];
          console.log('✅ M-Pesa service returned:', transactions.length, 'transactions');
          setTransactions(transactions);
          transactionsFound = true;
          
          if (transactions.length === 0) {
            setError("No transactions found in M-Pesa service");
          }
        } else {
          console.log('❌ M-Pesa service failed:', mpesaResponse);
          lastError = `M-Pesa service failed: ${mpesaResponse?.message || 'Unknown error'}`;
        }
      } catch (mpesaError) {
        console.error('❌ M-Pesa service error:', mpesaError);
        lastError = `M-Pesa service error: ${mpesaError.message}`;
      }
    }
    
    // If neither service returned data, show appropriate error
    if (!transactionsFound) {
      console.log('❌ No transactions found from any source');
      setTransactions([]);
      
      if (lastError) {
        setError(`Failed to load transactions: ${lastError}`);
      } else {
        setError("No transaction data available from any source");
      }
    }
    
  } catch (err) {
    console.error("❌ Unexpected error in fetchTransactions:", err);
    console.error("Error stack:", err.stack);
    
    // More specific error messages based on error type
    let errorMessage = "An unexpected error occurred while fetching transactions";
    
    if (err.name === 'TypeError') {
      if (err.message.includes('fetch')) {
        errorMessage = "Network error: Unable to connect to the server. Please check your internet connection and try again.";
      } else if (err.message.includes('JSON')) {
        errorMessage = "Server response error: Invalid data format received from server.";
      } else {
        errorMessage = `Type error: ${err.message}`;
      }
    } else if (err.name === 'SyntaxError') {
      errorMessage = "Server response error: Invalid JSON data received.";
    } else if (err.message.includes('CORS')) {
      errorMessage = "Cross-origin error: Server configuration issue. Please contact support.";
    } else if (err.message.includes('timeout')) {
      errorMessage = "Request timeout: Server took too long to respond.";
    } else if (err.message.includes('404')) {
      errorMessage = "API endpoint not found. Please check if the server is running correctly.";
    } else if (err.message.includes('500')) {
      errorMessage = "Server error: Internal server error occurred.";
    } else {
      errorMessage = `Error: ${err.message || 'Unknown error occurred'}`;
    }
    
    setError(errorMessage);
    setTransactions([]);
  } finally {
    setLoading(false);
    console.log('=== TRANSACTION FETCH COMPLETE ===');
  }
};

// Add this useEffect to test API on component mount
useEffect(() => {
  console.log('VendorDashboard mounted - Running diagnostics...');
  
  // Log environment info
  console.log('Environment Info:', {
    NODE_ENV: process.env.NODE_ENV,
    REACT_APP_API_URL: process.env.REACT_APP_API_URL,
    currentOrigin: window.location.origin,
    userAgent: navigator.userAgent
  });
  
  // Test API connectivity when component mounts
  const runDiagnostics = async () => {
    try {
      // Test API connectivity
      const connectivityResult = await testApiConnectivity();
      console.log('API connectivity test result:', connectivityResult);
      
      // Test M-Pesa endpoints
      if (typeof debugMpesaEndpoints === 'function') {
        await debugMpesaEndpoints();
      }
      
      if (!connectivityResult.success) {
        setError(`API connectivity issue: ${connectivityResult.message}`);
      }
    } catch (diagnosticError) {
      console.error('Diagnostic error:', diagnosticError);
    }
  };
  
  runDiagnostics();
}, []);

// Enhanced useEffect for fetching transactions
useEffect(() => {
  console.log('Active section changed to:', activeSection);
  if (activeSection === "tax-history") {
    console.log('Fetching transactions for tax-history section...');
    fetchTransactions();
  }
}, [activeSection]);

// Add a debug button to the tax-history section (you can remove this later)
// Add this right after the "Refresh" button in the tax-history section:

<Button 
  variant="outline-info" 
  size="sm"
  onClick={async () => {
    console.log('Running manual diagnostics...');
    try {
      await testApiConnectivity();
      if (typeof debugMpesaEndpoints === 'function') {
        await debugMpesaEndpoints();
      }
    } catch (e) {
      console.error('Manual diagnostic error:', e);
    }
  }}
  className="ms-2"
>
  Debug API
</Button>

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