import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import SongList from "./SongList"

const AlbumInfo = () => {
  const { albumId } = useParams();
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddSongModal, setShowAddSongModal] = useState(false); // Modal state for adding songs
  const [newSongData, setNewSongData] = useState({
    title: "",
    coverImage: null,
    lowAudio: null,
    highAudio: null,
  });
  const [songLoading, setSongLoading] = useState(false); // State for song uploading


  const handleAddSong = async () => {
    const formData = new FormData();
    formData.append("title", newSongData.title);
    formData.append("album", album._id);
    formData.append("artist", album.artistDetails._id);
    formData.append("genre", album.genreDetails._id);
    formData.append("coverImage", newSongData.coverImage);
    formData.append("low", newSongData.lowAudio);
    formData.append("high", newSongData.highAudio);

    setSongLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/v1/song", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const newSong = res.data.song
      // console.log(newSong);
      // console.log(album)
      setAlbum({
        ...album,
        songs: [...album.songs, newSong],
      });
      setSongLoading(false);
      setShowAddSongModal(false);
      alert("Song added successfully");
      // Optionally, you can reload album info to see the updated songs
    } catch (error) {
      setSongLoading(false);
      alert("Error adding song");
      console.error("Error adding song:", error);
    }
  };
  useEffect(() => {
    const fetchAlbumInfo = async () => {
      try {
        const response = await axios.get(
          `https://backend-music-xg6e.onrender.com/api/v1/albums/${albumId}`
        );
        setAlbum(response.data.data);
        setLoading(false);
      } catch (error) {
        setError("Error fetching album details");
        setLoading(false);
      }
    };

    fetchAlbumInfo();
  }, [albumId]);

  const handleInputChange = (e) => {
    setNewSongData({
      ...newSongData,
      [e.target.name]: e.target.files ? e.target.files[0] : e.target.value,
    });
  };



  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        Loading album details...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px", color: "red" }}>
        {error}
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "20px auto",
        padding: "30px",
        fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: "#f9f9f9",
        borderRadius: "12px",
        boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          marginBottom: "25px",
          color: "#333",
          fontSize: "2.2rem",
          fontWeight: "600",
        }}
      >
        {album.title}
      </h1>
      <div
        style={{
          border: "1px solid #e0e0e0",
          borderRadius: "10px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
          boxShadow: "0 6px 12px rgba(0, 0, 0, 0.08)",
          marginBottom: "30px",
        }}
      >
        <img
          src={album?.coverImage || "/default-cover.jpg"}
          alt="Album Cover"
          style={{ width: "40%", height: "auto", display: "block" }}
        />
        <div style={{ padding: "30px", width: "60%" }}>
          <h2 style={{ marginBottom: "15px", color: "#444", fontSize: "1.6rem" }}>
            Artist: {album?.artistDetails?.fullName}
          </h2>
          <p style={{ marginBottom: "10px", color: "#666", fontSize: "1rem" }}>
            Genre: {album?.genreDetails?.name}
          </p>
          <p style={{ marginBottom: "10px", color: "#666", fontSize: "1rem" }}>
            Company: {album?.company || "Not available"}
          </p>
        </div>
      </div>
      
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Songs</h2>
        <Button variant="primary" onClick={() => setShowAddSongModal(true)}>
          Add Song
        </Button>
      </div>
      
     
      {album?.songs && album.songs.length > 0 && <SongList album={album.title} artist={album?.artistDetails?.fullName} albumSongs={album.songs} />}
   

      {/* Add Song Modal */}
      <Modal show={showAddSongModal} onHide={() => setShowAddSongModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Song</Modal.Title>
        </Modal.Header>
        <Modal.Body >
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Song Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                placeholder="Enter song title"
                value={newSongData.title}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Cover Image</Form.Label>
              <Form.Control
                type="file"
                name="coverImage"
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Low Quality Audio</Form.Label>
              <Form.Control
                type="file"
                name="lowAudio"
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>High Quality Audio</Form.Label>
              <Form.Control
                type="file"
                name="highAudio"
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddSongModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddSong} disabled={songLoading}>
            {songLoading ? "Adding Song..." : "Add Song"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AlbumInfo;
