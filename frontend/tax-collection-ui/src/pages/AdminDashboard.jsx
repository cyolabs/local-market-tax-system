// AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  ListGroup,
  Table,
  InputGroup,
  FormControl,
  Form,
} from "react-bootstrap";
import {
  Bell,
  Translate,
  CurrencyExchange,
  Percent,
  Trash,
  ChevronDown,
  ChevronRight,
} from "react-bootstrap-icons";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const chartData = [
  { date: "2/1", tax: 18 },
  { date: "2/8", tax: 15 },
  { date: "2/15", tax: 12 },
  { date: "2/22", tax: 10 },
  { date: "2/29", tax: 9 },
  { date: "3/8", tax: 8.5 },
  { date: "3/15", tax: 8 },
  { date: "3/22", tax: 8.5 },
  { date: "3/29", tax: 10 },
  { date: "4/5", tax: 14 },
  { date: "4/12", tax: 17 },
  { date: "4/19", tax: 20 },
];

const topMarkets = [
  "Kapsabet Market",
  "Mosoriot Market",
  "Nandi Hills Market",
  "Kabiyet Market",
  "Kebulonik Market",
  "Lessos Market",
  "Kaiboi Market",
  "Chepterit Market",
  "Baraton Market",
  "Kipkaren Market",
];

const AdminDashboard = () => {
  const [activeView, setActiveView] = useState("dashboard");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser, token, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/admin/vendors/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };

    if (activeView === "registered") {
      fetchUsers();
    }
  }, [token, activeView]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const renderDashboard = () => (
    <>
      <div className="d-flex gap-3 flex-wrap mb-4">
        <Card className="shadow-sm text-center flex-grow-1" style={{ minWidth: "200px", backgroundColor: "#FFFAFA" }}>
          <Card.Body>
            <div>📝</div>
            <h6 className="text-muted">Registered traders</h6>
            <h3 className="fw-bold text-danger">{users.length}</h3>
          </Card.Body>
        </Card>
        <Card className="shadow-sm text-center flex-grow-1" style={{ minWidth: "200px", backgroundColor: "#FFFAFA" }}>
          <Card.Body>
            <div>💵</div>
            <h6 className="text-muted">Total tax/week</h6>
            <h4 className="fw-bold text-primary">Ksh. 100,350</h4>
          </Card.Body>
        </Card>
        <Card className="shadow-sm text-center flex-grow-1" style={{ minWidth: "200px", backgroundColor: "#FFFAFA" }}>
          <Card.Body>
            <div>📊</div>
            <h6 className="text-muted">Collection Rate %</h6>
            <h3 className="fw-bold text-danger">60%</h3>
          </Card.Body>
        </Card>
      </div>

      <Row>
        <Col md={8}>
          <Card className="shadow-sm mb-4">
            <Card.Header className="fw-bold text-center">WEEKLY TREND GRAPH</Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="tax" fill="#f9b233" />
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm text-center mb-4">
            <Card.Header className="fw-bold text-danger">Top Markets</Card.Header>
            <ListGroup variant="flush">
              {topMarkets.map((market, idx) => (
                <ListGroup.Item key={idx}>{idx + 1}. {market}</ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );

  const renderRegisteredUsers = () => (
    <>
      <h4 className="fw-bold mb-3">Registered Users</h4>
      {loading ? (
        <p>Loading users...</p>
      ) : (
        <Table striped bordered hover responsive>
          <thead style={{ backgroundColor: "#663B53", color: "white" }}>
            <tr>
              <th>Full Name</th>
              <th>Username</th>
              <th>National ID</th>
              <th>Market</th>
              <th>Email</th>
              <th>Role</th>
              <th>Business Type</th>
              <th>Gender</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.national_id}>
                <td>{user.full_name}</td>
                <td>{user.username}</td>
                <td>{user.national_id}</td>
                <td>{user.market_of_operation}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.business_type}</td>
                <td>{user.gender}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );

  const renderTaxReports = () => (
    <Card className="p-3">
    </Card>
  );

  const renderFeedback = () => (
    <Card className="p-3">
    </Card>
  );

  const renderSettings = () => (
    <Container>
      <h5 className="text-center fw-bold mb-4">Settings</h5>
      <Row className="py-2 border-bottom">
        <Col xs={1}><Bell size={20} /></Col>
        <Col>Notifications</Col>
        <Col xs={2}><Form.Check type="switch" defaultChecked /></Col>
      </Row>
    </Container>
  );

  return (
    <div className="d-flex" style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      <div style={{ width: "250px", background: "#d3cbc7" }} className="p-3 d-flex flex-column justify-content-between">
        <div>
          <Button className="w-100 mb-2 text-start" variant={activeView === "dashboard" ? "dark" : "outline-secondary"} onClick={() => setActiveView("dashboard")}>📊 Dashboard</Button>
          <Button className="w-100 mb-2 text-start" variant={activeView === "registered" ? "dark" : "outline-secondary"} onClick={() => setActiveView("registered")}>📝 Registered</Button>
          <Button className="w-100 mb-2 text-start" variant={activeView === "tax" ? "dark" : "outline-secondary"} onClick={() => setActiveView("tax")}>📈 Tax Report</Button>
          <Button className="w-100 mb-2 text-start" variant={activeView === "feedback" ? "dark" : "outline-secondary"} onClick={() => setActiveView("feedback")}>💬 Feedback</Button>
        </div>
        <div>
          <Button className="w-100 mb-2 text-start" variant="secondary" onClick={() => setActiveView("settings")}>⚙️ Settings</Button>
          <Button className="w-100 text-start" style={{ backgroundColor: "#e9f4eb" }} onClick={handleLogout}>⬅️ Logout</Button>
        </div>
      </div>

      <div className="flex-grow-1 p-4">
        {activeView === "dashboard" && renderDashboard()}
        {activeView === "registered" && renderRegisteredUsers()}
        {activeView === "tax" && renderTaxReports()}
        {activeView === "feedback" && renderFeedback()}
        {activeView === "settings" && renderSettings()}
      </div>
    </div>
  );
};

export default AdminDashboard;
