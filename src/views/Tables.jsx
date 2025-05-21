// ✅ Improved User Table with UX Enhancements
import { Fragment, useEffect, useState } from "react";
import {
  CardBody,
  Col,
  Row,
  Modal,
  Button,
  Form,
  Spinner,
  InputGroup,
  FormControl,
  Alert,
} from "react-bootstrap";
import axios from "axios";
import { debounce } from "lodash";
import { toast } from "react-hot-toast";
import defaultUser from "../assets/image/default.jpg";
import editIcon from "../assets/image/edit.png";
import deleteIcon from "../assets/image/trash.png";
import AddUserModal from "./AddUserModal";
import Card from "@/components/Card/Card";
import styles from "@/assets/scss/Tables.module.scss";

const Tables = () => {
  const [userData, setUserData] = useState([]);
  const [originalUsers, setOriginalUsers] = useState([]);
  const [searchUsers, SetSearchUsers] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showModalAdd, setShowModalAdd] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [role, setRole] = useState("user");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const limit = 10;

  useEffect(() => {
    fetchUsers();
  }, [currentPage, activeFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const query = searchTerm ? `&search=${searchTerm}` : "";
      const filter = activeFilter !== "all" ? `&role=${activeFilter}` : "";
      const res = await axios.get(
        `https://backend-music-xg6e.onrender.com/api/v1/admin/users?page=${currentPage}&limit=${limit}${query}${filter}`
      );
      setUserData(res.data.users);
      setOriginalUsers(res.data.users);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = debounce(async (value) => {
    setSearchTerm(value);
    setCurrentPage(1);

    if (value.trim().length > 2) {
      try {
        const res = await axios.get(
          `https://backend-music-xg6e.onrender.com/api/v1/admin/searchUser?query=${value}`
        );
        setUserData(res.data.users || []);
      } catch (err) {
        console.error("Search failed:", err);
        setUserData(originalUsers);
      }
    } else if (value.trim() === "") {
      // Restore original list if search is cleared
      setUserData(originalUsers);
    }
  }, 400);

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;
    setDeleting(true);
    try {
      await axios.delete(
        `https://backend-music-xg6e.onrender.com/api/v1/admin/user/${userToDelete._id}`
      );
      toast.success("User deleted successfully");
      fetchUsers();
      setShowDeleteModal(false);
    } catch (error) {
      toast.error("Failed to delete user");
    } finally {
      setDeleting(false);
    }
  };

  const handleSave = async () => {
    if (!fullName || !email || !role) {
      toast.error("Name, email, and role are required.");
      return;
    }

    setSaving(true);
    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("email", email);
    formData.append("role", role);
    if (coverImage) formData.append("coverImage", coverImage);

    try {
      await axios.put(
        `https://backend-music-xg6e.onrender.com/api/v1/user/update/${selectedUser._id}`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      toast.success("User updated successfully ✅");
      setShowModal(false);
      fetchUsers();
    } catch {
      toast.error("Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setCoverImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setFullName(user.fullName);
    setEmail(user.email);
    setRole(user.role);
    setPreviewImage(user.coverImage || defaultUser);
    setCoverImage(null);
    setShowModal(true);
  };

  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleAddUserClick = () => setShowModalAdd(true);
  const handleCloseAddUserModal = () => {
    setShowModalAdd(false);
    fetchUsers(); // Refresh list after add
  };

  const handleCloseEditModal = () => setShowModal(false);

  return (
    <Fragment>
      {/* Add User Button */}
      <div className="text-center my-3">
        <Button variant="success" onClick={handleAddUserClick}>
          Add New User
        </Button>
      </div>

      {/* Search Input */}
      <div className="mx-auto mb-3" style={{ maxWidth: 600 }}>
        <InputGroup>
          <FormControl
            placeholder="Search by name or email..."
            onChange={(e) => handleSearch(e.target.value)}
          />
        </InputGroup>
      </div>
      {userData.length == 0 && (
        <h1 className="text-danger h6">No user found</h1>
      )}

      {/* Filter Buttons */}
      <div className="text-center mb-3">
        {["all", "user", "admin"].map((filter) => (
          <Button
            key={filter}
            variant={activeFilter === filter ? "primary" : "outline-primary"}
            className="mx-2"
            onClick={() => setActiveFilter(filter)}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </Button>
        ))}
      </div>

      {/* Table */}
      <Row>
        <Col sm={12}>
          <Card title="User Table">
            {loading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  height: "100vh",
                }}
              >
                <Spinner />
              </div>
            ) : (
              <CardBody>
                <div className={`table-responsive ${styles.table_wrapper}`}>
                  <table className={`table ${styles.table}`}>
                    <thead className={`text-primary thead ${styles.thead}`}>
                      <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody className={styles.tbody}>
                      {userData.map((user, index) => (
                        <tr key={index}>
                          <td>
                            <img
                              src={user.coverImage || defaultUser}
                              alt="User"
                              width={40}
                            />
                          </td>
                          <td>{user.fullName}</td>
                          <td>{user.email}</td>
                          <td>{user.role}</td>

                          <button
                            className="me-2"
                            onClick={() => openEditModal(user)}
                          >
                            <img src={editIcon} alt="Edit" />
                          </button>
                          <button
                            size="sm"
                            onClick={() => openDeleteModal(user)}
                          >
                            <img src={deleteIcon} alt="Delete" />
                            {/* {deleting && userToDelete?._id === user._id ? (
                              <Spinner animation="border" size="sm" />
                            ) : (
                              "Delete"
                            )} */}
                          </button>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="text-center mt-3">
                  <Button
                    variant="outline-secondary"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <span className="mx-3">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline-secondary"
                    onClick={() => setCurrentPage((p) => p + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </CardBody>
            )}
          </Card>
        </Col>
      </Row>

      <AddUserModal
        showModalAdd={showModalAdd}
        type="user"
        handleClose={handleCloseAddUserModal}
      />

      <Modal show={showModal} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formFullName" className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formRole" className="mb-3">
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
            <Form.Group controlId="formCoverImage" className="mb-3">
              <Form.Label>Cover Image</Form.Label>
              <div style={{ position: "relative" }}>
                <img
                  src={previewImage || defaultUser}
                  alt="Cover"
                  style={{ width: "100%", maxHeight: 200, objectFit: "cover" }}
                />
                <label
                  htmlFor="uploadImage"
                  style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    backgroundColor: "#fff",
                    borderRadius: "50%",
                    padding: 5,
                    cursor: "pointer",
                    boxShadow: "0 0 4px rgba(0,0,0,0.2)",
                  }}
                >
                  <img src={editIcon} alt="edit" width={20} />
                </label>
                <input
                  type="file"
                  id="uploadImage"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                />
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEditModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={saving}>
            {saving && (
              <Spinner size="sm" animation="border" className="me-2" />
            )}
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete "{userToDelete?.fullName}"?
          <Alert variant="danger" className="mt-3">
            <Alert.Heading className="mb-2 text-sm">
              Careful with Artist Deletion
            </Alert.Heading>
            <p className="mb-0">
              Deleting an artist might lead to errors or the removal of their
              associated songs. Please proceed with caution.
            </p>
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDeleteConfirm}
            disabled={deleting}
          >
            {deleting && (
              <Spinner size="sm" animation="border" className="me-2" />
            )}
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
};

export default Tables;
