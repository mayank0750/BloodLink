import React, { useState } from "react";
import { Smartphone, AlertCircle } from "lucide-react";
import { UserService } from "../services/UserService";

const AddRoles = () => {
  const [formData, setFormData] = useState({
    role: "user",
    mobile: "",
    name: "",
    email: "",
    password: "",
    organizationName: "",
    organizationType: "",
    registrationNumber: "",
    address: "",
    city: "",
    state: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const validateForm = () => {
    if (!formData.role) return "Role is required";

    if (!formData.mobile.trim()) return "Mobile number is required";
    if (!/^[0-9]{10}$/.test(formData.mobile))
      return "Enter valid 10-digit mobile";

    if (!formData.name.trim()) return "Name is required";

    if (!formData.email.trim()) return "Email is required";

    if (!formData.password) return "Password is required";

    // Organization validation only for hospital/ngo
    if (formData.role === "hospital" || formData.role === "ngo") {
      if (!formData.organizationName.trim())
        return "Organization name required";
      if (!formData.organizationType) return "Organization type required";
      if (!formData.registrationNumber.trim())
        return "Registration number required";
      if (!formData.address.trim()) return "Address required";
      if (!formData.city.trim()) return "City required";
      if (!formData.state.trim()) return "State required";
    }

    return "";
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    const errorMsg = validateForm();
    if (errorMsg) {
      setError(errorMsg);
      return;
    }

    setLoading(true);
    setError("");

    try {
      // ✅ BUILD CLEAN PAYLOAD
      const payload = {
        role: formData.role,
        mobile: formData.mobile,
        name: formData.name,
        email: formData.email,
        password: formData.password,
      };

      // ✅ ONLY FOR hospital/ngo
      if (formData.role === "hospital" || formData.role === "ngo") {
        payload.organizationName = formData.organizationName;
        payload.organizationType = formData.organizationType;
        payload.registrationNumber = formData.registrationNumber;
        payload.address = formData.address;
        payload.city = formData.city;
        payload.state = formData.state;
      }

      await UserService.AddRoles(payload);

      setModalMessage("User created successfully!");
      setShowSuccessModal(true);

      setFormData({
        role: "user",
        mobile: "",
        name: "",
        email: "",
        password: "",
        organizationName: "",
        organizationType: "",
        registrationNumber: "",
        address: "",
        city: "",
        state: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const showOrgFields = formData.role === "hospital" || formData.role === "ngo";

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "1rem" }}>
      <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        Create User / Role
      </h2>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: "1rem" }}>
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      <form onSubmit={handleCreate} className="card">
        {/* ROLE DROPDOWN */}
        <div className="form-group">
          <label className="form-label">Add Role *</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="form-select"
          >
            <option value="admin">Admin</option>
            <option value="hospital">Hospital</option>
            <option value="ngo">NGO</option>
            <option value="user">User</option>
          </select>
        </div>

        {/* MOBILE */}
        <div className="form-group">
          <label className="form-label">Mobile Number *</label>
          <div style={{ position: "relative" }}>
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter 10-digit mobile"
              maxLength="10"
              style={{ paddingLeft: "3rem" }}
            />
            <Smartphone
              size={18}
              style={{
                position: "absolute",
                left: "1rem",
                top: "50%",
                transform: "translateY(-50%)",
                color: "gray",
              }}
            />
          </div>
        </div>

        {/* NAME */}
        <div className="form-group">
          <label className="form-label">Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="form-input"
            placeholder="Enter name"
          />
        </div>

        {/* EMAIL */}
        <div className="form-group">
          <label className="form-label">Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-input"
            placeholder="Enter email"
          />
        </div>

        {/* PASSWORD */}
        <div className="form-group">
          <label className="form-label">Password *</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="form-input"
            placeholder="Enter password"
          />
        </div>

        {/* ORGANIZATION FIELDS (ONLY FOR HOSPITAL / NGO) */}
        {showOrgFields && (
          <>
            <hr style={{ margin: "1rem 0" }} />

            <div className="form-group">
              <label className="form-label">Organization Name *</label>
              <input
                type="text"
                name="organizationName"
                value={formData.organizationName}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter organization name"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Organization Type *</label>
              <select
                name="organizationType"
                value={formData.organizationType}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">Select Type</option>
                <option value="hospital">Hospital</option>
                <option value="ngo">NGO</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Registration Number *</label>
              <input
                type="text"
                name="registrationNumber"
                value={formData.registrationNumber}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter registration number"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Address *</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter address"
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              <div className="form-group">
                <label className="form-label">City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="City"
                />
              </div>

              <div className="form-group">
                <label className="form-label">State *</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="State"
                />
              </div>
            </div>
          </>
        )}

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={loading}
          className="btn-primary"
          style={{
            width: "100%",
            marginTop: "1rem",
            padding: "1rem",
            fontSize: "1.1rem",
          }}
        >
          {loading ? "Creating..." : "Create"}
        </button>
      </form>
      {showSuccessModal && (
        <div className="modal-overlay">
          <div className="success-modal">
            <div style={{ color: "green", marginBottom: "1rem" }}>
              <CheckCircle size={70} />
            </div>

            <h2>Success!</h2>

            <p style={{ marginTop: "1rem" }}>{modalMessage}</p>

            <button
              className="btn-primary"
              onClick={() => setShowSuccessModal(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}
      {showErrorModal && (
        <div className="modal-overlay">
          <div className="success-modal">
            <div style={{ color: "#dc2626", marginBottom: "1rem" }}>
              <AlertCircle size={70} />
            </div>

            <h2>Error</h2>

            <p style={{ marginTop: "1rem", color: "var(--text-secondary)" }}>
              {modalMessage}
            </p>

            <button
              className="btn-primary"
              onClick={() => setShowErrorModal(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddRoles;
