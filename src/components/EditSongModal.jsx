import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const EditSongModal = ({ show, song,artist,album, onHide, onSave }) => {
  const [title, setTitle] = useState(song?.title);
  const [coverImage, setCoverImage] = useState(null);

  const handleSave = () => {
    const updatedSong = { ...song, title };
    if (coverImage) {
      updatedSong.coverImage = URL.createObjectURL(coverImage);
    }
    onSave(updatedSong, coverImage);
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Song</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formSongName">
            <Form.Label>Song Title</Form.Label>
            <Form.Control
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formCoverImage">
            <Form.Label>New Cover Image</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={(e) => setCoverImage(e.target.files[0])}
            />
          </Form.Group>
          <Form.Group controlId="formArtist">
            <Form.Label>Artist</Form.Label>
            <Form.Control type="text" value={artist} plaintext readOnly />
          </Form.Group>
          <Form.Group controlId="formAlbum">
            <Form.Label>Album</Form.Label>
            <Form.Control type="text" value={album} plaintext readOnly />
          </Form.Group>

        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditSongModal;
