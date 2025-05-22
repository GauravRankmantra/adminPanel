import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  Card,
  Button,
  Spinner,
  Form,
  Modal,
  Container,
  Row,
  Col,
  Alert, // Added for success/error messages
  InputGroup, // For search/filter input
} from "react-bootstrap";
import toast, { Toaster } from "react-hot-toast";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaVideo,
  FaEye,
  FaSearch,
  FaTimes, // For clear search
} from "react-icons/fa"; // More icons for better UI
import classNames from "classnames";
import moment from "moment"; // For displaying video upload time

const API_BASE = "http://localhost:5000/api/v1/AdminVideo"; // Base URL for videos
const API_UPLOAD = `${API_BASE}`; // Specific endpoint for upload

// Helper function to format views (e.g., 12345 -> 12.3K)
const formatViews = (num) => {
  if (typeof num !== 'number' || isNaN(num)) return '0 Views'; // Handle non-numeric or missing views
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M Views';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K Views';
  }
  return num + ' Views';
};

const FeaturedVideoAdmin = () => {
  const [videos, setVideos] = useState([]); // Array to hold all videos
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentVideo, setCurrentVideo] = useState(null); // Video being edited/viewed
  const [newTitle, setNewTitle] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // State for search functionality
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // Modal for delete confirmation

  // --- Fetch all videos ---
  const fetchVideos = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(API_BASE); // Fetch all videos
       if (Array.isArray(data)) {
        setVideos(data);
      } else if (data && typeof data === 'object') {
        // If it's a single video object (from old API), wrap it in an array
        setVideos([data]);
        console.warn("API returned a single video object where an array was expected. Wrapping in array.");
      } else {
        // If data is null, undefined, or empty, set to empty array
        setVideos([]);
      }
    } catch (error) {
      console.error("Failed to fetch videos:", error);
      toast.error("Failed to load videos.");
      setVideos([]); // Clear videos on error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  // --- Modal Handlers ---
  const handleShowAddModal = () => {
    setCurrentVideo(null); // Clear current video for adding new
    setNewTitle("");
    setSelectedFile(null);
    setShowModal(true);
  };

  const handleShowEditModal = (video) => {
    setCurrentVideo(video); // Set video to be edited
    setNewTitle(video.title || "");
    setSelectedFile(null); // No file pre-selected for edit, user must re-select if changing video
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentVideo(null);
    setNewTitle("");
    setSelectedFile(null);
  };

  const handleShowDeleteConfirm = (video) => {
    setCurrentVideo(video);
    setShowDeleteConfirm(true);
  };

  const handleCloseDeleteConfirm = () => {
    setShowDeleteConfirm(false);
    setCurrentVideo(null);
  };

  // --- Video Upload / Update ---
  const handleVideoSubmit = async () => {
    if (!selectedFile && !currentVideo) {
      return toast.error("Please select a video file to upload.");
    }

    if (!newTitle.trim()) {
      return toast.error("Video title cannot be empty.");
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("title", newTitle.trim());
    if (selectedFile) {
      formData.append("video", selectedFile);
    }

    try {
      let response;
      if (currentVideo) {
        // Update existing video (title or replace file)
        response = await axios.put(`${API_BASE}/${currentVideo._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Video updated successfully!");
      } else {
        // Upload new video
        response = await axios.post(API_UPLOAD, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Video uploaded successfully!");
      }
      fetchVideos(); // Refresh the list
      handleCloseModal();
    } catch (err) {
      console.error("Video operation failed:", err);
      toast.error(`Failed to ${currentVideo ? "update" : "upload"} video: ${err.response?.data?.message || err.message}`);
    } finally {
      setUploading(false);
    }
  };

  // --- Video Delete ---
  const handleDeleteVideo = async () => {
    if (!currentVideo) return; // Should not happen with modal
    try {
      await axios.delete(`${API_BASE}/${currentVideo._id}`);
      toast.success("Video deleted successfully!");
      fetchVideos(); // Refresh the list
      handleCloseDeleteConfirm();
    } catch (err) {
      console.error("Failed to delete video:", err);
      toast.error("Failed to delete video.");
    }
  };

  // --- Filtered Videos for Display ---
 const filteredVideos = videos.filter(video =>
    video.title?.toLowerCase().includes(searchTerm.toLowerCase()) // Added optional chaining for video.title
  ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));// Sort by newest first

  return (
    <Container className="py-4">
      <Toaster position="top-right" />

      <Card className="shadow-lg border-0 rounded-4 p-4 mb-4 bg-light">
        <Card.Body>
          <Card.Title className="d-flex justify-content-between align-items-center mb-4">
            <span className="fw-bold fs-3 text-primary d-flex align-items-center">
              <FaVideo className="me-2" /> Video Management
            </span>
            <Button variant="success" onClick={handleShowAddModal}>
              <FaPlus className="me-2" /> Add New Video
            </Button>
          </Card.Title>

          {/* Search Bar */}
          <Row className="mb-4">
            <Col>
              <InputGroup>
                <InputGroup.Text><FaSearch /></InputGroup.Text>
                <Form.Control
                  placeholder="Search videos by title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <Button variant="outline-secondary" onClick={() => setSearchTerm("")}>
                    <FaTimes />
                  </Button>
                )}
              </InputGroup>
            </Col>
          </Row>

          {loading ? (
            <div className="d-flex justify-content-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="ms-3 text-muted">Loading videos...</p>
            </div>
          ) : filteredVideos.length === 0 && searchTerm === "" ? (
            <Alert variant="info" className="text-center py-4">
              <FaVideo className="me-2" /> No videos uploaded yet. Click "Add New Video" to get started!
            </Alert>
          ) : filteredVideos.length === 0 && searchTerm !== "" ? (
            <Alert variant="warning" className="text-center py-4">
                <FaExclamationCircle className="me-2" /> No videos found matching "{searchTerm}".
            </Alert>
          ) : (
            <Row xs={1} md={2} lg={3} className="g-4"> {/* Responsive grid for videos */}
              {filteredVideos.map((video) => (
                <Col key={video._id}>
                  <Card className="h-100 shadow-sm border rounded-3 overflow-hidden d-flex flex-column">
                    <div className="position-relative">
                      <video
                        src={video.url}
                        controls
                        className="w-100 rounded-top"
                        style={{ maxHeight: "250px", objectFit: "cover" }} // Ensure aspect ratio and fit
                      >
                        Your browser does not support the video tag.
                      </video>
                      {/* Views Overlay (optional: could be on hover or static) */}
                      <div className="position-absolute bottom-0 end-0 p-2 bg-dark bg-opacity-75 text-white rounded-bottom-start">
                        <FaEye className="me-1" /> {formatViews(video.views)}
                      </div>
                    </div>
                    <Card.Body className="flex-grow-1 d-flex flex-column justify-content-between">
                      <Card.Title className="fw-bold text-truncate mb-2" title={video.title}>
                        {video.title}
                      </Card.Title>
                      <Card.Text className="text-muted small mb-3">
                        Uploaded: {moment(video.createdAt).format("MMM D, YYYY h:mm A")}
                      </Card.Text>
                      <div className="d-flex justify-content-between mt-auto">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleShowEditModal(video)}
                          className="flex-grow-1 me-2"
                        >
                          <FaEdit className="me-1" /> Edit
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleShowDeleteConfirm(video)}
                          className="flex-grow-1"
                        >
                          <FaTrash className="me-1" /> Delete
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Card.Body>
      </Card>

      {/* Upload/Edit Video Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered backdrop="static" keyboard={false}>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>{currentVideo ? "Edit Video" : "Upload New Video"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Video Title</Form.Label>
              <Form.Control
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Enter video title"
                required
                isInvalid={newTitle.trim() === "" && !uploading} // Add validation feedback
              />
              <Form.Control.Feedback type="invalid">
                Video title is required.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label className="fw-bold">
                {currentVideo ? "Replace Video File (Optional)" : "Select Video File"}
              </Form.Label>
              <Form.Control
                type="file"
                accept="video/*"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                required={!currentVideo} // File is required for new uploads
                isInvalid={!currentVideo && !selectedFile && !uploading} // Validation for new upload
              />
               <Form.Control.Feedback type="invalid">
                Please select a video file.
              </Form.Control.Feedback>
              {currentVideo && !selectedFile && (
                <Form.Text className="text-muted">
                  Leave empty to keep the existing video file.
                </Form.Text>
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal} disabled={uploading}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleVideoSubmit}
            disabled={uploading || (newTitle.trim() === "" && !uploading) || (!currentVideo && !selectedFile && !uploading)}
          >
            {uploading ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-1" />
                {currentVideo ? "Updating..." : "Uploading..."}
              </>
            ) : currentVideo ? (
              "Save Changes"
            ) : (
              "Upload Video"
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteConfirm} onHide={handleCloseDeleteConfirm} centered>
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the video titled "
          <span className="fw-bold">{currentVideo?.title}</span>"? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteConfirm}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteVideo}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default FeaturedVideoAdmin;