import { Fragment, useEffect, useState, useRef } from "react";
import { CardBody, Col, Row, Button } from "react-bootstrap";
import Card from "../components/Card/Card";
import axios from "axios";
import Loading from "./Loading";
import Error from "./Error";
import Success from "./Success";
import "../assets/scss/suggestion-list.scss";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddSong = () => {
  const [genres, setGenres] = useState([]);
  const [artistSuggestions, setArtistSuggestions] = useState([]);
  const [albumSuggestions, setAlbumSuggestions] = useState([]);
  const [albumSearch, setAlbumSearch] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(""); // Error state
  const [success, setSuccess] = useState(false); // Success state
 

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

  const [artistSearch, setArtistSearch] = useState("");
  const handleSuccess = () => {
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
    }, 3000);
  };

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get(
          "https://backend-music-xg6e.onrender.com/api/v1/genre"
        );
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
            `https://backend-music-xg6e.onrender.com/api/v1/user/artist/search?search=${artistSearch}`
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
            `https://backend-music-xg6e.onrender.com/api/v1/albums/album/search?search=${albumSearch}`
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

  useEffect(() => {
    console.log("useEffect - formData:", formData);
  }, [formData]);

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.files[0],
    });
  };

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

    setLoading(true);
    setError("");
    setSuccess(false);

    const data = new FormData();
    data.append("title", formData.title);
    data.append("artists", JSON.stringify(formData.artists.map((a) => a._id)));
    data.append("album", formData.album);
    data.append("genre", formData.genre);
    data.append("low", formData.lowAudio);
    data.append("high", formData.highAudio);
    data.append("coverImage", formData.coverImage);
    data.append("price", formData.price);
    data.append("freeDownload", formData.freeDownload);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/song",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setLoading(false);
      handleSuccess();
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
      setArtistSuggestions([]);
      setAlbumSuggestions([]);
      setAlbumSearch("");
      setArtistSearch("");
      if (lowAudioRef.current) lowAudioRef.current.value = "";
      if (highAudioRef.current) highAudioRef.current.value = "";
      if (coverImageRef.current) coverImageRef.current.value = "";
      console.log("Song added successfully:", response.data);
    } catch (error) {
      setLoading(false);
      setError("Error submitting the form");
      toast.error(
        error.response?.data?.message ||
          "Error submitting the form. Please try again."
      );
      console.error("Error submitting the form:", error);
    }
  };

  return (
    <Fragment>
      <Row className="gy-4 gx-4 justify-content-center">
        <Col lg={6} md={8} sm={12}>
          <Card title="Add Song">
            <CardBody>
              <div className="overflow-hidden">
                {loading && <Loading />}
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
                        <label
                          htmlFor="title"
                          className="form-control-label mb-1"
                        >
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
                        <span
                          key={artist._id}
                          className="badge bg-primary me-2"
                        >
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

                  <div className="form-group mt-3">
                    <Row>
                      <Col md={3}>
                        <label
                          htmlFor="album"
                          className="form-control-label mb-1"
                        >
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
                  </div>

                  <div className="form-group mt-3">
                    <Row>
                      <Col md={3}>
                        <label
                          htmlFor="genre"
                          className="form-control-label mb-1"
                        >
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
                        <label
                          htmlFor="price"
                          className="form-control-label mb-1"
                        >
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
                          Low Quality Audio{" "}
                          <span className="text-danger">*</span>
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
                          High Quality Audio{" "}
                          <span className="text-danger">*</span>
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
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
};

export default AddSong;
