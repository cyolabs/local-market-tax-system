import React from 'react';
import { Modal, Button, Table } from 'react-bootstrap';

const Receipt = ({ transaction, show, onHide }) => {
  if (!transaction) return null;

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Payment Receipt</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="receipt-container">
          <h4 className="text-center mb-4">COUNTY GOVERNMENT RECEIPT</h4>
          
          <Table borderless>
            <tbody>
              <tr>
                <td><strong>Receipt No:</strong></td>
                <td>{transaction.receipt_number}</td>
              </tr>
              <tr>
                <td><strong>Date:</strong></td>
                <td>{new Date(transaction.created_at).toLocaleString()}</td>
              </tr>
              <tr className="border-top">
                <td colSpan="2"><strong>TRANSACTION DETAILS</strong></td>
              </tr>
              <tr>
                <td><strong>Amount:</strong></td>
                <td>KES {transaction.amount.toLocaleString()}</td>
              </tr>
              <tr>
                <td><strong>Category:</strong></td>
                <td>{transaction.account_reference}</td>
              </tr>
              <tr>
                <td><strong>Phone:</strong></td>
                <td>{transaction.phone_number}</td>
              </tr>
              <tr>
                <td><strong>Status:</strong></td>
                <td>
                  <span className={`badge ${
                    transaction.status === 'Completed' ? 'bg-success' : 
                    transaction.status === 'Failed' ? 'bg-danger' : 'bg-warning'
                  }`}>
                    {transaction.status}
                  </span>
                </td>
              </tr>
            </tbody>
          </Table>
          
          <div className="text-center mt-4">
            <p className="text-muted">Thank you for your payment!</p>
            <p className="text-muted">County Government Revenue System</p>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button 
          variant="primary" 
          onClick={() => window.print()}
          className="no-print"
        >
          Print Receipt
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Receipt;