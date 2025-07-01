import React, { useState } from "react";
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

const VendorDashboard = () => {
  const [activeView, setActiveView] = useState("dashboard");

  const renderDashboard = () => (
    <>
      {/* Stat Cards */}
      <div className="d-flex gap-3 flex-wrap mb-4">
        <Card className="shadow-sm text-center flex-grow-1" style={{ minWidth: "200px" }}>
          <Card.Body>
            <div>📝</div>
            <h6 className="text-muted">Registered traders</h6>
            <h3 className="fw-bold text-danger">12,410</h3>
          </Card.Body>
        </Card>
        <Card className="shadow-sm text-center flex-grow-1" style={{ minWidth: "200px" }}>
          <Card.Body>
            <div>💵</div>
            <h6 className="text-muted">Total tax/week</h6>
            <h4 className="fw-bold text-primary">Ksh. 100,350</h4>
          </Card.Body>
        </Card>
        <Card className="shadow-sm text-center flex-grow-1" style={{ minWidth: "200px" }}>
          <Card.Body>
            <div>📊</div>
            <h6 className="text-muted">Collection Rate %</h6>
            <h3 className="fw-bold text-danger">60%</h3>
          </Card.Body>
        </Card>
      </div>

      {/* Chart and Markets */}
      <Row>
        <Col md={8}>
          <Card className="shadow-sm mb-4">
            <Card.Header className="fw-bold text-center">WEEKLY TREND GRAPH</Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis tickFormatter={(val) => `${val}M`} />
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
                <ListGroup.Item key={idx}>
                  {idx + 1}. {market}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        </Col>
      </Row>

      {/* Outstanding Tax and Suspend */}
      <div className="d-flex gap-3 flex-wrap">
        <Card className="shadow-sm text-center flex-grow-1" style={{ minWidth: "220px" }}>
          <Card.Body>
            <h6 className="text-muted">Outstanding tax</h6>
            <h4 className="fw-bold text-danger">Ksh. 40,140</h4>
            <div className="text-danger">40%</div>
          </Card.Body>
        </Card>
        <Card className="shadow-sm text-center flex-grow-1 border border-danger" style={{ minWidth: "240px" }}>
          <Card.Body>
            <h6 className="text-muted mb-3">Suspend not paying vendors</h6>
            <Button variant="success">Open to suspend</Button>
          </Card.Body>
        </Card>
      </div>
    </>
  );

  const renderRegisteredUsers = () => (
    <>
      <InputGroup className="mb-3 w-50">
        <FormControl placeholder="Search ..." />
      </InputGroup>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Gender</th>
            <th>National ID</th>
            <th>Business Type</th>
            <th>Market</th>
          </tr>
        </thead>
        <tbody>
          {Array(10).fill().map((_, i) => (
            <tr key={i}>
              <td>Daniel Ogera</td>
              <td>{i % 2 === 0 ? "Male" : "Female"}</td>
              <td>38406341</td>
              <td>Grocery seller</td>
              <td>Baraton</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );

  const renderTaxReports = () => (
    <>
      <h4 className="mb-4">Tax Compliance Overview</h4>
      <Card className="p-3 mb-4">
        <h5>Monthly Revenue Trends</h5>
        <img src="/images/tax-trend.png" alt="Trend" style={{ width: "100%" }} />
        <Button className="mt-3" variant="success">Download</Button>
      </Card>
      <Card className="p-3">
        <h5>Market Population</h5>
        <img src="/images/market-population.png" alt="Population" style={{ width: "100%" }} />
        <Button className="mt-3" variant="success">Download</Button>
      </Card>
    </>
  );

  const renderFeedback = () => (
    <>
      <InputGroup className="mb-3 w-50">
        <FormControl placeholder="Search ..." />
      </InputGroup>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Sender</th>
            <th>Subject</th>
            <th>Market</th>
            <th>Message</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {Array(10).fill().map((_, i) => (
            <tr key={i}>
              <td>Daniel Ogera</td>
              <td>Complain</td>
              <td>Baraton</td>
              <td>The market is dirty and we have been ...</td>
              <td>Apr 22, 2024 14:31</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );

  const renderSettings = () => (
    <Card className="shadow-sm">
      <Card.Body className="text-center">
        <img
          src="/mnt/data/settings.png"
          alt="Settings UI"
          style={{ width: "100%", maxWidth: "900px", borderRadius: "8px" }}
        />
      </Card.Body>
    </Card>
  );
  
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      <div className="d-flex">
        {/* Sidebar */}
        <div
          style={{ width: "250px", background: "#d3cbc7", minHeight: "100vh" }}
          className="d-flex flex-column justify-content-between p-3"
        >
          <div>
            <Button
              variant={activeView === "dashboard" ? "dark" : "outline-secondary"}
              className="w-100 mb-3 text-start fw-bold"
              onClick={() => setActiveView("dashboard")}
            >
              📊 Dashboard
            </Button>
            <Button
              variant={activeView === "registered" ? "dark" : "outline-secondary"}
              className="w-100 mb-3 text-start"
              onClick={() => setActiveView("registered")}
            >
              📝 Registered
            </Button>
            <Button
              variant={activeView === "tax" ? "dark" : "outline-secondary"}
              className="w-100 mb-3 text-start"
              onClick={() => setActiveView("tax")}
            >
              📈 Tax Report
            </Button>
            <Button
              variant={activeView === "feedback" ? "dark" : "outline-secondary"}
              className="w-100 mb-3 text-start"
              onClick={() => setActiveView("feedback")}
            >
              💬 Feedback
            </Button>
          </div>
          <div>
            <Button
              style={{ backgroundColor: "#6e4a4a", color: "white" }}
              className="w-100 mb-2 text-start"
              onClick={() => setActiveView("settings")}
            >
              ⚙️ Settings
            </Button>
            <Button
              onClick={handleLogout}
              style={{ backgroundColor: "#e9f4eb", color: "black" }}
              className="w-100 text-start"
            >
              ⬅️ Logout
            </Button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-grow-1 p-4">
          {activeView === "dashboard" && renderDashboard()}
          {activeView === "registered" && renderRegisteredUsers()}
          {activeView === "tax" && renderTaxReports()}
          {activeView === "feedback" && renderFeedback()}
          {activeView === "settings" && renderSettings()}
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
