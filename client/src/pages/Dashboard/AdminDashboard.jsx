import React from 'react';
import AllDonorsTable from '../List/AllDonorsTable';
import UsersTable from '../List/UsersTable';
import OrganRequestsList from '../List/OrganRequestsList';
import Analytics from '../Analytics';
import analytcs from '../Analytics';

const AdminDashboard = ({ activeTab, setActiveTab, dashboardData }) => {
  const tabs = [
    { id: 'donors', label: 'All Donors', count: dashboardData.allDonors.length, icon: '👥' },
    { id: 'organ-requests', label: 'Organ Requests', count: dashboardData.organRequests.length, icon: '⚠️' },
    { id: 'users', label: 'Users', count: dashboardData.users.length, icon: '👤' },
    { id: 'analytics', label: 'Analytics', icon: '📊' }
  ];

  return (
    <>
      {/* Admin Stats */}
      {dashboardData.stats && (
        <div className="stats-grid" style={{ marginBottom: '3rem' }}>
          <div className="stat-card">
            <div className="stat-value">{dashboardData.stats.donors.total}</div>
            <div className="stat-label">Total Donors</div>
            <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--success)' }}>
              +{dashboardData.stats.donors.recent} this month
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-value">{dashboardData.stats.donors.blood}</div>
            <div className="stat-label">Blood Donors</div>
            <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {dashboardData.stats.donors.active} active
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-value">{dashboardData.stats.donors.organ}</div>
            <div className="stat-label">Organ Donors</div>
          </div>

          <div className="stat-card">
            <div className="stat-value">{dashboardData.stats.organRequests?.total || 0}</div>
            <div className="stat-label">Organ Requests</div>
            <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--error)' }}>
              {dashboardData.stats.organRequests?.critical || 0} critical
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span style={{ marginRight: '0.5rem' }}>{tab.icon}</span>
            {tab.label} {tab.count !== undefined && `(${tab.count})`}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'donors' && <AllDonorsTable donors={dashboardData.allDonors} />}
      {activeTab === 'organ-requests' && <OrganRequestsList requests={dashboardData.organRequests} />}
      {activeTab === 'users' && <UsersTable users={dashboardData.users} />}
      {activeTab === 'analytics' && dashboardData.stats && <Analytics stats={dashboardData.stats} />}
    </>
  );
};

export default AdminDashboard;