import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Card } from 'react-bootstrap';
import { initiateSTKPush } from '../services/mpesaService';

const PaymentForm = ({ onPaymentInitiated, defaultAmount }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState(defaultAmount || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (defaultAmount) {
      setAmount(defaultAmount);
    }
  }, [defaultAmount]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const formattedPhone = phoneNumber.startsWith('0') 
        ? `254${phoneNumber.substring(1)}`
        : phoneNumber.startsWith('+')
        ? phoneNumber.substring(1)
        : phoneNumber;

      if (!amount || amount < 1) {
        throw new Error('Amount must be at least 1 KES');
      }

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
    <Card className="p-4 shadow-sm">
      <div className="text-center mb-4">
        <img src="/M-PESA_LOGO-01.svg" alt="M-Pesa" style={{ height: '50px', marginBottom: '1rem' }} />
        <h5 className="mt-3">Pay with M-Pesa</h5>
        <p className="text-muted small">Secure mobile payment powered by Safaricom</p>
      </div>

      <Form onSubmit={handleSubmit}>
        {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}
        {success && <Alert variant="success" dismissible onClose={() => setSuccess(null)}>{success}</Alert>}
        
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
            Must start with 0, +254, or 254
          </Form.Text>
        </Form.Group>

        <Form.Group controlId="amount" className="mb-3">
  <Form.Label>Amount (KES)</Form.Label>
  <Form.Control
    type="number"
    value={amount}
    readOnly
    plaintext 
  />
</Form.Group>


        <Button variant="success" type="submit" disabled={isLoading} className="w-100">
          {isLoading ? 'Processing...' : 'Pay via M-Pesa'}
        </Button>
      </Form>
    </Card>
  );
};

export default PaymentForm;