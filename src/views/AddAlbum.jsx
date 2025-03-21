import { Fragment, useState, useEffect,useRef } from "react";
import { useNavigate } from "react-router";
import { CardBody, Col, Row, Button } from "react-bootstrap";
import Card from "../components/Card/Card";
import axios from "axios";
import Loading from "../views/Loading";
import Error from "../views/Error";
import Success from "../views/Success";

const AddAlbum = () => {
  const [genres, setGenres] = useState([]);
  const [artistSuggestions, setArtistSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
    const coverImageRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    artist: "",
    genre: "",
    company: "",
    coverImage: null,
  });

  const [artistSearch, setArtistSearch] = useState("");
  const navigate = useNavigate();
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
    if (!formData.title || !formData.artist || !formData.genre) {
      setError("All fields are required.");
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
    data.append("genre", formData.genre);
    data.append("coverImage", formData.coverImage);
    data.append("company", formData.company);

    try {
      const response = await axios.post(
        "https://backend-music-xg6e.onrender.com/api/v1/albums",
        data
      );
      setLoading(false);
      handleSuccess();
      setFormData({
        title: "",
        artist: "",
        genre: "",
        company: "",
      });
      if (coverImageRef.current) coverImageRef.current.value = "";
      setArtistSuggestions([]);
      setArtistSearch("");
      navigate(`/forms/album/${response.data._id}`); 
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
          <Card title="Add Album">
            <CardBody>
              <div className="overflow-hidden">
                {loading && <Loading />}
                {error && <Error message={error} />}
                {success && <Success message={"Album Added Successfully"} />}

                <form onSubmit={handleSubmit}>
                  {/* Album Title */}
                  <div className="form-group mt-3">
                    <Row>
                      <Col md={3}>
                        <label
                          className="form-control-label mb-1"
                          htmlFor="title"
                        >
                          Album Title <span className="text-danger">*</span>
                        </label>
                      </Col>
                      <Col md={9}>
                        <input
                          id="title"
                          name="title"
                          type="text"
                          className="form-control"
                          placeholder="Enter the album title.."
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
                          className="form-control-label mb-1"
                          htmlFor="coverImage"
                        >
                          Cover Image <span className="text-danger">*</span>
                        </label>
                      </Col>
                      <Col md={9}>
                        <input
                          id="coverImage"
                          name="coverImage"
                          type="file"
                          className="form-control"
                          placeholder="choose coverImage."
                          ref={coverImageRef}
                          onChange={handleFileChange}
                          required
                        />
                      </Col>
                    </Row>
                  </div>

                  {/* Artist Search */}
                  <div className="form-group mt-3">
                    <Row>
                      <Col md={3}>
                        <label
                          className="form-control-label mb-1"
                          htmlFor="artist"
                        >
                          Artist <span className="text-danger">*</span>
                        </label>
                      </Col>
                      <Col md={9}>
                        <input
                          id="artist"
                          name="artistSearch"
                          type="text"
                          className="form-control"
                          placeholder="Search artist..."
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

                  {/* Genre */}
                  <div className="form-group mt-3">
                    <Row>
                      <Col md={3}>
                        <label
                          className="form-control-label mb-1"
                          htmlFor="genre"
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

                  {/* Company */}
                  <div className="form-group mt-3">
                    <Row>
                      <Col md={3}>
                        <label
                          className="form-control-label mb-1"
                          htmlFor="company"
                        >
                          Company
                        </label>
                      </Col>
                      <Col md={9}>
                        <input
                          id="company"
                          name="company"
                          type="text"
                          className="form-control"
                          placeholder="Enter the company name.."
                          value={formData.company}
                          onChange={handleInputChange}
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

export default AddAlbum;
