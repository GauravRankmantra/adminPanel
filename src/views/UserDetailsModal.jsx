import React from 'react';
import { Modal, Button, Row, Col, Image, ListGroup } from 'react-bootstrap';
import {
  FaEnvelope, FaUser, FaBuilding, FaPhone, FaFacebook,
  FaInstagram, FaTwitter, FaCrown, FaCheckCircle, FaStar,
  FaMusic, FaDownload, FaChartLine, FaCalendarAlt, FaTimesCircle
} from 'react-icons/fa';

import { GoHistory } from "react-icons/go";
import { CiSaveDown2 } from "react-icons/ci";
import { PiMusicNotesLight } from "react-icons/pi";
import { TfiStatsUp } from "react-icons/tfi";





const UserDetailsModal = ({ show, handleClose, user }) => {
  if (!user) return null; // Don't render if user data isn't provided yet

  // Helper function to format dates
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton style={{ backgroundColor: '#212529', color: '#fff', borderBottom: 'none' }}>
        <Modal.Title style={{ fontWeight: '600', fontSize: '1.75rem' }}>
          <FaUser className="me-2" style={{ color: '#00bcd4' }} /> User Details: {user.fullName}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: '#f8f9fa', padding: '30px' }}>
        <Row className="align-items-center mb-4">
          <Col md={3} className="text-center">
            <Image
              src={user?.coverImage || 'https://via.placeholder.com/150/007bff/ffffff?text=No+Avatar'}
              roundedCircle
              fluid
              style={{ width: '120px', height: '120px', objectFit: 'cover', border: '3px solid #007bff' }}
              alt="User Avatar"
            />
            {user.isVerified && (
              <p className="mt-2 mb-0 text-success fw-bold">
                <FaCheckCircle className="me-1" /> Verified
              </p>
            )}
             {user.isFeatured && (
              <p className="mb-0 text-info fw-bold">
                <FaStar className="me-1" /> Featured
              </p>
            )}
          </Col>
          <Col md={9}>
            <h3 className="mb-3 text-dark" style={{ fontSize: '2rem', fontWeight: 'bold' }}>{user.fullName}</h3>
            <p className="text-muted mb-1" style={{ fontSize: '1.1rem' }}>
              <FaEnvelope className="me-2" style={{ color: '#6c757d' }} />{user.email}
            </p>
            {user.phoneNumber && (
              <p className="text-muted mb-1" style={{ fontSize: '1.1rem' }}>
                <FaPhone className="me-2" style={{ color: '#6c757d' }} />{user.phoneNumber}
              </p>
            )}
            {user.address && (
              <p className="text-muted mb-1" style={{ fontSize: '1.1rem' }}>
                <FaBuilding className="me-2" style={{ color: '#6c757d' }} />{user.address}
              </p>
            )}
            {user.bio && (
              <p className="mt-3 text-secondary" style={{ fontStyle: 'italic' }}>
                "{user.bio}"
              </p>
            )}
          </Col>
        </Row>

        <h4 className="mb-3 text-dark border-bottom pb-2" style={{ borderBottomColor: '#dee2e6' }}>
          <TfiStatsUp className="me-2" style={{ color: '#fd7e14' }} /> Activity & Stats
        </h4>
        <Row className="mb-4">
          <Col md={4} className="mb-3">
            <div className="bg-white p-3 rounded shadow-sm text-center">
              <GoHistory size={28} className="text-success mb-2" />
              <h5 className="mb-0 text-dark">Songs History</h5>
              <p className="mb-0 fw-bold" style={{ fontSize: '1.2rem', color: '#28a745' }}>{user.songsHistory.length}</p>
            </div>
          </Col>
          <Col md={4} className="mb-3">
            <div className="bg-white p-3 rounded shadow-sm text-center">
              <CiSaveDown2 size={28} className="text-info mb-2" />
              <h5 className="mb-0 text-dark">Downloaded This Month</h5>
              <p className="mb-0 fw-bold" style={{ fontSize: '1.2rem', color: '#17a2b8' }}>{user.downloadedSongsThisMonth}</p>
            </div>
          </Col>
          <Col md={4} className="mb-3">
            <div className="bg-white p-3 rounded shadow-sm text-center">
              <PiMusicNotesLight size={28} className="text-warning mb-2" />
              <h5 className="mb-0 text-dark">Uploaded This Month</h5>
              <p className="mb-0 fw-bold" style={{ fontSize: '1.2rem', color: '#ffc107' }}>{user.uploadedSongsThisMonth}</p>
            </div>
          </Col>
        </Row>

        <h4 className="mb-3 text-dark border-bottom pb-2" style={{ borderBottomColor: '#dee2e6' }}>
          <FaCalendarAlt className="me-2" style={{ color: '#6f42c1' }} /> Important Dates
        </h4>
        <ListGroup variant="flush" className="mb-4">
          <ListGroup.Item style={{ backgroundColor: '#f8f9fa', border: 'none', padding: '8px 0' }}>
            <strong>Account Created:</strong> {formatDate(user.createdAt)}
          </ListGroup.Item>
          <ListGroup.Item style={{ backgroundColor: '#f8f9fa', border: 'none', padding: '8px 0' }}>
            <strong>Last Updated:</strong> {formatDate(user.updatedAt)}
          </ListGroup.Item>
          {user.paymentDate && (
            <ListGroup.Item style={{ backgroundColor: '#f8f9fa', border: 'none', padding: '8px 0' }}>
              <strong>Last Payment:</strong> {formatDate(user.paymentDate)}
            </ListGroup.Item>
          )}
        </ListGroup>

        {(user.facebook || user.instagram || user.twitter) && (
          <>
            <h4 className="mb-3 text-dark border-bottom pb-2" style={{ borderBottomColor: '#dee2e6' }}>
              <FaUser className="me-2" style={{ color: '#dc3545' }} /> Social Media
            </h4>
            <div className="d-flex mb-4">
              {user.facebook && (
                <a href={user.facebook} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary me-2" style={{ borderColor: '#007bff', color: '#007bff' }}>
                  <FaFacebook className="me-1" /> Facebook
                </a>
              )}
              {user.instagram && (
                <a href={user.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-outline-danger me-2" style={{ borderColor: '#dc3545', color: '#dc3545' }}>
                  <FaInstagram className="me-1" /> Instagram
                </a>
              )}
              {user.twitter && (
                <a href={user.twitter} target="_blank" rel="noopener noreferrer" className="btn btn-outline-info" style={{ borderColor: '#17a2b8', color: '#17a2b8' }}>
                  <FaTwitter className="me-1" /> Twitter
                </a>
              )}
            </div>
          </>
        )}

        <h4 className="mb-3 text-dark border-bottom pb-2" style={{ borderBottomColor: '#dee2e6' }}>
          <FaCrown className="me-2" style={{ color: '#ffc107' }} /> Roles & Status
        </h4>
        <ListGroup className="mb-4">
          <ListGroup.Item style={{ backgroundColor: '#f8f9fa', border: 'none', padding: '8px 0' }}>
            <strong>Role:</strong> <span className={`badge ${user.role === 'admin' ? 'bg-danger' : 'bg-success'}`}>{user.role}</span>
          </ListGroup.Item>
          <ListGroup.Item style={{ backgroundColor: '#f8f9fa', border: 'none', padding: '8px 0' }}>
            <strong>Can Sell:</strong>{' '}
            {user.canSell ? (
              <span className="badge bg-success">Yes</span>
            ) : (
              <span className="badge bg-secondary">No</span>
            )}
          </ListGroup.Item>
          <ListGroup.Item style={{ backgroundColor: '#f8f9fa', border: 'none', padding: '8px 0' }}>
            <strong>Verification State:</strong>{' '}
            <span className={`badge ${user.verificationState === 'verified' ? 'bg-success' : user.verificationState === 'pending' ? 'bg-warning' : 'bg-danger'}`}>
              {user.verificationState}
            </span>
          </ListGroup.Item>
           <ListGroup.Item style={{ backgroundColor: '#f8f9fa', border: 'none', padding: '8px 0' }}>
            <strong>Stripe ID:</strong> {user.stripeId || 'N/A'}
          </ListGroup.Item>
          <ListGroup.Item style={{ backgroundColor: '#f8f9fa', border: 'none', padding: '8px 0' }}>
            <strong>Paypal ID:</strong> {user.paypalId || 'N/A'}
          </ListGroup.Item>
        </ListGroup>

      </Modal.Body>
      <Modal.Footer style={{ borderTop: 'none', backgroundColor: '#f8f9fa' }}>
        <Button variant="secondary" onClick={handleClose} style={{ borderRadius: '20px', padding: '8px 20px' }}>
          <FaTimesCircle className="me-1" /> Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UserDetailsModal;