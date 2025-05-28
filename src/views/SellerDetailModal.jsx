// src/components/SellerDetailModal.js
import React from 'react';
import { Modal, Button, Image, ListGroup, Badge, Row, Col, Table ,Alert} from 'react-bootstrap';
import moment from 'moment'; // For formatting dates

const SellerDetailModal = ({ show, onHide, seller }) => {
  if (!seller) {
    return null; // Don't render if no seller data is provided
  }

  return (
    <Modal show={show} onHide={onHide} size="lg" centered scrollable>
      <Modal.Header closeButton>
        <Modal.Title className="text-primary">Seller Details: {seller.fullName}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        <Row className="mb-4 align-items-center">
          <Col md={4} className="text-center">
            <Image
              src={seller.coverImage || 'https://via.placeholder.com/150?text=No+Avatar'}
              alt={`${seller.fullName}'s avatar`}
              roundedCircle
              fluid
              style={{ width: '150px', height: '150px', objectFit: 'cover', border: '3px solid #007bff' }}
            />
          </Col>
          <Col md={8}>
            <h3 className="mb-2">{seller.fullName}</h3>
            {seller.email && <p className="text-muted mb-1"><i className="bi bi-envelope-fill me-2"></i>{seller.email}</p>}
            {seller.phoneNumber && <p className="text-muted mb-1"><i className="bi bi-telephone-fill me-2"></i>{seller.phoneNumber}</p>}
            {seller.address && <p className="text-muted mb-1"><i className="bi bi-geo-alt-fill me-2"></i>{seller.address}</p>}
            {seller.bio && <p className="text-secondary mt-3">{seller.bio}</p>}
          </Col>
        </Row>

        {/* {seller.coverImage && (
          <div className="mb-4 text-center">
            <h5>Cover Image</h5>
            <Image
              src={seller.coverImage}
              alt={`${seller.fullName}'s cover`}
              fluid
              className="rounded shadow-sm"
              style={{ maxHeight: '250px', objectFit: 'cover', width: '100%' }}
            />
          </div>
        )} */}

        <h4 className="mb-3 text-primary">Key Metrics</h4>
        <ListGroup variant="flush" className="mb-4">
          <ListGroup.Item className="d-flex justify-content-between align-items-center">
            Total Seller Earnings
            <Badge bg="success" className="p-2 fs-6">${seller.totalSellerEarnings?.toFixed(2) || '0.00'}</Badge>
          </ListGroup.Item>
          <ListGroup.Item className="d-flex justify-content-between align-items-center">
            Total Songs Sold
            <Badge bg="info" className="p-2 fs-6">{seller.totalSongsSold || 0}</Badge>
          </ListGroup.Item>
          {seller.popularity !== undefined && (
            <ListGroup.Item className="d-flex justify-content-between align-items-center">
              Popularity Score
              <Badge bg="secondary" className="p-2 fs-6">{seller.popularity}</Badge>
            </ListGroup.Item>
          )}
          {seller.role && (
            <ListGroup.Item className="d-flex justify-content-between align-items-center">
              Role
              <Badge bg="dark" className="p-2 fs-6 text-capitalize">{seller.role}</Badge>
            </ListGroup.Item>
          )}
           {seller.isVerified !== undefined && (
            <ListGroup.Item className="d-flex justify-content-between align-items-center">
              Verified Status
              <Badge bg={seller.isVerified ? 'success' : 'danger'} className="p-2 fs-6">
                {seller.isVerified ? 'Verified' : 'Not Verified'}
              </Badge>
            </ListGroup.Item>
          )}
           {seller.verificationState && seller.verificationState !== 'no' && (
            <ListGroup.Item className="d-flex justify-content-between align-items-center">
              Verification State
              <Badge bg={seller.verificationState === 'pending' ? 'warning' : 'danger'} className="p-2 fs-6 text-capitalize">
                {seller.verificationState}
              </Badge>
            </ListGroup.Item>
          )}
        </ListGroup>

        {/* --- Sales Details (if available) --- */}
        {seller.sellerSales && seller.sellerSales.length > 0 && (
          <>
            <h4 className="mb-3 text-primary">Recent Sales Details</h4>
            <Table striped bordered hover responsive className="shadow-sm">
              <thead className="table-dark">
                <tr>
                  <th>Sale ID</th>
                  <th>Amount Paid</th>
                  <th>Seller Earning</th>
                  <th>Platform Share</th>
                  <th>Admin Earning</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {seller.sellerSales.map((sale) => (
                  <tr key={sale._id}>
                    <td><small>{sale._id}</small></td>
                    <td>${sale.amountPaid?.toFixed(2)}</td>
                    <td>${sale.sellerEarning?.toFixed(2)}</td>
                    <td>${sale.platformShare?.toFixed(2)}</td>
                    <td><Badge bg='success'>$ {sale.adminEarning}</Badge></td>
                    <td>{moment(sale.createdAt).format('MMM DD, YYYY')}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <p className="text-end text-muted mt-2 small">
              Displaying {seller.sellerSales.length} recent sales.
            </p>
          </>
        )}
        {seller.sellerSales && seller.sellerSales.length === 0 && (
          <Alert variant="info" className="text-center">No sales records found for this seller.</Alert>
        )}

        {/* --- Other Seller Info --- */}
        <h4 className="mb-3 mt-4 text-primary">Additional Information</h4>
        <ListGroup variant="flush">
          {seller.stripeId && (
            <ListGroup.Item><strong>Stripe ID:</strong> <span className="text-muted small">{seller.stripeId}</span></ListGroup.Item>
          )}
          {seller.paypalId && (
            <ListGroup.Item><strong>PayPal ID:</strong> <span className="text-muted small">{seller.paypalId}</span></ListGroup.Item>
          )}
          {seller.facebook && (
            <ListGroup.Item><strong>Facebook:</strong> <a href={seller.facebook} target="_blank" rel="noopener noreferrer">{seller.facebook}</a></ListGroup.Item>
          )}
          {seller.instagram && (
            <ListGroup.Item><strong>Instagram:</strong> <a href={seller.instagram} target="_blank" rel="noopener noreferrer">{seller.instagram}</a></ListGroup.Item>
          )}
          {seller.twitter && (
            <ListGroup.Item><strong>Twitter:</strong> <a href={seller.twitter} target="_blank" rel="noopener noreferrer">{seller.twitter}</a></ListGroup.Item>
          )}
          {seller.plan && (
            <ListGroup.Item><strong>Subscription Plan:</strong> {seller.plan.name || 'N/A'}</ListGroup.Item>
          )}
          {seller.paymentDate && (
             <ListGroup.Item><strong>Last Payment Date:</strong> {moment(seller.paymentDate).format('MMM DD, YYYY')}</ListGroup.Item>
          )}
          {seller.uploadedSongsThisMonth !== undefined && (
             <ListGroup.Item><strong>Songs Uploaded This Month:</strong> {seller.uploadedSongsThisMonth}</ListGroup.Item>
          )}
          {seller.downloadedSongsThisMonth !== undefined && (
             <ListGroup.Item><strong>Songs Downloaded This Month (as buyer):</strong> {seller.downloadedSongsThisMonth}</ListGroup.Item>
          )}
          {seller.createdAt && (
            <ListGroup.Item><strong>Member Since:</strong> {moment(seller.createdAt).format('MMM DD, YYYY')}</ListGroup.Item>
          )}
          {seller.updatedAt && (
            <ListGroup.Item><strong>Last Updated:</strong> {moment(seller.updatedAt).format('MMM DD, YYYY, h:mm A')}</ListGroup.Item>
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

export default SellerDetailModal;