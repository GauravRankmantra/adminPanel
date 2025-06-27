import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  Form,
  Spinner,
  Alert,
  Container,
} from "react-bootstrap";
import axios from "axios";
import toast from "react-hot-toast";

const Home = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [heroData, setHeroData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    heading: "",
    subHeading: "",
    coverImage: null, // File object
  });
  const [originalData, setOriginalData] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null); // To handle errors in the UI

  const containerStyle = {
    paddingTop: "2rem",
    paddingBottom: "2rem",
  };

  const heroSectionStyle = {
    textAlign: "center",

    backgroundColor: "#f8f9fa", // Light gray background like Bootstrap's light
    borderRadius: "0.5rem",
    boxShadow: "0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)",
    padding: "2rem",
  };

  const headingStyle = {
    fontSize: "2.5rem",
    fontWeight: "bold",
    marginBottom: "1rem",
    color: "#212529", // Dark text color
  };

  const subHeadingStyle = {
    fontSize: "1.25rem",
    color: "#6c757d", // Gray text color for lead
    marginBottom: "1.5rem",
  };

  const imageContainerStyle = {
    display: "flex",
    justifyContent: "center",
    marginBottom: "1.5rem",
  };

  const imageStyle = {
    maxHeight: "400px",
    maxWidth: "100%",
    objectFit: "cover",
    borderRadius: "0.25rem",
    boxShadow: "0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)",
  };

  const updateButtonStyle = {
    marginTop: "1rem",
  };

  const loadingStyle = {
    textAlign: "center",
    marginTop: "2rem",
  };

  const loadingTextStyle = {
    color: "#6c757d",
  };

  const formGroupStyle = {
    marginBottom: "1.5rem",
  };

  const formLabelStyle = {
    fontWeight: "bold",
    marginBottom: "0.5rem",
    display: "block",
  };

  const formControlStyle = {
    display: "block",
    width: "100%",
    padding: "0.375rem 0.75rem",
    fontSize: "1rem",
    fontWeight: 400,
    lineHeight: 1.5,
    color: "#495057",
    backgroundColor: "#fff",
    border: "1px solid #ced4da",
    borderRadius: "0.25rem",
    transition: "border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out",
  };

  const modalTitleStyle = {
    fontSize: "1.5rem",
    fontWeight: "500",
    color: "#212529",
  };

  const modalFooterStyle = {
    display: "flex",
    justifyContent: "flex-end",
    padding: "1rem",
    borderTop: "1px solid #dee2e6",
    borderBottomRightRadius: "calc(0.3rem - 1px)",
    borderBottomLeftRadius: "calc(0.3rem - 1px)",
  };

  const cancelButton = {
    marginRight: "0.5rem",
  };

  const submitButton = {
    // Inherits Bootstrap's primary button styles
  };

  // Fetch hero section
  const fetchHeroData = async () => {
    try {
      const res = await axios.get(`${apiUrl}/home/heroSection`);
      if (res.data && res.data.success) {
        setHeroData(res.data.data);
        setOriginalData(res.data.data);
        setFormData({
          heading: res.data.data.heading || "",
          subHeading: res.data.data.subHeading || "",
          coverImage: null,
        });
        setError(null);
      } else {
        setError("Failed to fetch hero section: Invalid response from server.");
        setHeroData(null);
      }
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to fetch hero section";
      toast.error(message);
      setError(message);
      setHeroData(null);
    }
  };

  useEffect(() => {
    fetchHeroData();
  }, []);

  const hasChanges = () => {
    return (
      formData.heading !== originalData.heading ||
      formData.subHeading !== originalData.subHeading ||
      formData.coverImage !== null
    );
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.heading.trim() || !formData.subHeading.trim()) {
      const errorMessage = "All fields are required";
      toast.error(errorMessage);
      setError(errorMessage);
      return;
    }

    if (!hasChanges()) {
      const noChangesMessage = "No changes made";
      toast.error(noChangesMessage);
      setError(noChangesMessage);
      return;
    }

    try {
      setSubmitting(true);
      const payload = new FormData();
      payload.append("heading", formData.heading);
      payload.append("subHeading", formData.subHeading);
      if (formData.coverImage) {
        payload.append("coverImage", formData.coverImage);
      }

      const res = await axios.put(
        `${apiUrl}/home/heroSection/${originalData._id}`,
        payload,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (res.data && res.data.success) {
        toast.success("Hero section updated successfully!");
        setShowModal(false);
        fetchHeroData();
      } else {
        const serverMessage =
          res.data?.message || "Failed to update hero section";
        toast.error(serverMessage);
        setError(serverMessage);
      }
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to update hero section";
      toast.error(message);
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container style={containerStyle}>
      <h1 style={headingStyle}>Home Section</h1>

      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      {!heroData ? (
        <div style={loadingStyle}>
          <Spinner animation="border" variant="primary" className="my-4" />
          <p style={loadingTextStyle}>Loading Hero Section Data...</p>
        </div>
      ) : (
        <>
          <div style={heroSectionStyle}>
            <div>
              {heroData.coverImage && (
                <div style={imageContainerStyle}>
                  <img
                    src={heroData.coverImage}
                    alt="Hero Cover"
                    style={imageStyle}
                    className="img-fluid"
                  />
                </div>
              )}
              <div>
                <h2
                  style={{
                    fontSize: "2rem",
                    fontWeight: "semibold",
                    color: "#212529",
                    marginBottom: "0.75rem",
                  }}
                >
                  {heroData.heading}
                </h2>
                <p style={subHeadingStyle}>{heroData.subHeading}</p>
              </div>
            </div>
            <Button
              variant="primary"
              onClick={() => setShowModal(true)}
              style={updateButtonStyle}
            >
              Update Info
            </Button>
          </div>
        </>
      )}

      {/* Update Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title style={modalTitleStyle}>Update Hero Section</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleUpdate}>
          <Modal.Body>
            <Form.Group style={formGroupStyle}>
              <Form.Label style={formLabelStyle}>Heading</Form.Label>
              <Form.Control
                type="text"
                value={formData.heading}
                onChange={(e) =>
                  setFormData({ ...formData, heading: e.target.value })
                }
                required
                placeholder="Enter Heading"
                style={formControlStyle}
              />
            </Form.Group>

            <Form.Group style={formGroupStyle}>
              <Form.Label style={formLabelStyle}>Sub Heading</Form.Label>
              <Form.Control
                type="text"
                value={formData.subHeading}
                onChange={(e) =>
                  setFormData({ ...formData, subHeading: e.target.value })
                }
                required
                placeholder="Enter Sub Heading"
                style={formControlStyle}
              />
            </Form.Group>

            <Form.Group controlId="formFile" style={formGroupStyle}>
              <Form.Label style={formLabelStyle}>Cover Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setFormData({ ...formData, coverImage: e.target.files[0] })
                }
                style={formControlStyle}
              />
            </Form.Group>
          </Modal.Body>

          <Modal.Footer style={modalFooterStyle}>
            <Button
              variant="secondary"
              onClick={() => setShowModal(false)}
              disabled={submitting}
              style={cancelButton}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={!hasChanges() || submitting}
              style={submitButton}
            >
              {submitting ? (
                <>
                  <Spinner animation="border" size="sm" className="mr-2" />
                  Submitting...
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default Home;
