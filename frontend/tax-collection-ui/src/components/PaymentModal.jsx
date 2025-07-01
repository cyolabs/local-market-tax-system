import React, { useState } from 'react';
import { Modal, Button, Spinner, Alert } from 'react-bootstrap';
import PaymentForm from './PaymentForm';
import { downloadReceipt } from '../services/mpesaService';

const PaymentModal = ({ show, handleClose, onPaymentSuccess, transaction }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState(null);

  const handleDownload = async () => {
    if (!transaction?.id) {
      setError('No transaction available');
      return;
    }

    setIsDownloading(true);
    setError(null);
    
    try {
      const result = await downloadReceipt(transaction.id);
      
      if (result.success) {
        const url = window.URL.createObjectURL(result.blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = result.fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to download receipt');
      console.error(err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Payment Receipt</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <PaymentForm onPaymentInitiated={onPaymentSuccess} />
        
        {transaction?.status === 'Completed' && (
          <div className="mt-3">
            {error && <Alert variant="danger">{error}</Alert>}
            <Button 
              variant="success" 
              onClick={handleDownload}
              disabled={isDownloading}
            >
              {isDownloading ? (
                <>
                  <Spinner as="span" animation="border" size="sm" />
                  {' Downloading...'}
                </>
              ) : 'Download Receipt'}
            </Button>
          </div>
        )}
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