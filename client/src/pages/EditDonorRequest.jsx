import React, { useState ,useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Heart, CheckCircle, AlertCircle, AlertTriangle } from 'lucide-react';
import { BLOOD_GROUPS, ORGANS, URGENCY_LEVELS } from '../services/api';
import { OrganService } from '../services/OrganReqService.js';
import locationData from '../data/locationData.json';
import { useAuth } from '../context/AuthContext';

const EditDonorRequest = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    patientName: '',
    age: '',
    dob: '',
    gender: '',
    bloodGroup: '',
    organNeeded: '',
    urgencyLevel: 'Moderate',
    medicalCondition: '',
    hospitalName: '',
    doctorName: '',
    contactPerson: '',
    contact: '',
    alternateContact: '',
    email: '',
    address: '',
    city: '',
    state: '',
    district: '',
    taluka: '',
    pincode: '',
    remarks: ''
  });

  const [states] = useState(locationData);
  const [districts, setDistricts] = useState([]);
  const [talukas, setTalukas] = useState([]);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
  const { name, value } = e.target;

  setFormData(prev => {
    const updated = {
      ...prev,
      [name]: value
    };

    if (name === 'dob') {
      const age = calculateAge(value);
      updated.age = age >= 0 ? age : '';
    }

    return updated;
  });

  if (errors[name]) {
    setErrors(prev => ({ ...prev, [name]: '' }));
  }
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

  const selectedState = states.find(
    state => state.id === stateId
  );

  setDistricts(selectedState?.districts || []);

  setTalukas([]);

  setFormData(prev => ({
    ...prev,
    state: selectedState?.name || '',
    district: '',
    taluka: ''
  }));
};

const handleDistrictChange = (e) => {

  const districtId = Number(e.target.value);

  const selectedDistrict = districts.find(
    district => district.id === districtId
  );

  setTalukas(selectedDistrict?.talukas || []);

  setFormData(prev => ({
    ...prev,
    district: selectedDistrict?.name || '',
    taluka: ''
  }));
};

