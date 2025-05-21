import { useState, useEffect } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import axios from "axios";
import toast from "react-hot-toast";

const AddUserModal = ({ showModalAdd, type, handleClose }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [admin, setAdmin] = useState(false);
  const [coverImage, setCoverImage] = useState(null);
  const [isTrending, setIsTrending] = useState(false); // State for isTrending
  const [isFeatured, setIsFeatured] = useState(false); // State for isFeatured
  const [loading, setLoading] = useState(false);
  const formData = new FormData();

  useEffect(() => {
    if (type === "artist") {
      setRole("artist");
      setAdmin(true);
    } else {
      setRole("user");
    }
  }, [type]);

  const handleFileChange = (e) => {
    setCoverImage(e.target.files[0]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "fullName") {
      setName(value);
    } else if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    } else if (name === "role") {
      setRole(value);
    }
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    if (name === "isTrending") {
      setIsTrending(checked);
    } else if (name === "isFeatured") {
      setIsFeatured(checked);
    }
  };

  const handleAddUser = async () => {
    if (!name || !email || !password || !role) {
      toast.error("All basic fields are required");
      return;
    }

    setLoading(true);

    formData.append("fullName", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("role", role);
    formData.append("admin", admin);
    formData.append("isTrending", isTrending); // Append isTrending
    formData.append("isFeatured", isFeatured); // Append isFeatured
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
        setIsTrending(false);
        setIsFeatured(false);
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
              onChange={handleInputChange}
              name="fullName"
              placeholder="Enter name"
            />
          </Form.Group>

          <Form.Group controlId="formEmail" className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={handleInputChange}
              name="email"
              placeholder="Enter email"
            />
          </Form.Group>

          <Form.Group controlId="formPassword" className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={handleInputChange}
              name="password"
              placeholder="Enter password"
            />
          </Form.Group>

          {type === "artist" ? (
            <div>
              <Form.Group className="mb-3">
                <Form.Label>Is Trending</Form.Label>
                <div>
                  <input
                    type="checkbox"
                    id="isTrending"
                    name="isTrending"
                    checked={isTrending}
                    onChange={handleCheckboxChange}
                    // Apply Bootstrap class for styling
                  />
                  <label className="form-check-label ms-2" htmlFor="isTrending">
                    Yes
                  </label>
                </div>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Is Featured</Form.Label>
                <div>
                  <input
                    type="checkbox"
                    id="isFeatured"
                    name="isFeatured"
                    checked={isFeatured}
                    onChange={handleCheckboxChange}
                    // Apply Bootstrap class for styling
                  />
                  <label className="form-check-label ms-2" htmlFor="isFeatured">
                    Yes
                  </label>
                </div>
              </Form.Group>
            </div>
          ) : (
            <div></div>
          )}

          <Form.Group controlId="formRole" className="mb-3">
            <Form.Label>Role</Form.Label>
            {type === "user" ? (
              <Form.Control
                as="select"
                value={role}
                onChange={handleInputChange}
                name="role"
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
