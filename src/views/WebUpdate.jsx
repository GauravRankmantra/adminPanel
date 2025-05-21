import React, { useState, useEffect, useCallback } from "react";
import { Table, Button, Modal, Form, Spinner } from "react-bootstrap";

import { toast } from "react-hot-toast";
import { MdOutlineModeEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { IoIosAddCircle } from "react-icons/io";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

const WebUpdateComponent = () => {
  const [webUpdates, setWebUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingUpdate, setEditingUpdate] = useState(null);
  const [editForm, setEditForm] = useState({
    heading: "",
    subHeading: "",
    link: "",
  });
  const [editSubmitLoading, setEditSubmitLoading] = useState(false);
  const [editSubmitDisabled, setEditSubmitDisabled] = useState(true);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addForm, setAddForm] = useState({
    heading: "",
    subHeading: "",
    link: "",
  });
  const [addSubmitLoading, setAddSubmitLoading] = useState(false);
  const [addSubmitDisabled, setAddSubmitDisabled] = useState(true);

  const fetchWebUpdates = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        "https://backend-music-xg6e.onrender.com/api/v1/web"
      );
      if (response.data.success) {
        setWebUpdates(response.data.data);
      } else {
        setError(response.data.message || "Failed to fetch web updates.");
        toast.error(response.data.message || "Failed to fetch web updates.");
      }
    } catch (error) {
      setError(
        error.message || "An error occurred while fetching web updates."
      );
      toast.error(
        error.message || "An error occurred while fetching web updates."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWebUpdates();
  }, [fetchWebUpdates]);

  // Delete Web Update
  const handleDelete = (id) => {
    setDeletingId(id);
    setDeleteModalOpen(true); // Open the confirmation modal
  };

  const confirmDelete = async () => {
    if (!deletingId) return;

    setDeleteLoading(true);
    try {
      const response = await axios.delete(
        `https://backend-music-xg6e.onrender.com/api/v1/web/${deletingId}`
      );
      if (response.data.success) {
        toast.success(
          response.data.message || "Web update deleted successfully."
        );
        setWebUpdates((prevUpdates) =>
          prevUpdates.filter((update) => update._id !== deletingId)
        );
        setDeleteModalOpen(false); // Close modal on success
      } else {
        toast.error(response.data.message || "Failed to delete web update.");
        setError(response.data.message);
      }
    } catch (error) {
      toast.error(
        error.message || "An error occurred while deleting the web update."
      );
      setError(error.message);
    } finally {
      setDeleteLoading(false);
      setDeletingId(null);
    }
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setDeletingId(null); // Reset deleting ID
  };

  // Edit Web Update
  const handleEdit = (update) => {
    setEditingUpdate(update);
    setEditForm({
      heading: update.heading,
      subHeading: update.subHeading,
      link: update.link,
    });
    setEditSubmitDisabled(true); // Disable submit initially
    setEditModalOpen(true);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
    // Enable submit if any field has changed from the original
    setEditSubmitDisabled(
      editingUpdate?.heading ===
        (name === "heading" ? value : editForm.heading) &&
        editingUpdate?.subHeading ===
          (name === "subHeading" ? value : editForm.subHeading) &&
        editingUpdate?.link === (name === "link" ? value : editForm.link)
    );
  };

  const handleEditSubmit = async () => {
    if (!editingUpdate) return;

    setEditSubmitLoading(true);
    try {
      const response = await axios.put(
        `https://backend-music-xg6e.onrender.com/api/v1/web/${editingUpdate._id}`,
        editForm,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.success) {
        toast.success(
          response.data.message || "Web update updated successfully."
        );
        setWebUpdates((prevUpdates) =>
          prevUpdates.map((update) =>
            update._id === editingUpdate._id
              ? { ...update, ...response.data.data }
              : update
          )
        );
        setEditModalOpen(false);
        setEditingUpdate(null);
      } else {
        toast.error(response.data.message || "Failed to update web update.");
        setError(response.data.message);
      }
    } catch (error) {
      toast.error(
        error.message || "An error occurred while updating the web update."
      );
      setError(error.message);
    } finally {
      setEditSubmitLoading(false);
    }
  };

  const handleAddInputChange = (e) => {
    const { name, value } = e.target;
    setAddForm((prev) => ({ ...prev, [name]: value }));
    // Disable submit if heading or subheading is empty
    setAddSubmitDisabled(
      !addForm.heading?.trim() || !addForm.subHeading?.trim()
    );
  };

  const handleAddSubmit = async () => {
    setAddSubmitLoading(true);
    try {
      const response = await axios.post(
        "https://backend-music-xg6e.onrender.com/api/v1/web",
        addForm,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.success) {
        toast.success(
          response.data.message || "Web update added successfully."
        );
        setWebUpdates((prevUpdates) => [response.data.data, ...prevUpdates]); // Add to the beginning
        setAddModalOpen(false);
        setAddForm({ heading: "", subHeading: "", link: "" }); // Reset form
      } else {
        toast.error(response.data.message || "Failed to add web update.");
        setError(response.data.message);
      }
    } catch (error) {
      toast.error(
        error.message || "An error occurred while adding the web update."
      );
      setError(error.message);
    } finally {
      setAddSubmitLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <h1 className="text-center my-4">Web Updates</h1>

      <div className="d-flex justify-content-end mb-3">
        <Button
          variant="primary"
          onClick={() => setAddModalOpen(true)}
          className="shadow-sm"
        >
          <IoIosAddCircle className="me-2" /> Add New Update
        </Button>
      </div>

      {loading && (
        <div className="text-center my-4">
          <Spinner animation="border" variant="primary" />
        </div>
      )}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && (
        <div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Table striped bordered hover responsive className="shadow-sm">
            <thead>
              <tr>
                <th>Heading</th>
                <th>Subheading</th>
                <th>Link</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {webUpdates.map((update) => (
                <tr
                  key={update._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <td>{update.heading}</td>
                  <td>{update.subHeading}</td>
                  <td>
                    {update.link ? (
                      <a
                        href={update.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {update.link}
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td>{new Date(update.createdAt).toLocaleString()}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleEdit(update)}
                        className="shadow-sm"
                        title="Edit"
                      >
                        <MdOutlineModeEdit />
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(update._id)}
                        className="shadow-sm"
                        title="Delete"
                      >
                        <MdDelete />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal show={deleteModalOpen} onHide={cancelDelete} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this web update? This action cannot be
          undone.
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={cancelDelete}
            className="shadow-sm"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={confirmDelete}
            disabled={deleteLoading}
            className="shadow-sm"
          >
            {deleteLoading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />{" "}
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Web Update Modal */}
      <Modal
        show={editModalOpen}
        onHide={() => setEditModalOpen(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Web Update</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editingUpdate && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Heading</Form.Label>
                <Form.Control
                  type="text"
                  name="heading"
                  value={editForm.heading}
                  onChange={handleEditInputChange}
                  placeholder="Enter heading"
                  className="shadow-sm"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Subheading</Form.Label>
                <Form.Control
                  type="text"
                  name="subHeading"
                  value={editForm.subHeading}
                  onChange={handleEditInputChange}
                  placeholder="Enter subheading"
                  className="shadow-sm"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Link</Form.Label>
                <Form.Control
                  type="text"
                  name="link"
                  value={editForm.link}
                  onChange={handleEditInputChange}
                  placeholder="Enter link"
                  className="shadow-sm"
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setEditModalOpen(false)}
            className="shadow-sm"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleEditSubmit}
            disabled={editSubmitDisabled}
            className="shadow-sm"
          >
            {editSubmitLoading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />{" "}
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add Web Update Modal */}
      <Modal show={addModalOpen} onHide={() => setAddModalOpen(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Web Update</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Heading</Form.Label>
              <Form.Control
                type="text"
                name="heading"
                value={addForm.heading}
                onChange={handleAddInputChange}
                placeholder="Enter heading"
                className="shadow-sm"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Subheading</Form.Label>
              <Form.Control
                type="text"
                name="subHeading"
                value={addForm.subHeading}
                onChange={handleAddInputChange}
                placeholder="Enter subheading"
                className="shadow-sm"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Link</Form.Label>
              <Form.Control
                type="text"
                name="link"
                value={addForm.link}
                onChange={handleAddInputChange}
                placeholder="Enter link"
                className="shadow-sm"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setAddModalOpen(false)}
            className="shadow-sm"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleAddSubmit}
            disabled={addSubmitDisabled}
            className="shadow-sm"
          >
            {addSubmitLoading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />{" "}
                Adding...
              </>
            ) : (
              "Add Update"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default WebUpdateComponent;
