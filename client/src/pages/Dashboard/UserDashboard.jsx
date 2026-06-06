import React, { useState } from 'react';
import DonorsList from '../List/DonorsList';
import LocationFilter from '../../components/LocationFilter';

const UserDashboard = ({ 
  activeTab, 
  setActiveTab, 
  dashboardData, 
  loadDonors,
  locationData 
}) => {
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
    { id: 'blood', label: 'Blood Donors', icon: '💧' },
    { id: 'organ', label: 'Organ Donors', icon: '❤️' }
  ];

  const applyFilters = (newFilters) => {
    loadDonors(newFilters);
  };

  return (
    <>
      <div className="tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span style={{ marginRight: '0.5rem' }}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <LocationFilter 
        filters={filters}
        setFilters={setFilters}
        onApplyFilters={applyFilters}
        locationData={locationData}
        showOrganFilter={activeTab === 'organ'}
      />
      
      <DonorsList donors={dashboardData.donors} type={activeTab} />
    </>
  );
};

export default UserDashboard;