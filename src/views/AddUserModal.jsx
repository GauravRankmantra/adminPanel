import { useState, useEffect } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import axios from "axios";
import toast from "react-hot-toast";

const AddUserModal = ({ showModalAdd, type, handleClose }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [coverImage, setCoverImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (type === "artist") {
      setRole("artist");
    } else {
      setRole("user");
    }
  }, [type]);

  const handleFileChange = (e) => {
    setCoverImage(e.target.files[0]);
  };

  const handleAddUser = async () => {
    if (!name || !email || !password || !role) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("fullName", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("role", role);
    if (coverImage) {
      formData.append("coverImage", coverImage);
    }

    try {
      const res = await axios.post(
        "https://backend-music-xg6e.onrender.com/api/v1/user",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (res.status === 200) {
        toast.success(
          type === "artist"
            ? "Artist created successfully 🎨"
            : "User created successfully ✅"
        );

        // Reset form
        setName("");
        setEmail("");
        setPassword("");
        setCoverImage(null);
        handleClose();
      } else {
        throw new Error("Unexpected server response.");
      }
    } catch (err) {
      console.error(err);
      const message =
        err.response?.data?.message || err.message || "Failed to create user.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={showModalAdd} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {type === "artist" ? "Add New Artist" : "Add New User"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formFullName" className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter name"
            />
          </Form.Group>

          <Form.Group controlId="formEmail" className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
            />
          </Form.Group>

          <Form.Group controlId="formPassword" className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />
          </Form.Group>

          <Form.Group controlId="formRole" className="mb-3">
            <Form.Label>Role</Form.Label>
            {type === "user" ? (
              <Form.Control
                as="select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </Form.Control>
            ) : (
              <Form.Control value={role} disabled />
            )}
          </Form.Group>

          <Form.Group controlId="formCoverImage" className="mb-3">
            <Form.Label>Cover Image</Form.Label>
            <Form.Control type="file" onChange={handleFileChange} />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleAddUser} disabled={loading}>
          {loading && <Spinner animation="border" size="sm" className="me-2" />}
          Add
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddUserModal;
