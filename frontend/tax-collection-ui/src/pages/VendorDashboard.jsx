import React, { useState } from "react";
import { Container, Row, Col, Card, Button, ListGroup } from "react-bootstrap";

const categories = [
  { title: "Fresh products traders", image: "/images/fresh.jpg" },
  { title: "Livestock and meat", image: "/images/livestock.jpg" },
  { title: "Fish vendors", image: "/images/fish.jpg" },
  { title: "Clothes and textile", image: "/images/clothes.jpg" },
  { title: "Clothing and textile", image: "/images/clothing.jpg" },
  { title: "Household goods", image: "/images/household.jpg" },
];

const VendorDashboard = () => {
  const [activeSection, setActiveSection] = useState("payments");

  const renderContent = () => {
    switch (activeSection) {
      case "payments":
        return (
          <>
            <h2 className="mb-4 text-center">Select payment category</h2>
            <Row>
              {categories.map((item, idx) => (
                <Col md={4} className="mb-4" key={idx}>
                  <Card className="text-center shadow-sm h-100">
                    <Card.Body>
                      <div className="mb-3">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="rounded-circle"
                          style={{ width: "100px", height: "100px", objectFit: "cover" }}
                        />
                      </div>
                      <Card.Title>{item.title}</Card.Title>
                      <Button variant="outline-dark">PAY</Button>
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
            <h2 className="mb-4 text-center">Tax History</h2>
            <p className="text-center">This is where the tax history will be displayed.</p>
          </>
        );
      case "feedback":
        return (
          <>
            <h2 className="mb-4 text-center">Feedback</h2>
            <p className="text-center">This is where the feedback form or messages will appear.</p>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="d-flex" style={{ maxHeight: "72vh" }}>
      {/* Sidebar */}
      <div
        style={{
          width: "250px",
          backgroundColor: "#f8f9fa",
          borderRight: "1px solid #dee2e6",
          padding: "1.5rem",
        }}
        className="d-flex flex-column"
      >
        <h5 className="mb-4">Dashboard</h5>
        <ListGroup variant="flush">
          <ListGroup.Item action onClick={() => setActiveSection("payments")}>
            Payments
          </ListGroup.Item>
          <ListGroup.Item action onClick={() => setActiveSection("tax-history")}>
            Tax History
          </ListGroup.Item>
          <ListGroup.Item action onClick={() => setActiveSection("feedback")}>
            Feedback
          </ListGroup.Item>
        </ListGroup>
      </div>

      {/* Main content */}
      <div className="flex-grow-1 bg-white">
        <Container className="py-5">
          {renderContent()}
        </Container>
      </div>
    </div>
  );
};

export default VendorDashboard;
