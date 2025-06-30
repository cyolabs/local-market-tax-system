import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { initiateSTKPush } from '../services/mpesaService';

const PaymentForm = ({ onPaymentInitiated }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState(''); // State for amount input
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // 1. Format phone number
      const formattedPhone = phoneNumber.startsWith('0') 
        ? `254${phoneNumber.substring(1)}`
        : phoneNumber.startsWith('+')
        ? phoneNumber.substring(1)
        : phoneNumber;

      // 2. Validate amount
      if (!amount || amount < 1) {
        throw new Error('Amount must be at least 1 KES');
      }

      // 3. Initiate payment
      const response = await initiateSTKPush(
        formattedPhone,
        amount,
        'TAX_PAYMENT',
        'Tax Payment'
      );

      setSuccess('Payment request sent. Check your phone to complete the transaction.');
      onPaymentInitiated?.(response.data);
      
    } catch (err) {
      const errorMessage = err.response?.data?.error || 
                         err.response?.data?.message || 
                         err.message || 
                         'Payment failed. Please try again.';
      setError(errorMessage);
      console.error('Payment error:', err.response?.data || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}
      {success && <Alert variant="success" dismissible onClose={() => setSuccess(null)}>{success}</Alert>}
      
      {/* Phone Number Field */}
      <Form.Group controlId="phoneNumber" className="mb-3">
        <Form.Label>Phone Number</Form.Label>
        <Form.Control
          type="tel"
          placeholder="e.g. 0722123456 or 254722123456"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          pattern="^(0|\+?254)\d{9}$"
          required
        />
        <Form.Text className="text-muted">
          Starts with 0, +254, or 254
        </Form.Text>
      </Form.Group>

      {/* SINGLE Amount Field - Choose ONE of these options: */}

      {/* Option 1: Editable Amount */}
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

      {/* OR */}

      {/* Option 2: Read-only Amount (if receiving from props) */}
      {/* 
      <Form.Group controlId="amount" className="mb-3">
        <Form.Label>Amount (KES)</Form.Label>
        <Form.Control
          type="number"
          value={amount}
          readOnly
          min="1"
        />
      </Form.Group>
      */}

      <Button variant="primary" type="submit" disabled={isLoading}>
        {isLoading ? 'Processing...' : 'Pay via M-Pesa'}
      </Button>
    </Form>
  );
};

export default PaymentForm;