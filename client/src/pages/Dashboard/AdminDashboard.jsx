import React, { useState, useMemo, useEffect } from "react";
import AllDonorsTable from "../List/AllDonorsTable";
import UsersTable from "../List/UsersTable";
import OrganRequestsList from "../List/OrganRequestsList";
import Analytics from "../Analytics";
import { AdminService } from "../../services/AdminService";
import { DonorService } from '../../services/DonorService';
import { OrganService } from "../../services/OrganReqService";
import LocationFilter from "../../components/LocationFilter";
import DonorsList from "../List/DonorsList";
import locationData from "../../data/locationData.json";

const AdminDashboard = ({}) => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("blood");

  const [dashboardData, setDashboardData] = useState({
    allDonors: [],
    users: [],
    stats: null,
    organRequests: [],
  });

  const tabs = [
    {
      id: "blood",
      label: "Blood Donors",
      count: dashboardData?.stats?.donors?.blood || 0,
      icon: "👥",
    },
    {
      id: "organ",
      label: "Organ Donors",
      count: dashboardData?.stats?.donors?.organ || 0,
      icon: "👥",
    },
    {
      id: "donors",
      label: "All Donors",
      count: dashboardData?.allDonors?.length || 0,
      icon: "👥",
    },
    {
      id: "organ-requests",
      label: "Organ Requests",
      count: dashboardData?.organRequests?.length || 0,
      icon: "⚠️",
    },
    {
      id: "users",
      label: "Users",
      count: dashboardData?.users?.length || 0,
      icon: "👤",
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: "📊",
    },
  ];

  const [filters, setFilters] = useState({
    bloodGroup: "all",
    organ: "all",
    state: "",
    district: "",
    taluka: "",
    city: "",
    latitude: null,
    longitude: null,
  });

  const [filteredBloodDonors, setFilteredBloodDonors] = useState([]);
  const [filteredOrganDonors, setFilteredOrganDonors] = useState([]);

  const handleBloodFilter = async (filters) => {
  console.log("Blood Filters:", filters);
  await loadBloodDonors(filters);
};

  const handleOrganFilter = async (filters) => {
  console.log("Organ Filters:", filters);
  await loadOrganDonors(filters);
};

  const loadBloodDonors = async (filters = {}) => {
  try {
    const response = await DonorService.getBloodDonors(filters);
    setFilteredBloodDonors(response.data);
  } catch (error) {
    console.error(error);
  }
};

const loadOrganDonors = async (filters = {}) => {
  try {
    const response = await DonorService.getOrganDonors(filters);
    setFilteredOrganDonors(response.data);
  } catch (error) {
    console.error(error);
  }
};

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setLoading(true);

    try {
      const [donorsRes, usersRes, statsRes, organReqRes] = await Promise.all([
        AdminService.getAllDonors(),
        AdminService.getAllUsers(),
        AdminService.getStats(),
        OrganService.getAll(),
      ]);

      const allDonors = donorsRes.data || [];

      // Dashboard data
      setDashboardData({
        donors: [],
        allDonors: allDonors,
        users: usersRes.data || [],
        stats: statsRes.data || {},
        organRequests: organReqRes.data || [],
      });
      await loadBloodDonors();
      await loadOrganDonors();
    } catch (error) {
      console.error("Error loading admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fade-in">
        {/* Admin Stats */}
        {/* {dashboardData?.stats && (
        <div className="stats-grid" style={{ marginBottom: '3rem' }}>

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
            <div className="stat-value">{dashboardData.stats.donors.total}</div>
            <div className="stat-label">Total Donors</div>
            <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--success)' }}>
              +{dashboardData.stats.donors.recent} this month
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-value">{dashboardData.stats.organRequests?.total || 0}</div>
            <div className="stat-label">Organ Requests</div>
            <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--error)' }}>
              {dashboardData.stats.organRequests?.critical || 0} critical
            </div>
          </div>
        </div>
      )} */}

        {/* Header Section */}
        <div
          style={{
            background:
              "linear-gradient(135deg, rgba(200, 30, 30, 0.95) 0%, rgba(154, 21, 21, 0.95) 100%)",
            padding: "2rem 1rem",
            border: "2px solid #c81e1e",
            borderRadius: "12px",
          }}
        >
          <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
            <h1 style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>
              Admin Dashboard
            </h1>
            <p style={{ fontSize: "1.1rem", color: "white" }}>
              Manage donors, users, organ requests, and view analytics
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {/* <span style={{ marginRight: '0.5rem' }}>{tab.icon}</span> */}
              {tab.label} {tab.count !== undefined && `(${tab.count})`}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "blood" && (
          <>
            <LocationFilter
              filters={filters}
              setFilters={setFilters}
              onApplyFilters={handleBloodFilter}
              locationData={locationData}
            />

            <DonorsList donors={filteredBloodDonors} 
            type="blood" />
          </>
        )}
        {activeTab === "organ" && (
          <>
            <LocationFilter
              filters={filters}
              setFilters={setFilters}
              onApplyFilters={handleOrganFilter}
              locationData={locationData}
              showOrganFilter={true}
            />

            <DonorsList donors={filteredOrganDonors} 
            type="organ" />
          </>
        )}
        {activeTab === "donors" && (
          <AllDonorsTable donors={dashboardData?.allDonors} />
        )}
        {activeTab === "organ-requests" && (
          <OrganRequestsList requests={dashboardData?.organRequests} />
        )}
        {activeTab === "users" && <UsersTable users={dashboardData?.users} />}
        {activeTab === "analytics" && dashboardData?.stats && (
          <Analytics stats={dashboardData?.stats} />
        )}
      </div>
    </>
  );
};

export default AdminDashboard;
