import React, { useEffect, useState } from "react";
import user1 from "@/assets/image/avatar/user-1.jpg";
import user2 from "@/assets/image/avatar/user-2.jpg";
import user3 from "@/assets/image/avatar/user-3.jpg";
import user4 from "@/assets/image/avatar/user-4.jpg";
import messageStyle from "@/assets/scss/Message.module.scss";
import axios from "axios";
import { FaInbox, FaSpinner, FaExclamationCircle } from "react-icons/fa";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const Message = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getMessages = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(
          "https://backend-music-xg6e.onrender.com/api/v1/ticket?status=Resolved"
        );
        setMessages(res.data || []);
        console.log("Fetched messages:", res.data);
      } catch (err) {
        console.error("Failed to fetch messages:", err);
        setError("Failed to load messages. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    getMessages();
  }, []);

  const handleMessageClick = () => {
    navigate("/forms/tickets");
  };

  return (
    <div className={messageStyle.message_menu}>
      {loading ? (
        <p
          className={messageStyle.message_counter}
          style={{ textAlign: "center" }}
        >
          <FaSpinner className="spin-animation" /> Loading messages...
        </p>
      ) : error ? (
        <p
          className={messageStyle.message_counter}
          style={{ textAlign: "center", color: "red" }}
        >
          <FaExclamationCircle /> {error}
        </p>
      ) : (
        <>
          <p className={messageStyle.message_counter}>
            <FaInbox className="me-2" /> You have {messages.length} Message
            {messages.length !== 1 ? "s" : ""}
          </p>
          {messages.length > 0 ? (
            messages.map((data, index) => {
              const userName = data.userId?.fullName || "Unknown User";
              const messageTime = moment(data.createdAt).fromNow();
              const messageSubject = data.subject || "No Subject";
              const messageId = data._id;
              const userAvatar = [user1, user2, user3, user4][index % 4];

              return (
                <div
                  onClick={() => {
                    setTimeout(() => {
                      navigate("/forms/tickets");
                    }, 50);
                  }}
                  className={`${messageStyle.message_body} ${
                    messageStyle[`bg_${(index % 4) + 1}`]
                  } d-flex gap-2`}
                  style={{
                    borderLeft: "4px solid green",
                    paddingLeft: "10px",
                    cursor: "pointer",
                  }}
                  key={messageId}
                >
                  <span className={messageStyle.user_img}>
                    <img src={userAvatar} alt="user" />
                  </span>
                  <div className={messageStyle.message}>
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="name fw-bold text-dark">{userName}</span>
                      <small className="text-muted fst-italic">
                        {messageTime}
                      </small>
                    </div>
                    <p className="mb-0 text-secondary">{messageSubject}</p>
                  </div>
                </div>
              );
            })
          ) : (
            <p
              className={messageStyle.message_counter}
              style={{ textAlign: "center", marginTop: "20px" }}
            >
              No resolved messages found.
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default Message;
