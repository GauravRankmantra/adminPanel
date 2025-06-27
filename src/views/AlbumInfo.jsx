import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import SongList from "./SongList";
import Loading from "./Loading";
import Success from "./Success";
import { CardBody, Col, Row } from "react-bootstrap";
import AddSong from "./AddSong";

const AlbumInfo = () => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const { albumId } = useParams();
  const [genres, setGenres] = useState([]);
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const lowAudioRef = useRef(null);
  const highAudioRef = useRef(null);
  const coverImageRef = useRef(null);
  const [artistSuggestions, setArtistSuggestions] = useState([]);
  const [albumSuggestions, setAlbumSuggestions] = useState([]);
  const [showAddSongModal, setShowAddSongModal] = useState(false); // Modal state for adding songs

  const [formData, setFormData] = useState({
    title: "",
    artists: [],
    genre: "",
    album: "",
    lowAudio: null,
    highAudio: null,
    coverImage: null,
    price: 0,
    freeDownload: false,
  });
  const [songLoading, setSongLoading] = useState(false);
  const [artistSearch, setArtistSearch] = useState("");
  const [albumSearch, setAlbumSearch] = useState("");
  const [success, setSuccess] = useState(false);
  const handleSuccess = () => {
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
    }, 3000);
  };
  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.files[0],
    });
  };

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get(`${apiUrl}/genre`);
        setGenres(response.data);
      } catch (error) {
        console.error("Error fetching genres:", error);
        toast.error("Failed to fetch genres. Please try again.");
      }
    };
    fetchGenres();
  }, []);

  useEffect(() => {
    if (artistSearch.length > 1) {
      const fetchArtists = async () => {
        try {
          const response = await axios.get(
            `${apiUrl}/user/artist/search?search=${artistSearch}`
          );
          setArtistSuggestions(response.data);
        } catch (error) {
          console.error("Error fetching artist suggestions:", error);
          toast.error("Failed to fetch artist suggestions.");
        }
      };
      fetchArtists();
    }
  }, [artistSearch]);

  useEffect(() => {
    if (albumSearch.length > 1) {
      const fetchAlbum = async () => {
        try {
          const response = await axios.get(
            `${apiUrl}/albums/album/search?search=${albumSearch}`
          );
          setAlbumSuggestions(response.data);
        } catch (error) {
          console.error("Error fetching album suggestions:", error);
          toast.error("Failed to fetch album suggestions.");
        }
      };
      fetchAlbum();
    }
  }, [albumSearch]);

  const handleArtistSelect = (artist) => {
    if (!formData.artists.some((a) => a._id === artist._id)) {
      setFormData((prev) => ({
        ...prev,
        artists: [...prev.artists, artist],
      }));
    }
    setArtistSearch("");
    setArtistSuggestions([]);
  };

  const removeArtist = (artistId) => {
    setFormData((prev) => ({
      ...prev,
      artists: prev.artists.filter((artist) => artist._id !== artistId),
    }));
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handlePriceChange = (e) => {
    const priceValue = parseFloat(e.target.value);
    setFormData({
      ...formData,
      price: priceValue,
      freeDownload: priceValue > 0 ? false : formData.freeDownload, // Disable freeDownload if price > 0
    });
  };
  const handleFreeDownloadChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      freeDownload: e.target.value === "true" ? true : false,
    }));
  };
  // State for song uploading

  const validateForm = () => {
    if (
      !formData.title ||
      formData.artists.length === 0 ||
      !formData.genre ||
      !formData.lowAudio ||
      !formData.highAudio ||
      !formData.coverImage ||
      formData.price === null
    ) {
      setError("All fields are required except album.");
      toast.error("All fields are required except album.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    console.log("clicked");
    e.preventDefault();
    if (!validateForm()) return;

    setSongLoading(true);
    setError("");
    setSuccess(false);

    const data = new FormData();
    data.append("title", formData.title);
    data.append("artists", JSON.stringify(formData.artists.map((a) => a._id)));
    data.append("album", albumId);
    data.append("genre", formData.genre);
    data.append("low", formData.lowAudio);
    data.append("high", formData.highAudio);
    data.append("coverImage", formData.coverImage);
    data.append("price", formData.price);
    data.append("freeDownload", formData.freeDownload);

    try {
      const response = await axios.post(`${apiUrl}/v1/song`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSongLoading(false);
      handleSuccess();

      const newSong = response?.data?.song;
      console.log("newSong", newSong);

      // ✅ Add the new song to album.songs
      setAlbum((prev) => ({
        ...prev,
        songs: [...prev.songs, newSong],
      }));

      setFormData({
        title: "",
        artists: [],
        genre: "",
        album: "",
        lowAudio: null,
        highAudio: null,
        coverImage: null,
        price: 0,
        freeDownload: false,
      });

      setShowAddSongModal(false);
      setArtistSuggestions([]);
      setAlbumSuggestions([]);
      setAlbumSearch("");
      setArtistSearch("");

      if (lowAudioRef.current) lowAudioRef.current.value = "";
      if (highAudioRef.current) highAudioRef.current.value = "";
      if (coverImageRef.current) coverImageRef.current.value = "";

      console.log("Song added successfully:", response.data);
    } catch (error) {
      setSongLoading(false); // not `setLoading`
      setError("Error submitting the form");
      toast.error(
        error.response?.data?.message ||
          "Error submitting the form. Please try again."
      );
      console.error("Error submitting the form:", error);
    }
  };

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
      const res = await axios.post(`${apiUrl}/song`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const newSong = res.data.song;
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
        const response = await axios.get(`${apiUrl}/albums/${albumId}`);
        setAlbum(response.data.data);
        setLoading(false);
      } catch (error) {
        setError("Error fetching album details");
        setLoading(false);
      }
    };

    fetchAlbumInfo();
  }, [albumId]);

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
          <h2
            style={{ marginBottom: "15px", color: "#444", fontSize: "1.6rem" }}
          >
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

      {album?.songs &&
        album?.songs?.length > 0 &&
        album?.songs?.some((song) => song?.artistDetails?.length > 0) && (
          <SongList album={album.title} albumSongs={album.songs} />
        )}

      {/* Add Song Modal */}

      <Modal show={showAddSongModal} onHide={() => setShowAddSongModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Song</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {songLoading && <Loading />}
          {error && <Error message={error} />}
          {success && <Success message={"Song Uploded Successfully"} />}
          <form onSubmit={handleSubmit}>
            <div className="form-group mt-3">
              <Row>
                <Col md={3}>
                  <label
                    className="d-block mb-1 form-control-label"
                    htmlFor="coverImage"
                  >
                    Cover Image <span className="text-danger">*</span>
                  </label>
                </Col>
                <Col md={9}>
                  <div className="form-group">
                    <input
                      type="file"
                      className="form-control-file"
                      id="coverImage"
                      name="coverImage"
                      ref={coverImageRef}
                      onChange={handleFileChange}
                      required
                    />
                  </div>
                </Col>
              </Row>
            </div>

            <div className="form-group mt-3">
              <Row>
                <Col md={3}>
                  <label htmlFor="title" className="form-control-label mb-1">
                    Song name <span className="text-danger">*</span>
                  </label>
                </Col>
                <Col md={9}>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    className="form-control"
                    placeholder="Enter the song name.."
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </Col>
              </Row>
            </div>

            {/* <div className="form-group mt-3">
                    <Row>
                      <Col md={3}>
                        <label
                          htmlFor="artist"
                          className="form-control-label mb-1"
                        >
                          Artist name <span className="text-danger">*</span>
                        </label>
                      </Col>
                      <Col md={9}>
                        <input
                          id="artist"
                          name="artistSearch"
                          type="text"
                          className="form-control"
                          placeholder="Enter the artist name.."
                          value={artistSearch}
                          onChange={(e) => setArtistSearch(e.target.value)}
                          required
                        />
                        {artistSuggestions?.data?.length > 0 && (
                          <ul className="list-group suggestion-list">
                            {artistSuggestions?.data?.map((artist) => (
                              <li
                                key={artist._id}
                                className="list-group-item"
                                onClick={() => {
                                  setFormData({
                                    ...formData,
                                    artist: artist._id,
                                  });
                                  setArtistSuggestions([]);
                                  setArtistSearch(artist.fullName);
                                }}
                              >
                                {artist?.fullName}
                              </li>
                            ))}
                          </ul>
                        )}
                      </Col>
                    </Row>
                  </div> */}

            <div className="form-group  mt-3">
              <label>
                Artists <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Search artist..."
                value={artistSearch}
                onChange={(e) => setArtistSearch(e.target.value)}
              />
              {artistSuggestions?.data?.length > 0 && (
                <ul className="list-group suggestion-list">
                  {artistSuggestions?.data?.map((artist) => (
                    <li
                      key={artist._id}
                      className="list-group-item"
                      onClick={() => handleArtistSelect(artist)}
                    >
                      {artist.fullName}
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-2">
                {formData.artists.map((artist) => (
                  <span key={artist._id} className="badge bg-primary me-2">
                    {artist.fullName}{" "}
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => removeArtist(artist._id)}
                    ></button>
                  </span>
                ))}
              </div>
            </div>
            {/* 
            <div className="form-group mt-3">
              <Row>
                <Col md={3}>
                  <label htmlFor="album" className="form-control-label mb-1">
                    Album name
                  </label>
                </Col>
                <Col md={9}>
                  <input
                    id="album"
                    name="albumSearch"
                    type="text"
                    className="form-control"
                    placeholder="Enter the Album name.."
                    value={albumSearch}
                    onChange={(e) => setAlbumSearch(e.target.value)}
                  />
                  {albumSuggestions?.data?.length > 0 && (
                    <ul className="list-group suggestion-list">
                      {albumSuggestions?.data?.map((album) => (
                        <li
                          key={album._id}
                          className="list-group-item"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              album: album._id,
                            });
                            setAlbumSuggestions([]);
                            setAlbumSearch(album.title);
                          }}
                        >
                          {album?.title}
                        </li>
                      ))}
                    </ul>
                  )}
                </Col>
              </Row>
            </div> */}

            <div className="form-group mt-3">
              <Row>
                <Col md={3}>
                  <label htmlFor="genre" className="form-control-label mb-1">
                    Genre <span className="text-danger">*</span>
                  </label>
                </Col>
                <Col md={9}>
                  <select
                    id="genre"
                    name="genre"
                    className="form-control"
                    value={formData.genre}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Genre</option>
                    {genres.map((genre) => (
                      <option key={genre._id} value={genre._id}>
                        {genre.name}
                      </option>
                    ))}
                  </select>
                </Col>
              </Row>
            </div>
            <div className="form-group mt-3">
              <Row>
                <Col md={3}>
                  <label htmlFor="price" className="form-control-label mb-1">
                    Price ($) <span className="text-danger">*</span>
                  </label>
                </Col>
                <Col md={9}>
                  <input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    className="form-control"
                    placeholder="Enter the price"
                    value={formData.price}
                    onChange={handlePriceChange}
                    required
                  />
                </Col>
              </Row>
            </div>

            <div className="form-group mt-3">
              <Row>
                <Col md={3}>
                  <label className="form-control-label mb-1">
                    Free Download
                  </label>
                </Col>
                <Col md={9}>
                  <div className="">
                    <input
                      className=""
                      type="radio"
                      name="freeDownload"
                      value="true"
                      id="freeDownloadTrue"
                      disabled={formData.price > 0}
                      checked={formData.freeDownload === true} // Now comparing boolean with boolean
                      onChange={handleFreeDownloadChange}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="freeDownloadTrue"
                    >
                      Yes
                    </label>
                  </div>
                  <div className="">
                    <input
                      className=""
                      type="radio"
                      name="freeDownload"
                      value="false"
                      id="freeDownloadFalse"
                      checked={formData.freeDownload === false} // Now comparing boolean with boolean
                      onChange={handleFreeDownloadChange}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="freeDownloadFalse"
                    >
                      No
                    </label>
                  </div>
                </Col>
              </Row>
            </div>
            <div className="form-group mt-3">
              <Row>
                <Col md={3}>
                  <label
                    className="d-block mb-1 form-control-label"
                    htmlFor="lowAudio"
                  >
                    Low Quality Audio <span className="text-danger">*</span>
                  </label>
                </Col>
                <Col md={9}>
                  <input
                    type="file"
                    className="form-control-file"
                    id="lowAudio"
                    name="lowAudio"
                    ref={lowAudioRef}
                    onChange={handleFileChange}
                    required
                  />
                </Col>
              </Row>
            </div>

            <div className="form-group mt-3">
              <Row>
                <Col md={3}>
                  <label
                    className="d-block mb-1 form-control-label"
                    htmlFor="highAudio"
                  >
                    High Quality Audio <span className="text-danger">*</span>
                  </label>
                </Col>
                <Col md={9}>
                  <input
                    type="file"
                    className="form-control-file"
                    id="highAudio"
                    name="highAudio"
                    ref={highAudioRef}
                    onChange={handleFileChange}
                    required
                  />
                </Col>
              </Row>
            </div>

            <div className="form-group mt-4 text-center w-100">
              <Button type="submit" className="w-100">
                Submit
              </Button>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowAddSongModal(false)}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AlbumInfo;
