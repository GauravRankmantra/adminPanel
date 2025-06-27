import React, { useEffect, useState } from "react";
import { Button, Modal, Form, Spinner, Table } from "react-bootstrap";
import toast from "react-hot-toast";
import axios from "axios";

const Genres = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [saving, setSaving] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [newGenre, setNewGenre] = useState({
    name: "",
    discription: "",
    image: null,
  });
  const [editGenre, setEditGenre] = useState({
    name: "",
    discription: "",
    image: null,
  });
  const [originalEditGenre, setOriginalEditGenre] = useState({});

  const fetchGenres = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${apiUrl}/genre`);
      setGenres(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch genres");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGenres();
  }, []);

  const handleDelete = async () => {
    try {
      const id = selectedGenre?._id;
      if (!id) return;

      await axios.delete(`${apiUrl}/genre/${id}`);
      toast.success("Genre deleted successfully");
      setShowDeleteModal(false);
      fetchGenres();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete genre");
    }
  };

  const handleCreate = async () => {
    if (
      !newGenre.name.trim() ||
      !newGenre.discription.trim() ||
      !newGenre.image
    ) {
      toast.error("Please fill all fields and select an image");
      return;
    }

    try {
      setSaving(true);
      const formData = new FormData();
      formData.append("name", newGenre.name);
      formData.append("discription", newGenre.discription);
      formData.append("image", newGenre.image);

      await axios.post(`${apiUrl}/genre`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Genre added successfully");
      setShowAddModal(false);
      setNewGenre({ name: "", discription: "", image: null });
      fetchGenres();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add genre");
    } finally {
      setSaving(false);
    }
  };

  const hasEditChanges = () => {
    return (
      editGenre.name !== originalEditGenre.name ||
      editGenre.discription !== originalEditGenre.discription ||
      editGenre.image !== null
    );
  };

  const handleUpdate = async () => {
    const id = selectedGenre?._id;
    if (!id || !hasEditChanges()) return;

    try {
      setUpdating(true);
      const formData = new FormData();
      if (editGenre.name !== originalEditGenre.name)
        formData.append("name", editGenre.name);
      if (editGenre.discription !== originalEditGenre.discription)
        formData.append("discription", editGenre.discription);
      if (editGenre.image) formData.append("image", editGenre.image);

      await axios.put(`${apiUrl}/genre/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Genre updated successfully");
      setShowEditModal(false);
      fetchGenres();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update genre");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Genres</h2>
        <Button variant="primary" onClick={() => setShowAddModal(true)}>
          Add Genre
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Image</th>
              <th>Genre Name</th>
              <th style={{ width: "300px" }}>description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {genres.length > 0 ? (
              genres?.map((genre, index) => (
                <tr key={genre._id}>
                  <td>{index + 1}</td>
                  <td
                    style={{
                      width: "50px",
                    }}
                  >
                    <img
                      style={{
                        width: "50px",
                      }}
                      src={genre.image || "https://dummyimage.com/svga"}
                    ></img>
                  </td>
                  <td>{genre.name}</td>
                  <td>
                    <div
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        maxWidth: "280px",
                      }}
                    >
                      {genre.discription}
                    </div>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button
                        variant="info"
                        size="sm"
                        onClick={() => {
                          setSelectedGenre(genre);
                          setShowViewModal(true);
                        }}
                      >
                        View
                      </Button>
                      <Button
                        variant="info"
                        size="sm"
                        onClick={() => {
                          setSelectedGenre(genre);
                          setEditGenre({
                            name: genre.name,
                            discription: genre.discription,
                            image: null,
                          });
                          setOriginalEditGenre({
                            name: genre.name,
                            discription: genre.discription,
                          });
                          setShowEditModal(true);
                        }}
                      >
                        Edit
                      </Button>

                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => {
                          setSelectedGenre(genre);
                          setShowDeleteModal(true);
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  No genres found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete <strong>{selectedGenre?.name}</strong>
          ?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add Genre Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Genre</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {/* Genre Name */}
            <Form.Group controlId="genreName" className="mb-3">
              <Form.Label>Genre Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter genre name"
                value={newGenre.name}
                onChange={(e) =>
                  setNewGenre({ ...newGenre, name: e.target.value })
                }
              />
            </Form.Group>

            {/* Genre discription */}
            <Form.Group controlId="genrediscription" className="mb-3">
              <Form.Label>discription</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter discription"
                value={newGenre.discription}
                onChange={(e) =>
                  setNewGenre({ ...newGenre, discription: e.target.value })
                }
              />
            </Form.Group>

            {/* Genre Image Upload */}
            <Form.Group controlId="genreImage" className="mb-3">
              <Form.Label>Genre Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => {
                  setNewGenre({ ...newGenre, image: e.target.files[0] });
                }}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleCreate} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* View Genre Modal */}
      <Modal
        show={showViewModal}
        onHide={() => setShowViewModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Genre Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>Name:</h5>
          <p>{selectedGenre?.name}</p>

          <h5>discription:</h5>
          <p>{selectedGenre?.discription}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      {/* 
update model */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Genre</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="editGenreName" className="mb-3">
              <Form.Label>Genre Name</Form.Label>
              <Form.Control
                type="text"
                value={editGenre.name}
                onChange={(e) =>
                  setEditGenre({ ...editGenre, name: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group controlId="editGenrediscription" className="mb-3">
              <Form.Label>discription</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={editGenre.discription}
                onChange={(e) =>
                  setEditGenre({ ...editGenre, discription: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group controlId="editGenreImage" className="mb-3">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setEditGenre({ ...editGenre, image: e.target.files[0] })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleUpdate}
            disabled={!hasEditChanges() || updating}
          >
            {updating ? "Submitting..." : "Update"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Genres;
