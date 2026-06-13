import React, { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Search, Filter, X, Printer ,Pencil, Trash2} from "lucide-react";
import { Link } from "react-router-dom";
import { URGENCY_LEVELS ,ORGANS } from "../../services/dataService";
import locationData from "../../data/locationData.json";
import { OrganService } from "../../services/OrganReqService";

const OrganRequestsTable = ({ requests }) => {
  const [filters, setFilters] = useState({
    search: "",
    organNeeded: "",
    urgencyLevel: "",
    status: "",
    state: "",
    district: "",
  });

  const [showFilters, setShowFilters] = useState(false);
  const [selectedRequests, setSelectedRequests] = useState([]);
  const urgencyLevels = URGENCY_LEVELS.map((u) => u.value);
  const statuses = ["pending", "approved", "fulfilled", "rejected"];

  const [showDeleteModal, setShowDeleteModal] = useState(false);
const [selectedRequestId, setSelectedRequestId] = useState(null);
const [showSuccessModal, setShowSuccessModal] = useState(false);
const [modalMessage, setModalMessage] = useState("");

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "state" ? { district: "" } : {}),
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      organNeeded: "",
      urgencyLevel: "",
      status: "",
      state: "",
      district: "",
    });
  };

  const getFilteredRequests = () => {
    let filtered = [...(requests || [])];

    // SEARCH
    if (filters.search) {
      filtered = filtered.filter(
        (organReq) =>
          organReq.patientName
            ?.toLowerCase()
            .includes(filters.search.toLowerCase()) ||
          organReq.hospitalName
            ?.toLowerCase()
            .includes(filters.search.toLowerCase()) ||
          organReq.contact
            ?.toLowerCase()
            .includes(filters.search.toLowerCase()),
      );
    }

    // ORGAN
    if (filters.organNeeded) {
      filtered = filtered.filter(
        (organReq) => organReq.organNeeded === filters.organNeeded,
      );
    }

    // URGENCY
    if (filters.urgencyLevel) {
      filtered = filtered.filter(
        (organReq) => organReq.urgencyLevel === filters.urgencyLevel,
      );
    }

    // STATUS
    if (filters.status) {
      filtered = filtered.filter(
        (organReq) => organReq.status === filters.status,
      );
    }

    // CITY
    if (filters.city) {
      filtered = filtered.filter((organReq) =>
        organReq.city?.toLowerCase().includes(filters.city.toLowerCase()),
      );
    }

    // STATE
    if (filters.state) {
      filtered = filtered.filter(
        (organReq) =>
          organReq.state?.toLowerCase() === filters.state.toLowerCase(),
      );
    }

    // DISTRICT
    if (filters.district) {
      filtered = filtered.filter(
        (organReq) =>
          organReq.district?.toLowerCase() === filters.district.toLowerCase(),
      );
    }

    return filtered;
  };

  const filteredRequests = getFilteredRequests();
  const hasActiveFilters = Object.values(filters).some((v) => v !== "");

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRequests(filteredRequests.map((organReq) => organReq._id));
    } else {
      setSelectedRequests([]);
    }
  };

  const handleSelectRequest = (id) => {
    setSelectedRequests((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const states = locationData.map((state) => state.name);

  const districts = filters.state
    ? locationData.find((s) => s.name === filters.state)?.districts || []
    : [];

  

  const downloadPDF = () => {
    const selectedData = filteredRequests.filter((organReq) =>
      selectedRequests.includes(organReq._id),
    );

    if (selectedData.length === 0) {
      alert("Please select at least one request");
      return;
    }

    const doc = new jsPDF();

    doc.text("Organ Requests List", 10, 10);

    autoTable(doc, {
      startY: 20,
      head: [
        [
          "Sr",
          "Patient",
          "Age",
          "Gender",
          "Organ",
          "Urgency",
          "Status",
          "Hospital",
          "City",
        ],
      ],
      body: selectedData.map((organReq, i) => [
        i + 1,
        organReq.patientName,
        organReq.age,
        organReq.gender,
        organReq.organNeeded,
        organReq.urgencyLevel,
        organReq.status,
        organReq.hospitalName,
        `${organReq.city}, ${organReq.state}`,
      ]),
    });

    doc.save("organ-requests.pdf");
  };

  const handleDelete = async () => {
  try {
    const res = await OrganService.deleteRequest(selectedRequestId);

    if (res.success) {
      setShowDeleteModal(false);
      setSelectedRequestId(null);

      setModalMessage("Organ Request deleted successfully!");
      setShowSuccessModal(true);

      setTimeout(() => {
        setShowSuccessModal(false);
        window.location.reload();
      }, 1500);
    }
  } catch (error) {
    console.error("Delete Error:", error);
  }
};

  return (
    <div>
      {/* SEARCH + FILTER BAR */}
      <div
        style={{
          background: "var(--bg-card)",
          padding: "1.5rem",
          borderRadius: "12px",
          marginBottom: "1.5rem",
          border: "1px solid #c81e1e",
        }}
      >
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          {/* SEARCH */}
          <div style={{ flex: 1, minWidth: "250px", position: "relative" }}>
            <Search
              size={18}
              style={{
                position: "absolute",
                left: 10,
                top: "50%",
                transform: "translateY(-50%)",
                color: "gray",
              }}
            />
            <input
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search patient, hospital, contact..."
              className="form-input"
              style={{ paddingLeft: "2.5rem" }}
            />
          </div>

          {/* FILTER BUTTON */}
          <button
            className="btn-secondary"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={18} /> Filters
            {hasActiveFilters && (
              <span
                style={{
                  marginLeft: 8,
                  background: "red",
                  color: "white",
                  borderRadius: "50%",
                  padding: "2px 6px",
                  fontSize: 12,
                }}
              >
                {Object.values(filters).filter((v) => v !== "").length}
              </span>
            )}
          </button>

          {/* CLEAR */}
          {hasActiveFilters && (
            <button className="btn-secondary" onClick={clearFilters}>
              <X size={18} /> Clear All
            </button>
          )}
        </div>

        {/* FILTER PANEL */}
        {showFilters && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1rem",
              marginTop: "1rem",
              paddingTop: "1rem",
              borderTop: "1px solid #ccc",
            }}
          >
            {/* ORGAN */}
            <select
              name="organNeeded"
              value={filters.organNeeded}
              onChange={handleFilterChange}
              className="form-select"
            >
              <option value="">All Organs</option>

              {ORGANS.map((organ) => (
                <option key={organ.value || organ} value={organ.value || organ}>
                  {organ.label || organ}
                </option>
              ))}
            </select>

            {/* URGENCY */}
            <select
              name="urgencyLevel"
              value={filters.urgencyLevel}
              onChange={handleFilterChange}
              className="form-select"
            >
              <option value="">All Urgency</option>
              {urgencyLevels.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>

            <select
              name="state"
              value={filters.state}
              onChange={handleFilterChange}
              className="form-select"
            >
              <option value="">All States</option>

              {states.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>

            <select
              name="district"
              value={filters.district}
              onChange={handleFilterChange}
              className="form-select"
              disabled={!filters.state}
            >
              <option value="">All Districts</option>

              {districts.map((district) => (
                <option key={district.id} value={district.name}>
                  {district.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
          padding: "0 0.5rem",
        }}
      >
        <div style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
          Showing {filteredRequests.length} of {requests?.length || 0} donors
        </div>
        {hasActiveFilters && (
          <div style={{ color: "var(--primary)", fontSize: "0.85rem" }}>
            Filters applied
          </div>
        )}
        <button
          onClick={downloadPDF}
          className="btn-secondary"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <Printer size={18} />
          Download PDF
        </button>
      </div>

      {/* TABLE */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={
                    filteredRequests.length > 0 &&
                    selectedRequests.length === filteredRequests.length
                  }
                  onChange={handleSelectAll}
                />
              </th>
              <th>Patient</th>
              <th>Organ</th>
              <th>Blood Group</th>
              <th>Urgency</th>
              <th>Contact</th>
              {/* <th>Status</th> */}
              <th>Hospital</th>
              <th>Location</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredRequests.length > 0 ? (
              filteredRequests.map((organReq) => (
                <tr key={organReq._id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedRequests.includes(organReq._id)}
                      onChange={() => handleSelectRequest(organReq._id)}
                    />
                  </td>
                  <td>
                    <strong>{organReq.patientName}</strong>
                    <div style={{ fontSize: 12 }}>
                      {organReq.age} yrs • {organReq.gender}
                    </div>
                  </td>
                  <td>{organReq.organNeeded}</td>
                  <td>{organReq.bloodGroup}</td>
                  <td>
                    <span style={{ fontWeight: 600 }}>
                      {organReq.urgencyLevel}
                    </span>
                  </td>
                  <td>
                    <div>{organReq.contact}</div>
                    <div
                      style={{
                        fontSize: "0.85rem",
                        color: "var(--text-muted)",
                      }}
                    >
                      {organReq.email}
                    </div>
                  </td>
                  {/* <td>{organReq.status}</td> */}
                  <td>{organReq.hospitalName}</td>
                  <td>
                    {organReq.city}, {organReq.state}
                  </td>
                  <td>
  <div
    style={{
      display: "flex",
      gap: "10px",
      alignItems: "center",
    }}
  >
    <Link to={`/organ-request/${organReq._id}`}>
      <button
        style={{
          border: "none",
          background: "transparent",
          cursor: "pointer",
          color: "#2563eb",
        }}
        title="Edit Request"
      >
        <Pencil size={18} />
      </button>
    </Link>

    <button
      onClick={() => {
        setSelectedRequestId(organReq._id);
        setShowDeleteModal(true);
      }}
      style={{
        border: "none",
        background: "transparent",
        cursor: "pointer",
        color: "#dc2626",
      }}
      title="Delete Request"
    >
      <Trash2 size={18} />
    </button>
  </div>
</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  No requests found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {showDeleteModal && (
  <div className="modal-overlay">
    <div className="custom-modal">
      <div className="warning-icon">⚠️</div>

      <h3>Delete Organ Request</h3>

      <p>
        Are you sure you want to delete this organ request?
      </p>

      <div className="modal-actions">
        <button
          className="cancel-btn"
          onClick={() => {
            setShowDeleteModal(false);
            setSelectedRequestId(null);
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

export default OrganRequestsTable;
