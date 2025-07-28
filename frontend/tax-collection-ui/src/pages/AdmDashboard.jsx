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
  Modal,
  Spinner,
  Badge,
  Tab,
  Tabs
} from "react-bootstrap";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from "recharts";

const initialUsers = [
   {
    id: 1,
    full_name: "Tax Api",
    email: "taxapi@gmail.com",
    phone: "254709023456",
    business_type: "Fresh products trader",
    status: "Active",
    created_at: "2025-07-15T10:30:00Z",
    last_login: "2025-07-28T14:20:00Z"
  },
  {
    id: 1,
    full_name: "Rylee Meyers",
    email: "qohexi@mailinator.com",
    phone: "11303556666",
    business_type: "other",
    status: "Active",
    created_at: "2025-07-27T16:56:42.399646Z",
    last_login: "2025-07-27T16:56:39.705151Z"
  },
  {
    id: 2,
    full_name: "Debrah",
    email: "Debrah@gmail.com",
    phone: "35683935",
    business_type: "wholesale",
    status: "Active",
    created_at: "2025-07-27T17:11:55.012796Z",
    last_login: "2025-07-27T17:11:53.158872Z"
  },
  {
    id: 3,
    full_name: "Ian kip",
    email: "ian@gmail.com",
    phone: "36374859855",
    business_type: "wholesale",
    status: "Active",
    created_at: "2025-07-27T17:14:53.002337Z",
    last_login: "2025-07-27T17:14:50.545723Z"
  },
  {
    id: 4,
    full_name: "Destiny Kent",
    email: "ruxynimy@mailinator.com",
    phone: "56515111",
    business_type: "retail",
    status: "Active",
    created_at: "2025-07-27T17:23:04.005208Z",
    last_login: "2025-07-27T17:23:01.724952Z"
  },
  {
    id: 5,
    full_name: "Tana Stuart",
    email: "kozuzynip@mailinator.com",
    phone: "5461455611",
    business_type: "other",
    status: "Active",
    created_at: "2025-07-27T19:33:40.024128Z",
    last_login: "2025-07-27T19:33:38.022203Z"
  },
  {
    id: 6,
    full_name: "Jane Doe",
    email: "jane@example.com",
    phone: "12345678",
    business_type: "retail",
    status: "Active",
    created_at: "2025-07-28T02:27:35.554614Z",
    last_login: "2025-07-28T02:27:32.963440Z"
  },
  {
    id: 7,
    full_name: "Coby Lindsay",
    email: "lenuq@mailinator.com",
    phone: "1365899999",
    business_type: "service",
    status: "Active",
    created_at: "2025-07-28T04:22:45.377282Z",
    last_login: "2025-07-28T04:22:43.179541Z"
  },
  {
    id: 8,
    full_name: "Blaine Combs",
    email: "gydypehotu@mailinator.com",
    phone: "1536555555",
    business_type: "wholesale",
    status: "Active",
    created_at: "2025-07-28T06:36:25.978707Z",
    last_login: "2025-07-28T06:36:23Z"
  },
  {
    id: 9,
    full_name: "Aloo",
    email: "aloo@gmail.com",
    phone: "57296528",
    business_type: "service",
    status: "Active",
    created_at: "2025-07-28T06:45:11.176541Z",
    last_login: "2025-07-28T06:45:08.831025Z"
  },
  {
    id: 10,
    full_name: "",
    email: "admin@2025.com",
    phone: "",
    business_type: "",
    status: "Active",
    created_at: "2025-07-27T03:06:34.328774Z",
    last_login: "2025-07-28T02:57:02.838101Z"
  },
  {
    id: 11,
    full_name: "Jordan Garcia",
    email: "ruzu@mailinator.com",
    phone: "155555555555",
    business_type: "retail",
    status: "Active",
    created_at: "2025-07-28T08:36:51.372548Z",
    last_login: "2025-07-28T08:36:49Z"
  },
  {
    id: 12,
    full_name: "Lillian Sparks",
    email: "gyga@mailinator.com",
    phone: "1365851456",
    business_type: "other",
    status: "Active",
    created_at: "2025-07-28T08:50:25.266946Z",
    last_login: "2025-07-28T08:50:22Z"
  }
];


