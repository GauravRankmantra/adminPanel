import React from 'react';
import { Modal, Button, Row, Col, ListGroup, Badge } from 'react-bootstrap';
import { FaMoneyBillWave, FaExchangeAlt, FaClock, FaCalendarAlt, FaUser, FaMusic, FaInfoCircle } from 'react-icons/fa';

// Helper function for currency formatting (same as in PaymentsTable.js)
const formatCurrency = (amount, currency, locale = 'en-US') => {
  if (amount === null || amount === undefined) return 'N/A';
  const numericAmount = parseFloat(amount);
  if (isNaN(numericAmount)) return 'Invalid Amount';

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numericAmount);
  } catch (e) {
    return `${numericAmount.toFixed(2)} ${currency}`;
  }
};

// Helper function for date formatting (same as in PaymentsTable.js)
const formatDate = (isoString) => {
  if (!isoString) return 'N/A';
  try {
    return new Date(isoString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false, // Use 24-hour format
    });
  } catch (e) {
    return isoString;
  }
};


const TransactionDetailModal = ({ show, onHide, transaction }) => {
  if (!transaction) return null; // Don't render if no transaction is passed

  const feeDetails = transaction.feeDetails && transaction.feeDetails.length > 0
    ? transaction.feeDetails[0]
    : {};

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title>Payment Transaction Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ListGroup variant="flush">
          {/* General Payment Information */}
          <ListGroup.Item className="d-flex justify-content-between align-items-center">
            <div>
              <FaMoneyBillWave className="me-2 text-info" />
              <strong>Payment Status:</strong>
            </div>
            <Badge bg={
              transaction.paymentStatus === 'succeeded' ? 'success' :
              transaction.paymentStatus === 'pending' ? 'warning' : 'danger'
            }>
              {transaction.paymentStatus || 'N/A'}
            </Badge>
          </ListGroup.Item>
          <ListGroup.Item className="d-flex justify-content-between align-items-center">
            <div>
              <FaMoneyBillWave className="me-2 text-info" />
              <strong>Payout Status:</strong>
            </div>
            <Badge bg={
              transaction.payoutStatus === 'paid' ? 'success' :
              transaction.payoutStatus === 'pending' ? 'warning' : 'info'
            }>
              {transaction.payoutStatus || 'N/A'}
            </Badge>
          </ListGroup.Item>

          <ListGroup.Item>
            <Row>
              <Col md={6}><strong>Payment Intent ID:</strong></Col>
              <Col md={6} className="text-break">{transaction.paymentIntentId || 'N/A'}</Col>
            </Row>
          </ListGroup.Item>
          <ListGroup.Item>
            <Row>
              <Col md={6}><strong>Latest Charge ID:</strong></Col>
              <Col md={6} className="text-break">{transaction.latestChargeId || 'N/A'}</Col>
            </Row>
          </ListGroup.Item>
          <ListGroup.Item>
            <Row>
              <Col md={6}><FaUser className="me-2 text-secondary" /><strong>Receipt Email:</strong></Col>
              <Col md={6}>{transaction.receiptEmail || 'N/A'}</Col>
            </Row>
          </ListGroup.Item>

          {/* Customer & Earnings */}
          <ListGroup.Item className="mt-3 bg-light"><h5><FaMoneyBillWave className="me-2" />Amounts & Earnings</h5></ListGroup.Item>
          <ListGroup.Item>
            <Row>
              <Col md={6}><strong>Customer Paid:</strong></Col>
              <Col md={6}>
                {formatCurrency(
                  transaction.customerFacingAmount,
                  transaction.customerFacingCurrency
                )}
              </Col>
            </Row>
          </ListGroup.Item>
          <ListGroup.Item>
            <Row>
              <Col md={6}><strong>Processed Amount (Gross):</strong></Col>
              <Col md={6}>
                {formatCurrency(
                  transaction.processedAmount,
                  transaction.processedCurrency
                )}
              </Col>
            </Row>
          </ListGroup.Item>
          <ListGroup.Item>
            <Row>
              <Col md={6}><strong>Net Amount (after fees):</strong></Col>
              <Col md={6}>
                {formatCurrency(
                  transaction.netAmount,
                  transaction.processedCurrency
                )}
              </Col>
            </Row>
          </ListGroup.Item>
          <ListGroup.Item>
            <Row>
              <Col md={6}><strong>Stripe Fee:</strong></Col>
              <Col md={6}>
                {formatCurrency(
                  transaction.feeAmount,
                  transaction.feeCurrency
                )}
                {feeDetails.description ? ` (${feeDetails.description})` : ''}
              </Col>
            </Row>
          </ListGroup.Item>
          <ListGroup.Item>
            <Row>
              <Col md={6}><strong>Seller Earning:</strong></Col>
              <Col md={6}>
                {formatCurrency(
                  transaction.sellerEarning,
                  transaction.processedCurrency // Assuming base currency for earnings
                )}
              </Col>
            </Row>
          </ListGroup.Item>
          <ListGroup.Item>
            <Row>
              <Col md={6}><strong>Admin Earning:</strong></Col>
              <Col md={6}>
                {formatCurrency(
                  transaction.adminEarning,
                  transaction.processedCurrency // Assuming base currency for earnings
                )}
              </Col>
            </Row>
          </ListGroup.Item>

          {/* Currency Conversion */}
          {transaction.exchangeRate && transaction.originalCurrency && transaction.convertedCurrency && (
            <ListGroup.Item>
              <Row>
                <Col md={6}><FaExchangeAlt className="me-2 text-warning" /><strong>Currency Conversion:</strong></Col>
                <Col md={6}>
                  {transaction.originalCurrency} to {transaction.convertedCurrency} @ {transaction.exchangeRate}
                </Col>
              </Row>
            </ListGroup.Item>
          )}

          {/* Transaction & Payout Dates */}
          <ListGroup.Item className="mt-3 bg-light"><h5><FaCalendarAlt className="me-2" />Dates & Times</h5></ListGroup.Item>
          <ListGroup.Item>
            <Row>
              <Col md={6}><strong>Transaction Created:</strong></Col>
              <Col md={6}>{formatDate(transaction.transactionCreatedDateTime)}</Col>
            </Row>
          </ListGroup.Item>
          <ListGroup.Item>
            <Row>
              <Col md={6}><strong>Funds Available On:</strong></Col>
              <Col md={6}>{formatDate(transaction.availableOnDateTime)}</Col>
            </Row>
          </ListGroup.Item>
          <ListGroup.Item>
            <Row>
              <Col md={6}><strong>Database Created At:</strong></Col>
              <Col md={6}>{formatDate(transaction.createdAt)}</Col>
            </Row>
          </ListGroup.Item>
          <ListGroup.Item>
            <Row>
              <Col md={6}><strong>Database Updated At:</strong></Col>
              <Col md={6}>{formatDate(transaction.updatedAt)}</Col>
            </Row>
          </ListGroup.Item>

          {/* Linked Entities */}
          <ListGroup.Item className="mt-3 bg-light"><h5><FaUser className="me-2" />Linked Entities</h5></ListGroup.Item>
          <ListGroup.Item>
            <Row>
              <Col md={6}><strong>Buyer:</strong></Col>
              <Col md={6}>{transaction.buyerId?.fullName || 'N/A'}{transaction.buyerId?._id ? ` (ID: ${transaction.buyerId._id})` : ''}</Col>
            </Row>
          </ListGroup.Item>
          <ListGroup.Item>
            <Row>
              <Col md={6}><strong>Seller:</strong></Col>
              <Col md={6}>
                {transaction.sellerId?.fullName || 'N/A'}
                {transaction.sellerId?.admin ? ' (Admin)' : ''}
                {transaction.sellerId?._id ? ` (ID: ${transaction.sellerId._id})` : ''}
              </Col>
            </Row>
          </ListGroup.Item>
          <ListGroup.Item>
            <Row>
              <Col md={6}><FaMusic className="me-2" /><strong>Song:</strong></Col>
              <Col md={6}>{transaction.songId?.title || 'N/A'}{transaction.songId?._id ? ` (ID: ${transaction.songId._id})` : ''}</Col>
            </Row>
          </ListGroup.Item>

          {/* Other Details */}
          <ListGroup.Item className="mt-3 bg-light"><h5><FaInfoCircle className="me-2" />Other Details</h5></ListGroup.Item>
          <ListGroup.Item>
            <Row>
              <Col md={6}><strong>Balance Transaction ID:</strong></Col>
              <Col md={6} className="text-break">{transaction.balanceTransactionId || 'N/A'}</Col>
            </Row>
          </ListGroup.Item>
          <ListGroup.Item>
            <Row>
              <Col md={6}><strong>Reporting Category:</strong></Col>
              <Col md={6}>{transaction.reportingCategory || 'N/A'}</Col>
            </Row>
          </ListGroup.Item>
          <ListGroup.Item>
            <Row>
              <Col md={6}><strong>Transaction Type:</strong></Col>
              <Col md={6}>{transaction.transactionType || 'N/A'}</Col>
            </Row>
          </ListGroup.Item>
          <ListGroup.Item>
            <Row>
              <Col md={6}><strong>Capture Method:</strong></Col>
              <Col md={6}>{transaction.captureMethod || 'N/A'}</Col>
            </Row>
          </ListGroup.Item>
          <ListGroup.Item>
            <Row>
              <Col md={6}><strong>Description:</strong></Col>
              <Col md={6}>{transaction.description || 'N/A'}</Col>
            </Row>
          </ListGroup.Item>
          <ListGroup.Item>
            <Row>
              <Col md={6}><strong>Customer (Stripe ID):</strong></Col>
              <Col md={6}>{transaction.customer || 'N/A'}</Col>
            </Row>
          </ListGroup.Item>
          <ListGroup.Item>
            <Row>
              <Col md={6}><strong>Payment Method Type:</strong></Col>
              <Col md={6}>{transaction.paymentMethodType || 'N/A'}</Col>
            </Row>
          </ListGroup.Item>

          {transaction.receiptUrl && (
            <ListGroup.Item>
              <Row>
                <Col md={6}><strong>Receipt URL:</strong></Col>
                <Col md={6}>
                  <a href={transaction.receiptUrl} target="_blank" rel="noopener noreferrer">
                    View Receipt
                  </a>
                </Col>
              </Row>
            </ListGroup.Item>
          )}

        </ListGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TransactionDetailModal;