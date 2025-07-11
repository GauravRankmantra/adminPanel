import React, { useState, useEffect, useCallback } from "react";
import debounce from "lodash";

import {
  CardBody,
  Col,
  Row,
  Modal,
  Button,
  Form,
  Spinner,
} from "react-bootstrap";
import Card from "../components/Card/Card";
import styles from "../assets/scss/Tables.module.scss";
import axios from "axios";
import { toast } from "react-toastify";
import editIcon from "../assets/image/edit.png";
import deleteIcon from "../assets/image/trash.png";
import EditSongModal from "../components/EditSongModal";

const apiUrl = import.meta.env.VITE_API_URL;

const AllSongs = () => {
  const [state, setState] = useState({
    songs: [],
    originalSongs: [],
    loading: true,
    showEditModal: false,
    showDeleteModal: false,
    currentPage: 1,
    totalPages: 1,
    searchQuery: "",
    selectedSong: null,
    isProcessing: false,
    noSearchResult: false,
  });

  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func.apply(this, args), delay);
    };
  };

  const fetchSongs = useCallback(
    async (query = "", page = 1, isSearch = false) => {
      // Show loading only if it's NOT a search
      if (!isSearch) {
        setState((prev) => ({ ...prev, loading: true }));
      }

      try {
        const response = await axios.get(`${apiUrl}/song`, {
          params: {
            search: query,
            page,
            limit: 10,
          },
        });

        const { data, total, pages } = response.data;

        if (isSearch && data.length === 0) {
          setState((prev) => ({
            ...prev,
            noSearchResult: true,
            loading: false, // make sure to stop loading
          }));
          return;
        }

        setState((prev) => ({
          ...prev,
          songs: data,
          originalSongs: isSearch ? prev.originalSongs : data,
          totalPages: pages,
          currentPage: page,
          loading: false,
          noSearchResult: false,
        }));
      } catch (error) {
        console.error("Error fetching songs:", error);
        toast.error("Failed to load songs. Please try again later.");
        setState((prev) => ({ ...prev, loading: false }));
      }
    },
    []
  );

  useEffect(() => {
    const debouncedFetch = debounce(fetchSongs, 500);
    debouncedFetch(state.searchQuery, state.currentPage);
  }, [state.searchQuery, state.currentPage, fetchSongs]);

  const debouncedSearch = useCallback(
    debounce((query) => {
      if (query.length >= 3) {
        fetchSongs(query, 1, true);
      } else if (query.length === 0) {
        fetchSongs("", 1);
      }
    }, 600),
    [fetchSongs]
  );

  const handleSearch = (e) => {
    const value = e.target.value;
    setState((prev) => ({
      ...prev,
      searchQuery: value,
      currentPage: 1,
    }));
    debouncedSearch(value);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= state.totalPages) {
      setState((prev) => ({ ...prev, currentPage: newPage }));
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      setState((prev) => ({ ...prev, isProcessing: true }));
      await axios.delete(`${apiUrl}/song/${state.selectedSong._id}`);

      setState((prev) => ({
        ...prev,
        songs: prev.songs.filter((song) => song._id !== state.selectedSong._id),
        showDeleteModal: false,
        isProcessing: false,
      }));
      toast.success("Song deleted successfully");
    } catch (error) {
      console.error("Error deleting song:", error);
      toast.error("Failed to delete song. Please try again.");
      setState((prev) => ({ ...prev, isProcessing: false }));
    }
  };

  const handleEditSave = async (updatedSong, coverImage) => {
    console.log("cover", coverImage);
    const formData = new FormData();
    formData.append("title", updatedSong.title);
    if (coverImage) {
      formData.append("coverImage", coverImage);
    }

    try {
      await axios.put(
        `${apiUrl}/song/${selectedSong._id}`,
        formData,
        { withCredentials: true }
      );

      fetchSongs();
      setState((prev) => ({
        ...prev,
        showEditModal: false,
        isProcessing: false,
      }));
      toast.success("Song updated successfully");
    } catch (error) {
      console.error("Error updating song:", error);
      toast.error("Failed to update song. Please try again.");
      setState((prev) => ({ ...prev, isProcessing: false }));
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")} min`;
  };

  const {
    loading,
    showEditModal,
    showDeleteModal,
    currentPage,
    totalPages,
    searchQuery,
    selectedSong,
    songs,
    isProcessing,
  } = state;

  // if (loading) {
  //   return (
  //     <div className="d-flex justify-content-center mt-5">
  //       <Spinner animation="border" variant="primary" />
  //     </div>
  //   );
  // }

  return (
    <div>
      <Row className="gy-4 gx-4">
        <Col sm={12}>
          <Form.Control
            type="text"
            placeholder="Search for songs..."
            value={searchQuery}
            onChange={handleSearch}
            className="mb-3"
            aria-label="Search songs"
          />

          <Card title="Song Management">
            <CardBody>
              <div className={`table-responsive ${styles.table_wrapper}`}>
                {state.noSearchResult && (
                  <div className="text-danger text-center mb-3 fw-semibold">
                    No song found
                  </div>
                )}
                {loading ? (
                  <div className="d-flex justify-content-center mt-5">
                    <Spinner animation="border" variant="primary" />
                  </div>
                ) : (
                  <table className={`table ${styles.table}`}>
                    <thead className={`text-primary thead ${styles.thead}`}>
                      <tr>
                        <th scope="col">Cover</th>
                        <th scope="col">Title</th>
                        <th scope="col">Artist</th>
                        <th scope="col">Album</th>
                        <th scope="col">Duration</th>
                        <th scope="col">Actions</th>
                      </tr>
                    </thead>

                    <tbody className={`tbody ${styles.tbody}`}>
                      {songs.length > 0 ? (
                        songs.map((song) => (
                          <tr key={song._id}>
                            <td>
                              <img
                                src={song.coverImage}
                                alt="Cover"
                                className="img-thumbnail"
                                style={{
                                  width: "50px",
                                  height: "50px",
                                  objectFit: "cover",
                                }}
                              />
                            </td>
                            <td>{song.title}</td>
                            <td>
                              {Array.isArray(song?.artist)
                                ? song?.artist.map((a, i) => (
                                    <span key={a._id || i}>
                                      {a.fullName}
                                      {i < song?.artist.length - 1 && ", "}
                                    </span>
                                  ))
                                : song?.artist?.fullName ||
                                  song?.artist ||
                                  "Unknown Artist"}
                            </td>
                            <td>{song.album?.title || "No Album"}</td>
                            <td>{song.duration}</td>
                            <td>
                              <div className="d-flex gap-2">
                                <Button
                                  variant="link"
                                  onClick={() =>
                                    setState((prev) => ({
                                      ...prev,
                                      selectedSong: song,
                                      showEditModal: true,
                                    }))
                                  }
                                  aria-label="Edit song"
                                >
                                  <img src={editIcon} alt="Edit" width="20" />
                                </Button>
                                <Button
                                  variant="link"
                                  onClick={() =>
                                    setState((prev) => ({
                                      ...prev,
                                      selectedSong: song,
                                      showDeleteModal: true,
                                    }))
                                  }
                                  aria-label="Delete song"
                                >
                                  <img
                                    src={deleteIcon}
                                    alt="Delete"
                                    width="20"
                                  />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="text-center py-4">
                            No songs found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>

              {totalPages > 1 && (
                <div className="d-flex justify-content-center align-items-center mt-4">
                  <Button
                    variant="outline-primary"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="me-2"
                  >
                    Previous
                  </Button>

                  <span className="mx-3">
                    Page {currentPage} of {totalPages}
                  </span>

                  <Button
                    variant="outline-primary"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="ms-2"
                  >
                    Next
                  </Button>
                </div>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Edit Modal */}

      {selectedSong && (
        <EditSongModal
          show={showEditModal}
          song={selectedSong}
          artist={selectedSong?.artist[0]?.fullName}
          album={selectedSong?.album?.title}
          onHide={() =>
            setState((prev) => ({
              ...prev,
              showEditModal: false,
            }))
          }
          onSave={handleEditSave}
        />
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => setState((prev) => ({ ...prev, showDeleteModal: false }))}
        aria-labelledby="delete-song-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete "{selectedSong?.title}"? This action
          cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() =>
              setState((prev) => ({ ...prev, showDeleteModal: false }))
            }
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDeleteConfirm}
            disabled={isProcessing}
          >
            {isProcessing ? "Deleting..." : "Confirm Delete"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AllSongs;
