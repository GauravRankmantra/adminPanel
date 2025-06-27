import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
// Ensure that 'bootstrap/dist/css/bootstrap.min.css' is imported globally
// in your main application file (e.g., App.js or index.js)
// import 'bootstrap/dist/css/bootstrap.min.css';

const EditSongModal = ({ show, song, artist, album, onHide, onSave }) => {
  // State for the editable song title, initialized from the song prop
  console.log("detail in edit moal")
  console.log("artist",artist)
   console.log("artist",album)
  const [title, setTitle] = useState(song?.title || "");
  console.log("prope at edit model", show, song, artist, album, onHide, onSave )
  // State for the new cover image file, initialized to null
  const [coverImage, setCoverImage] = useState(null);

  // Effect hook to reset the form state when the modal is shown or the song prop changes.
  // This ensures that when the modal opens, it always reflects the current song's data
  // and clears any previously selected new cover image.
  useEffect(() => {
    if (show) {
      setTitle(song?.title || ""); // Set title to current song's title
      setCoverImage(null); // Clear any previously selected cover image
    }
  }, [show, song]); // Re-run this effect if 'show' or 'song' changes

  // Handler for when the "Save Changes" button is clicked
  const handleSave = () => {
    // Create an updated song object, spreading existing song properties and updating the title
    const updatedSong = { ...song, title };
     if (coverImage) {
      updatedSong.coverImage = URL.createObjectURL(coverImage);
    }
    // Call the onSave prop function, passing the updated song object and the new cover image file
    // The parent component will handle the actual saving logic (e.g., API call, state update)
    onSave(updatedSong, coverImage);
  };

  return (
    // The Modal component controls the visibility and basic structure of the dialog.
    // 'show' prop controls visibility, 'onHide' is called when the modal needs to close.
    // 'centered' prop vertically centers the modal on the screen for better aesthetics.
    <Modal show={show} onHide={onHide} centered>
      {/* Modal Header: Contains the title and close button */}
      <Modal.Header closeButton className="bg-light border-bottom rounded-top"> {/* Subtle background and border */}
        <Modal.Title className="text-primary fw-bold">Edit Song Details</Modal.Title> {/* Bold, primary colored title */}
      </Modal.Header>


      {/* Modal Body: Contains the form for editing song details */}
      <Modal.Body className="py-4"> {/* Increased vertical padding for more spacious look */}
        <Form>
          {/* Song Title Input */}
          <Form.Group controlId="formSongTitle" className="mb-3"> {/* Margin-bottom for spacing */}
            <Form.Label className="fw-semibold">Song Title:</Form.Label> {/* Bold label */}
            <Form.Control
              type="text"
              placeholder="Enter song title" // User-friendly placeholder
              value={title}
              onChange={(e) => setTitle(e.target.value)} // Update state on input change
              className="rounded-3 border-secondary" // Rounded corners and a subtle border
            />
          </Form.Group>

          {/* New Cover Image Input */}
          <Form.Group controlId="formCoverImage" className="mb-3">
            <Form.Label className="fw-semibold">New Cover Image:</Form.Label>
            <Form.Control
              type="file"
              accept="image/*" // Restrict file selection to images
              onChange={(e) => setCoverImage(e.target.files[0])} // Store the selected file object
              className="rounded-3" // Consistent rounded corners
            />
            {/* Display name of the selected file for better feedback */}
            {coverImage && (
                <Form.Text className="text-muted mt-2 small">
                    Selected: <strong>{coverImage.name}</strong>
                </Form.Text>
            )}
            {/* Display the current cover image if available and no new image is selected */}
            {song?.coverImage && !coverImage && (
                <div className="mt-3 text-center">
                    <p className="mb-2 text-muted small">Current Cover Image:</p>
                    <img
                        src={song.coverImage}
                        alt="Current Cover"
                        className="img-thumbnail rounded-3 shadow-sm" // Thumbnail style with rounded corners and shadow
                        style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'cover' }} // Inline style for sizing
                    />
                </div>
            )}
          </Form.Group>

          {/* Horizontal rule for visual separation of editable and read-only fields */}
          <hr className="my-4" />

          {/* Artist (Read-Only) */}
          <Form.Group controlId="formArtist" className="mb-3">
            <Form.Label className="fw-semibold">Artist:</Form.Label>
            <Form.Control
              type="text"
              value={artist || "N/A"} // Display "N/A" if artist is not provided
              plaintext // Renders as plain text, without traditional form styling
              readOnly // Makes the input field read-only
              className="fw-normal text-muted" // Normal font weight, muted text color
            />
          </Form.Group>

          {/* Album (Read-Only) */}
          <Form.Group controlId="formAlbum" className="mb-0"> {/* No margin-bottom for the last group */}
            <Form.Label className="fw-semibold">Album:</Form.Label>
            <Form.Control
              type="text"
              value={album || "N/A"} // Display "N/A" if album is not provided
              plaintext
              readOnly
              className="fw-normal text-muted"
            />
          </Form.Group>
        </Form>
      </Modal.Body>

      {/* Modal Footer: Contains action buttons */}
      <Modal.Footer className="justify-content-between border-top bg-light rounded-bottom"> {/* Buttons spaced out, subtle background and border */}
        <Button
          variant="outline-secondary" // Outline style for "Cancel"
          onClick={onHide} // Calls onHide to close the modal
          className="rounded-pill px-4" // Pill-shaped button with extra horizontal padding
        >
          Cancel
        </Button>
        <Button
          variant="primary" // Primary color for "Save Changes"
          onClick={handleSave} // Calls handleSave to process changes
          className="rounded-pill px-4 shadow-sm" // Pill-shaped, extra padding, subtle shadow for emphasis
        >
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditSongModal;
