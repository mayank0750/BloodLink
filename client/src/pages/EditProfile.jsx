import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Smartphone, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const EditProfile = () => {
  const navigate = useNavigate();
  const { login, verifyOTP } = useAuth();
  
  const [step, setStep] = useState(1); // 1: mobile, 2: OTP
  const [formData, setFormData] = useState({
    mobile: '',
    name: '',
    email: '',
    otp: ''
  });
  const [userId, setUserId] = useState('');
  const [generatedOTP, setGeneratedOTP] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    
    if (!formData.mobile || !/^[0-9]{10}$/.test(formData.mobile)) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await login(formData.mobile, formData.name, formData.email);
      setUserId(response.userId);
      setGeneratedOTP(response.otp); // In development only
      setStep(2);
    } catch (err) {
      setError(err.toString());
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    
    if (!formData.otp || formData.otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await verifyOTP(userId, formData.otp);
      navigate('/dashboard');
    } catch (err) {
      setError(err.toString());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in" style={{ 
      padding: '0.25rem 0.2rem', 
      maxWidth: '500px', 
      margin: '0 auto',
      minHeight: 'calc(100vh - 200px)',
      display: 'flex',
      alignItems: 'center'
    }}>
      <div style={{ width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            color: 'white'
          }}>
            <LogIn size={40} />
          </div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.25rem' }}>
            Profile Edit
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
            {step === 1 ? 'Login with your mobile number' : 'Enter the OTP sent to your mobile'}
          </p>
        </div>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={20} style={{ display: 'inline', marginRight: '0.5rem' }} />
            {error}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleSendOTP} className="card">
            <div className="form-group">
              <label className="form-label">Mobile Number *</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter 10-digit mobile number"
                  maxLength="10"
                  style={{ paddingLeft: '3rem' }}
                />
                <Smartphone 
                  size={20} 
                  style={{ 
                    position: 'absolute', 
                    left: '1rem', 
                    top: '50%', 
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)'
                  }} 
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
                placeholder="Your name"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                placeholder="your.email@example.com"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{
                width: '100%',
                marginTop: '1rem',
                fontSize: '1.1rem',
                padding: '1rem'
              }}
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>

            {/* <p style={{ 
              textAlign: 'center', 
              marginTop: '1.5rem', 
              color: 'var(--text-muted)',
              fontSize: '0.9rem'
            }}>
              Not a donor yet? <a href="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>Register here</a>
            </p> */}
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="card">
            {generatedOTP && (
              <div className="alert alert-info" style={{ marginBottom: '1.5rem' }}>
                <strong>Development Mode:</strong> Your OTP is <strong>{generatedOTP}</strong>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Enter OTP *</label>
              <input
                type="text"
                name="otp"
                value={formData.otp}
                onChange={handleChange}
                className="form-input"
                placeholder="6-digit OTP"
                maxLength="6"
                style={{ 
                  fontSize: '1.5rem', 
                  letterSpacing: '0.5rem',
                  textAlign: 'center'
                }}
              />
              <p style={{ 
                marginTop: '0.75rem', 
                fontSize: '0.9rem', 
                color: 'var(--text-muted)' 
              }}>
                OTP sent to +91 {formData.mobile}
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{
                width: '100%',
                marginTop: '1rem',
                fontSize: '1.1rem',
                padding: '1rem'
              }}
            >
              {loading ? 'Verifying...' : 'Verify & Login'}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep(1);
                setFormData({ ...formData, otp: '' });
                setError('');
              }}
              className="btn-outline"
              style={{
                width: '100%',
                marginTop: '1rem'
              }}
            >
              Change Mobile Number
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditProfile;
