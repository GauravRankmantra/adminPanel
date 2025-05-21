import React, { useEffect, useState } from "react";
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
} from "react-bootstrap";
import toast, { Toaster } from "react-hot-toast";
import classNames from "classnames";

const API_BASE = "https://backend-music-xg6e.onrender.com/api/v1/AdminVideo";

const FeaturedVideoAdmin = () => {
  const [videoData, setVideoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    fetchVideo();
  }, []);

  const fetchVideo = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(API_BASE);
      setVideoData(data);
      setNewTitle(data.title || "");
    } catch (error) {
      setVideoData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleVideoUpload = async () => {
    if (!selectedFile) return toast.error("Please select a video file");
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("video", selectedFile);
      formData.append("title", newTitle || "Featured Video");

      const { data } = await axios.post(`${API_BASE}/upload-video`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Video uploaded successfully!");
      setVideoData(data);
      setShowModal(false);
      setSelectedFile(null);
    } catch (err) {
      toast.error("Failed to upload video");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete the featured video?"))
      return;
    try {
      await axios.delete(API_BASE);
      toast.success("Video deleted successfully");
      setVideoData(null);
    } catch (err) {
      toast.error("Failed to delete video");
    }
  };

  const handleTitleUpdate = async () => {
    try {
      await axios.put(API_BASE, { title: newTitle });
      toast.success("Title updated");
      setVideoData((prev) => ({ ...prev, title: newTitle }));
    } catch (err) {
      toast.error("Failed to update title");
    }
  };

  return (
    <Container className="py-4">
      <Toaster position="top-right" />

      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-lg border-0 rounded-4 p-3">
            <Card.Body>
              <Card.Title className="d-flex justify-content-between align-items-center">
                <span className="fw-bold fs-4">Featured Video</span>
                <Button variant="primary" onClick={() => setShowModal(true)}>
                  {videoData ? "Replace Video" : "Upload Video"}
                </Button>
              </Card.Title>

              {loading ? (
                <div className="d-flex justify-content-center py-5">
                  <Spinner animation="border" variant="primary" />
                </div>
              ) : videoData ? (
                <>
                  <div className="mt-4 mb-3">
                    <video
                      src={videoData.url}
                      controls
                      className="w-100 rounded shadow"
                      style={{ maxHeight: "400px" }}
                    />
                  </div>
                  <Form.Group className="mb-3">
                    <Form.Label>Video Title</Form.Label>
                    <Form.Control
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                    />
                  </Form.Group>
                  <div className="d-flex justify-content-between">
                    <Button variant="success" onClick={handleTitleUpdate}>
                      Update Title
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                      Delete Video
                    </Button>
                  </div>
                </>
              ) : (
                <p className="text-muted mt-4">No video uploaded yet.</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Upload Modal */}
      <Modal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setSelectedFile(null);
        }}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {videoData ? "Replace Video" : "Upload New Video"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Video Title</Form.Label>
            <Form.Control
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Enter video title"
            />
          </Form.Group>

          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>Select Video File</Form.Label>
            <Form.Control
              type="file"
              accept="video/*"
              onChange={(e) => setSelectedFile(e.target.files[0])}
            />
          </Form.Group>

          {uploading ? (
            <div className="text-center">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            <Button
              variant="primary"
              onClick={handleVideoUpload}
              className={classNames("w-100", { disabled: uploading })}
            >
              {videoData ? "Replace Video" : "Upload Video"}
            </Button>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default FeaturedVideoAdmin;
