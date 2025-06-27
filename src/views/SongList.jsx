import React, { useState } from "react";
import { CardBody, Col, Row } from "react-bootstrap";
import axios from "axios";
import SongTable from "../components/SongTable";
import EditSongModal from "../components/EditSongModal";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import Loading from "./Loading";

const SongList = ({ album, albumSongs }) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [songs, setSongs] = useState(albumSongs);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSong, setSelectedSong] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  const handleEditClick = (song) => {
    setSelectedSong(song);
    setShowEditModal(true);
  };
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
  const handleDeleteClick = (song) => {
    setSelectedSong(song);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setLoading(true);
      await axios.delete(`${apiUrl}/song/${selectedSong._id}`, {
        withCredentials: true,
      });
      setSongs(songs.filter((song) => song._id !== selectedSong._id));
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting song:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSave = async (updatedSong, coverImage) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", updatedSong.title);
      if (coverImage) {
        formData.append("coverImage", coverImage);
      }

      await axios.put(`${apiUrl}/song/${selectedSong._id}`, formData, {
        withCredentials: true,
      });
      const updatedSongs = songs.map((song) =>
        song._id === updatedSong._id ? updatedSong : song
      );
      setSongs(updatedSongs);
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating song:", error);
    } finally {
      setLoading(false);
    }
  };
  if (loading)
    return (
      <div>
        <Loading message={"updating Song "} />
      </div>
    );

  return (
    <div>
      <Row className="gy-4 gx-4 mt-4">
        <Col sm={12}>
          <CardBody>
            <SongTable
              songs={songs}
              handleEditClick={handleEditClick}
              handleDeleteClick={handleDeleteClick}
            />
            {/* Pagination */}
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
        </Col>
      </Row>

      {selectedSong && (
        <EditSongModal
          show={showEditModal}
          song={selectedSong}
          artist={selectedSong.artist[0]}
          album={album}
          onHide={() => setShowEditModal(false)}
          onSave={handleEditSave}
        />
      )}

      {/* Delete Confirmation Modal */}
      {selectedSong && (
        <DeleteConfirmationModal
          show={showDeleteModal}
          song={selectedSong}
          onHide={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
};

export default SongList;
