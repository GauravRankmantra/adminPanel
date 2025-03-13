import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";

const AddUserModal = ({ showModalAdd, handleClose }) => {
  const [name, setName] = useState(""); // State for name
  const [email, setEmail] = useState(""); // State for email
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); // State for role, default to "user"
  const [coverImage, setCoverImage] = useState(null); // State for cover image
  const [loading, setLoading] = useState(false); // State for loading
  const [error, setError] = useState(""); // State for error message
  const [success, setSuccess] = useState(false); // State for success

  // Handle file input for cover image
  const handleFileChange = (e) => {
    setCoverImage(e.target.files[0]);
  };

  // Handle form submission to add new user
  const handleAddUser = async () => {
    if (!name || !email || !role) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);
    setError("");
    const formData = new FormData();
    formData.append("fullName", name);
    formData.append("email", email);
    formData.append("role", role);
    formData.append("password", password);
    if (coverImage) {
      formData.append("coverImage", coverImage);
    }

    try {
      const response = await axios.post(
        "https://backend-music-xg6e.onrender.com/api/v1/user",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setSuccess(true);
      setLoading(false);
      handleClose();
      setEmail('');
      setPassword('');
      setCoverImage('')
      setName('')
    } catch (error) {
      setLoading(false);
      setError("Error adding user.");
    }
  };

  return (
    <Modal show={showModalAdd} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add New User</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && (
          <div className="alert alert-success">User added successfully!</div>
        )}
        <Form>
          {/* Name */}
          <Form.Group controlId="formFullName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter user's name"
            />
          </Form.Group>

          {/* Email */}
          <Form.Group controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter user's email"
            />
          </Form.Group>
          <Form.Group controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter user's password"
            />
          </Form.Group>

          {/* Role */}
          <Form.Group controlId="formRole">
            <Form.Label>Role</Form.Label>
            <Form.Control
              as="select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="artist">Artist</option>
            </Form.Control>
          </Form.Group>

          {/* Cover Image */}
          <Form.Group controlId="formCoverImage">
            <Form.Label>Cover Image</Form.Label>
            <input
              type="file"
              onChange={handleFileChange}
              className="form-control-file"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleAddUser} disabled={loading}>
          {loading ? "Saving..." : "Add"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddUserModal;