const reportTypes = [
  { id: 1, name: "User Registration Report", type: "users" },
  { id: 2, name: "Transaction Summary Report", type: "transactions" },
  { id: 3, name: "Revenue Analysis Report", type: "revenue" },
  { id: 4, name: "Feedback Summary Report", type: "feedback" },
];
// const testApiConnectivity = async () => {
//   try {
//     const response = await fetch("https://local-market-tax-system-7fuw.onrender.com/api/ping/");
//     if (!response.ok) {
//       throw new Error("API connectivity test failed");
//     }
//     const data = await response.json();
//     console.log("API connectivity success:", data);
//   } catch (error) {
//     console.error("API connectivity error:", error);
//   }
// };
const initialTransactions = [
  {
    id: 1,
    user_id: 1,
    user_name: "John Doe",
    amount: 1.00,
    category: "Fresh products trader",
    phone: "254794917386",
    mpesa_code: "TGR9RNERHL",
    status: "Completed",
    created_at: "2025-07-27T16:57:17.948517Z",
    receipt_number: "RCP001",
    checkout_id: "ws_CO_270720251957118794917386"
  },
  {
    id: 2,
    user_id: 2,
    user_name: "Mary Smith",
    amount: 1.00,
    category: "Livestock and meat",
    phone: "254707418744",
    mpesa_code: "TGR9RNQH15",
    status: "Completed",
    created_at: "2025-07-27T16:58:37.423874Z",
    receipt_number: "RCP002",
    checkout_id: "ws_CO_270720251958148707418744"
  },
  {
    id: 3,
    user_id: 1,
    user_name: "John Doe",
    amount: 1.00,
    category: "Fresh products trader",
    phone: "254794917386",
    mpesa_code: "TGR5RO6F2V",
    status: "Completed",
    created_at: "2025-07-27T17:00:26.412260Z",
    receipt_number: "RCP003",
    checkout_id: "ws_CO_270720252000204794917386"
  },
  {
    id: 4,
    user_id: 2,
    user_name: "Mary Smith",
    amount: 0.00,
    category: "Livestock and meat",
    phone: "254707418744",
    mpesa_code: "",
    status: "Failed",
    created_at: "2025-07-27T17:01:11.681868Z",
    receipt_number: "RCP004",
    checkout_id: "ws_CO_270720252000459707418744"
  },
  {
    id: 5,
    user_id: 1,
    user_name: "John Doe",
    amount: 1.00,
    category: "Fresh products trader",
    phone: "254794917386",
    mpesa_code: "TGR6RRRZUK",
    status: "Completed",
    created_at: "2025-07-27T17:15:59.133001Z",
    receipt_number: "RCP005",
    checkout_id: "ws_CO_270720252015266794917386"
  },
  {
    id: 6,
    user_id: 2,
    user_name: "Mary Smith",
    amount: 1.00,
    category: "Livestock and meat",
    phone: "254707418744",
    mpesa_code: "TGR1RSBVVX",
    status: "Completed",
    created_at: "2025-07-27T17:18:21.911930Z",
    receipt_number: "RCP006",
    checkout_id: "ws_CO_270720252018093707418744"
  },
  {
    id: 7,
    user_id: 1,
    user_name: "John Doe",
    amount: 1.00,
    category: "Fresh products trader",
    phone: "254794917386",
    mpesa_code: "TGR9RSPWRF",
    status: "Completed",
    created_at: "2025-07-27T17:20:10.608984Z",
    receipt_number: "RCP007",
    checkout_id: "ws_CO_270720252020042794917386"
  },
  {
    id: 8,
    user_id: 2,
    user_name: "Mary Smith",
    amount: 1.00,
    category: "Livestock and meat",
    phone: "254707418744",
    mpesa_code: "TGR2RSTI5K",
    status: "Pending",
    created_at: "2025-07-27T17:20:36.087169Z",
    receipt_number: "RCP008",
    checkout_id: "ws_CO_270720252020227707418744"
  },
  {
    id: 9,
    user_id: 1,
    user_name: "John Doe",
    amount: 1.00,
    category: "Fresh products trader",
    phone: "254794917386",
    mpesa_code: "TGR8RTOTXQ",
    status: "Completed",
    created_at: "2025-07-27T17:24:37.637446Z",
    receipt_number: "RCP009",
    checkout_id: "ws_CO_270720252024307794917386"
  },
  {
    id: 10,
    user_id: 1,
    user_name: "John Doe",
    amount: 1.00,
    category: "Fresh products trader",
    phone: "254794917386",
    mpesa_code: "TGR5S1TNUJ",
    status: "Completed",
    created_at: "2025-07-27T18:05:47.509479Z",
    receipt_number: "RCP010",
    checkout_id: "ws_CO_270720252105415794917386"
  },
  {
    id: 11,
    user_id: 1,
    user_name: "John Doe",
    amount: 1.00,
    category: "Fresh products trader",
    phone: "254794917386",
    mpesa_code: "TGR0SFEX9G",
    status: "Completed",
    created_at: "2025-07-27T19:56:19.120261Z",
    receipt_number: "RCP011",
    checkout_id: "ws_CO_270720252256090794917386"
  },
  {
    id: 12,
    user_id: 1,
    user_name: "John Doe",
    amount: 1.00,
    category: "Fresh products trader",
    phone: "254794917386",
    mpesa_code: "TGS4STJAGM",
    status: "Completed",
    created_at: "2025-07-28T04:23:27.099566Z",
    receipt_number: "RCP012",
    checkout_id: "ws_CO_280720250723216794917386"
  },
  {
    id: 13,
    user_id: 2,
    user_name: "Mary Smith",
    amount: 1.00,
    category: "Livestock and meat",
    phone: "254707418744",
    mpesa_code: "TGS7TCDKLR",
    status: "Completed",
    created_at: "2025-07-28T06:47:04.006200Z",
    receipt_number: "RCP013",
    checkout_id: "ws_CO_280720250946541707418744"
  }
];


