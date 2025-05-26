import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Spinner } from "react-bootstrap";
import axios from "axios";
import styles from "@/assets/scss/Authentication.module.scss"; // Assuming this path is correct
import logo from "@/assets/image/main_bg.jpg"; // Assuming this path is correct
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Alert,
  InputGroup,
} from "react-bootstrap";
import { FaUser, FaLock, FaSignInAlt, FaEye, FaEyeSlash } from "react-icons/fa"; // Import FaEyeSlash for the "hide" icon
import { IoLogIn } from "react-icons/io5";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [logging, setLogging] = useState(false); // Renamed from isLoading for clarity with your code
  const [validated, setValidated] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // New state for password visibility

  const navigate = useNavigate();

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
    }
    setValidated(true); // Set validated to true to show validation feedback

    if (form.checkValidity() === false) {
      return; // Stop if form is invalid
    }

    setLogging(true);
    setError(""); // Clear previous errors

    try {
      const response = await axios.post(
        "https://backend-music-xg6e.onrender.com/api/v1/auth/adminlogin",
        { email, password },
        { withCredentials: true }
      );

      if (response.data.success) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        navigate("/dashboard");
      } else {
        // This block might be redundant if the server always sends error status on failure
        // but it's good for explicit handling if success: false is sent with 200 OK
        setError(response.data.message || "Login failed. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err); // Log the full error for debugging
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your credentials and try again."
      );
    } finally {
      setLogging(false); // Ensure logging state is reset in finally block
    }
  };

  const backgroundStyle = {
    minHeight: "100vh",
    backgroundImage: `url(${logo})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px 0",
  };

  const enhancedBackgroundStyle = {
    ...backgroundStyle,
    background: `linear-gradient(rgba(20, 20, 50, 0.65), rgba(40, 20, 70, 0.75)), ${backgroundStyle.backgroundImage}`,
    backgroundSize: backgroundStyle.backgroundSize,
    backgroundPosition: backgroundStyle.backgroundPosition,
    backgroundRepeat: backgroundStyle.backgroundRepeat,
  };

  const cardStyle = {
    maxWidth: "450px",
    width: "100%",
    borderRadius: "15px",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
    border: "none",
  };

  return (
    <div style={enhancedBackgroundStyle}>
      <Container fluid>
        <Row className="justify-content-center">
          <Col xs={12} sm={10} md={8} lg={6} xl={4}>
            <Card style={cardStyle} className="p-4 p-sm-5">
              <Card.Body>
                <div className="text-center mb-4">
                  <IoLogIn size={50} className="text-primary mb-3" />
                  <h2 className="fw-bold">Welcome Back!</h2>
                  <p className="text-muted">
                    Sign in to continue to your Admin account.
                  </p>
                </div>

                {error && <Alert variant="danger">{error}</Alert>}

                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <InputGroup hasValidation>
                      <InputGroup.Text>
                        <FaUser />
                      </InputGroup.Text>
                      <Form.Control
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        aria-describedby="inputGroupPrepend"
                      />
                      <Form.Control.Feedback type="invalid">
                        Please enter a valid email address.
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>

                  <Form.Group className="mb-4" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <InputGroup hasValidation>
                      <InputGroup.Text>
                        <FaLock />
                      </InputGroup.Text>
                      <Form.Control
                        type={showPassword ? "text" : "password"} // Dynamic type based on state
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                      />
                      <InputGroup.Text
                        role="button" // Indicate it's clickable
                        onClick={togglePasswordVisibility} // Attach click handler
                        style={{ cursor: "pointer" }} // Add cursor style
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}{" "}
                        {/* Change icon based on state */}
                      </InputGroup.Text>
                      <Form.Control.Feedback type="invalid">
                        Password must be at least 6 characters.
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formBasicCheckbox">
                    <input
                      type="checkbox"
                      name="remember"
                      placeholder="Remember me"
                    />
                    <label htmlFor="remember"> Remember me</label>
                  </Form.Group>

                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100 py-2 fw-semibold"
                    disabled={logging} // Use 'logging' state for disabled
                  >
                    {logging ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        Logging in...
                      </>
                    ) : (
                      "Login"
                    )}
                  </Button>
                </Form>

                <div className="mt-4 text-center">
                  <a href="#forgot" className="text-decoration-none small">
                    Forgot password?
                  </a>
                </div>
                <hr className="my-4" />
                <div className="text-center">
                  <p className="small text-muted">
                    Don't have an account?{" "}
                    <a
                      href="https://odgmusic.com/register"
                      target="_blank"
                      rel="noopener noreferrer" // Good practice for target="_blank"
                      className="text-decoration-none fw-semibold"
                    >
                      Sign up
                    </a>
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
