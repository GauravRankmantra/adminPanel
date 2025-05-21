import { Fragment, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { CardBody, Col, Row, Button, Form } from "react-bootstrap";
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
    isFeatured: false,
    isTranding: false,
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
    const { name, value, type, checked } = e.target;

    // Correct handling for radio button values
    let processedValue = value;
    if (type === "radio") {
      if (value === "true") processedValue = true;
      else if (value === "false") processedValue = false;
    }
    console.log("pro", processedValue);

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : processedValue,
    }));
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
      !formData.coverImage
    ) {
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
    data.append("isFeatured", formData.isFeatured === true);
    data.append("isTranding", formData.isTranding === true);

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
        isFeatured: false,
        isTranding: false,
      });
      if (coverImageRef.current) coverImageRef.current.value = "";
      setArtistSuggestions([]);
      setArtistSearch("");
      navigate(`/forms/album/${response.data.album._id}`);
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

                <Form onSubmit={handleSubmit}>
                  {/* Album Title */}
                  <Form.Group className="mt-3">
                    <Form.Label>
                      Album Title <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="title"
                      placeholder="Enter the album title.."
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>

                  {/* Cover Image */}
                  <Form.Group className="mt-3">
                    <Form.Label>
                      Cover Image <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="file"
                      name="coverImage"
                      placeholder="choose coverImage."
                      ref={coverImageRef}
                      onChange={handleFileChange}
                      required
                    />
                  </Form.Group>

                  {/* Artist Search */}
                  <Form.Group className="mt-3">
                    <Form.Label>
                      Artist <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="artistSearch"
                      placeholder="Search artist..."
                      value={artistSearch}
                      onChange={(e) => setArtistSearch(e.target.value)}
                      required
                      autoComplete="off"
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
                    <Form.Text className="text-danger">
                      Please select an artist from the list of pre-registered
                      artists.
                    </Form.Text>
                  </Form.Group>

                  {/* Genre */}
                  <Form.Group className="mt-3">
                    <Form.Label>
                      Genre <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      as="select"
                      name="genre"
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
                    </Form.Control>
                  </Form.Group>

                  {/* Company */}
                  <Form.Group className="mt-3">
                    <Form.Label>Company</Form.Label>
                    <Form.Control
                      type="text"
                      name="company"
                      placeholder="Enter the company name.."
                      value={formData.company}
                      onChange={handleInputChange}
                      autoComplete="off"
                    />
                  </Form.Group>

                  {/* isTranding Radio Buttons */}
                  {/* isTranding Radio Buttons */}
                  <Form.Group className="mt-3">
                    <Form.Label>Is Trending</Form.Label>
                    <div className="form-check form-check-inline">
                      <input
                        type="radio"
                        name="isTranding"
                        id="isTrandingYes"
                        value="true"
                        checked={formData.isTranding === true}
                        onChange={handleInputChange}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="isTrandingYes"
                      >
                        Yes
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        type="radio"
                        name="isTranding"
                        id="isTrandingNo"
                        value="false"
                        checked={formData.isTranding === false}
                        onChange={handleInputChange}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="isTrandingNo"
                      >
                        No
                      </label>
                    </div>
                  </Form.Group>

                  <Form.Group className="mt-3">
                    <Form.Label>Is Featured</Form.Label>
                    <div className="form-check form-check-inline">
                      <input
                        type="radio"
                        name="isFeatured"
                        id="isFeaturedYes"
                        value="true"
                        checked={formData.isFeatured === true}
                        onChange={handleInputChange}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="isFeaturedYes"
                      >
                        Yes
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        type="radio"
                        name="isFeatured"
                        id="isFeaturedNo"
                        value="false"
                        checked={formData.isFeatured === false}
                        onChange={handleInputChange}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="isFeaturedNo"
                      >
                        No
                      </label>
                    </div>
                  </Form.Group>

                  <div className="form-group mt-4 text-center w-100">
                    <Button type="submit" className="w-100">
                      Submit
                    </Button>
                  </div>
                </Form>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
};

export default AddAlbum;