const initialFeedback = [
  {
    id: 1,
    user_id: 1,
    user_name: "John Doe",
    subject: "Payment Process",
    message: "The payment process is very smooth and user-friendly. Thank you for making it so easy to pay our taxes!",
    status: "Read",
    created_at: "2025-07-28T10:30:00Z",
    created_at: "2025-07-28T10:30:00Z",
    priority: "Low"
  },
  {
    id: 2,
    user_id: 2,
    user_name: "Mary Smith",
    subject: "System Issue",
    message: "I experienced some delays in payment confirmation yesterday. The system took about 10 minutes to confirm my payment. Please look into this issue.",
    status: "Unread",
    created_at: "2024-07-27T14:20:00Z",
    priority: "High"
  },
  {
    id: 3,
    user_id: 3,
    user_name: "Peter Johnson",
    subject: "Feature Request",
    message: "It would be great to have monthly payment summaries sent via email. This would help us keep better records of our tax payments.",
    status: "In Review",
    created_at: "2024-07-26T16:45:00Z",
    priority: "Medium"
  },
  {
    id: 4,
    user_id: 4,
    user_name: "Alice Brown",
    subject: "Mobile App Request",
    message: "Please consider developing a mobile app for easier access to the payment system when we're at the market.",
    status: "Unread",
    created_at: "2024-07-25T11:30:00Z",
    priority: "Medium"
  },
  {
    id: 5,
    user_id: 5,
    user_name: "David Wilson",
    subject: "Receipt Issue",
    message: "I couldn't download my receipt after payment. Had to contact support to get it resolved.",
    status: "Read",
    created_at: "2024-07-24T09:15:00Z",
    priority: "High"
  }
];

// Chart data for analytics
const revenueData = [
  { month: 'Jan', revenue: 45000, transactions: 120, users: 15 },
  { month: 'Feb', revenue: 52000, transactions: 140, users: 18 },
  { month: 'Mar', revenue: 48000, transactions: 130, users: 22 },
  { month: 'Apr', revenue: 61000, transactions: 160, users: 25 },
  { month: 'May', revenue: 55000, transactions: 145, users: 28 },
  { month: 'Jun', revenue: 67000, transactions: 180, users: 32 },
  { month: 'Jul', revenue: 72000, transactions: 190, users: 35 }
];

