import React, { useState,useEffect } from 'react';
import DonorsList from '../List/DonorsList';
import LocationFilter from '../../components/LocationFilter';
import { DonorService } from '../../services/DonorService';
import locationData from '../../data/locationData.json';

const UserDashboard = ({}) => {
  const [activeTab, setActiveTab] = useState('blood');
  const [donors, setDonors] = useState([]);

  const [showFilters, setShowFilters] = useState(false);
  const [locationCaptured, setLocationCaptured] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const [filters, setFilters] = useState({
    bloodGroup: '',
    organ: '',
    state: '',
    district: '',
    taluka: '',
    city: '',
    latitude: null,
    longitude: null
  });

  const tabs = [
    { id: 'blood', label: 'Blood Donors', icon: '💧' , },
    { id: 'organ', label: 'Organ Donors', icon: '❤️' , }
  ];

  const applyFilters = (newFilters) => {
    console.log("Applying Filters:", newFilters);
    loadDonors(newFilters);
  };

  useEffect(() => {
  setShowFilters(false);
  setLocationCaptured(false);
  setErrorMessage('');
}, [activeTab]);

  useEffect(() => {
  setFilters({
    bloodGroup: '',
    organ: '',
    state: '',
    district: '',
    taluka: '',
    city: '',
    latitude: null,
    longitude: null
  });

  loadDonors();
}, [activeTab]);

  const loadDonors = async (filters = {}) => {
  try {
    const response =
      activeTab === 'blood'
        ? await DonorService.getBloodDonors(filters)
        : await DonorService.getOrganDonors(filters);

    setDonors(response.data);
  } catch (error) {
    console.error(error);
  }
};

  return (
    <>
    <div className="fade-in">
      {/* Header Section */}
      <div style={{ 
        background: 'linear-gradient(135deg, rgba(200, 30, 30, 0.95) 0%, rgba(154, 21, 21, 0.95) 100%)',
        padding: '2rem 1rem',
        border: '2px solid #c81e1e',
        borderRadius: '12px',
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
            Find Donors Near You  
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'white' }}>
            Search for blood and organ donors in your area
          </p>
        </div>
      </div>

      <div className="tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            to={tab.path}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {/* <span style={{ marginRight: '0.5rem' }}>{tab.icon}</span> */}
            {tab.label}
          </button>
        ))}
      </div>

      <LocationFilter
        key={activeTab}
        filters={filters}
        setFilters={setFilters}
        onApplyFilters={applyFilters}
        locationData={locationData}
        showOrganFilter={activeTab === 'organ'}
        activeTab={activeTab}
      />
      
      <DonorsList 
      donors={donors}
      type={activeTab}
      /> 
    </div>
    </>
  );
};

export default UserDashboard;