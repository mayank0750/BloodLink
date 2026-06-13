import React, { useState, useMemo } from "react";
import { Droplet, Heart, MapPin, Pencil, Trash2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { DonorService } from "../../services/DonorService";

const DonorsList = ({ donors, type }) => {
  const { user, isAuthenticated } = useAuth();

  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 10;

  const totalPages = Math.ceil(donors.length / ITEMS_PER_PAGE);

  const currentDonors = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return donors.slice(start, start + ITEMS_PER_PAGE);
  }, [donors, currentPage]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDonorId, setSelectedDonorId] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  if (!donors || donors.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "4rem 2rem",
          background: "var(--bg-card)",
          borderRadius: "12px",
          border: "1px solid #c81e1e",
        }}
      >
        <div
          style={{
            width: "80px",
            height: "80px",
            background: "rgba(200, 30, 30, 0.1)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.5rem",
            color: "var(--primary)",
          }}
        >
          {type === "blood" ? <Droplet size={40} /> : <Heart size={40} />}
        </div>
        <h3 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
          No donors found
        </h3>
        <p style={{ color: "var(--text-secondary)" }}>
          Try adjusting your filters to find more donors
        </p>
      </div>
    );
  }

  const getPageNumbers = () => {
    const pages = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  const handleDelete = async () => {
    try {
      const res = await DonorService.deleteDonor(selectedDonorId);

      if (res.success) {
        // remove donor from UI
        window.location.reload();

        setShowDeleteModal(false);
        setSelectedDonorId(null);

        setModalMessage("Donor deleted successfully!");
        setShowSuccessModal(true);

        setTimeout(() => {
          setShowSuccessModal(false);
        }, 2000);
      }
    } catch (error) {
      console.error("Error deleting donor:", error);
    }
  };

  return (
    <div className="grid-4">
      {currentDonors.map((donor) => (
        <div key={donor._id} className="card">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "1rem",
            }}
          >
            <div>
              <h3 style={{ fontSize: "1.25rem", marginBottom: "0.25rem" }}>
                {donor.name}
              </h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                {donor.age} years • {donor.gender}
              </p>
            </div>
            {/* <span className={`badge badge-${donor.donorType}`}>
              {donor.donorType}
            </span> */}
            {isAuthenticated && user?.role === "admin" && (
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  alignItems: "center",
                }}
              >
                <Link
                  to={
                    donor.donorType === "organ"
                      ? `/organ-donor/${donor._id}`
                      : `/blood-donor/${donor._id}`
                  }
                >
                  <button
                    style={{
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      color: "#2563eb",
                    }}
                    title="Edit Donor"
                  >
                    <Pencil size={18} />
                  </button>
                </Link>
                <button
                  onClick={() => {
                    setSelectedDonorId(donor._id);
                    setShowDeleteModal(true);
                  }}
                  style={{
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    color: "#dc2626",
                  }}
                  title="Delete Donor"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            )}
          </div>

          {donor.bloodGroup && donor.bloodGroup !== "N/A" && (
            <div
              style={{
                background: "rgba(200, 30, 30, 0.1)",
                padding: "0.75rem",
                borderRadius: "8px",
                marginBottom: "1rem",
                border: "1px solid #c81e1e",
              }}
            >
              <div
                style={{
                  fontSize: "0.85rem",
                  color: "var(--text-muted)",
                  marginBottom: "0.25rem",
                }}
              >
                Blood Group
              </div>
              <div
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  color: "var(--primary)",
                }}
              >
                {donor.bloodGroup}
              </div>
            </div>
          )}

          {donor.organs && donor.organs.length > 0 && (
            <div style={{ marginBottom: "1rem" }}>
              <div
                style={{
                  fontSize: "0.85rem",
                  color: "var(--text-muted)",
                  marginBottom: "0.5rem",
                }}
              >
                Organs
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {donor.organs.map((organ) => (
                  <span
                    key={organ}
                    style={{
                      background: "rgba(30, 58, 138, 0.1)",
                      color: "var(--secondary)",
                      padding: "0.25rem 0.75rem",
                      borderRadius: "6px",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                    }}
                  >
                    {organ}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div
            style={{
              borderTop: "1px solid var(--border)",
              paddingTop: "1rem",
              marginTop: "1rem",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                color: "var(--text-secondary)",
                fontSize: "0.9rem",
                marginBottom: "0.5rem",
              }}
            >
              <MapPin size={16} />
              <span>
                {donor.city}, {donor.state}
              </span>
            </div>
            <div style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
              <div
                style={{
                  fontSize: "0.9rem",
                  color: "var(--text-secondary)",
                }}
              >
                📞{" "}
                <a
                  href={`tel:${donor.contact}`}
                  style={{
                    color: "var(--primary)",
                    textDecoration: "none",
                    fontWeight: "600",
                  }}
                >
                  {donor.contact}
                </a>
              </div>
            </div>
            <div style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
              ✉️ {donor.email}
            </div>
          </div>
        </div>
      ))}

      {totalPages > 1 && (
        <div
          className="pagination-container"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "8px",
            marginTop: "2rem",
            flexWrap: "wrap",
          }}
        >
          <button
            className="btn-secondary"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Prev
          </button>

          {getPageNumbers().map((page, index) =>
            page === "..." ? (
              <span
                key={index}
                style={{
                  padding: "8px 12px",
                  color: "var(--text-muted)",
                }}
              >
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                style={{
                  minWidth: "42px",
                  height: "42px",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  cursor: "pointer",
                  fontWeight: 600,
                  background:
                    currentPage === page ? "var(--primary)" : "var(--bg-card)",
                  color: currentPage === page ? "#fff" : "var(--text-primary)",
                }}
              >
                {page}
              </button>
            ),
          )}

          <button
            className="btn-secondary"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </button>
        </div>
      )}

      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="custom-modal">
            <div className="warning-icon">⚠️</div>
            <h3>Delete Donor</h3>
            <p>Are you sure you want to delete this donor?</p>
            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedDonorId(null);
                }}
              >
                Cancel
              </button>
              <button className="delete-btn" onClick={handleDelete}>
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

export default DonorsList;