const categoryData = [
  { name: 'Fresh products', value: 35, amount: 52500, color: '#8884d8' },
  { name: 'Livestock and meat', value: 25, amount: 37500, color: '#82ca9d' },
  { name: 'Fish vendors', value: 20, amount: 16000, color: '#ffc658' },
  { name: 'Clothes and textile', value: 15, amount: 9000, color: '#ff7300' },
  { name: 'Household goods', value: 5, amount: 3500, color: '#00ff88' }
];

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const [users, setUsers] = useState(initialUsers);
  const [transactions, setTransactions] = useState(initialTransactions);
  const [feedback, setFeedback] = useState(initialFeedback);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalType, setModalType] = useState("");

  // Form states
  const [userForm, setUserForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    business_type: "",
    status: "Active"
  });

  // Filters
  const [statusFilter, setStatusFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  // Mock API functions with simulated delays
  const simulateApiCall = async (duration = 1000) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, duration));
    setLoading(false);
  };

  const showAlert = (message, type = "success") => {
    if (type === "success") {
      setSuccess(message);
      setTimeout(() => setSuccess(null), 3000);
    } else {
      setError(message);
      setTimeout(() => setError(null), 3000);
    }
  };


    // User management functions
  const deleteUser = async (userId) => {
    await simulateApiCall(1000);
    const userToDelete = users.find(u => u.id === userId);
    setUsers(users.filter(user => user.id !== userId));
    setTransactions(transactions.filter(txn => txn.user_id !== userId));
    setFeedback(feedback.filter(fb => fb.user_id !== userId));
    showAlert(`User ${userToDelete?.full_name} deleted successfully`);
  };

  const updateUserStatus = async (userId, newStatus) => {
    await simulateApiCall(500);
    setUsers(users.map(user => 
      user.id === userId ? { ...user, status: newStatus } : user
    ));
    showAlert(`User status updated to ${newStatus}`);
  };

  const createOrUpdateUser = async () => {
    await simulateApiCall(1000);
    
    if (selectedItem) {
      // Update existing user
      setUsers(users.map(user => 
        user.id === selectedItem.id 
          ? { ...user, ...userForm }
          : user
      ));
      showAlert("User updated successfully");
    } else {
      // Create new user
      const newUser = {
        id: Math.max(...users.map(u => u.id)) + 1,
        ...userForm,
        created_at: new Date().toISOString(),
        last_login: "Never"
      };
      setUsers([...users, newUser]);
      showAlert("User created successfully");
    }
    
    closeModal();
  };

  // Transaction management functions
  const updateTransactionStatus = async (transactionId, newStatus) => {
    await simulateApiCall(500);
    setTransactions(transactions.map(txn => 
      txn.id === transactionId 
        ? { ...txn, status: newStatus }
        : txn
    ));
    showAlert(`Transaction status updated to ${newStatus}`);
  };

  // Feedback management functions
  const updateFeedbackStatus = async (feedbackId, newStatus) => {
    await simulateApiCall(500);
    setFeedback(feedback.map(fb => 
      fb.id === feedbackId 
        ? { ...fb, status: newStatus }
        : fb
    ));
    showAlert(`Feedback status updated to ${newStatus}`);
  };

  const deleteFeedback = async (feedbackId) => {
    await simulateApiCall(500);
    setFeedback(feedback.filter(fb => fb.id !== feedbackId));
    showAlert("Feedback deleted successfully");
  };

  // Modal functions
  const openUserModal = (user = null) => {
    setModalType("user");
    setSelectedItem(user);
    if (user) {
      setUserForm({
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
        business_type: user.business_type,
        status: user.status
      });
    } else {
      setUserForm({
        full_name: "",
        email: "",
        phone: "",
        business_type: "",
        status: "Active"
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedItem(null);
    setModalType("");
  };

  // Filter functions
  const getFilteredTransactions = () => {
    return transactions.filter(txn => {
      if (statusFilter && txn.status !== statusFilter) return false;
      if (categoryFilter && txn.category !== categoryFilter) return false;
      if (startDate && new Date(txn.created_at) < new Date(startDate)) return false;
      if (endDate && new Date(txn.created_at) > new Date(endDate)) return false;
      return true;
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Completed': { bg: 'success', text: 'Completed' },
      'Success': { bg: 'success', text: 'Success' },
      'Pending': { bg: 'warning', text: 'Pending' },
      'Failed': { bg: 'danger', text: 'Failed' },
      'Active': { bg: 'success', text: 'Active' },
      'Inactive': { bg: 'secondary', text: 'Inactive' },
      'Read': { bg: 'success', text: 'Read' },
      'Unread': { bg: 'danger', text: 'Unread' },
      'In Review': { bg: 'warning', text: 'In Review' }
    };
    
    const config = statusConfig[status] || { bg: 'secondary', text: status };
    return <Badge bg={config.bg}>{config.text}</Badge>;
  };

  // Statistics calculations
  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.status === "Active").length,
    totalRevenue: transactions
      .filter(t => t.status === "Completed")
      .reduce((sum, t) => sum + t.amount, 0),
    totalTransactions: transactions.length,
    completedTransactions: transactions.filter(t => t.status === "Completed").length,
    pendingTransactions: transactions.filter(t => t.status === "Pending").length,
    failedTransactions: transactions.filter(t => t.status === "Failed").length,
    unreadFeedback: feedback.filter(f => f.status === "Unread").length,
    highPriorityFeedback: feedback.filter(f => f.priority === "High").length,
    availableReports: reportTypes.length,
    lastReportDownload: "2024-07-28"
  };

  const generateMockReport = (reportType) => {
  let csvContent = "";
  
  switch(reportType) {
    case "users":
      csvContent = "ID,Full Name,Email,Phone,Business Type,Status,Created At,Last Login\n";
      users.forEach(user => {
        csvContent += `${user.id},"${user.full_name}","${user.email}","${user.phone}","${user.business_type}","${user.status}","${user.created_at}","${user.last_login}"\n`;
      });
      break;
      
    case "transactions":
      csvContent = "ID,User Name,Amount,Category,Phone,Status,M-Pesa Code,Date,Receipt Number\n";
      transactions.forEach(txn => {
        csvContent += `${txn.id},"${txn.user_name}",${txn.amount},"${txn.category}","${txn.phone}","${txn.status}","${txn.mpesa_code}","${txn.created_at}","${txn.receipt_number}"\n`;
      });
      break;
      
    case "revenue":
      csvContent = "Month,Revenue,Transactions,Users\n";
      revenueData.forEach(item => {
        csvContent += `${item.month},${item.revenue},${item.transactions},${item.users}\n`;
      });
      break;
      
    case "feedback":
      csvContent = "ID,User Name,Subject,Message,Status,Priority,Created At\n";
      feedback.forEach(fb => {
        csvContent += `${fb.id},"${fb.user_name}","${fb.subject}","${fb.message.replace(/"/g, '""')}","${fb.status}","${fb.priority}","${fb.created_at}"\n`;
      });
      break;
      
  }
  
  return csvContent;
};

const downloadReport = (reportType) => {
  setLoading(true);
  
  setTimeout(() => {
    const csvContent = generateMockReport(reportType);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${reportType}_report_${new Date().toISOString().slice(0,10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setLoading(false);
    showAlert(`${reportType} report downloaded successfully`);
  }, 1500);
};

    const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return (
          <>
            <h4 className="mb-4 text-center">System Overview & Analytics</h4>
            
            {/* Statistics Cards */}
            <Row className="mb-4">
              <Col md={3} className="mb-3">
                <Card className="text-center shadow-sm h-100">
                  <Card.Body>
                    <Card.Title className="text-primary">Total Users</Card.Title>
                    <h2 className="text-primary">{stats.totalUsers}</h2>
                    <Card.Text className="text-muted">
                      {stats.activeUsers} Active
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3} className="mb-3">
                <Card className="text-center shadow-sm h-100">
                  <Card.Body>
                    <Card.Title className="text-success">Total Revenue</Card.Title>
                    <h2 className="text-success">KES {stats.totalRevenue.toLocaleString()}</h2>
                    <Card.Text className="text-muted">
                      This Month
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3} className="mb-3">
                <Card className="text-center shadow-sm h-100">
                  <Card.Body>
                    <Card.Title className="text-info">Transactions</Card.Title>
                    <h2 className="text-info">{stats.totalTransactions}</h2>
                    <Card.Text className="text-muted">
                      {stats.completedTransactions} Completed
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3} className="mb-3">
                <Card className="text-center shadow-sm h-100">
                  <Card.Body>
                    <Card.Title className="text-warning">Pending Items</Card.Title>
                    <h2 className="text-warning">{stats.pendingTransactions + stats.unreadFeedback}</h2>
                    <Card.Text className="text-muted">
                      Need Attention
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Charts */}
            <Row className="mb-4">
              <Col lg={8} className="mb-4">
                <Card>
                  <Card.Header>
                    <h5 className="mb-0">Revenue & User Growth Trend</h5>
                  </Card.Header>
                  <Card.Body>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Legend />
                        <Line 
                          yAxisId="left"
                          type="monotone" 
                          dataKey="revenue" 
                          stroke="#8884d8" 
                          strokeWidth={2}
                          name="Revenue (KES)"
                        />
                        <Line 
                          yAxisId="right"
                          type="monotone" 
                          dataKey="users" 
                          stroke="#82ca9d" 
                          strokeWidth={2}
                          name="Total Users"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={4} className="mb-4">
                <Card>
                  <Card.Header>
                    <h5 className="mb-0">Revenue by Category</h5>
                  </Card.Header>
                  <Card.Body>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Recent Activity */}
            <Row>
              <Col lg={6} className="mb-4">
                <Card>
                  <Card.Header>
                    <h5 className="mb-0">Recent Transactions</h5>
                  </Card.Header>
                  <Card.Body>
                    <div className="table-responsive">
                      <Table size="sm">
                        <thead>
                          <tr>
                            <th>User</th>
                            <th>Amount</th>
                            <th>Category</th>
                            <th>Phone</th>
                            <th>Status</th>
                            <th>M-Pesa Code</th>
                            <th>Date</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getFilteredTransactions().slice(0, 5).map(txn => (
                            <tr key={txn.id}>
                              <td><strong>{txn.user_name}</strong></td>
                              <td><strong>KES {parseFloat(txn.amount).toLocaleString()}</strong></td>
                              <td><small>{txn.category}</small></td>
                              <td>{txn.phone}</td>
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
                                {new Date(txn.created_at).toLocaleDateString('en-GB', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </td>
                              <td>
                                {txn.status === "Pending" && (
                                  <div className="d-flex gap-1">
                                    <Button
                                      variant="outline-success"
                                      size="sm"
                                      onClick={() => updateTransactionStatus(txn.id, 'Completed')}
                                      disabled={loading}
                                    >
                                      Approve
                                    </Button>
                                    <Button
                                      variant="outline-danger"
                                      size="sm"
                                      onClick={() => updateTransactionStatus(txn.id, 'Failed')}
                                      disabled={loading}
                                    >
                                      Reject
                                    </Button>
                                  </div>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={6} className="mb-4">
                <Card>
                  <Card.Header>
                    <h5 className="mb-0">Recent Feedback</h5>
                  </Card.Header>
                  <Card.Body>
                    {feedback.slice(0, 3).map(fb => (
                      <div key={fb.id} className="mb-3 pb-3 border-bottom">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <strong>{fb.subject}</strong>
                            <div className="text-muted small">
                              From: {fb.user_name}
                            </div>
                          </div>
                          <div className="text-end">
                            {getStatusBadge(fb.status)}
                            <div className="small text-muted mt-1">
                              {new Date(fb.created_at).toLocaleDateString('en-GB')}
                            </div>
                          </div>
                        </div>
                        <p className="mb-1 mt-2 small">{fb.message.substring(0, 100)}...</p>
                      </div>
                    ))}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </>
        );

      case "users":
        return (
          <>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="mb-0">User Management</h4>
              <Button variant="primary" onClick={() => openUserModal()}>
                Add New User
              </Button>
            </div>

            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2">Loading users...</p>
              </div>
            ) : users.length > 0 ? (
              <Card>
                <Card.Body>
                  <div className="table-responsive">
                    <Table hover>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Phone</th>
                          <th>Business Type</th>
                          <th>Status</th>
                          <th>Created</th>
                          <th>Last Login</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map(user => (
                          <tr key={user.id}>
                            <td><strong>{user.full_name}</strong></td>
                            <td>{user.email}</td>
                            <td>{user.phone}</td>
                            <td>{user.business_type}</td>
                            <td>{getStatusBadge(user.status)}</td>
                            <td>
                              {new Date(user.created_at).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric'
                              })}
                            </td>
                            <td>
                              {user.last_login === "Never" ? (
                                <span className="text-muted">Never</span>
                              ) : (
                                new Date(user.last_login).toLocaleDateString('en-GB', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: '2-digit'
                                })
                              )}
                            </td>
                            <td>
                              <div className="d-flex gap-1">
                                <Button
                                  variant="outline-primary"
                                  size="sm"
                                  onClick={() => openUserModal(user)}
                                  disabled={loading}
                                >
                                  Edit
                                </Button>
                                <Button
                                  variant={user.status === "Active" ? "outline-warning" : "outline-success"}
                                  size="sm"
                                  onClick={() => updateUserStatus(user.id, user.status === "Active" ? "Inactive" : "Active")}
                                  disabled={loading}
                                >
                                  {user.status === "Active" ? "Deactivate" : "Activate"}
                                </Button>
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={() => deleteUser(user.id)}
                                  disabled={loading}
                                >
                                  Delete
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </Card.Body>
              </Card>
            ) : (
              <Alert variant="info" className="text-center py-5">
                <h5>No users found</h5>
                <p className="mb-3">
                  No users have been registered yet.
                </p>
                <Button variant="primary" onClick={() => openUserModal()}>
                  Add First User
                </Button>
              </Alert>
            )}
          </>
        );


              case "transactions":
        return (
          <>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="mb-0">Transaction Management</h4>
              <div className="d-flex gap-2">
                <Badge bg="success" className="me-2">
                  {stats.completedTransactions} Completed
                </Badge>
                <Badge bg="warning" className="me-2">
                  {stats.pendingTransactions} Pending
                </Badge>
                <Badge bg="danger">
                  {stats.failedTransactions} Failed
                </Badge>
              </div>
            </div>

            {/* Filters */}
            <Card className="mb-4">
              <Card.Body>
                <Row>
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>Status Filter</Form.Label>
                      <Form.Select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                      >
                        <option value="">All Statuses</option>
                        <option value="Completed">Completed</option>
                        <option value="Pending">Pending</option>
                        <option value="Failed">Failed</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>Category Filter</Form.Label>
                      <Form.Select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                      >
                        <option value="">All Categories</option>
                        <option value="Fresh products trader">Fresh products trader</option>
                        <option value="Livestock and meat">Livestock and meat</option>
                        <option value="Fish vendor">Fish vendor</option>
                        <option value="Clothes and textile">Clothes and textile</option>
                        <option value="Household goods">Household goods</option>
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
                </Row>
              </Card.Body>
            </Card>

            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2">Loading transactions...</p>
              </div>
            ) : getFilteredTransactions().length > 0 ? (
              <Card>
                <Card.Body>
                  <div className="table-responsive">
                    <Table hover>
                      <thead>
                        <tr>
                          <th>User</th>
                          <th>Amount</th>
                          <th>Category</th>
                          <th>Phone</th>
                          <th>Status</th>
                          <th>M-Pesa Code</th>
                          <th>Date</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getFilteredTransactions().map(txn => (
                          <tr key={txn.id}>
                            <td><strong>{txn.user_name}</strong></td>
                            <td><strong>KES {parseFloat(txn.amount).toLocaleString()}</strong></td>
                            <td><small>{txn.category}</small></td>
                            <td>{txn.phone}</td>
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
                              {new Date(txn.created_at).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </td>
                            <td>
                              {txn.status === "Pending" && (
                                <div className="d-flex gap-1">
                                  <Button
                                    variant="outline-success"
                                    size="sm"
                                    onClick={() => updateTransactionStatus(txn.id, 'Completed')}
                                    disabled={loading}
                                  >
                                    Approve
                                  </Button>
                                  <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => updateTransactionStatus(txn.id, 'Failed')}
                                    disabled={loading}
                                  >
                                    Reject
                                  </Button>
                                </div>
                              )}
                              {txn.status === "Failed" && (
                                <Button
                                  variant="outline-primary"
                                  size="sm"
                                  onClick={() => updateTransactionStatus(txn.id, 'Completed')}
                                  disabled={loading}
                                >
                                  Retry
                                </Button>
                              )}
                              {txn.status === "Completed" && (
                                <Button
                                  variant="outline-info"
                                  size="sm"
                                  disabled
                                >
                                  Completed
                                </Button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </Card.Body>
              </Card>
            ) : (
              <Alert variant="info" className="text-center py-5">
                <h5>No transactions found</h5>
                <p className="mb-0">
                  No transactions match your current filters.
                </p>
              </Alert>
            )}
          </>
        );

      case "feedback":
        return (
          <>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="mb-0">User Feedback Management</h4>
              <div className="d-flex gap-2">
                <Badge bg="danger" className="me-2">
                  {stats.unreadFeedback} Unread
                </Badge>
                <Badge bg="warning" className="me-2">
                  {feedback.filter(f => f.status === 'In Review').length} In Review
                </Badge>
                <Badge bg="danger">
                  {stats.highPriorityFeedback} High Priority
                </Badge>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2">Loading feedback...</p>
              </div>
            ) : feedback.length > 0 ? (
              <Row>
                {feedback.map(fb => (
                  <Col lg={6} key={fb.id} className="mb-4">
                    <Card className={`h-100 ${fb.status === 'Unread' ? 'border-danger' : ''} ${fb.priority === 'High' ? 'border-warning border-2' : ''}`}>
                      <Card.Header className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center gap-2">
                          <strong>{fb.subject}</strong>
                          <Badge bg={
                            fb.priority === 'High' ? 'danger' :
                            fb.priority === 'Medium' ? 'warning' : 'success'
                          }>
                            {fb.priority}
                          </Badge>
                        </div>
                        {getStatusBadge(fb.status)}
                      </Card.Header>
                      <Card.Body>
                        <p className="mb-2">{fb.message}</p>
                        <small className="text-muted">
                          From: <strong>{fb.user_name}</strong> | {new Date(fb.created_at).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </small>
                      </Card.Body>
                      <Card.Footer className="d-flex gap-2">
                        {fb.status === 'Unread' && (
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => updateFeedbackStatus(fb.id, 'In Review')}
                            disabled={loading}
                          >
                            Mark as Read
                          </Button>
                        )}
                        {fb.status === 'In Review' && (
                          <Button
                            variant="outline-success"
                            size="sm"
                            onClick={() => updateFeedbackStatus(fb.id, 'Read')}
                            disabled={loading}
                          >
                            Mark as Resolved
                          </Button>
                        )}
                        {fb.status === 'Read' && (
                          <Button
                            variant="outline-warning"
                            size="sm"
                            onClick={() => updateFeedbackStatus(fb.id, 'In Review')}
                            disabled={loading}
                          >
                            Reopen
                          </Button>
                        )}
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => deleteFeedback(fb.id)}
                          disabled={loading}
                        >
                          Delete
                        </Button>
                      </Card.Footer>
                    </Card>
                  </Col>
                ))}
              </Row>
            ) : (
              <Alert variant="info" className="text-center py-5">
                <h5>No feedback available</h5>
                <p className="mb-0">
                  No user feedback has been received yet.
                </p>
              </Alert>
            )}
          </>
        );
      
        case "reports":
  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">Report Generation</h4>
        <div>
          <Badge bg="info" className="me-2">
            CSV Format
          </Badge>
        </div>
      </div>

      <Card>
        <Card.Body>
          <h5 className="mb-4">Available Reports</h5>
          <Row>
            {reportTypes.map(report => (
              <Col md={6} key={report.id} className="mb-4">
                <Card className="h-100">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <Card.Title>{report.name}</Card.Title>
                        <Card.Text className="text-muted small">
                          Contains all {report.type} data in CSV format
                        </Card.Text>
                      </div>
                      <Button 
                        variant="outline-primary"
                        onClick={() => downloadReport(report.type)}
                        disabled={loading}
                      >
                        {loading ? (
                          <Spinner as="span" animation="border" size="sm" />
                        ) : (
                          'Download'
                        )}
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Card.Body>
      </Card>

      <Card className="mt-4">
        <Card.Body>
          <h5 className="mb-3">Custom Report</h5>
          <Form>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Report Type</Form.Label>
                  <Form.Select>
                    <option>Select report type</option>
                    <option>Custom User Report</option>
                    <option>Custom Transaction Report</option>
                    <option>Custom Feedback Report</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Date Range</Form.Label>
                  <Form.Select>
                    <option>Select date range</option>
                    <option>Last 7 days</option>
                    <option>Last 30 days</option>
                    <option>Last quarter</option>
                    <option>Custom range</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Format</Form.Label>
                  <Form.Select>
                    <option>CSV</option>
                    <option disabled>PDF (coming soon)</option>
                    <option disabled>Excel (coming soon)</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <div className="d-flex justify-content-end">
              <Button variant="primary" disabled>
                Generate Custom Report
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </>
  );

      default:
        return (
          <Alert variant="warning" className="text-center py-5">
            <h5>Section not found</h5>
            <p className="mb-0">Please select a valid section from the sidebar.</p>
          </Alert>
        );
    }
  };

  return (
    <>
      {/* Mobile Header */}
      <div
        className="d-block d-md-none text-white px-3 py-3"
        style={{ background: "linear-gradient(to right, #d16ba5, #86a8e7)" }}
      >
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <div className="fw-bold">ADMIN PANEL</div>
            <small>System Administrator</small>
          </div>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#333",
              fontWeight: "bold"
            }}
          >
            A
          </div>
        </div>
        <div className="d-flex justify-content-around mt-3">
          <Button
            size="sm"
            variant={activeSection === "overview" ? "secondary" : "light"}
            onClick={() => setActiveSection("overview")}
          >
            Overview
          </Button>
          <Button
            size="sm"
            variant={activeSection === "users" ? "secondary" : "light"}
            onClick={() => setActiveSection("users")}
          >
            Users
          </Button>
          <Button
            size="sm"
            variant={activeSection === "transactions" ? "secondary" : "light"}
            onClick={() => setActiveSection("transactions")}
          >
            Transactions
          </Button>
          <Button
            size="sm"
            variant={activeSection === "feedback" ? "secondary" : "light"}
            onClick={() => setActiveSection("feedback")}
          >
            Feedback
          </Button>
          // Add this with the other mobile navigation buttons
