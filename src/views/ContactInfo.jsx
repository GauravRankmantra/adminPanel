import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Form,
  Button,
  Row,
  Col,
  Card,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import { Table, Modal } from "react-bootstrap";

import moment from "moment";

const ContactInfo = () => {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(
        "https://backend-music-xg6e.onrender.com/api/v1/contact"
      );
      setMessages(response.data.data);
    } catch (error) {
      console.error("Error fetching contact messages:", error);
    }
  };

  const handleViewMessage = (message) => {
    setSelectedMessage(message);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedMessage(null);
  };
  const [formData, setFormData] = useState({
    phone: "",
    email: "",
    address: "",
    mapEmbedLink: "",
    facebook: "",
    instagram: "",
    Twitter: "",
  });

  const [initialData, setInitialData] = useState(null);
  const [contactId, setContactId] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    axios
      .get(
        "https://backend-music-xg6e.onrender.com/api/v1/contact/contact-info"
      )
      .then((res) => {
        const data = res.data;
        setFormData(data);
        setInitialData(data);
        setContactId(data._id);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const hasChanges = () => {
    if (!initialData) return false;
    return Object.keys(formData).some(
      (key) => formData[key] !== initialData[key]
    );
  };

  const handleDeleteMessage = async (id) => {
    try {
      await axios.delete(
        `https://backend-music-xg6e.onrender.com/api/v1/contact/${id}`
      );
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg._id !== id)
      );
      setToastMessage("Message deleted successfully.");
      setShowToast(true);
    } catch (error) {
      console.error("Error deleting message:", error);
      setToastMessage("Failed to delete message.");
      setShowToast(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!hasChanges()) {
      setToastMessage("No changes made.");
      setShowToast(true);
      return;
    }

    await axios.put(
      `https://backend-music-xg6e.onrender.com/api/v1/contact/contact-info/${contactId}`,
      formData
    );
    setToastMessage("Contact info updated!");
    setShowToast(true);
    setInitialData(formData); // Update initialData after successful save
  };

  return (
    <>
      <Container className="mt-5 position-relative">
        <Card className="shadow">
          <Card.Header className="bg-primary text-white text-center">
            <h4>Update Contact Information</h4>
          </Card.Header>
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group controlId="formPhone">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter phone number"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="formEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter email address"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3" controlId="formAddress">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter address"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Facebook</Form.Label>
                <Form.Control
                  type="text"
                  name="facebook"
                  value={formData.facebook}
                  onChange={handleChange}
                  placeholder="Enter Facebook link"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Instagram</Form.Label>
                <Form.Control
                  type="text"
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleChange}
                  placeholder="Enter Instagram link"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>X (Twitter)</Form.Label>
                <Form.Control
                  type="text"
                  name="twitter"
                  value={formData.Twitter}
                  onChange={handleChange}
                  placeholder="Enter Twitter/X link"
                />
              </Form.Group>

              <Form.Group className="mb-4" controlId="formMapEmbedLink">
                <Form.Label>Map Embed Link</Form.Label>
                <Form.Control
                  type="text"
                  name="mapEmbedLink"
                  value={formData.mapEmbedLink}
                  onChange={handleChange}
                  placeholder="Enter map embed URL"
                />
              </Form.Group>

              <div className="text-center">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={!hasChanges()}
                >
                  Update Info
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>

        {/* Toast */}
        <ToastContainer position="top-end" className="p-3">
          <Toast
            onClose={() => setShowToast(false)}
            show={showToast}
            delay={2500}
            autohide
            bg="info"
          >
            <Toast.Body className="text-white">{toastMessage}</Toast.Body>
          </Toast>
        </ToastContainer>
      </Container>
      <Container className="mt-5">
        <h2>Contact Messages</h2>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Sent On</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {messages?.map((message, index) => (
              <tr key={message._id}>
                <td>{index + 1}</td>
                <td>{message.name}</td>
                <td>{message.email}</td>
                <td>{message.phone}</td>
                <td>{moment(message.createdAt).format("YYYY-MM-DD HH:mm")}</td>
                <td>
                  <div className="d-grid gap-2">
                    <Button
                      variant="info"
                      size="sm"
                      onClick={() => handleViewMessage(message)}
                    >
                      View
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteMessage(message._id)} // Assuming you have a delete function
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* View Message Modal */}
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Contact Message Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedMessage && (
              <div>
                <p>
                  <strong>Name:</strong> {selectedMessage.name}
                </p>
                <p>
                  <strong>Email:</strong> {selectedMessage.email}
                </p>
                <p>
                  <strong>Phone:</strong> {selectedMessage.phone}
                </p>
                <p>
                  <strong>Message:</strong>
                </p>
                <p>{selectedMessage.message}</p>
                <p className="mt-3">
                  <strong>Sent On:</strong>{" "}
                  {selectedMessage?.createdAt && (
                    <span>
                      {moment(selectedMessage.createdAt).format(
                        "YYYY-MM-DD HH:mm:ss"
                      )}
                    </span>
                  )}
                </p>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
};

export default ContactInfo;
