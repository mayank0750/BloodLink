import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  CheckCircle,
  AlertCircle,
  MapPin,
  Navigation,
} from "lucide-react";
import {
  BLOOD_GROUPS,
  ORGANS,
  GENDERS,
  getCurrentLocation,
} from "../services/api";
import { DonorService } from "../services/DonorService.js";
import locationData from "../data/locationData.json";
import { useAuth } from "../context/AuthContext";

const DonorRegistrationPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    dob: "",
    bloodGroup: "",
    lastDonationDate: "",
    organs: [],
    donorType: "blood",
    contact: "",
    email: "",
    location: "",
    city: "",
    state: "",
    district: "",
    taluka: "",
    pincode: "",
    coordinates: {
      latitude: null,
      longitude: null,
    },
    consentAccepted: false,
  });

  const [states] = useState(locationData);
  const [districts, setDistricts] = useState([]);
  const [talukas, setTalukas] = useState([]);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalErrorMessage, setModalErrorMessage] = useState("");

  const [showConsentModal, setShowConsentModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationCaptured, setLocationCaptured] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "dob") {
      const age = calculateAge(value);

      setFormData((prev) => ({
        ...prev,
        dob: value,
        age: age >= 0 ? age : "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleOrganChange = (organ) => {
    setFormData((prev) => ({
      ...prev,
      organs: prev.organs.includes(organ)
        ? prev.organs.filter((o) => o !== organ)
        : [...prev.organs, organ],
    }));
  };

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();

    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  const handleStateChange = (e) => {
    const stateId = Number(e.target.value);

    const selectedState = states.find((state) => state.id === stateId);

    setDistricts(selectedState?.districts || []);
    setTalukas([]);

    setFormData((prev) => ({
      ...prev,
      state: selectedState?.name || "",
      district: "",
      taluka: "",
    }));

    setErrors((prev) => ({
      ...prev,
      state: "",
    }));
  };

  const handleDistrictChange = (e) => {
    const districtId = Number(e.target.value);

    const selectedDistrict = districts.find(
      (district) => district.id === districtId,
    );

    setTalukas(selectedDistrict?.talukas || []);

    setFormData((prev) => ({
      ...prev,
      district: selectedDistrict?.name || "",
      taluka: "",
    }));

    setErrors((prev) => ({
      ...prev,
      district: "",
    }));
  };

  const handleTalukaChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      taluka: e.target.value,
    }));

    setErrors((prev) => ({
      ...prev,
      taluka: "",
    }));
  };

  const handleCaptureLocation = async () => {
    setLocationLoading(true);
    setErrorMessage("");

    try {
      const position = await getCurrentLocation();
      setFormData((prev) => ({
        ...prev,
        coordinates: {
          latitude: position.latitude,
          longitude: position.longitude,
        },
      }));
      setLocationCaptured(true);
      setErrors((prev) => ({
        ...prev,
        latitude: "",
        longitude: "",
      }));
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(
        `Unable to get location: ${error.message}. Please allow location access or enter manually.`,
      );
      setLocationCaptured(false);
    } finally {
      setLocationLoading(false);
    }
  };

  const handleManualCoordinates = (field, value) => {
    const numValue = value ? parseFloat(value) : null;

    setFormData((prev) => ({
      ...prev,
      coordinates: {
        ...prev.coordinates,
        [field]: numValue,
      },
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));

    if (field === "latitude" && numValue !== null) {
      if (numValue < -90 || numValue > 90) {
        setErrors((prev) => ({
          ...prev,
          latitude: "Latitude must be between -90 and 90",
        }));
      }
    }

    if (field === "longitude" && numValue !== null) {
      if (numValue < -180 || numValue > 180) {
        setErrors((prev) => ({
          ...prev,
          longitude: "Longitude must be between -180 and 180",
        }));
      }
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.age) newErrors.age = "Age is required";
    else if (formData.age < 18 || formData.age > 65) {
      newErrors.age = "Age must be between 18 and 65";
    }
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.dob) {
      newErrors.dob = "Date of Birth is required";
    }
    if (!formData.contact) newErrors.contact = "Contact number is required";
    else if (!/^[0-9]{10}$/.test(formData.contact)) {
      newErrors.contact = "Contact must be a valid 10-digit number";
    }
    if (!formData.email) newErrors.email = "Email is required";
    else if (
      !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)
    ) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state) newErrors.state = "State is required";
    if (!formData.district) newErrors.district = "District is required";
    if (!formData.taluka) newErrors.taluka = "Taluka is required";
    if (formData.pincode && !/^[0-9]{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Pincode must be 6 digits";
    }

    // Latitude required validation
    if (
      formData.coordinates.latitude === null ||
      formData.coordinates.latitude === ""
    ) {
      newErrors.latitude = "Latitude is required";
    } else if (
      formData.coordinates.latitude < -90 ||
      formData.coordinates.latitude > 90
    ) {
      newErrors.latitude = "Latitude must be between -90 and 90";
    }

    // Longitude required validation
    if (
      formData.coordinates.longitude === null ||
      formData.coordinates.longitude === ""
    ) {
      newErrors.longitude = "Longitude is required";
    } else if (
      formData.coordinates.longitude < -180 ||
      formData.coordinates.longitude > 180
    ) {
      newErrors.longitude = "Longitude must be between -180 and 180";
    }

    // Donor type specific validation
    if (formData.donorType === "blood" || formData.donorType === "both") {
      if (!formData.bloodGroup)
        newErrors.bloodGroup = "Blood group is required";
    }
    if (formData.donorType === "organ" || formData.donorType === "both") {
      if (formData.organs.length === 0) {
        newErrors.organs = "Please select at least one organ";
      }
    }

    if (!formData.consentAccepted) {
      newErrors.consentAccepted =
        "Please accept the privacy policy and consent terms";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccess(false);

    if (!validate()) return;

    setLoading(true);

    try {
      await DonorService.SaveDonor(formData);
      setSuccess(true);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Registration error:", error);
      const message =
        error.response?.data?.message ||
        `${error}. Registration failed. Please try again.`;

      setModalErrorMessage(message);
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <div
      className="fade-in"
      style={{ padding: "0.25rem 0.2rem", maxWidth: "900px", margin: "0 auto" }}
    >
      <div style={{ textAlign: "center", marginBottom: "1rem" }}>
        <div
          style={{
            width: "80px",
            height: "80px",
            background:
              "linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1rem",
            color: "white",
          }}
        >
          <Heart size={40} fill="currentColor" />
        </div>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "0.25rem" }}>
          Become a Donor
        </h1>
        <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)" }}>
          Fill in your details to register as a blood or organ donor
        </p>
      </div>

      {success && (
        <div className="alert alert-success">
          <CheckCircle
            size={20}
            style={{ display: "inline", marginRight: "0.5rem" }}
          />
          Registration successful! Redirecting to login...
        </div>
      )}

      {/* {errorMessage && (
        <div className="alert alert-error">
          <AlertCircle size={20} style={{ display: 'inline', marginRight: '0.5rem' }} />
          {errorMessage}
        </div>
      )} */}

      {showSuccessModal && (
        <div className="modal-overlay">
          <div className="success-modal">
            <div className="success-icon">
              <CheckCircle size={70} />
            </div>

            <h2>Registration Successful!</h2>

            <p>
              Thank you for registering as a donor. Your information has been
              saved successfully.
            </p>

            <button className="btn-primary" onClick={handleModalClose}>
              OK
            </button>
          </div>
        </div>
      )}

      {showErrorModal && (
        <div className="modal-overlay">
          <div
            className="success-modal"
            style={{
              maxWidth: "500px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                color: "#dc2626",
                marginBottom: "1rem",
              }}
            >
              <AlertCircle size={70} />
            </div>

            <h2>Registration Failed</h2>

            <p
              style={{
                marginTop: "1rem",
                color: "var(--text-secondary)",
              }}
            >
              {modalErrorMessage}
            </p>

            <button
              className="btn-primary"
              onClick={() => setShowErrorModal(false)}
              style={{ marginTop: "1.5rem" }}
            >
              OK
            </button>
          </div>
        </div>
      )}

      {showConsentModal && (
        <div className="modal-overlay">
          <div
            className="success-modal"
            style={{
              maxWidth: "700px",
              textAlign: "left",
            }}
          >
            <h2>Privacy Policy & Consent</h2>

            <div
              style={{
                maxHeight: "400px",
                overflowY: "auto",
                marginTop: "1rem",
              }}
            >
              <p>
                By registering as a donor, you agree that the information
                provided by you may be stored and processed by our platform for
                donor matching, emergency communication, and healthcare related
                services.
              </p>

              <p>
                We may use your contact information including mobile number and
                email address to:
              </p>

              <ul>
                <li>
                  Contact you regarding blood or organ donation opportunities.
                </li>
                <li>Notify you about emergency donor requests.</li>
                <li>
                  Send awareness campaigns, newsletters and health-related
                  updates.
                </li>
                <li>Improve our donor network and services.</li>
              </ul>

              <p>
                Your information may be shared with verified hospitals, NGOs,
                healthcare organizations and authorized personnel strictly for
                donor identification and communication purposes.
              </p>

              <p>
                We do not sell your personal data to third parties. Reasonable
                security measures are used to protect your information.
              </p>

              <p>
                You may request removal of your donor profile at any time by
                contacting the platform administrator.
              </p>
            </div>

            <button
              className="btn-primary"
              onClick={() => setShowConsentModal(false)}
              style={{ marginTop: "1rem" }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="card">
        {/* Donor Type Selection */}
        <div className="form-group">
          <label className="form-label">I want to donate *</label>
          <div style={{ display: "flex", gap: "1rem" }}>
            {["blood", "organ", "both"].map((type) => (
              <label
                key={type}
                style={{
                  flex: 1,
                  padding: "1rem",
                  border: `2px solid ${formData.donorType === type ? "var(--primary)" : "var(--border)"}`,
                  borderRadius: "8px",
                  cursor: "pointer",
                  background:
                    formData.donorType === type
                      ? "rgba(200, 30, 30, 0.05)"
                      : "transparent",
                  transition: "all 0.2s",
                  textAlign: "center",
                  fontWeight: 600,
                }}
              >
                <input
                  type="radio"
                  name="donorType"
                  value={type}
                  checked={formData.donorType === type}
                  onChange={handleChange}
                  style={{ display: "none" }}
                />
                {type === "blood"
                  ? "Blood"
                  : type === "organ"
                    ? "Organ"
                    : "Both"}
              </label>
            ))}
          </div>
        </div>

        {/* Personal Information */}
        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter your full name"
            />
            {errors.name && <div className="form-error">{errors.name}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Age *</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              className="form-input"
              placeholder="Age will be calculated automatically"
              readOnly
            />
            {errors.age && <div className="form-error">{errors.age}</div>}
          </div>
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">DOB *</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="form-input"
            />
            {errors.dob && <div className="form-error">{errors.dob}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Gender *</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="form-select"
            >
              <option value="">Select Gender</option>
              {GENDERS.map((gender) => (
                <option key={gender} value={gender}>
                  {gender}
                </option>
              ))}
            </select>
            {errors.gender && <div className="form-error">{errors.gender}</div>}
          </div>
        </div>

        {/* Blood Group (if blood donor) */}
        {(formData.donorType === "blood" || formData.donorType === "both") && (
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Blood Group *</label>
              <select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">Select Blood Group</option>
                {BLOOD_GROUPS.map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </select>
              {errors.bloodGroup && (
                <div className="form-error">{errors.bloodGroup}</div>
              )}
            </div>
            <div className="form-group">
              <label className="form-label">
                Last Time Blood Donated (Optional)
              </label>

              <input
                type="date"
                name="lastDonationDate"
                value={formData.lastDonationDate}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>
        )}

        {/* Organs (if organ donor) */}
        {(formData.donorType === "organ" || formData.donorType === "both") && (
          <div className="form-group">
            <label className="form-label">Organs to Donate *</label>
            <div className="checkbox-group">
              {ORGANS.map((organ) => (
                <label key={organ} className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={formData.organs.includes(organ)}
                    onChange={() => handleOrganChange(organ)}
                    className="checkbox-input"
                  />
                  <span>{organ}</span>
                </label>
              ))}
            </div>
            {errors.organs && <div className="form-error">{errors.organs}</div>}
          </div>
        )}

        {/* Contact Information */}
        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Contact Number *</label>
            <input
              type="tel"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              className="form-input"
              placeholder="10-digit mobile number"
              maxLength="10"
            />
            {errors.contact && (
              <div className="form-error">{errors.contact}</div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              placeholder="your.email@example.com"
            />
            {errors.email && <div className="form-error">{errors.email}</div>}
          </div>
        </div>

        {/* Location Information */}
        <div className="form-group">
          <label className="form-label">Full Address *</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="form-input"
            placeholder="Street, Area, Landmark"
          />
          {errors.location && (
            <div className="form-error">{errors.location}</div>
          )}
        </div>

        <div className="grid-3">
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
            {errors.city && <div className="form-error">{errors.city}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">State *</label>
            <select className="form-select" onChange={handleStateChange}>
              <option value="">Select State</option>
              {states.map((state) => (
                <option key={state.id} value={state.id}>
                  {state.name}
                </option>
              ))}
            </select>
            {errors.state && <div className="form-error">{errors.state}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">District *</label>
            <select
              className="form-select"
              onChange={handleDistrictChange}
              disabled={!formData.state}
            >
              <option value="">Select District</option>

              {districts.map((district) => (
                <option key={district.id} value={district.id}>
                  {district.name}
                </option>
              ))}
            </select>
            {errors.district && (
              <div className="form-error">{errors.district}</div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Taluka *</label>
            <select
              className="form-select"
              value={formData.taluka}
              onChange={handleTalukaChange}
              disabled={!formData.district}
            >
              <option value="">Select Taluka</option>

              {talukas.map((taluka, index) => (
                <option key={index} value={taluka}>
                  {taluka}
                </option>
              ))}
            </select>
            {errors.taluka && <div className="form-error">{errors.taluka}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Pincode</label>
            <input
              type="number"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              className="form-input"
              placeholder="6-digit pincode"
              maxLength="6"
              min="0"
            />
            {errors.pincode && (
              <div className="form-error">{errors.pincode}</div>
            )}
          </div>
        </div>

        {/* Location Coordinates */}
        <div
          className="form-group"
          style={{
            background: "rgba(200, 30, 30, 0.05)",
            padding: "1.5rem",
            borderRadius: "12px",
            border: "2px dashed var(--primary)",
          }}
        >
          <label
            className="form-label"
            style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <MapPin size={20} />
            Capture Your Location.This helps users find donors near them more
            easily
          </label>

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={handleCaptureLocation}
              disabled={locationLoading}
              className="btn-primary"
              style={{ flex: "0 0 auto" }}
            >
              <Navigation size={18} />
              {locationLoading
                ? "Getting Location..."
                : locationCaptured
                  ? "Location Captured ✓"
                  : "Use My Current Location"}
            </button>

            {locationCaptured && (
              <div
                style={{
                  flex: 1,
                  padding: "0.75rem",
                  background: "rgba(5, 150, 105, 0.1)",
                  borderRadius: "8px",
                  color: "var(--success)",
                  fontSize: "0.9rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <CheckCircle size={18} />
                Location captured successfully!
              </div>
            )}
          </div>

          <div style={{ marginTop: "1rem" }}>
            <p
              style={{
                fontSize: "0.85rem",
                fontWeight: 600,
                marginBottom: "0.5rem",
              }}
            >
              Or enter coordinates manually:
            </p>
            <div className="grid-2">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: "0.85rem" }}>
                  Latitude
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.coordinates.latitude || ""}
                  onChange={(e) =>
                    handleManualCoordinates("latitude", e.target.value)
                  }
                  className="form-input"
                  placeholder="e.g., 19.0760"
                />
                {errors.latitude && (
                  <div className="form-error">{errors.latitude}</div>
                )}
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: "0.85rem" }}>
                  Longitude
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.coordinates.longitude || ""}
                  onChange={(e) =>
                    handleManualCoordinates("longitude", e.target.value)
                  }
                  className="form-input"
                  placeholder="e.g., 72.8777"
                />
                {errors.longitude && (
                  <div className="form-error">{errors.longitude}</div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div
          className="form-group"
          style={{
            marginTop: "1.5rem",
            padding: "1rem",
            background: "rgba(200,30,30,0.05)",
            borderRadius: "8px",
            border: "1px solid var(--border)",
          }}
        >
          <label
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "0.75rem",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              name="consentAccepted"
              checked={formData.consentAccepted}
              onChange={handleChange}
              style={{ marginTop: "4px" }}
            />

            <span style={{ fontSize: "0.95rem" }}>
              I agree to the{" "}
              <button
                type="button"
                onClick={() => setShowConsentModal(true)}
                style={{
                  border: "none",
                  background: "none",
                  color: "var(--primary)",
                  fontWeight: 600,
                  cursor: "pointer",
                  textDecoration: "underline",
                  padding: 0,
                }}
              >
                Privacy Policy & Consent Terms
              </button>
            </span>
          </label>

          {errors.consentAccepted && (
            <div className="form-error">{errors.consentAccepted}</div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary"
          style={{
            width: "100%",
            marginTop: "1rem",
            fontSize: "1.1rem",
            padding: "1rem",
          }}
        >
          {loading ? "Registering..." : "Register as Donor"}
        </button>

        {/* <p style={{ 
          textAlign: 'center', 
          marginTop: '1.5rem', 
          color: 'var(--text-muted)',
          fontSize: '0.9rem'
        }}>
          Already registered? <a href="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Login here</a>
        </p> */}
      </form>
    </div>
  );
};

export default DonorRegistrationPage;
