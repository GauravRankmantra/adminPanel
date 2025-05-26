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
  Alert,
  InputGroup,
} from "react-bootstrap";
import toast, { Toaster } from "react-hot-toast";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaVideo,
  FaEye,
  FaSearch,
  FaTimes,
  FaExclamationCircle,
  FaPlayCircle,
} from "react-icons/fa";
import classNames from "classnames";
import moment from "moment";

const API_BASE = "https://backend-music-xg6e.onrender.com/api/v1/AdminVideo";
const API_UPLOAD = `${API_BASE}`;

// Helper function to format views (e.g., 12345 -> 12.3K)
const formatViews = (num) => {
  if (typeof num !== 'number' || isNaN(num)) return '0 Views';
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M Views';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K Views';
  }
  return num + ' Views';
};

const FeaturedVideoAdmin = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showModal, setShowModal] = useState(false); // For Add/Edit Modal
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedThumbnailFile, setSelectedThumbnailFile] = useState(null);
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState(null);

  const [currentVideo, setCurrentVideo] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // NEW STATES FOR VIDEO PLAYBACK MODAL
  const [showVideoPlayModal, setShowVideoPlayModal] = useState(false);
  const [videoToPlayUrl, setVideoToPlayUrl] = useState(null);
  const [videoToPlayTitle, setVideoToPlayTitle] = useState("");


  useEffect(() => {
    if (selectedThumbnailFile) {
      const objectUrl = URL.createObjectURL(selectedThumbnailFile);
      setThumbnailPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setThumbnailPreviewUrl(null);
    }
  }, [selectedThumbnailFile]);


  // --- Fetch all videos ---
  const fetchVideos = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(API_BASE);
      if (Array.isArray(data)) {
        setVideos(data);
      } else if (data && typeof data === 'object') {
        setVideos([data]);
        console.warn("API returned a single video object where an array was expected. Wrapping in array.");
      } else {
        setVideos([]);
      }
    } catch (error) {
      console.error("Failed to fetch videos:", error);
      toast.error("Failed to load videos.");
      setVideos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  // --- Modal Handlers (Add/Edit) ---
  const handleShowAddModal = () => {
    setCurrentVideo(null);
    setNewTitle("");
    setSelectedFile(null);
    setSelectedThumbnailFile(null);
    setThumbnailPreviewUrl(null);
    setShowModal(true);
  };

  const handleShowEditModal = (video) => {
    setCurrentVideo(video);
    setNewTitle(video.title || "");
    setSelectedFile(null);
    setSelectedThumbnailFile(null);
    setThumbnailPreviewUrl(video.thumbnailUrl || null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentVideo(null);
    setNewTitle("");
    setSelectedFile(null);
    setSelectedThumbnailFile(null);
    setThumbnailPreviewUrl(null);
  };

  // --- Modal Handlers (Video Playback) ---
  const handleShowVideoPlayModal = (videoUrl, videoTitle) => {
    setVideoToPlayUrl(videoUrl);
    setVideoToPlayTitle(videoTitle);
    setShowVideoPlayModal(true);
  };

  const handleCloseVideoPlayModal = () => {
    setVideoToPlayUrl(null);
    setVideoToPlayTitle("");
    setShowVideoPlayModal(false);
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

    if (!currentVideo && !selectedThumbnailFile) {
        return toast.error("Please select a thumbnail image for the new video.");
    }


    setUploading(true);
    const formData = new FormData();
    formData.append("title", newTitle.trim());

    if (selectedFile) {
      formData.append("video", selectedFile);
    }
    if (selectedThumbnailFile) {
      formData.append("thumbnail", selectedThumbnailFile);
    }

    try {
      let response;
      if (currentVideo) {
        response = await axios.put(`${API_BASE}/${currentVideo._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Video updated successfully!");
      } else {
        response = await axios.post(API_UPLOAD, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Video uploaded successfully!");
      }
      fetchVideos();
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
    if (!currentVideo) return;
    try {
      await axios.delete(`${API_BASE}/${currentVideo._id}`);
      toast.success("Video deleted successfully!");
      fetchVideos();
      handleCloseDeleteConfirm();
    } catch (err) {
      console.error("Failed to delete video:", err);
      toast.error("Failed to delete video.");
    }
  };

  // --- Filtered Videos for Display ---
  const filteredVideos = videos.filter(video =>
    video.title?.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));


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
            <Row xs={1} md={2} lg={3} className="g-4">
              {filteredVideos.map((video) => (
                <Col key={video._id}>
                  <Card className="h-100 shadow-sm border rounded-3 overflow-hidden d-flex flex-column">
                    <div className="position-relative video-thumbnail-wrapper">
                      {video.thumbnailUrl ? (
                        <img
                          src={video.thumbnailUrl}
                          alt={video.title}
                          className="w-100 rounded-top"
                          style={{ maxHeight: "250px", objectFit: "cover", cursor: 'pointer' }}
                          // UPDATED onClick: Open video in modal
                          onClick={() => handleShowVideoPlayModal(video.url, video.title)}
                        />
                      ) : (
                        <div
                          className="w-100 rounded-top bg-light d-flex align-items-center justify-content-center text-muted"
                          style={{ maxHeight: "250px", height: "150px", objectFit: "cover", cursor: 'pointer' }}
                          // UPDATED onClick: Open video in modal
                          onClick={() => handleShowVideoPlayModal(video.url, video.title)}
                        >
                          <FaVideo size={50} />
                          <p className="ms-2 mb-0">No Thumbnail</p>
                        </div>
                      )}
                      {/* Play icon overlay */}
                      <div
                          className="position-absolute top-50 start-50 translate-middle text-white"
                          style={{ cursor: 'pointer', zIndex: 1 }}
                          // UPDATED onClick: Open video in modal
                          onClick={() => handleShowVideoPlayModal(video.url, video.title)}
                      >
                          <FaPlayCircle size={60} style={{ opacity: 0.8 }} />
                      </div>
                      {/* Views Overlay */}
                      <div className="position-absolute bottom-0 end-0 p-2 bg-dark bg-opacity-75 text-white rounded-bottom-start">
                        <FaEye className="me-1" /> {formatViews(video.views)}
                      </div>
                    </div>
                    <Card.Body className="flex-grow-1 d-flex flex-column justify-content-between">
                      <Card.Title className="fw-bold text-truncate mb-2" title={video.title}>
                        {video.title}
                      </Card.Title>
                      <Card.Text className="text-muted small mb-3">
                        Uploaded: {moment(video.createdAt).format("MMM D,YYYY h:mm A")}
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
                isInvalid={newTitle.trim() === "" && !uploading}
              />
              <Form.Control.Feedback type="invalid">
                Video title is required.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formVideoFile" className="mb-3">
              <Form.Label className="fw-bold">
                {currentVideo ? "Replace Video File (Optional)" : "Select Video File"}
              </Form.Label>
              <Form.Control
                type="file"
                accept="video/*"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                required={!currentVideo}
                isInvalid={!currentVideo && !selectedFile && !uploading}
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

            {/* Thumbnail Upload Field */}
            <Form.Group controlId="formThumbnailFile" className="mb-3">
              <Form.Label className="fw-bold">
                {currentVideo ? "Replace Thumbnail (Optional)" : "Upload Thumbnail"}
              </Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedThumbnailFile(e.target.files[0])}
                required={!currentVideo}
                isInvalid={!currentVideo && !selectedThumbnailFile && !uploading}
              />
              <Form.Control.Feedback type="invalid">
                Please select a thumbnail image.
              </Form.Control.Feedback>
              {currentVideo && !selectedThumbnailFile && (
                <Form.Text className="text-muted">
                  Leave empty to keep the existing thumbnail.
                </Form.Text>
              )}

              {/* Thumbnail Preview */}
              {(thumbnailPreviewUrl || currentVideo?.thumbnailUrl) && (
                <div className="mt-2">
                  <p className="mb-1 text-muted small">Current/Selected Thumbnail:</p>
                  <img
                    src={thumbnailPreviewUrl || currentVideo?.thumbnailUrl}
                    alt="Thumbnail Preview"
                    style={{ maxWidth: '150px', height: 'auto', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                  {selectedThumbnailFile && (
                    <Form.Text className="d-block text-muted mt-1">
                      Selected: {selectedThumbnailFile.name}
                    </Form.Text>
                  )}
                </div>
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
            disabled={
                uploading ||
                newTitle.trim() === "" ||
                (!currentVideo && !selectedFile) ||
                (!currentVideo && !selectedThumbnailFile)
            }
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

      {/* NEW: Video Playback Modal */}
      <Modal show={showVideoPlayModal} onHide={handleCloseVideoPlayModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>{videoToPlayTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex justify-content-center align-items-center bg-dark">
          {videoToPlayUrl ? (
            <video
              src={videoToPlayUrl}
              controls
              autoPlay // Auto-play the video when modal opens
              className="w-100"
              style={{ maxHeight: '70vh' }} // Limit height to avoid overflow
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <Alert variant="danger">No video URL available.</Alert>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseVideoPlayModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

    </Container>
  );
};

export default FeaturedVideoAdmin;