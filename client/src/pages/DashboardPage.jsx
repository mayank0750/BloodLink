import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import AdminDashboard from './Dashboard/AdminDashboard';
import HospitalNGODashboard from './Dashboard/HospitalNGODashboard';
import UserDashboard from './Dashboard/UserDashboard';

const DashboardPage = () => {
  const { user, isAdmin } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Admin Dashboard
  if (isAdmin) {
    return <AdminDashboard />;
  }

  // Hospital / NGO Dashboard
  if (user.role === 'hospital' || user.role === 'ngo') {
    return <HospitalNGODashboard />;
  }

  // Normal User Dashboard
  return <UserDashboard />;
};

export default DashboardPage;