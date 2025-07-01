const ReceiptPage = ({ transaction }) => {
  return (
    <div className="receipt">
      <h2>Payment Receipt</h2>
      <p><strong>Amount:</strong> KES {transaction.amount}</p>
      <p><strong>Transaction ID:</strong> {transaction.transaction_id}</p>
      <p><strong>Phone:</strong> {transaction.phone_number}</p>
      <p><strong>Date:</strong> {new Date(transaction.transaction_date).toLocaleString()}</p>
      <button onClick={() => window.print()}>Print Receipt</button>
    </div>
  );
};