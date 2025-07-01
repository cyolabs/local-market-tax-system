import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import PaymentForm from './PaymentForm';

const PaymentModal = ({ show, handleClose, onPaymentSuccess }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Make Payment</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <PaymentForm onPaymentInitiated={onPaymentSuccess} />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};


export default PaymentModal;