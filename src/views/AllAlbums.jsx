import React, { useEffect, useState } from "react";
import { Card, Button, Row, Col, Container } from "react-bootstrap";
import { useNavigate } from "react-router";
import defaultAlbum from "../assets/image/album_cover.png"
import axios from "axios";


const AllAlbums = () => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Fetch all albums when the component mounts
  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/v1/albums"
        );
        setAlbums(response.data.allAlbums);
        setLoading(false);
      } catch (error) {
        setError("Error fetching albums");
        setLoading(false);
      }
    };

    fetchAlbums();
  }, []);

  if (loading) {
    return <div>Loading albums...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Redirect to album info page with album ID
  const handleAlbumClick = (albumId) => {
    navigate(`/forms/album/${albumId}`); 
  };

  return (
    <Container>
      <h1 className="text-center my-4">All Albums</h1>
      <Row>
        {albums.map((album) => (
          <Col key={album._id} sm={12} md={6} lg={3} className="mb-4">
            <Card className="h-100 album-card">
              <Card.Img variant="top" src={album?.coverImage || defaultAlbum} />
              <Card.Body>
                <Card.Title>{album.title}</Card.Title>
                <Card.Text>Artist: {album?.artist?.fullName}</Card.Text>
                <Card.Text>Company: {album?.company}</Card.Text>
                <Button
                  variant="outline-primary mt-2"
                  onClick={() => handleAlbumClick(album._id)}
                >
                  View Album Info
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default AllAlbums;
