import React, { useEffect, useState } from "react";
import { Table, Button, Form, Spinner, Alert, Modal } from "react-bootstrap";
import axios from "axios";

const Ticket = () => {
  const [tickets, setTickets] = useState([]);
  const [statusFilter, setStatusFilter] = useState("Pending");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [newStatus, setNewStatus] = useState("Pending");
  const [adminNote, setAdminNote] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);

  const fetchTickets = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(
        `https://backend-music-xg6e.onrender.com/api/v1/ticket?status=${statusFilter}`
      );
      setTickets(res.data);
    } catch (err) {
      setError("Failed to load tickets. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [statusFilter]);

  const handleStatusChange = async () => {
    setSubmitLoading(true);
    try {
      await axios.put(
        `https://backend-music-xg6e.onrender.com/api/v1/ticket/${selectedTicket._id}`,
        {
          status: newStatus,
          adminNote,
        }
      );
      setShowModal(false);
      fetchTickets();
      setSubmitLoading(false);
    } catch (err) {
      alert("Failed to update ticket status.");
    }
  };

  const handleEditClick = (ticket) => {
    setSelectedTicket(ticket);
    setNewStatus(ticket.status);
    setAdminNote(ticket.adminNote || "");
    setShowModal(true);
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-3">Ticket Management</h3>

      <Form.Select
        className="mb-3 w-auto"
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
      >
        <option value="Pending">Pending</option>
        <option value="Resolved">Resolved</option>
        <option value="Rejected">Rejected</option>
      </Form.Select>

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : tickets.length === 0 ? (
        <Alert variant="info">
          No tickets found for "{statusFilter}" status.
        </Alert>
      ) : (
        <div className="table-responsive">
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Subject</th>
                <th>Message</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket._id}>
                  <td>{ticket.userId?.fullName || "Unknown"}</td>
                  <td>{ticket.userId?.email || "Unknown"}</td>
                  <td>{ticket.subject}</td>
                  <td>{ticket.message}</td>
                  <td>
                    <span
                      className={`badge bg-${
                        ticket.status === "Pending"
                          ? "warning"
                          : ticket.status === "Resolved"
                          ? "success"
                          : "danger"
                      }`}
                    >
                      {ticket.status}
                    </span>
                  </td>
                  <td className="">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleEditClick(ticket)}
                    >
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {/* Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Update Ticket Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <option value="Pending">Pending</option>
              <option value="Resolved">Resolved</option>
              <option value="Rejected">Rejected</option>
            </Form.Select>
          </Form.Group>

          <Form.Group>
            <Form.Label>Admin Note</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              placeholder="Optional note (e.g., 'Check your email for details')"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleStatusChange}>
            {submitLoading && <Spinner animation="border" size="sm" />}
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Ticket;
