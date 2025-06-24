import React from "react";
import { Container, Row, Col, Card, Button, ListGroup } from "react-bootstrap";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

// Sample bar chart data
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
];

const AdminDashboard = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to right, #e8c5ff, #a9c1ff)",
      }}
      className="p-0"
    >
      {/* Body */}
      <div className="d-flex" style={{ padding: "20px" }}>
        {/* Sidebar */}
        <div
          style={{ width: "250px" }}
          className="d-flex flex-column justify-content-between"
        >
          <div>
            <div className="mb-3">
              <Button variant="secondary" className="w-100 text-start">
                📊 Dashboard
              </Button>
            </div>
            <div className="mb-3">
              <Button variant="outline-light" className="w-100 text-start">
                📄 Registered
              </Button>
            </div>
            <div className="mb-3">
              <Button variant="outline-light" className="w-100 text-start">
                📈 Tax Report
              </Button>
            </div>
            <div className="mb-3">
              <Button variant="outline-light" className="w-100 text-start">
                💬 Feedback
              </Button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-grow-1 ps-4">
          <div className="d-flex gap-3 overflow-auto flex-nowrap mb-4">
            <Card
              className="shadow-sm text-center flex-shrink-0"
              style={{ width: "210px" }}
            >
              <Card.Body>
                <div>📋</div>
                <h6 className="text-muted">Resisted traders</h6>
                <h3 className="text-danger fw-bold">12410</h3>
              </Card.Body>
            </Card>

            <Card
              className="shadow-sm text-center flex-shrink-0"
              style={{ width: "210px" }}
            >
              <Card.Body>
                <div>👤</div>
                <h6 className="text-muted">Total tax/week</h6>
                <h4 className="text-primary fw-bold">Ksh. 100,350</h4>
              </Card.Body>
            </Card>

            <Card
              className="shadow-sm text-center flex-shrink-0"
              style={{ width: "210px" }}
            >
              <Card.Body>
                <div>📈</div>
                <h6 className="text-muted">Collection Rate %</h6>
                <h3 className="text-danger fw-bold">60%</h3>
              </Card.Body>
            </Card>

            <Card
              className="shadow-sm text-center flex-shrink-0"
              style={{ width: "210px" }}
            >
              <Card.Body>
                <h6 className="text-muted">Outstanding tax</h6>
                <h4 className="text-danger fw-bold">Ksh. 40,140</h4>
                <div className="text-danger">40%</div>
              </Card.Body>
            </Card>

            <Card
              className="shadow-sm text-center flex-shrink-0 border-danger"
              style={{ width: "240px" }}
            >
              <Card.Body>
                <h6 className="text-muted mb-3">Suspend not paying vendors</h6>
                <Button variant="danger">Open to suspend</Button>
              </Card.Body>
            </Card>
          </div>

          <Row>
            <Col md={8}>
              <Card className="shadow-sm mb-4">
                <Card.Header className="fw-bold text-center">
                  WEEKLY TREND GRAPH
                </Card.Header>
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
              <Card className="shadow-sm text-center">
                <Card.Header className="fw-bold text-danger">
                  Top Markets
                </Card.Header>
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
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
