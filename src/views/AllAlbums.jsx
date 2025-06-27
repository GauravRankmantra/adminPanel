import React, { useEffect, useState } from "react";
import {
  Card,
  Button,
  Row,
  Col,
  Container,
  Spinner,
  Modal,
} from "react-bootstrap";
import { MdOutlineDelete } from "react-icons/md";

import { useNavigate } from "react-router";
import defaultAlbum from "../assets/image/album_cover.png";
import axios from "axios";
import { toast } from "react-hot-toast";

const AllAlbums = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingAlbumId, setDeletingAlbumId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/albums`);
      setAlbums(response.data.allAlbums);
    } catch (error) {
      setError("Error fetching albums");
    } finally {
      setLoading(false);
    }
  };

  const handleAlbumClick = (albumId) => {
    navigate(`/forms/album/${albumId}`);
  };

  const confirmDelete = (album) => {
    setSelectedAlbum(album);
    setShowConfirmModal(true);
  };

  const handleDelete = async () => {
    if (!selectedAlbum) return;

    setDeletingAlbumId(selectedAlbum._id);
    setShowConfirmModal(false);

    try {
      await axios.delete(`${apiUrl}/albums/${selectedAlbum._id}`, {
        withCredentials: true,
      });
      toast.success("Album deleted successfully");
      setAlbums((prev) => prev.filter((a) => a._id !== selectedAlbum._id));
    } catch (error) {
      toast.error("Failed to delete album");
    } finally {
      setDeletingAlbumId(null);
      setSelectedAlbum(null);
    }
  };

  if (loading) return <div>Loading albums...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Container>
      <h1 className="text-center my-4">All Albums</h1>
      <Row>
        {albums.map((album) => (
          <Col key={album._id} sm={12} md={6} lg={3} className="mb-4">
            <Card className="h-100 album-card position-relative">
              <div
                className="position-absolute top-0 end-0 p-2"
                style={{ zIndex: 1 }}
              >
                <button
                  className="btn btn-outline-dark"
                  onClick={() => confirmDelete(album)}
                  disabled={deletingAlbumId === album._id}
                >
                  {deletingAlbumId === album._id ? (
                    <Spinner size="sm" animation="border" />
                  ) : (
                    <MdOutlineDelete color="red" size={20} />
                  )}
                </button>
              </div>

              <Card.Img
                variant="top"
                src={album?.coverImage || defaultAlbum}
                loading="lazy"
              />

              <Card.Body>
                <Card.Title>{album.title}</Card.Title>
                <Card.Text>
                  Artist: {album?.artist?.fullName || "Unknown Artist"}
                </Card.Text>
                <Card.Text>Company: {album?.company}</Card.Text>
                <Button
                  variant="outline-primary mt-2"
                  onClick={() => handleAlbumClick(album._id)}
                >
                  View Album Info
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Delete Confirmation Modal */}
      <Modal
        show={showConfirmModal}
        onHide={() => setShowConfirmModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete{" "}
          <strong>{selectedAlbum?.title}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowConfirmModal(false)}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AllAlbums;
