import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { FaPaperPlane, FaTrashAlt } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

const Ticket = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [activeUserId, setActiveUserId] = useState(null);
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});
  const chatRef = useRef(null);

  const backendUrl = "https://backend-music-xg6e.onrender.com/api/v1/message";

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${backendUrl}/users`);
      if (res.data.success && Array.isArray(res.data.users)) {
        setUsers(res.data.users);
        const unread = {};
        res.data.users.forEach((user) => {
          unread[user._id] = user.unreadCount || 0;
        });
        setUnreadCounts(unread);

        if (res.data.users.length > 0 && !activeUserId) {
          setActiveUserId(res.data.users[0]._id);
        }
      }
    } catch (error) {
      console.error("Fetch users failed", error);
    }
  };

  const fetchMessages = async (userId) => {
    if (!userId) return;
    try {
      const res = await axios.get(`${backendUrl}/messages/${userId}`);
      if (res.data.success) {
        setMessages(res.data.messages);
        setUnreadCounts((prev) => ({ ...prev, [userId]: 0 }));
      }
    } catch (error) {
      console.error("Fetch messages failed", error);
    }
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim() === "" || !activeUserId) {
      toast.error("Please type a message.");
      return;
    }

    try {
      const res = await axios.post(`${backendUrl}/messages/admin`, {
        userId: activeUserId,
        text: inputMessage,
      });

      if (res.data.message) {
        setMessages((prev) => [...prev, res.data.message]);
      }

      setInputMessage("");
    } catch (error) {
      toast.error(
        "Send failed: " + (error.response?.data?.error || error.message)
      );
    }
  };

  const deleteMessage = async (messageId) => {
    try {
      await axios.delete(`${backendUrl}/messages/${messageId}`);
      setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
      toast.success("Message deleted");
    } catch (error) {
      toast.error(
        "Delete failed: " + (error.response?.data?.message || error.message)
      );
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSendMessage();
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (activeUserId) fetchMessages(activeUserId);
  }, [activeUserId]);

  useEffect(() => {
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
  }, [messages]);

  const filteredUsers = users.filter((user) =>
    user.fullName.toLowerCase().includes(search.toLowerCase())
  );

  const activeUser = users.find((u) => u._id === activeUserId);

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />
      <style>{`
        .ticket-container {
          display: flex;
          height: 85vh;
          border-radius: 10px;
          box-shadow: 0 0 15px rgba(0,0,0,0.1);
          overflow: hidden;
          font-family: 'Segoe UI', sans-serif;
        }

        .sidebar {
          width: 25%;
          background: #ffffff;
          border-right: 1px solid #ddd;
          display: flex;
          flex-direction: column;
        }

        .search-box {
          padding: 16px;
          border-bottom: 1px solid #eee;
        }

        .search-box input {
          width: 100%;
          padding: 10px 14px;
          border-radius: 20px;
          border: 1px solid #ccc;
        }

        .contacts {
          flex-grow: 1;
          overflow-y: auto;
        }

        .contact {
          padding: 12px 18px;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #f0f0f0;
          transition: background 0.3s;
        }

        .contact:hover {
          background-color: #f9f9f9;
        }

        .contact.active {
          background-color: #0d6efd;
          color: white;
        }

        .badge {
          background: red;
          color: white;
          border-radius: 12px;
          font-size: 0.75rem;
          padding: 2px 8px;
          margin-left: 8px;
        }

        .chat-section {
          width: 75%;
          display: flex;
          flex-direction: column;
          background: #f8f9fa;
        }

        .chat-header {
          padding: 18px;
          background: white;
          border-bottom: 1px solid #ddd;
          font-weight: bold;
        }

        .chat-messages {
          flex-grow: 1;
          background: white;
          padding: 20px 28px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 10px;
          
        }

        .message {
          max-width: 70%;
          padding: 10px 16px;
          border-radius: 16px;
          position: relative;
        }

        .message.sent {
          align-self: flex-end;
          background: #0d6efd;
          color: white;
          border-bottom-right-radius: 0;
        }

        .message.received {
          align-self: flex-start;
          background: #e0e0e0;
          color: #222;
          border-bottom-left-radius: 0;
        }

        .message time {
          font-size: 0.7rem;
          opacity: 0.6;
          display: block;
          margin-top: 4px;
          text-align: right;
        }

        .delete-icon {
          position: absolute;
          top: -18px;
          right: -6px;
          color: #dc3545;
          font-size: 15px;
          cursor: pointer;
          transition: transform 0.3s ease;
        }

        .delete-icon:hover {
          transform: rotate(15deg);
        }

        .chat-input {
          padding: 16px 24px;
          background: white;
          border-top: 1px solid #ddd;
        }

        .chat-input input {
          width: 100%;
          padding: 10px 48px 10px 14px;
          border-radius: 20px;
          border: 1px solid #ccc;
        }

        .send-icon {
          position: absolute;
          right: 30px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 20px;
          color: #0d6efd;
          cursor: pointer;
        }

        @media (max-width: 768px) {
          .ticket-container {
            height: 100%;
            flex-direction: column;

          }
          .sidebar, .chat-section {
            width: 100%;
          }
        }
      `}</style>

      <div className="ticket-container">
        <div className="sidebar">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search user..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="contacts">
            {filteredUsers.map((user) => (
              <div
                key={user._id}
                className={`contact ${
                  activeUserId === user._id ? "active" : ""
                }`}
                onClick={() => setActiveUserId(user._id)}
              >
                <span>{user.fullName}</span>
                {unreadCounts[user._id] > 0 && (
                  <span className="badge">{unreadCounts[user._id]}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="chat-section">
          <div className="chat-header">
            {activeUser?.fullName || "Select a user"}
          </div>

          <div className="chat-messages" ref={chatRef}>
            {messages.length === 0 ? (
              <div
                style={{ textAlign: "center", marginTop: "20%", color: "#888" }}
              >
                No messages
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg._id}
                  className={`message ${
                    msg.sender === "admin" ? "sent" : "received"
                  }`}
                >
                  {msg.sender === "admin" && (
                    <div
                      className="delete-icon"
                      onClick={() => deleteMessage(msg._id)}
                      title="Delete"
                    >
                      <FaTrashAlt />
                    </div>
                  )}
                  {msg.text}
                  <time>{new Date(msg.createdAt).toLocaleString()}</time>
                </div>
              ))
            )}
          </div>

          <div className="chat-input" style={{ position: "relative" }}>
            <input
              type="text"
              placeholder="Type your message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={!activeUserId}
            />
            <div className="send-icon" onClick={handleSendMessage}>
              <FaPaperPlane />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ticket;
