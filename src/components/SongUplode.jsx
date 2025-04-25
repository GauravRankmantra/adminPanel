import { Fragment, useState, useRef } from "react";
import { CardBody, Col, Row, Button } from "react-bootstrap";
import Card from "../components/Card/Card";
import axios from "axios";
import Loading from "./Loading";
import Error from "../views/Error";
import Success from "../views/Success";

const SongUpload = () => {
  const [songs, setSongs] = useState([
    { artist: "", coverImage: null, lowAudio: null, highAudio: null },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSuccess = () => {
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
    }, 3000);
  };

  // Handle dynamic form input changes for each song
  const handleInputChange = (index, event) => {
    const values = [...songs];
    if (event.target.name === "artist") {
      values[index].artist = event.target.value;
    } else if (event.target.name === "coverImage") {
      values[index].coverImage = event.target.files[0];
    } else if (event.target.name === "lowAudio") {
      values[index].lowAudio = event.target.files[0];
    } else if (event.target.name === "highAudio") {
      values[index].highAudio = event.target.files[0];
    }
    setSongs(values);
  };

  // Add a new song upload form
  const handleAddSong = () => {
    setSongs([
      ...songs,
      { artist: "", coverImage: null, lowAudio: null, highAudio: null },
    ]);
  };

  // Remove song upload form
  const handleRemoveSong = (index) => {
    const values = [...songs];
    values.splice(index, 1);
    setSongs(values);
  };

  const validateForm = () => {
    for (const song of songs) {
      if (
        !song.artist ||
        !song.coverImage ||
        !song.lowAudio ||
        !song.highAudio
      ) {
        setError("All fields are required for each song.");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError("");
    setSuccess(false);

    const formData = new FormData();
    songs.forEach((song, index) => {
      formData.append(`songs[${index}][artist]`, song.artist);
      formData.append(`songs[${index}][coverImage]`, song.coverImage);
      formData.append(`songs[${index}][lowAudio]`, song.lowAudio);
      formData.append(`songs[${index}][highAudio]`, song.highAudio);
    });

    try {
      const response = await axios.post(
        "https://backend-music-xg6e.onrender.com/api/v1/songs/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setLoading(false);
      handleSuccess();
      setSongs([
        { artist: "", coverImage: null, lowAudio: null, highAudio: null },
      ]);
    } catch (error) {
      setLoading(false);
      setError("Error submitting the form");
      console.error("Error submitting the form:", error);
    }
  };

  return (
    <Fragment>
      <Row className="gy-4 gx-4 justify-content-center">
        <Col lg={8} md={10} sm={12}>
          <Card title="Upload Songs">
            <CardBody>
              <div className="overflow-hidden">
                {loading && <Loading />}
                {error && <Error message={error} />}
                {success && <Success message={"Songs Uploaded Successfully"} />}

                <form onSubmit={handleSubmit}>
                  {songs.map((song, index) => (
                    <div key={index} className="song-upload-form">
                      <h5>Song {index + 1}</h5>
                      {/* Artist */}
                      <div className="form-group mt-3">
                        <Row>
                          <Col md={3}>
                            <label
                              className="form-control-label mb-1"
                              htmlFor={`artist-${index}`}
                            >
                              Artist Name <span className="text-danger">*</span>
                            </label>
                          </Col>
                          <Col md={9}>
                            <input
                              id={`artist-${index}`}
                              name="artist"
                              type="text"
                              className="form-control"
                              placeholder="Enter the artist name.."
                              value={song.artist}
                              onChange={(e) => handleInputChange(index, e)}
                              required
                            />
                          </Col>
                        </Row>
                      </div>

                      {/* Cover Image */}
                      <div className="form-group mt-3">
                        <Row>
                          <Col md={3}>
                            <label
                              className="form-control-label mb-1"
                              htmlFor={`coverImage-${index}`}
                            >
                              Cover Image <span className="text-danger">*</span>
                            </label>
                          </Col>
                          <Col md={9}>
                            <input
                              type="file"
                              className="form-control-file"
                              id={`coverImage-${index}`}
                              name="coverImage"
                              onChange={(e) => handleInputChange(index, e)}
                              required
                            />
                          </Col>
                        </Row>
                      </div>

                      {/* Low Quality Audio */}
                      <div className="form-group mt-3">
                        <Row>
                          <Col md={3}>
                            <label
                              className="form-control-label mb-1"
                              htmlFor={`lowAudio-${index}`}
                            >
                              Low Quality Audio{" "}
                              <span className="text-danger">*</span>
                            </label>
                          </Col>
                          <Col md={9}>
                            <input
                              type="file"
                              className="form-control-file"
                              id={`lowAudio-${index}`}
                              name="lowAudio"
                              onChange={(e) => handleInputChange(index, e)}
                              required
                            />
                          </Col>
                        </Row>
                      </div>

                      {/* High Quality Audio */}
                      <div className="form-group mt-3">
                        <Row>
                          <Col md={3}>
                            <label
                              className="form-control-label mb-1"
                              htmlFor={`highAudio-${index}`}
                            >
                              High Quality Audio{" "}
                              <span className="text-danger">*</span>
                            </label>
                          </Col>
                          <Col md={9}>
                            <input
                              type="file"
                              className="form-control-file"
                              id={`highAudio-${index}`}
                              name="highAudio"
                              onChange={(e) => handleInputChange(index, e)}
                              required
                            />
                          </Col>
                        </Row>
                      </div>

                      <Button
                        variant="danger"
                        className="mt-3"
                        onClick={() => handleRemoveSong(index)}
                      >
                        Remove Song
                      </Button>
                      <hr />
                    </div>
                  ))}

                  <Button
                    variant="primary"
                    className="mt-3"
                    onClick={handleAddSong}
                  >
                    Add Another Song
                  </Button>

                  <div className="form-group mt-4 text-center w-100">
                    <Button type="submit" className="w-100">
                      Submit Songs
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

export default SongUpload;
