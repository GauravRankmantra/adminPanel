import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Button,
  Card,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const Terms = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [content, setContent] = useState("");
  const [initialContent, setInitialContent] = useState("");
  const [toast, setToast] = useState({ show: false, message: "" });

  useEffect(() => {
    axios.get(`${apiUrl}/terms`).then((res) => {
      setContent(res.data?.content || "");
      setInitialContent(res.data?.content || "");
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const strippedContent = content.replace(/<[^>]+>/g, "").trim();
    if (strippedContent.length < 100) {
      setToast({
        show: true,
        message: "Content must be at least 100 characters.",
      });
      return;
    }

    if (content === initialContent) {
      setToast({ show: true, message: "No changes detected." });
      return;
    }

    try {
      await axios.post(`${apiUrl}/terms`, {
        content,
      });
      setInitialContent(content);
      setToast({
        show: true,
        message: "Terms & Conditions  saved successfully.",
      });
    } catch {
      setToast({ show: true, message: "Error saving Terms & Conditions." });
    }
  };

  return (
    <Container className="mt-5">
      <Card>
        <Card.Header className="bg-dark text-white">
          Terms and Conditions Editor
        </Card.Header>
        <Card.Body>
          <form onSubmit={handleSubmit}>
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              style={{ height: "300px", marginBottom: "2rem" }}
            />
            <Button type="submit" variant="primary">
              Save Terms & Conditions
            </Button>
          </form>
        </Card.Body>
      </Card>

      <ToastContainer position="top-end" className="p-3">
        <Toast
          show={toast.show}
          onClose={() => setToast({ ...toast, show: false })}
          delay={2500}
          autohide
          bg="info"
        >
          <Toast.Body className="text-white">{toast.message}</Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
};

export default Terms;
