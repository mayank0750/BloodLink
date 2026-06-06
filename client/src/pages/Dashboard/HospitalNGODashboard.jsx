import React, { useState } from 'react';
import OrganRequestsList from '../List/OrganRequestsList';
import DonorsList from '../List/DonorsList';
import LocationFilter from '../../components/LocationFilter';

const HospitalNGODashboard = ({ 
  activeTab, 
  setActiveTab, 
  dashboardData, 
  loadHospitalNGOData,
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
    { id: 'organ', label: 'Organ Donors', icon: '❤️' },
    { id: 'organ-requests', label: 'Organ Requests', icon: '⚠️' }
  ];

  const applyFilters = (newFilters) => {
    loadHospitalNGOData(newFilters);
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

      {(activeTab === 'blood' || activeTab === 'organ') && (
        <>
          <LocationFilter 
            filters={filters}
            setFilters={setFilters}
            onApplyFilters={applyFilters}
            locationData={locationData}
          />
          <DonorsList donors={dashboardData.donors} type={activeTab} />
        </>
      )}

      {activeTab === 'organ-requests' && (
        <OrganRequestsList requests={dashboardData.organRequests} />
      )}
    </>
  );
};

export default HospitalNGODashboard;