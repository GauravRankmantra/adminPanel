import React, { useState, useEffect } from "react";
import { CardBody, Col, Row, Modal, Button, Form } from "react-bootstrap";
import Card from "@/components/Card/Card";
import styles from "@/assets/scss/Tables.module.scss";
import axios from "axios";
import editIcon from "../assets/image/edit.png";
import deleteIcon from "../assets/image/trash.png";

const AllSongs = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSong, setSelectedSong] = useState(null);
  const [totalPages, setTotalPages] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Fetch all songs on component load
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await axios.get(
          "https://backend-music-xg6e.onrender.com/api/v1/song"
        );
        setSongs(response?.data); // Assuming the API response returns songs
        setLoading(false);
      } catch (error) {
        console.error("Error fetching songs:", error);
        setLoading(false);
      }
    };

    fetchSongs();
  }, []);

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

  const handleEditClick = (song) => {
    setSelectedSong(song);
    setShowEditModal(true);
  };

  const handleDeleteClick = (song) => {
    setSelectedSong(song);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(
        `https://backend-music-xg6e.onrender.com/api/v1/song/${selectedSong._id}`
      );
      setSongs(songs.filter((song) => song._id !== selectedSong._id)); // Remove deleted song from list
      setShowDeleteModal(false); // Close delete modal
    } catch (error) {
      console.error("Error deleting song:", error);
    }
  };

  const handleEditSave = async () => {
    try {
      // Perform the update API call here (e.g., updating song details)
      await axios.put(
        `https://backend-music-xg6e.onrender.com/api/v1/song/${selectedSong._id}`,
        {
          title: selectedSong.title,
          artist: selectedSong.artist,
          album: selectedSong.album,
          duration: selectedSong.duration,
        }
      );
      setShowEditModal(false); // Close the modal after successful save
      const updatedSongs = songs.map((song) =>
        song._id === selectedSong._id ? selectedSong : song
      );
      setSongs(updatedSongs); // Update the song list
    } catch (error) {
      console.error("Error updating song:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Row className="gy-4 gx-4">
        <Col sm={12}>
          <Card title="User Information">
            <CardBody>
          
              <div className={`table-responsive ${styles.table_wrapper}`}>
                <table className={`table ${styles.table}`}>
                  <thead className={`text-primary thead ${styles.thead}`}>
                    <tr>
                      <td>Cover image</td>
                      <td>Title</td>
                      <td>Artist</td>
                      <td>Album</td>
                      <td>Duration</td>
                      <td>Update</td>
                    </tr>
                  </thead>
                  {console.log(songs)}
                  <tbody className={`tbody ${styles.tbody}`}>
                    {songs?.data?.map((song, index) => (
                      <tr key={index}>
                        <td>
                          <img
                            src={song?.coverImage}
                            alt="Cover"
                            style={{ width: "50px", height: "50px" }}
                          />
                        </td>
                        <td>{song?.title}</td>
                        <td>{song?.artist?.fullName}</td>
                        <td>{song?.album?.title || "No Album"}</td>
                        <td>
                          {Math.floor(song?.duration)}:
                          {String(Math.floor(song?.duration % 60)).padStart(
                            2,
                            "0"
                          )}{" "}
                          <span style={{ fontSize: "0.8em", opacity: 0.6 }}>
                            min
                          </span>
                        </td>

                       
                          <button
                            
                            onClick={() => handleEditClick(song)}
                          >
                            <img src={editIcon} alt="Edit" />
                          </button>
                          <button
                            
                            onClick={() => handleDeleteClick(song)}
                          >
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

      {/* Edit Song Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Song</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedSong && (
            <Form>
              <Form.Group controlId="formSongName">
                <Form.Label>Song Name</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedSong?.title}
                  onChange={(e) =>
                    setSelectedSong({ ...selectedSong, title: e.target.value })
                  }
                />
              </Form.Group>

              <Form.Group controlId="formArtistName">
                <Form.Label>Artist</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedSong?.artist?.fullName}
                  onChange={(e) =>
                    setSelectedSong({
                      ...selectedSong,
                      artist: { ...selectedSong.artist, fullName: e.target.value },
                    })
                  }
                />
              </Form.Group>

              <Form.Group controlId="formAlbumName">
                <Form.Label>Album</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedSong?.album?.title || ""}
                  onChange={(e) =>
                    setSelectedSong({
                      ...selectedSong,
                      album: { ...selectedSong.album, title: e.target.value },
                    })
                  }
                />
              </Form.Group>

              <Form.Group controlId="formDuration">
                <Form.Label>Duration</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedSong?.duration}
                  onChange={(e) =>
                    setSelectedSong({
                      ...selectedSong,
                      duration: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleEditSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the song "{selectedSong?.title}"?
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
    </div>
  );
};

export default AllSongs;
