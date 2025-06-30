import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { initiateSTKPush } from '../services/mpesaService';

const PaymentForm = ({ onPaymentInitiated }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await initiateSTKPush(
        phoneNumber,
        amount,
        'TAX_PAYMENT',
        'Tax Payment'
      );
      
      setSuccess('Payment request sent successfully. Please check your phone to complete the transaction.');
      if (onPaymentInitiated) {
        onPaymentInitiated(response.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to initiate payment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      
      <Form.Group controlId="phoneNumber" className="mb-3">
        <Form.Label>Phone Number</Form.Label>
        <Form.Control
          type="tel"
          placeholder="e.g. 254712345678"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
        <Form.Text className="text-muted">
          Enter your M-Pesa registered phone number
        </Form.Text>
      </Form.Group>

      <Form.Group controlId="amount" className="mb-3">
        <Form.Label>Amount (KES)</Form.Label>
        <Form.Control
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="1"
          required
        />
      </Form.Group>

      <Button variant="primary" type="submit" disabled={isLoading}>
        {isLoading ? 'Processing...' : 'Pay via M-Pesa'}
      </Button>
    </Form>
  );
};

export default PaymentForm;