<Button
  size="sm"
  variant={activeSection === "reports" ? "secondary" : "light"}
  onClick={() => setActiveSection("reports")}
>
  Reports
</Button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="d-flex flex-column flex-md-row" style={{ minHeight: "80vh", maxHeight: "90vh" }}>
        {/* Sidebar for desktop */}
        <div
          className="d-none d-md-flex flex-column"
          style={{
            width: "280px",
            backgroundColor: "#f8f9fa",
            borderRight: "1px solid #dee2e6",
            padding: "1.5rem",
          }}
        >
          <div className="d-flex align-items-center mb-4">
            <div
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: "bold",
                fontSize: "1.2rem",
                marginRight: "12px"
              }}
            >
              A
            </div>
            <div>
              <h6 className="mb-0">Admin Panel</h6>
              <small className="text-muted">System Administrator</small>
            </div>
          </div>
          
          <h5 className="mb-4">Dashboard</h5>
          <ListGroup variant="flush">
            <ListGroup.Item
              action
              active={activeSection === "overview"}
              onClick={() => setActiveSection("overview")}
              className="d-flex justify-content-between align-items-center"
            >
              📊 Overview
              {stats.pendingTransactions + stats.unreadFeedback > 0 && (
                <Badge bg="danger" pill>
                  {stats.pendingTransactions + stats.unreadFeedback}
                </Badge>
              )}
            </ListGroup.Item>
            <ListGroup.Item
              action
              active={activeSection === "users"}
              onClick={() => setActiveSection("users")}
              className="d-flex justify-content-between align-items-center"
            >
              👥 Users
              <Badge bg="primary" pill>{stats.totalUsers}</Badge>
            </ListGroup.Item>
            <ListGroup.Item
              action
              active={activeSection === "transactions"}
              onClick={() => setActiveSection("transactions")}
              className="d-flex justify-content-between align-items-center"
            >
              💳 Transactions
              {stats.pendingTransactions > 0 && (
                <Badge bg="warning" pill>{stats.pendingTransactions}</Badge>
              )}
            </ListGroup.Item>
            <ListGroup.Item
              action
              active={activeSection === "feedback"}
              onClick={() => setActiveSection("feedback")}
              className="d-flex justify-content-between align-items-center"
            >
              💬 Feedback
              {stats.unreadFeedback > 0 && (
                <Badge bg="danger" pill>{stats.unreadFeedback}</Badge>
              )}
            </ListGroup.Item>
          </ListGroup>
