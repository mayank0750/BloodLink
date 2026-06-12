import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Smartphone, AlertCircle, CheckCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();

  const { login, verifyOTP, register, passwordLogin, forgotPassword } =
    useAuth();

  const [step, setStep] = useState(1);
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    mobile: "",
    otp: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [modalErrorMessage, setModalErrorMessage] = useState("");
  const [redirectStep, setRedirectStep] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");

    setFieldErrors({
      ...fieldErrors,
      [e.target.name]: "",
    });
  };

  const openSuccessModal = (message, nextStep = null) => {
    setSuccessMessage(message);

    setRedirectStep(nextStep);

    setShowSuccessModal(true);
  };

  const openErrorModal = (message) => {
    setModalErrorMessage(message);
    setShowErrorModal(true);
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    if (redirectStep === "login") {
      setStep(3);
    }
    if (redirectStep === "dashboard") {
      navigate("/dashboard");
    }
  };

  const sendOTP = async () => {
    const errors = {};

    if (!formData.mobile) {
      errors.mobile = "Mobile required";
    }

    if (!/^[0-9]{10}$/.test(formData.mobile)) {
      errors.mobile = "Enter valid mobile";
    }

    setFieldErrors(errors);

    if (Object.keys(errors).length) {
      return;
    }

    try {
      setLoading(true);

      const res = await login(formData.mobile);

      setOtpSent(true);
    } catch (err) {
      setFieldErrors({
        mobile: err.toString(),
      });
    }

    setLoading(false);
  };

  const verifyOtp = async () => {
    if (!formData.otp) {
      setError("Enter OTP");
      return;
    }
    try {
      setLoading(true);
      await verifyOTP(formData.mobile, formData.otp);
      setStep(2);
    } catch (err) {
      openErrorModal(err.toString());
    }
    setLoading(false);
  };

  const registerUser = async (e) => {
    e.preventDefault();

    const errors = {};

    if (!formData.name?.trim()) {
      errors.name = "Name is required";
    }

    if (!formData.email?.trim()) {
      errors.email = "Email is required";
    } else if (
      !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)
    ) {
      errors.email = "Enter valid email";
    }

    if (!formData.password?.trim()) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password minimum 6 characters";
    }

    setFieldErrors(errors);

    if (Object.keys(errors).length) {
      return;
    }

    try {
      setLoading(true);

      await register({
        mobile: formData.mobile,

        name: formData.name,

        email: formData.email,

        password: formData.password,
      });

      openSuccessModal("Successfully Registered", "login");
    } catch (err) {
      openErrorModal(String(err));
    }

    setLoading(false);
  };

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    if (!formData.mobile.trim()) {
      setError("Mobile number is required");
      return;
    }
    if (!formData.password.trim()) {
      setError("Password is required");
      return;
    }
    try {
      await passwordLogin(formData.mobile, formData.password);
      openSuccessModal("Welcome to WeLifeLink", "dashboard");
    } catch (err) {
      openErrorModal(err.toString());
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    const errors = {};

    if (!formData.mobile.trim()) {
      errors.mobile = "Mobile is required";
    } else if (!/^[0-9]{10}$/.test(formData.mobile)) {
      errors.mobile = "Enter valid mobile";
    }

    if (!formData.password.trim()) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password minimum 6 characters";
    }

    if (!formData.confirmPassword.trim()) {
      errors.confirmPassword = "Re-enter password";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setFieldErrors(errors);

    if (Object.keys(errors).length) {
      return;
    }

    try {
      setLoading(true);

      await forgotPassword(formData.mobile, formData.password);

      openSuccessModal("Password Updated Successfully", "login");

      setFormData({
        ...formData,
        password: "",
        confirmPassword: "",
      });

      setStep(3);
    } catch (err) {
      openErrorModal(err.toString());
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        maxWidth: 500,
        margin: "40px auto",
      }}
    >
      <h1
        style={{
          textAlign: "center",
        }}
      >
        Login
      </h1>
      {/* STEP 1 */}

      {step === 1 && (
        <div className="card">
          <label>Mobile Number</label>

          <div
            style={{
              position: "relative",
            }}
          >
            <input
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="Enter Mobile"
              maxLength="10"
              disabled={otpSent}
              className="form-input"
              style={{ paddingLeft: "3rem" }}
            />
            {fieldErrors.mobile && (
              <p style={{ color: "red", fontSize: 12 }}>
                {" "}
                {fieldErrors.mobile}{" "}
              </p>
            )}

            <Smartphone
              size={18}
              style={{
                position: "absolute",
                left: "1rem",
                top: 14,
              }}
            />
          </div>

          {!otpSent && (
            <button
              className="btn-primary"
              style={{
                width: "100%",
                marginTop: 15,
              }}
              onClick={sendOTP}
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          )}

          <p style={{ textAlign: "center", marginTop: "1rem" }}>
            Already registered?{" "}
            <span
              onClick={() => {
                setStep(3);
                setError("");
              }}
              style={{
                color: "red",
                fontWeight: "600",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Login here
            </span>
          </p>

          {otpSent && (
            <>
              <div
                style={{
                  marginTop: 20,
                }}
              >
                <label>Enter OTP</label>

                <input
                  name="otp"
                  value={formData.otp}
                  onChange={handleChange}
                  placeholder="6 digit OTP"
                  maxLength="6"
                  className="form-input"
                />
              </div>

              <button
                className="btn-primary"
                style={{
                  width: "100%",
                  marginTop: 15,
                }}
                onClick={verifyOtp}
              >
                Verify OTP
              </button>
            </>
          )}
        </div>
      )}

      {/* STEP 2 */}

      {step === 2 && (
        <form onSubmit={registerUser} className="card">
          <label>Mobile</label>

          <input value={formData.mobile} disabled className="form-input" />

          <label>Name</label>

          <input name="name" onChange={handleChange} className="form-input" />
          {fieldErrors.name && (
            <p
              style={{
                color: "red",
                fontSize: "12px",
                marginTop: "4px",
              }}
            >
              {fieldErrors.name}
            </p>
          )}

          <label>Email</label>

          <input name="email" onChange={handleChange} className="form-input" />
          {fieldErrors.email && (
            <p
              style={{
                color: "red",
                fontSize: "12px",
              }}
            >
              {fieldErrors.email}
            </p>
          )}

          <label>Password</label>

          <input
            type="password"
            name="password"
            onChange={handleChange}
            className="form-input"
          />
          {fieldErrors.password && (
            <p
              style={{
                color: "red",
                fontSize: "12px",
              }}
            >
              {fieldErrors.password}
            </p>
          )}

          <button
            type="submit"
            className="btn-primary"
            style={{
              width: "100%",
              marginTop: 20,
            }}
          >
            Registration
          </button>
          <p style={{ textAlign: "center", marginTop: "1rem" }}>
            Already registered?{" "}
            <span
              onClick={() => {
                setStep(3);
                setError("");
              }}
              style={{
                color: "red",
                fontWeight: "600",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Login here
            </span>
          </p>
        </form>
      )}

      {/* STEP 3 - Password Login */}
      {step === 3 && (
        <form onSubmit={handlePasswordLogin} className="card">
          <div className="form-group">
            <label className="form-label">Mobile Number *</label>

            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter mobile number"
              maxLength="10"
            />
          </div>

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
            Login
          </button>
          <p
            style={{
              textAlign: "center",
              marginTop: "1rem",
              fontSize: "0.95rem",
            }}
          >
            Not registered yet?{" "}
            <span
              onClick={() => {
                setStep(1);
                setError("");
              }}
              style={{
                color: "red",
                fontWeight: "600",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Register here
            </span>
          </p>
          <p
            style={{
              textAlign: "center",
              marginTop: "10px",
            }}
          >
            <span
              onClick={() => {
                setStep(4);
                setError("");
              }}
              style={{
                color: "blue",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Forgot Password?
            </span>
          </p>
        </form>
      )}

      {step === 4 && (
        <form onSubmit={handleForgotPassword} className="card">
          <label>Mobile</label>

          <input
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            className="form-input"
          />

          {fieldErrors.mobile && (
            <p
              style={{
                color: "red",
                fontSize: "12px",
                marginTop: "4px",
              }}
            >
              {fieldErrors.mobile}
            </p>
          )}

          <label>New Password</label>

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="form-input"
          />

          {fieldErrors.password && (
            <p
              style={{
                color: "red",
                fontSize: "12px",
                marginTop: "4px",
              }}
            >
              {fieldErrors.password}
            </p>
          )}

          <label>Re-enter Password</label>

          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="form-input"
          />

          {fieldErrors.confirmPassword && (
            <p
              style={{
                color: "red",
                fontSize: "12px",
                marginTop: "4px",
              }}
            >
              {fieldErrors.confirmPassword}
            </p>
          )}

          <button
            type="submit"
            className="btn-primary"
            style={{
              width: "100%",
              marginTop: "20px",
            }}
          >
            {loading ? "Updating..." : "Update Password"}
          </button>

          <p
            style={{
              textAlign: "center",
              marginTop: "15px",
            }}
          >
            <span
              onClick={() => {
                setStep(3);
                setError("");
                setFieldErrors({});
              }}
              style={{
                cursor: "pointer",
                color: "red",
                textDecoration: "underline",
              }}
            >
              Back to Login
            </span>
          </p>
        </form>
      )}

      {showSuccessModal && (
        <div className="modal-overlay">
          <div className="success-modal">
            <div
              className="success-icon"
              style={{
                color: "#16a34a",
              }}
            >
              <CheckCircle size={70} />
            </div>
            <h2>Success</h2>
            <p>{successMessage}</p>
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
              maxWidth: 500,
            }}
          >
            <div
              style={{
                color: "#dc2626",
                marginBottom: 20,
              }}
            >
              <AlertCircle size={70} />
            </div>
            <h2>Something Went Wrong</h2>
            <p>{modalErrorMessage}</p>
            <button
              className="btn-primary"
              style={{
                marginTop: 20,
              }}
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

export default LoginPage;
