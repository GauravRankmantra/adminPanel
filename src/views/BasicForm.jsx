import { Fragment, useEffect, useState, useRef } from "react";
import { CardBody, Col, Row, Button } from "react-bootstrap";
import Card from "../components/Card/Card";
import axios from "axios";
import Loading from "../views/Loading";
import Error from "../views/Error";
import Success from "../views/Success";
import "../assets/scss/suggestion-list.scss";


const BasicForm = () => {
  const [genres, setGenres] = useState([]);
  const [artistSuggestions, setArtistSuggestions] = useState([]);
  const [albumSuggestions, setAlbumSuggestions] = useState([]);
  const [albumSearch, setAlbumSearch] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(""); // Error state
  const [success, setSuccess] = useState(false); // Success state
  const lowAudioRef = useRef(null);
  const highAudioRef = useRef(null);
  const coverImageRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    artist: "",
    genre: "",
    album: "",
    lowAudio: null,
    highAudio: null,
    coverImage: null,
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
        }
      };
      fetchAlbum();
    }
  }, [albumSearch]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.files[0],
    });
  };

  const validateForm = () => {
    if (
      !formData.title ||
      !formData.artist ||
      !formData.genre ||
      !formData.lowAudio ||
      !formData.highAudio ||
      !formData.coverImage
    ) {
      setError("All fields are required except album.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError("");
    setSuccess(false);

    const data = new FormData();
    data.append("title", formData.title);
    data.append("artist", formData.artist);
    data.append("album", formData.album);
    data.append("genre", formData.genre);
    data.append("low", formData.lowAudio);
    data.append("high", formData.highAudio);
    data.append("coverImage", formData.coverImage);

    try {
      const response = await axios.post(
        "https://backend-music-xg6e.onrender.com/api/v1/song",
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
        artist: "",
        genre: "",
        album: "",
        lowAudio: null,
        highAudio: null,
        coverImage: null,
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

                  <div className="form-group mt-3">
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

export default BasicForm;