const handleTalukaChange = (e) => {

  setFormData(prev => ({
    ...prev,
    taluka: e.target.value
  }));
};

  const validate = () => {
    const newErrors = {};

    if (!formData.patientName.trim()) newErrors.patientName = 'Patient name is required';
    if (!formData.dob) {
    newErrors.dob = 'Date of Birth is required';
   }
    if (!formData.age) newErrors.age = 'Age is required';
    else if (formData.age < 1 || formData.age > 100) {
      newErrors.age = 'Age must be between 1 and 100';
    }
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.bloodGroup) newErrors.bloodGroup = 'Blood group is required';
    if (!formData.organNeeded) newErrors.organNeeded = 'Please select organ needed';
    if (!formData.urgencyLevel) newErrors.urgencyLevel = 'Please select urgency level';
    if (!formData.medicalCondition.trim()) newErrors.medicalCondition = 'Medical condition is required';
    if (!formData.hospitalName.trim()) newErrors.hospitalName = 'Hospital name is required';
    if (!formData.contactPerson.trim()) newErrors.contactPerson = 'Contact person name is required';
    if (!formData.contact) newErrors.contact = 'Contact number is required';
    else if (!/^[0-9]{10}$/.test(formData.contact)) {
      newErrors.contact = 'Contact must be a valid 10-digit number';
    }
    if (formData.alternateContact && !/^[0-9]{10}$/.test(formData.alternateContact)) {
      newErrors.alternateContact = 'Alternate contact must be a valid 10-digit number';
    }
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.district) newErrors.district = 'District is required';
    if (!formData.taluka) newErrors.taluka = 'Taluka is required';
    if (!formData.pincode) newErrors.pincode = 'Pincode is required';
    else if (!/^[0-9]{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Pincode must be 6 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

    useEffect(() => {
      if (id) {
        getDonorRequestData();
      }
    }, [id]);
  
    const getDonorRequestData = async () => {
      try {
        const response = await OrganService.getById(id);
        const data = response.data;

    setFormData({
      patientName: data.patientName || '',
      age: data.age || '',
      dob: data.dob ? data.dob.split('T')[0] : '',
      gender: data.gender || '',
      bloodGroup: data.bloodGroup || '',
      organNeeded: data.organNeeded || '',
      urgencyLevel: data.urgencyLevel || 'Moderate',
      medicalCondition: data.medicalCondition || '',
      hospitalName: data.hospitalName || '',
      doctorName: data.doctorName || '',
      contactPerson: data.contactPerson || '',
      contact: data.contact || '',
      alternateContact: data.alternateContact || '',
      email: data.email || '',
      address: data.address || '',
      city: data.city || '',
      state: data.state || '',
      district: data.district || '',
      taluka: data.taluka || '',
      pincode: data.pincode || '',
      remarks: data.remarks || ''
    });
      } catch (error) {
        console.error("Error fetching donor:", error);
      }
    };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccess(false);

    if (!validate()) return;

    setLoading(true);

    try {
      await OrganService.updateData(id,formData);
      setSuccess(true);
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Request submission error:', error);
      setErrorMessage(error.response?.data?.message || 'Request submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
  setShowSuccessModal(false);
   if (user) {
    navigate('/dashboard');
  } else {
    navigate('/login');
  }
  };

  return (
    <div className="fade-in" style={{ padding: '0.25rem 0.2rem', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <div style={{
          width: '80px',
          height: '80px',
          background: 'linear-gradient(135deg, var(--secondary) 0%, #1e40af 100%)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1rem',
          color: 'white'
        }}>
          <AlertTriangle size={40} />
        </div>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.25rem' }}>
          Request for Organ
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
          Fill in the details to request an organ. Our team will help you find a match.
        </p>
      </div>

      {success && (
        <div className="alert alert-success">
          <CheckCircle size={20} style={{ display: 'inline', marginRight: '0.5rem' }} />
          Request submitted successfully! Our team will contact you soon. Redirecting to home...
        </div>
      )}

      {errorMessage && (
        <div className="alert alert-error">
          <AlertCircle size={20} style={{ display: 'inline', marginRight: '0.5rem' }} />
          {errorMessage}
        </div>
      )}

      {showSuccessModal && (
        <div className="modal-overlay">
          <div className="success-modal">
            <div className="success-icon">
              <CheckCircle size={70} />
            </div>
            <h2>Organ Request Submitted</h2>
            <p>
  Thank you for submitting your organ request.
  Your request has been recorded and is now available for review by hospitals, NGOs, and authorized healthcare professionals.
</p> 
            <button
              className="btn-primary"
              onClick={handleModalClose}
            >
              OK
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="card">
        <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', borderBottom: '2px solid var(--border)', paddingBottom: '0.75rem' }}>
          Patient Information
        </h3>

        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Patient Name *</label>
            <input
              type="text"
              name="patientName"
              value={formData.patientName}
              onChange={handleChange}
              className="form-input"
              placeholder="Full name of patient"
            />
            {errors.patientName && <div className="form-error">{errors.patientName}</div>}
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
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && <div className="form-error">{errors.gender}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Blood Group *</label>
            <select
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
              className="form-select"
            >
              <option value="">Select Blood Group</option>
              {BLOOD_GROUPS.map(group => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>
            {errors.bloodGroup && <div className="form-error">{errors.bloodGroup}</div>}
          </div>
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Organ Needed *</label>
            <select
              name="organNeeded"
              value={formData.organNeeded}
              onChange={handleChange}
              className="form-select"
            >
              <option value="">Select Organ</option>
              {ORGANS.map(organ => (
                <option key={organ} value={organ}>{organ}</option>
              ))}
            </select>
            {errors.organNeeded && <div className="form-error">{errors.organNeeded}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Urgency Level *</label>
            <select
              name="urgencyLevel"
              value={formData.urgencyLevel}
              onChange={handleChange}
              className="form-select"
              style={{
                borderColor: URGENCY_LEVELS.find(u => u.value === formData.urgencyLevel)?.color || 'var(--border)'
              }}
            >
              {URGENCY_LEVELS.map(level => (
                <option key={level.value} value={level.value}>{level.label}</option>
              ))}
            </select>
            {errors.urgencyLevel && <div className="form-error">{errors.urgencyLevel}</div>}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Medical Condition *</label>
          <textarea
            name="medicalCondition"
            value={formData.medicalCondition}
            onChange={handleChange}
            className="form-textarea"
            placeholder="Describe the patient's medical condition and reason for organ transplant"
            rows="4"
          />
          {errors.medicalCondition && <div className="form-error">{errors.medicalCondition}</div>}
        </div>

        <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', marginTop: '2rem', borderBottom: '2px solid var(--border)', paddingBottom: '0.75rem' }}>
          Hospital Information
        </h3>

        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Hospital Name *</label>
            <input
              type="text"
              name="hospitalName"
              value={formData.hospitalName}
              onChange={handleChange}
              className="form-input"
              placeholder="Hospital name"
            />
            {errors.hospitalName && <div className="form-error">{errors.hospitalName}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Doctor Name (Optional)</label>
            <input
              type="text"
              name="doctorName"
              value={formData.doctorName}
              onChange={handleChange}
              className="form-input"
              placeholder="Consulting doctor"
            />
          </div>
        </div>

        <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', marginTop: '2rem', borderBottom: '2px solid var(--border)', paddingBottom: '0.75rem' }}>
          Contact Information
        </h3>

        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Contact Person *</label>
            <input
              type="text"
              name="contactPerson"
              value={formData.contactPerson}
              onChange={handleChange}
              className="form-input"
              placeholder="Name of contact person"
            />
            {errors.contactPerson && <div className="form-error">{errors.contactPerson}</div>}
          </div>

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
            {errors.contact && <div className="form-error">{errors.contact}</div>}
          </div>
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Alternate Contact (Optional)</label>
            <input
              type="tel"
              name="alternateContact"
              value={formData.alternateContact}
              onChange={handleChange}
              className="form-input"
              placeholder="10-digit mobile number"
              maxLength="10"
            />
            {errors.alternateContact && <div className="form-error">{errors.alternateContact}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              placeholder="email@example.com"
            />
            {errors.email && <div className="form-error">{errors.email}</div>}
          </div>
        </div>

        <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', marginTop: '2rem', borderBottom: '2px solid var(--border)', paddingBottom: '0.75rem' }}>
          Address Details
        </h3>

        <div className="form-group">
          <label className="form-label">Full Address *</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="form-input"
            placeholder="Street, Area, Landmark"
          />
          {errors.address && <div className="form-error">{errors.address}</div>}
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
            <select
  className="form-select"
  onChange={handleStateChange}
>
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
            {errors.district && <div className="form-error">{errors.district}</div>}
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
            <label className="form-label">Pincode *</label>
            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              className="form-input"
              placeholder="6-digit pincode"
              maxLength="6"
            />
            {errors.pincode && <div className="form-error">{errors.pincode}</div>}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Additional Remarks (Optional)</label>
          <textarea
            name="remarks"
            value={formData.remarks}
            onChange={handleChange}
            className="form-textarea"
            placeholder="Any additional information..."
            rows="3"
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
          {loading ? 'Updating Request...' : 'Update Organ Request'}
        </button>

        <p style={{ 
          textAlign: 'center', 
          marginTop: '1.5rem', 
          color: 'var(--text-muted)',
          fontSize: '0.9rem'
        }}>
          Your request will be reviewed by our team and visible to hospitals and NGOs
        </p>
      </form>
    </div>
  );
};

export default EditDonorRequest;
