// Production-grade Artist Management Page
import { Fragment, useEffect, useState } from "react";
import {
  CardBody,
  Col,
  Row,
  Modal,
  Button,
  Form,
  Container,
  Spinner,
  Alert,
} from "react-bootstrap";
import { FormControl, InputGroup } from "react-bootstrap";
import { debounce } from "lodash";
import axios from "axios";
import toast from "react-hot-toast";
import defaultUser from "../assets/image/default.jpg";
import editIcon from "../assets/image/edit.png";
import deleteIcon from "../assets/image/trash.png";
import AddUserModal from "./AddUserModal";
import Card from "@/components/Card/Card";
import styles from "@/assets/scss/Tables.module.scss";
import UserDetailsModal from "./UserDetailsModal";

const ArtistsPage = () => {
  const [artists, setArtists] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showdetailMmodal, setShowDetailModal] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [role, setRole] = useState("artist");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [artistToDelete, setArtistToDelete] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [isTrending, setIsTrending] = useState(false); // State for isTrending
  const [isFeatured, setIsFeatured] = useState(false); // State for isFeatured
  const [showModalAdd, setShowModalAdd] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [saving, setSaving] = useState(false);

  const limit = 10;

  useEffect(() => {
    if (selectedArtist) {
      setFullName(selectedArtist.fullName);
      setEmail(selectedArtist.email);
      setRole(selectedArtist.role);
      setPreviewImage(selectedArtist.coverImage || "default-image.jpg");
      setCoverImage(null);
      setIsTrending(selectedArtist.isTrending);
      setIsFeatured(selectedArtist.isFeatured);
    }
  }, [selectedArtist]);

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    if (name === "isTrending") {
      setIsTrending(checked);
    } else if (name === "isFeatured") {
      setIsFeatured(checked);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedArtist(null);
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setCoverImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleEditClick = (user) => {
    setSelectedArtist(user);
    setRole(user.role); // Set the current role in the form
    setShowModal(true);
  };

  useEffect(() => {
    fetchArtists(currentPage);
  }, [currentPage]);

  const fetchArtists = async (page) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `https://backend-music-xg6e.onrender.com/api/v1/admin/artist?page=${page}&limit=${limit}`
      );

      setArtists(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      toast.error("Failed to fetch artists");
    } finally {
      setLoading(false);
    }
  };
  let searchFlag = false;
  const handleSearchInput = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.length >= 3) debouncedSearch(value);
    else setSearchResults([]);
  };

  const debouncedSearch = debounce(async (term) => {
    try {
      searchFlag = true;
      const res = await axios.get(
        `https://backend-music-xg6e.onrender.com/api/v1/user/search/user?query=${term}`
      );
      const artists = res.data.users.filter((u) => u.role === "artist");
      setSearchResults(artists);
    } catch {
      toast.error("Search failed");
    } finally {
      searchFlag = false;
    }
  }, 500);

  const handleDeleteArtist = async () => {
    try {
      await axios.delete(
        `https://backend-music-xg6e.onrender.com/api/v1/admin/user/${artistToDelete._id}`
      );
      toast.success("Artist deleted successfully");
      setShowDeleteModal(false);
      fetchArtists(currentPage);
    } catch {
      toast.error("Failed to delete artist");
    }
  };

  const handleShowModal = (user) => {
    setSelectedUser(user);
    setShowDetailModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setShowDetailModal(false);
    setSelectedUser(null);
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
    formData.append("isFeatured", isFeatured);
    formData.append("isTrending", isTrending);
  
    if (coverImage) formData.append("coverImage", coverImage);

    try {
      await axios.put(
        `https://backend-music-xg6e.onrender.com/api/v1/user/update/${selectedArtist._id}`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      toast.success("User updated successfully ✅");
      handleClose();
    } catch (error) {
      console.error("Update failed", error);
      toast.error("Failed to update user");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "20px", // Add some top margin
        }}
      >
        <Spinner variant="primary" />
      </div>
    );
  }

  return (
    <Fragment>
      <Container className="text-center my-4">
        <Button variant="success" onClick={() => setShowAddModal(true)}>
          Create New Artist
        </Button>
      </Container>

      <Container className="mb-4">
        <InputGroup>
          <FormControl
            placeholder="Search artist by name or email..."
            value={searchTerm}
            onChange={handleSearchInput}
          />
        </InputGroup>
      </Container>
      {/* {searchFlag && searchResults.length == 0 && (
        <div>
          <h1 className="text-danger h6">Artist Not Found</h1>
        </div>
      )} */}

      <Row className="gy-4 gx-4">
        <Col sm={12}>
          <Card title="Artists">
            <CardBody>
              <div className={`table-responsive ${styles.table_wrapper}`}>
                <table className={`table ${styles.table}`}>
                  <thead className={`text-primary thead ${styles.thead}`}>
                    <tr>
                      <td>Cover Image</td>
                      <td>Name</td>
                      <td>Email</td>
                      <td>Role</td>
                      <td>Actions</td>
                    </tr>
                  </thead>
                  <tbody className={styles.tbody}>
                    {(searchResults.length > 0 ? searchResults : artists).map(
                      (artist, index) => (
                        <tr key={index} onClick={() => handleShowModal(artist)}>
                          <td>
                            <img
                              src={artist.coverImage || defaultUser}
                              alt="cover"
                              width={40}
                            />
                          </td>
                          <td>{artist.fullName}</td>
                          <td>{artist.email}</td>
                          <td>{artist.role}</td>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedArtist(artist);
                              setShowModal(true);
                            }}
                          >
                            <img src={editIcon} alt="edit" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setArtistToDelete(artist);
                              setShowDeleteModal(true);
                            }}
                          >
                            <img src={deleteIcon} alt="delete" />
                          </button>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
              <div className="d-flex justify-content-center align-items-center gap-3 mt-4">
                <Button
                  variant="outline-secondary"
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span>
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
          </Card>
        </Col>
      </Row>

      <AddUserModal
        showModalAdd={showAddModal}
        type={"artist"}
        handleClose={() => setShowAddModal(false)}
      />

      <Modal show={showModal} onHide={handleClose}>
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

            <Form.Group controlId="formCoverImage" className="mb-3">
              <Form.Label>Cover Image</Form.Label>
              <div style={{ position: "relative", display: "inline-block" }}>
                <img
                  src={previewImage}
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
          <Button variant="secondary" onClick={handleClose} disabled={saving}>
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
          <Modal.Title>Delete Artist</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete "{artistToDelete?.fullName}"?
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
          <Button variant="danger" onClick={handleDeleteArtist}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      <UserDetailsModal
        show={showdetailMmodal}
        handleClose={handleCloseModal}
        user={selectedUser}
      />
    </Fragment>
  );
};

export default ArtistsPage;
