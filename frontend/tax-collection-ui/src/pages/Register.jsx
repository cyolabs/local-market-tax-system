import { useState } from 'react';
import { Form, Button, Container, Alert, Row, Col } from 'react-bootstrap';
import { loginUser, registerUser } from '../services/api';

export default function Register() {
  const [formData, setFormData] = useState({
    // ...initial state
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.password2) {
      setErrors({...errors, password2: 'Passwords do not match'});
      return;
    }
    try {
      const { data } = await registerUser(formData);
      // Handle successful registration
    } catch (err) {
      setErrors(err.response?.data || {});
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <h2 className="text-center mb-4">Vendor Registration</h2>
          
          {errors.non_field_errors && (
            <Alert variant="danger">{errors.non_field_errors}</Alert>
          )}

          <Form onSubmit={handleSubmit}>
            {/* Form fields with Bootstrap styling */}
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                value={formData.full_name}
                onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                isInvalid={!!errors.full_name}
                required
              />
              <Form.Control.Feedback type="invalid">
                {errors.full_name}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Add other fields similarly */}

            <Button variant="success" type="submit" className="w-100 mt-3">
              Register
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}