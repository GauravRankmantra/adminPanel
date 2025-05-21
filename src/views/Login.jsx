import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Spinner } from "react-bootstrap";
import axios from "axios";
import styles from "@/assets/scss/Authentication.module.scss";
import logo from "@/assets/image/main_bg.jpg";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Alert,
  InputGroup,
} from "react-bootstrap";
import { FaUser, FaLock, FaSignInAlt } from "react-icons/fa";
import { IoLogIn } from "react-icons/io5";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [validated, setValidated] = useState(false);
  const navigate = useNavigate();
  const [logging, setLogging] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLogging(true);

    try {
      const response = await axios.post(
        "https://backend-music-xg6e.onrender.com/api/v1/auth/adminlogin",
        { email, password },
        { withCredentials: true }
      );
      localStorage.setItem("user", JSON.stringify(response.data.user));

      if (response.data.success) {
        setLogging(false);
        // Redirect to dashboard on successful login
        navigate("/dashboard");
      }
    } catch (err) {
      setLogging(false);
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    }
  };

  const backgroundStyle = {
    minHeight: "100vh",
    // === BACKGROUND IMAGE SECTION ===
    // Replace '/assets/images/login-background.jpg' with the path to YOUR image
    // Ensure this image is in your `public` folder or import it if it's in `src`

    backgroundImage: `url(${logo})`,
    backgroundSize: "cover", // Cover the entire area
    backgroundPosition: "center", // Center the image
    backgroundRepeat: "no-repeat", // Do not repeat the image
    // backgroundAttachment: 'fixed', // Optional: Creates a parallax effect
    // === END BACKGROUND IMAGE SECTION ===
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px 0",
  };

  const enhancedBackgroundStyle = {
    ...backgroundStyle,
    background: `linear-gradient(rgba(20, 20, 50, 0.65), rgba(40, 20, 70, 0.75)), ${backgroundStyle.backgroundImage}`,
    // Ensure other background properties are reapplied if `background` shorthand overwrites them
    backgroundSize: backgroundStyle.backgroundSize,
    backgroundPosition: backgroundStyle.backgroundPosition,
    backgroundRepeat: backgroundStyle.backgroundRepeat,
    // backgroundAttachment: backgroundStyle.backgroundAttachment, // if you used it
  };
  const cardStyle = {
    maxWidth: "450px",
    width: "100%",
    borderRadius: "15px",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
    border: "none", // Remove default card border
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
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6} // Example validation
                      />
                      <Form.Control.Feedback type="invalid">
                        Password must be at least 6 characters.
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formBasicCheckbox">
                    <Form.Check type="checkbox" label="Remember me" />
                  </Form.Group>

                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100 py-2 fw-semibold"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
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