<ListGroup.Item
  action
  active={activeSection === "reports"}
  onClick={() => setActiveSection("reports")}
  className="d-flex justify-content-between align-items-center"
>
  📊 Reports
  <Badge bg="info" pill>New</Badge>
</ListGroup.Item>

          {/* Quick Stats in Sidebar */}
          <div className="mt-4 pt-4 border-top">
            <h6 className="text-muted">Quick Stats</h6>
            <div className="small">
              <div className="d-flex justify-content-between mb-2">
                <span>Active Users:</span>
                <strong className="text-success">{stats.activeUsers}</strong>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Today's Revenue:</span>
                <strong className="text-success">KES {(stats.totalRevenue * 0.1).toLocaleString()}</strong>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Pending Items:</span>
                <strong className="text-warning">{stats.pendingTransactions + stats.unreadFeedback}</strong>
              </div>
              <div className="mt-4 pt-4 border-top">
  <h6 className="text-muted">Quick Stats</h6>
  <div className="small">
    {/* ... your existing quick stats */}
    <div className="d-flex justify-content-between mb-2">
      <span>Available Reports:</span>
      <strong className="text-info">{stats.availableReports}</strong>
    </div>
  </div>
</div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-grow-1 bg-white" style={{ overflowY: "auto" }}>
          <Container className="py-4">
            {/* Alert Messages */}
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
            
            {renderContent()}
          </Container>
        </div>
      </div>

      {/* User Modal */}
      <Modal show={showModal && modalType === "user"} onHide={closeModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{selectedItem ? 'Edit User' : 'Add New User'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={userForm.full_name}
                    onChange={(e) => setUserForm({...userForm, full_name: e.target.value})}
                    placeholder="Enter full name"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={userForm.email}
                    onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                    placeholder="Enter email address"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="text"
                    value={userForm.phone}
                    onChange={(e) => setUserForm({...userForm, phone: e.target.value})}
                    placeholder="e.g., 254700123456"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Business Type</Form.Label>
                  <Form.Select
                    value={userForm.business_type}
                    onChange={(e) => setUserForm({...userForm, business_type: e.target.value})}
                    required
                  >
                    <option value="">Select Business Type</option>
                    <option value="Fresh products trader">Fresh products trader</option>
                    <option value="Livestock and meat">Livestock and meat</option>
                    <option value="Fish vendor">Fish vendor</option>
                    <option value="Clothes and textile">Clothes and textile</option>
                    <option value="Household goods">Household goods</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    value={userForm.status}
                    onChange={(e) => setUserForm({...userForm, status: e.target.value})}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={createOrUpdateUser}
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner as="span" animation="border" size="sm" className="me-2" />
                {selectedItem ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              selectedItem ? 'Update User' : 'Create User'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AdminDashboard;