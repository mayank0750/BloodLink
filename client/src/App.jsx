import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import DonorRegistrationPage from './pages/DonorRegistrationPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import OrganRequestPage from './pages/OrganRequestPage';
import LocationsPage from './pages/LocationsPage';
import AdminMessages from './pages/Messages/AdminMessages';
import EditProfile from './pages/EditProfile';
import EditBloodDonor from './pages/EditBloodDonor';
import EditOrganDonor from './pages/EditOrganDonor';
import EditDonorRequest from './pages/EditDonorRequest';
import AddRoles from './pages/AddRoles';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p style={{ color: 'var(--text-muted)' }}>Loading...</p>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

// App Routes Component
const AppRoutes = () => {
  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<DonorRegistrationPage />} />
          <Route path="/organ-request" element={<OrganRequestPage />} />
          <Route path="/locations" element={<LocationsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          {/* <Route
            path="/edit-profile"
            element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            }
          /> */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/blood-donor/:id"
            element={
              <ProtectedRoute>
                <EditBloodDonor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/organ-donor/:id"
            element={
              <ProtectedRoute>
                <EditOrganDonor />
              </ProtectedRoute>
            }
          />
           <Route
            path="/organ-request/:id"
            element={
              <ProtectedRoute>
                <EditDonorRequest />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-roles"
            element={
              <ProtectedRoute>
                <AddRoles />
              </ProtectedRoute>
            }
          />
          <Route path="/admin/messages" element={<AdminMessages />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
};

// Main App Component
function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
