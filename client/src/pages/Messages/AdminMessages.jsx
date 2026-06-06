import React, { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { MessageService } from "../../services/MessagingService.js";

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState(null);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await MessageService.getAllMessages();

      if (res.success) {
        setMessages(res.messages);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
  try {
    const res = await MessageService.deleteMessage(selectedMessageId);

    if (res.success) {
      setMessages((prev) =>
        prev.filter((msg) => msg._id !== selectedMessageId)
      );

      setShowDeleteModal(false);
      setSelectedMessageId(null);

      setModalMessage("Message deleted successfully!");
      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
      }, 2000);
    }
  } catch (error) {
    console.error("Error deleting message:", error);
  }
};

  return (
    <div className="fade-in">
      <div
        style={{
          background:
            "linear-gradient(135deg, rgba(200, 30, 30, 0.95) 0%, rgba(154, 21, 21, 0.95) 100%)",
          padding: "3rem 2rem",
          border: "2px solid #c81e1e",
          borderRadius: "12px",
        }}
      >
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <h1 style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>
            Users Messages
          </h1>
          <p style={{ fontSize: "1.1rem", color: "white" }}>
            View and manage messages from users, hospitals, and NGOs
          </p>
        </div>
      </div>

      <div className="table-container" style={{ marginTop: "2rem" }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Mobile No.</th>
              <th>Email</th>
              <th>Message</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  Loading...
                </td>
              </tr>
            ) : messages.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No messages found
                </td>
              </tr>
            ) : (
              messages.map((msg) => (
                <tr key={msg._id}>
                  <td>{msg.name}</td>
                  <td>{msg.phone}</td>
                  <td>{msg.email}</td>
                  <td>{msg.message}</td>
                  <td>
                    <button
  onClick={() => {
    setSelectedMessageId(msg._id);
    setShowDeleteModal(true);
  }}
  className="action-button delete"
  title="Delete Message"
>
  <Trash2 size={18} />
</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showDeleteModal && (
  <div className="modal-overlay">
    <div className="custom-modal">
      <div className="warning-icon">⚠️</div>

      <h3>Delete Message</h3>

      <p>
        Are you sure you want to delete this message?
      </p>

      <div className="modal-actions">
        <button
          className="cancel-btn"
          onClick={() => {
            setShowDeleteModal(false);
            setSelectedMessageId(null);
          }}
        >
          Cancel
        </button>

        <button
          className="delete-btn"
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)}

{showSuccessModal && (
  <div className="modal-overlay">
    <div className="success-modal">
      <div className="success-icon">✓</div>

      <h3>Success</h3>

      <p>{modalMessage}</p>
    </div>
  </div>
)}
    </div>
  );
};

export default AdminMessages;