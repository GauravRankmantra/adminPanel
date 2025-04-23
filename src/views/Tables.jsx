import { Fragment, useEffect, useState } from "react";
import { CardBody, Col, Row, Modal, Button, Form } from "react-bootstrap";
import Card from "@/components/Card/Card";
import styles from "@/assets/scss/Tables.module.scss";
import axios from "axios";
import defaultUser from "../assets/image/default.jpg";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import editIcon from "../assets/image/edit.png";
import deleteIcon from "../assets/image/trash.png";
import AddUserModal from "./AddUserModal"; // Import AddUserModal

const Tables = () => {
  const [userData, setUserData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showModalAdd, setShowModalAdd] = useState(false); // State to show AddUserModal
  const [selectedUser, setSelectedUser] = useState(null); // Selected user info for editing
  const [role, setRole] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const limit = 10;

  useEffect(() => {
    const fetchData = async (page) => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/v1/admin/users?page=${page}&limit=${limit}`
        );
        setUserData(response.data.users); // Update user data
        setTotalPages(response.data.totalPages); // Set total pages
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData(currentPage); // Fetch data for current page
  }, [currentPage]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(
        `http://localhost:5000/api/v1/admin/user/${userToDelete._id}`
      );
      setShowDeleteModal(false);
      setUserData(userData.filter((user) => user._id !== userToDelete._id)); // Remove user from list
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };
  const handleEditClick = (user) => {
    setSelectedUser(user);
    setRole(user.role); // Set the current role in the form
    setShowModal(true);
  };

  const handleAddUserClick = () => {
    setShowModalAdd(true);
  };

  // Close modal
  const handleClose = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const handleCloseAddUserModal = () => {
    setShowModalAdd(false);
  };

  const handleSave = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/v1/admin/user/${selectedUser._id}`,
        { role }
      );
      setShowModal(false);

      const updatedUsers = userData.map((user) =>
        user._id === selectedUser._id ? { ...user, role } : user
      );
      setUserData(updatedUsers);
    } catch (error) {
      console.error("Error updating user role:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Fragment>
      {/* Add New User Button */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "20px", // Add some top margin
        }}
      >
        <button
          style={{
            padding: "12px 24px",
            margin: "10px",
            backgroundColor: "#4CAF50", // Green background
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: "pointer",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            transition: "background-color 0.3s ease, transform 0.2s ease",
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = "#45a049"; // Darker green on hover
            e.target.style.transform = "scale(1.05)"; // Slightly scale up
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = "#4CAF50";
            e.target.style.transform = "scale(1)";
          }}
          onClick={handleAddUserClick} // Add user button clicked
        >
          Add new User
        </button>
      </div>

      <Row className="gy-4 gx-4">
        <Col sm={12}>
          <Card title="User Information">
            <CardBody>
              <div className={`table-responsive ${styles.table_wrapper}`}>
                <table className={`table ${styles.table}`}>
                  <thead className={`text-primary thead ${styles.thead}`}>
                    <tr>
                      <td>Cover image</td>
                      <td>Name</td>
                      <td>Email</td>
                      <td>Role</td>
                      <td>Update</td>
                    </tr>
                  </thead>
                  <tbody className={`tbody ${styles.tbody}`}>
                    {userData.map((item, index) => (
                      <tr key={index}>
                        <td>
                          <img
                            src={item.coverImage || defaultUser}
                            alt="Cover"
                          />
                        </td>
                        <td>{item.fullName}</td>
                        <td>{item.email}</td>
                        <td>{item.role}</td>
                        <button onClick={() => handleEditClick(item)}>
                          <img src={editIcon} alt="Edit" />
                        </button>
                        <button onClick={() => handleDeleteClick(item)}>
                          <img src={deleteIcon} alt="Delete" />
                        </button>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "20px 0",
                  }}
                >
                  <button
                    style={{
                      padding: "8px 16px",
                      margin: "0 5px",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      backgroundColor: "#f0f0f0",
                      cursor: "pointer",
                      transition: "background-color 0.3s ease",
                    }}
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    onMouseOver={(e) => {
                      if (!e.target.disabled) {
                        e.target.style.backgroundColor = "#e0e0e0";
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!e.target.disabled) {
                        e.target.style.backgroundColor = "#f0f0f0";
                      }
                    }}
                  >
                    Previous
                  </button>

                  <span
                    style={{
                      margin: "0 10px",
                      fontSize: "14px",
                      color: "#555",
                    }}
                  >
                    Page {currentPage} of {totalPages}
                  </span>

                  <button
                    style={{
                      padding: "8px 16px",
                      margin: "0 5px",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      backgroundColor: "#f0f0f0",
                      cursor: "pointer",
                      transition: "background-color 0.3s ease",
                    }}
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    onMouseOver={(e) => {
                      if (!e.target.disabled) {
                        e.target.style.backgroundColor = "#e0e0e0";
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!e.target.disabled) {
                        e.target.style.backgroundColor = "#f0f0f0";
                      }
                    }}
                  >
                    Next
                  </button>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* AddUserModal */}
      <AddUserModal
        showModalAdd={showModalAdd}
        handleClose={handleCloseAddUserModal}
      />

      {/* Modal to edit user role */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User Role</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <Form>
              <Form.Group controlId="formFullName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedUser.fullName}
                  readOnly
                />
              </Form.Group>

              <Form.Group controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={selectedUser.email}
                  readOnly
                />
              </Form.Group>

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

              <Form.Group controlId="formCoverImage">
                <Form.Label>Cover Image</Form.Label>
                <img
                  src={selectedUser.coverImage || "default-image.jpg"} // Optional cover image
                  alt="Cover"
                  style={{ width: "100%", height: "auto" }}
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the user "{userToDelete?.fullName}"?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
};

export default Tables;
