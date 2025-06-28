import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Modal,
  Form,
  Alert,
  Spinner,
  InputGroup,
} from "react-bootstrap";
import { FaEye, FaEyeSlash, FaLock, FaEnvelope } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-hot-toast";

const Profile = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const user = JSON.parse(localStorage.getItem("user"));

  // State for change password modal
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  // State for change email modal
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailForm, setEmailForm] = useState({
    newEmail: "",
    confirmEmail: "",
    password: "",
  });
  const [showEmailPassword, setShowEmailPassword] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState("");

  // Handle password form input changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    setPasswordError(""); // Clear error when user types
  };

  // Handle email form input changes
  const handleEmailChange = (e) => {
    const { name, value } = e.target;
    setEmailForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    setEmailError(""); // Clear error when user types
  };

  // Validate password form
  const validatePasswordForm = () => {
    if (!passwordForm.currentPassword.trim()) {
      setPasswordError("Current password is required");
      return false;
    }
    if (!passwordForm.newPassword.trim()) {
      setPasswordError("New password is required");
      return false;
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters long");
      return false;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New passwords do not match");
      return false;
    }
    if (passwordForm.currentPassword === passwordForm.newPassword) {
      setPasswordError("New password must be different from current password");
      return false;
    }
    return true;
  };

  // Validate email form
  const validateEmailForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailForm.newEmail.trim()) {
      setEmailError("New email is required");
      return false;
    }
    if (!emailRegex.test(emailForm.newEmail)) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    if (emailForm.newEmail !== emailForm.confirmEmail) {
      setEmailError("Email addresses do not match");
      return false;
    }
    if (emailForm.newEmail.toLowerCase() === user?.email?.toLowerCase()) {
      setEmailError("New email must be different from current email");
      return false;
    }
    if (!emailForm.password.trim()) {
      setEmailError("Password is required to change email");
      return false;
    }
    return true;
  };

  // Handle change password submission
  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!validatePasswordForm()) {
      return;
    }

    setPasswordLoading(true);
    setPasswordError("");

    try {
      const response = await axios.post(
        `${apiUrl}/user/changepass`,
        {
          oldPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
          confirmPassword: passwordForm.confirmPassword,
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success("Password changed successfully!");
        setShowPasswordModal(false);
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        setPasswordError(response.data.message || "Failed to change password");
      }
    } catch (error) {
      console.error("Change password error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to change password. Please try again.";
      setPasswordError(errorMessage);
    } finally {
      setPasswordLoading(false);
    }
  };

  // Handle change email submission
  const handleChangeEmail = async (e) => {
    e.preventDefault();

    if (!validateEmailForm()) {
      return;
    }

    setEmailLoading(true);
    setEmailError("");

    try {
      const response = await axios.post(
        `${apiUrl}/user/changeEmail`,
        {
          newEmail: emailForm.newEmail,
          password: emailForm.password,
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success(
          "Email changed successfully! Please check your new email for verification."
        );

        // Update user data in localStorage
        const updatedUser = { ...user, email: emailForm.newEmail };
        localStorage.setItem("user", JSON.stringify(updatedUser));

        setShowEmailModal(false);
        setEmailForm({
          newEmail: "",
          confirmEmail: "",
          password: "",
        });

        // Reload the page to reflect changes
        window.location.reload();
      } else {
        setEmailError(response.data.message || "Failed to change email");
      }
    } catch (error) {
      console.error("Change email error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to change email. Please try again.";
      setEmailError(errorMessage);
    } finally {
      setEmailLoading(false);
    }
  };

  // Reset forms when modals are closed
  const handleClosePasswordModal = () => {
    setShowPasswordModal(false);
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setPasswordError("");
  };

  const handleCloseEmailModal = () => {
    setShowEmailModal(false);
    setEmailForm({
      newEmail: "",
      confirmEmail: "",
      password: "",
    });
    setEmailError("");
  };

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col lg={8}>
          <Card className="p-4 border-0 shadow-lg rounded-4">
            <Row className="align-items-center">
              <Col md={4} className="text-center mb-4 mb-md-0">
                <img
                  src={user?.coverImage || "https://via.placeholder.com/150"}
                  alt="Profile"
                  className="rounded-circle border shadow-sm"
                  style={{
                    width: "150px",
                    height: "150px",
                    objectFit: "cover",
                    border: "4px solid #e7e7e7",
                  }}
                />
                <h5 className="mt-3  fw-bold">
                  {user?.fullName || "John Doe"}
                </h5>
                <Badge bg="info" className="mt-2">
                  {user?.role || "Listener"}
                </Badge>
              </Col>
              <Col md={8}>
                <div className="mb-3">
                  <h6 className=" fw-semibold">Email</h6>
                  <p className="text-muted">
                    {user?.email || "johndoe@example.com"}
                  </p>
                </div>
                <div className="mb-3">
                  <h6 className="text-muted">Bio</h6>
                  <p className="">
                    {user?.bio || "This user has not set up a bio yet."}
                  </p>
                </div>
                <div className="mb-3">
                  <h6 className="text-muted">Account Created</h6>
                  <p>
                    {new Date(user?.createdAt).toLocaleDateString() || "N/A"}
                  </p>
                </div>
                <Row>
                  <Col xs={6}>
                    <h6 className="text-muted">Songs Uploaded (This Month)</h6>
                    <p>{user?.uploadedSongsThisMonth ?? 0}</p>
                  </Col>
                  <Col xs={6}>
                    <h6 className="text-muted">
                      Songs Downloaded (This Month)
                    </h6>
                    <p>{user?.downloadedSongsThisMonth ?? 0}</p>
                  </Col>
                </Row>
                {/* <Button variant="outline-primary" className="mt-3 px-4 rounded-pill">
                  Edit Profile
                </Button> */}

                {/* Action Buttons */}
                <Row className="mt-4">
                  <Col xs={6}>
                    <Button
                      variant="outline-primary"
                      className="w-100 px-3 rounded-pill"
                      onClick={() => setShowPasswordModal(true)}
                    >
                      <FaLock className="me-2" />
                      Change Password
                    </Button>
                  </Col>
                  <Col xs={6}>
                    <Button
                      variant="outline-secondary"
                      className="w-100 px-3 rounded-pill"
                      onClick={() => setShowEmailModal(true)}
                    >
                      <FaEnvelope className="me-2" />
                      Change Email
                    </Button>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Change Password Modal */}
      <Modal
        show={showPasswordModal}
        onHide={handleClosePasswordModal}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleChangePassword}>
          <Modal.Body>
            {passwordError && (
              <Alert variant="danger" className="mb-3">
                {passwordError}
              </Alert>
            )}

            <Form.Group className="mb-3">
              <Form.Label>Current Password</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showCurrentPassword ? "text" : "password"}
                  name="currentPassword"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter current password"
                  required
                />
                <Button
                  variant="outline-secondary"
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                </Button>
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>New Password</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter new password"
                  required
                />
                <Button
                  variant="outline-secondary"
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                </Button>
              </InputGroup>
              <Form.Text className="text-muted">
                Password must be at least 6 characters long
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Confirm New Password</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Confirm new password"
                  required
                />
                <Button
                  variant="outline-secondary"
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </Button>
              </InputGroup>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClosePasswordModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={passwordLoading}>
              {passwordLoading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Changing...
                </>
              ) : (
                "Change Password"
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Change Email Modal */}
      <Modal show={showEmailModal} onHide={handleCloseEmailModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Change Email</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleChangeEmail}>
          <Modal.Body>
            {emailError && (
              <Alert variant="danger" className="mb-3">
                {emailError}
              </Alert>
            )}

            <Form.Group className="mb-3">
              <Form.Label>New Email Address</Form.Label>
              <Form.Control
                type="email"
                name="newEmail"
                value={emailForm.newEmail}
                onChange={handleEmailChange}
                placeholder="Enter new email address"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Confirm New Email Address</Form.Label>
              <Form.Control
                type="email"
                name="confirmEmail"
                value={emailForm.confirmEmail}
                onChange={handleEmailChange}
                placeholder="Confirm new email address"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Current Password</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showEmailPassword ? "text" : "password"}
                  name="password"
                  value={emailForm.password}
                  onChange={handleEmailChange}
                  placeholder="Enter current password to confirm"
                  required
                />
                <Button
                  variant="outline-secondary"
                  type="button"
                  onClick={() => setShowEmailPassword(!showEmailPassword)}
                >
                  {showEmailPassword ? <FaEyeSlash /> : <FaEye />}
                </Button>
              </InputGroup>
              <Form.Text className="text-muted">
                Enter your current password to confirm the email change
              </Form.Text>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseEmailModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={emailLoading}>
              {emailLoading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Changing...
                </>
              ) : (
                "Change Email"
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default Profile;
