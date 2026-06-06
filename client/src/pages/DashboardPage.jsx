// DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { adminAPI, BLOOD_GROUPS, ORGANS, URGENCY_LEVELS, getCurrentLocation } from '../services/api';
import { AdminService } from '../services/AdminService';
import { DonorService } from '../services/DonorService';
import { OrganService } from '../services/OrganReqService';
import locationData from '../data/locationData.json';

// Import Components
import AdminDashboard from './Dashboard/AdminDashboard';
import HospitalNGODashboard from './Dashboard/HospitalNGODashboard';
import UserDashboard from './Dashboard/UserDashboard';
import DonorsList from './List/DonorsList';
import OrganRequestsList from './List/OrganRequestsList';
import AllDonorsTable from './List/AllDonorsTable';
import UsersTable from './List/UsersTable';
import Analytics from './Analytics';
import LocationFilter from '../components/LocationFilter';

const DashboardPage = () => {
  const { user, isAdmin } = useAuth();
  const isHospitalOrNGO = user?.role === 'hospital' || user?.role === 'ngo';
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('blood');
  const [dashboardData, setDashboardData] = useState({
    donors: [],
    allDonors: [],
    users: [],
    organRequests: [],
    stats: null
  });

  useEffect(() => {
    if (isAdmin) {
      loadAdminData();
    } else if (isHospitalOrNGO) {
      loadHospitalNGOData();
    } else {
      loadDonors();
    }
  }, [activeTab]);

  const loadDonors = async (filters = {}) => {
    setLoading(true);
    try {
      const response = activeTab === 'blood' 
        ? await DonorService.getBloodDonors(filters)
        : await DonorService.getOrganDonors(filters);
      setDashboardData(prev => ({ ...prev, donors: response.data }));
    } catch (error) {
      console.error('Error loading donors:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadHospitalNGOData = async (filters = {}) => {
    setLoading(true);
    try {
      if (activeTab === 'blood' || activeTab === 'organ') {
        const response = activeTab === 'blood'
          ? await DonorService.getBloodDonors(filters)
          : await DonorService.getOrganDonors(filters);
        setDashboardData(prev => ({ ...prev, donors: response.data }));
      } else if (activeTab === 'organ-requests') {
        const response = await OrganService.getAll();
        setDashboardData(prev => ({ ...prev, organRequests: response.data }));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [donorsRes, usersRes, statsRes, organReqRes] = await Promise.all([
        AdminService.getAllDonors(),
        AdminService.getAllUsers(),
        AdminService.getStats(),
        OrganService.getAll()
      ]);
      setDashboardData({
        donors: [],
        allDonors: donorsRes.data || [],
        users: usersRes.data,
        stats: statsRes.data,
        organRequests: organReqRes.data
      });
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !dashboardData.donors.length && !dashboardData.allDonors.length) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p style={{ color: 'var(--text-muted)' }}>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="fade-in">
      {/* Header Section */}
      <div style={{ 
        background: 'linear-gradient(135deg, rgba(200, 30, 30, 0.95) 0%, rgba(154, 21, 21, 0.95) 100%)',
        padding: '3rem 2rem',
        border: '2px solid #c81e1e',
        borderRadius: '12px',
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
            {isAdmin ? 'Admin Dashboard' : isHospitalOrNGO ? `${user.role === 'hospital' ? 'Hospital' : 'NGO'} Dashboard` : 'Find Donors'}
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'white' }}>
            {isAdmin 
              ? 'Manage donors, users, organ requests, and view analytics' 
              : isHospitalOrNGO
              ? 'Access donor information and organ requests'
              : 'Search for blood and organ donors in your area'
            }
          </p>
          {user && user.organizationName && (
            <p style={{ fontSize: '1rem', color: 'var(--primary)', marginTop: '0.5rem', fontWeight: 600 }}>
              {user.organizationName}
            </p>
          )}
        </div>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
        {/* Render Dashboard based on user role */}
        {isAdmin ? (
          <AdminDashboard 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            dashboardData={dashboardData}
            loadAdminData={loadAdminData}
          />
        ) : isHospitalOrNGO ? (
          <HospitalNGODashboard 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            dashboardData={dashboardData}
            loadHospitalNGOData={loadHospitalNGOData}
            locationData={locationData}
          />
        ) : (
          <UserDashboard 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            dashboardData={dashboardData}
            loadDonors={loadDonors}
            locationData={locationData}
          />
        )}
      </div>
    </div>
  );
};

export default DashboardPage;