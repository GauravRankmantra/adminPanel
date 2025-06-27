import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Card,
  Button,
  Form,
  Row,
  Col,
  Alert,
  Spinner,
  ListGroup,
  InputGroup,
} from "react-bootstrap";
import {
  FaEdit,
  FaCheck,
  FaTimes,
  FaPlus,
  FaTrash,
  FaLink,
  FaHeading,
  FaInfoCircle,
} from "react-icons/fa"; // React Icons
import { toast } from "react-hot-toast"; // For toast notifications
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;
// API Configuration
const API_BASE_URL = `${apiUrl}`; // Ensure this matches your backend URL
const FOOTER_API_ENDPOINT = `${API_BASE_URL}/footer`;

// Helper to get authentication token (mock for production readiness)
const getConfig = () => {
  const token = localStorage.getItem("adminToken"); // Assuming admin token is stored here
  if (!token) {
    console.error("Admin token not found. Please log in.");
    // In a real app, you'd throw an error or redirect
  }
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

const FooterManagement = () => {
  const [footerData, setFooterData] = useState(null); // Stores fetched, original data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    // Data currently being edited in form
    mainHeading: "",
    links: [],
    subscribe: "",
  });
  const [isUpdating, setIsUpdating] = useState(false);

  // --- Fetch Footer Data ---
  const fetchFooter = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(FOOTER_API_ENDPOINT);
      const fetchedData = response.data.data;
      setFooterData(fetchedData); // Store original data
      setFormData({
        // Initialize form data with fetched data
        mainHeading: fetchedData.mainHeading || "",
        links: fetchedData.links || [],
        subscribe: fetchedData.subscribe || "",
      });
    } catch (err) {
      console.error("Error fetching footer:", err);
      setError(
        err.response?.data?.message ||
          "Failed to fetch footer data. Please check your backend connection."
      );
      toast.error("Failed to load footer data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFooter();
  }, [fetchFooter]);

  // --- Handle Form Changes ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLinkChange = (index, field, value) => {
    const newLinks = [...formData.links];
    newLinks[index][field] = value;
    setFormData((prev) => ({ ...prev, links: newLinks }));
  };

  const handleAddLink = () => {
    setFormData((prev) => ({
      ...prev,
      links: [...prev.links, { heading: "", link: "" }],
    }));
  };

  const handleRemoveLink = (index) => {
    setFormData((prev) => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index),
    }));
  };

  // --- Handle Form Submission (Update) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setError(null);

    if (formData.mainHeading === "" && footerData?.mainHeading !== "") {
      // If it was not empty initially but is now empty
      setError("Main Heading cannot be empty.");
      setIsUpdating(false);
      return;
    }

    // Validate subscribe only if it was touched AND is now empty
    if (formData.subscribe === "" && footerData?.subscribe !== "") {
      // If it was not empty initially but is now empty
      setError("Subscribe section text cannot be empty.");
      setIsUpdating(false);
      return;
    }

    // Validate individual links within the array:
    // Every link *within the array* must be complete.
    // for (const link of formData.links) {
    //     if (!link.heading.trim()) {
    //         setError(`Link heading for "${link.heading || 'an empty link'}" cannot be empty.`);
    //         setIsUpdating(false);
    //         return;
    //     }
    // if (!link.link.trim()) {
    //     setError(`Link URL for "${link.heading}" cannot be empty.`);
    //     setIsUpdating(false);
    //     return;
    // }
    // if (!/^https?:\/\/.+/.test(link.link.trim())) {
    //     setError(`Link URL "${link.link}" is not a valid URL (must start with http:// or https://).`);
    //     setIsUpdating(false);
    //     return;
    // }
    // }
    // --- END REVISED CLIENT-SIDE VALIDATION ---

    try {
      const footerId = footerData?._id;
      if (!footerId) {
        throw new Error(
          "Footer ID not available for update. Please refresh the page."
        );
      }

      const response = await axios.put(
        `${FOOTER_API_ENDPOINT}/${footerId}`,
        formData
      );
      setFooterData(response.data.data); // Update original data with new data
      toast.success("Footer updated successfully!");
      setIsEditing(false); // Exit edit mode on success
    } catch (err) {
      console.error("Error updating footer:", err);
      setError(
        err.response?.data?.message ||
          "Failed to update footer. Please check your input and try again."
      );
      toast.error("Failed to update footer.");
    } finally {
      setIsUpdating(false);
    }
  };

  // --- Handle Cancel ---
  const handleCancel = () => {
    // Revert formData to the last saved footerData
    setFormData({
      mainHeading: footerData?.mainHeading || "",
      links: footerData?.links || [],
      subscribe: footerData?.subscribe || "",
    });
    setError(null); // Clear any validation errors
    setIsEditing(false);
  };

  // --- Render Logic ---
  if (loading) {
    return (
      <Container className="my-5 text-center">
        <Spinner animation="border" role="status" className="text-primary" />
        <p className="mt-3 text-muted">Loading footer data...</p>
      </Container>
    );
  }

  // Error for initial fetch (not in edit mode)
  if (error && !isEditing) {
    return (
      <Container className="my-5">
        <Alert variant="danger" className="text-center">
          <FaInfoCircle className="me-2" /> {error}
          <div className="mt-2">
            <Button variant="outline-danger" onClick={fetchFooter}>
              Retry Load
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <Card className="shadow-lg rounded-3">
        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center p-3">
          <h3 className="mb-0">
            <FaEdit className="me-2" /> Footer Configuration
          </h3>
          {!isEditing && (
            <Button
              variant="light"
              onClick={() => setIsEditing(true)}
              className="d-flex align-items-center"
            >
              <FaEdit className="me-2" /> Edit
            </Button>
          )}
        </Card.Header>
        <Card.Body className="p-4">
          {error &&
            isEditing && ( // Show error specifically within the form if in edit mode
              <Alert variant="danger" className="mb-3">
                <FaInfoCircle className="me-2" /> {error}
              </Alert>
            )}

          {!isEditing ? (
            // --- Display Mode ---
            <div>
              <h5 className="text-primary mb-3">Main Heading:</h5>
              <p className="fs-5 fw-bold mb-4">
                {footerData?.mainHeading || "N/A"}
              </p>

              <h5 className="text-primary mb-3">Footer Links:</h5>
              {footerData?.links && footerData.links.length > 0 ? (
                <ListGroup className="mb-4 shadow-sm">
                  {footerData.links.map((link, index) => (
                    <ListGroup.Item
                      key={index}
                      className="d-flex justify-content-between align-items-center py-2 px-3"
                    >
                      <div>
                        <FaHeading className="me-2 text-muted" />
                        <span className="fw-semibold">{link.heading}</span>
                      </div>
                      <a
                        href={link.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-info text-decoration-none"
                      >
                        <FaLink className="me-2" />
                        {link.link}
                      </a>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <Alert variant="info" className="text-center py-3">
                  No links configured.
                </Alert>
              )}

              <h5 className="text-primary mb-3">Subscribe Section Text:</h5>
              <p className="fs-5">{footerData?.subscribe || "N/A"}</p>
            </div>
          ) : (
            // --- Edit Mode (Form) ---
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formMainHeading">
                <Form.Label>Main Heading:</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <FaHeading />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    name="mainHeading"
                    value={formData.mainHeading}
                    onChange={handleInputChange}
                    placeholder="Enter main footer heading"
                    // No 'required' here, as discussed
                  />
                </InputGroup>
              </Form.Group>

              <h5 className="text-primary mt-4 mb-3">Footer Links:</h5>
              {formData.links.map((link, index) => (
                <Card key={index} className="mb-3 p-3 bg-light border-0">
                  <Row className="g-3">
                    <Col md={5}>
                      <Form.Group controlId={`linkHeading${index}`}>
                        <Form.Label className="small mb-1">Heading</Form.Label>
                        <InputGroup size="sm">
                          <InputGroup.Text>
                            <FaHeading />
                          </InputGroup.Text>
                          <Form.Control
                            type="text"
                            value={link.heading}
                            onChange={(e) =>
                              handleLinkChange(index, "heading", e.target.value)
                            }
                            placeholder="Link Title"
                            required // Individual links must be complete
                          />
                        </InputGroup>
                      </Form.Group>
                    </Col>
                    <Col md={5}>
                      <Form.Group controlId={`linkUrl${index}`}>
                        <Form.Label className="small mb-1">URL</Form.Label>
                        <InputGroup size="sm">
                          <InputGroup.Text>
                            <FaLink />
                          </InputGroup.Text>
                          <Form.Control
                            type="text"
                            value={link.link}
                            onChange={(e) =>
                              handleLinkChange(index, "link", e.target.value)
                            }
                            placeholder="https://example.com"
                            // Individual links must be complete
                          />
                        </InputGroup>
                      </Form.Group>
                    </Col>
                    <Col
                      md={2}
                      className="d-flex align-items-end justify-content-center"
                    >
                      <Button
                        variant="outline-danger"
                        onClick={() => handleRemoveLink(index)}
                        className="w-100"
                        title="Remove Link"
                      >
                        <FaTrash />
                      </Button>
                    </Col>
                  </Row>
                </Card>
              ))}
              <Button
                variant="outline-primary"
                onClick={handleAddLink}
                className="mb-4 d-flex align-items-center"
              >
                <FaPlus className="me-2" /> Add New Link
              </Button>

              <Form.Group className="mb-4" controlId="formSubscribe">
                <Form.Label>Subscribe Section Text:</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <FaInfoCircle />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    name="subscribe"
                    value={formData.subscribe}
                    onChange={handleInputChange}
                    placeholder="Enter text for subscribe section"
                    // No 'required' here, as discussed
                  />
                </InputGroup>
              </Form.Group>

              <div className="d-flex justify-content-end gap-2">
                <Button
                  variant="secondary"
                  onClick={handleCancel}
                  disabled={isUpdating}
                >
                  <FaTimes className="me-2" /> Cancel
                </Button>
                <Button variant="success" type="submit" disabled={isUpdating}>
                  {isUpdating ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FaCheck className="me-2" /> Save Changes
                    </>
                  )}
                </Button>
              </div>
            </Form>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default FooterManagement;
