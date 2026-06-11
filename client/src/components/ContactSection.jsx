import React, { useState } from "react";
import { MessageService } from "../services/MessagingService.js";
import { CheckCircle, AlertCircle } from "lucide-react";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalErrorMessage, setModalErrorMessage] = useState("");

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Validation
  const validate = () => {
    let newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = "Enter valid 10 digit phone number";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      newErrors.email = "Invalid email address";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {
      try {
        // API Call
        const response = await MessageService.sendMessage(formData);

        console.log(response);

        setShowSuccessModal(true);

        // Reset Form
        setFormData({
          name: "",
          phone: "",
          email: "",
          message: "",
        });

        setErrors({});
      } catch (error) {
        console.error(error);
        setModalErrorMessage(
          error.response?.data?.message ||
            "Failed to send message. Please try again.",
        );

        setShowErrorModal(true);
      }
    }
  };

  return (
    <>
      {/* Contact Me Section */}
      <section
        style={{
          padding: "5rem 2rem",
          background: "#c81e1e",
          color: "white",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "3rem",
            alignItems: "center",
          }}
        >
          {/* Left Side */}
          <div>
            <h2
              style={{
                fontSize: "2.5rem",
                marginBottom: "1rem",
                fontFamily: "'DM Serif Display', serif",
                background: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Contact Me
            </h2>

            <p
              style={{
                color: "#d1d5db",
                lineHeight: 1.8,
                marginBottom: "2rem",
              }}
            >
              Have questions, need blood donors, or want to collaborate? Feel
              free to contact us anytime. We are here to help save lives.
            </p>

            <div style={{ lineHeight: 2 }}>
              <p>📍 Gadchiroli, India</p>
              <p>📧 welifelink@gmail.com</p>
              <p>📞 +91 98239 70338</p>
            </div>
          </div>

          {/* Right Side Form */}
          <form
            onSubmit={handleSubmit}
            style={{
              background: "#fef9f3",
              padding: "2rem",
              borderRadius: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            {/* Name */}
            <div>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                style={{
                  padding: "1rem",
                  borderRadius: "10px",
                  border: "1px solid #c81e1e",
                  outline: "none",
                  fontSize: "1rem",
                  width: "100%",
                }}
              />
              {errors.name && (
                <p style={{ color: "red", marginTop: "5px" }}>{errors.name}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <input
                type="text"
                name="phone"
                placeholder="Your Phone Number"
                value={formData.phone}
                onChange={handleChange}
                style={{
                  padding: "1rem",
                  borderRadius: "10px",
                  border: "1px solid #c81e1e",
                  outline: "none",
                  fontSize: "1rem",
                  width: "100%",
                }}
              />
              {errors.phone && (
                <p style={{ color: "red", marginTop: "5px" }}>{errors.phone}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                style={{
                  padding: "1rem",
                  borderRadius: "10px",
                  border: "1px solid #c81e1e",
                  outline: "none",
                  fontSize: "1rem",
                  width: "100%",
                }}
              />
              {errors.email && (
                <p style={{ color: "red", marginTop: "5px" }}>{errors.email}</p>
              )}
            </div>

            {/* Message */}
            <div>
              <textarea
                rows="5"
                name="message"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleChange}
                style={{
                  padding: "1rem",
                  borderRadius: "10px",
                  border: "1px solid #c81e1e",
                  outline: "none",
                  fontSize: "1rem",
                  resize: "none",
                  width: "100%",
                }}
              />
              {errors.message && (
                <p style={{ color: "red", marginTop: "5px" }}>
                  {errors.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              style={{
                background: "#c81e1e",
                color: "white",
                padding: "1rem",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                fontSize: "1rem",
                fontWeight: "bold",
              }}
            >
              Send Message
            </button>
          </form>
        </div>
      </section>
      {showSuccessModal && (
        <div className="modal-overlay">
          <div className="success-modal">
            <div className="success-icon">
              <CheckCircle size={70} />
            </div>

            <h2>Message Sent Successfully!</h2>

            <p>
              Thank you for contacting us. We have received your message and
              will get back to you soon.
            </p>

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

            <h2>Message Failed</h2>

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
    </>
  );
}
