import React, { useState, useEffect, useMemo } from "react";
import { MapPin, Droplet, Heart, Users, Search } from "lucide-react";
import { BLOOD_GROUPS, ORGANS } from "../services/dataService";
import { useAuth } from "../context/AuthContext";
import { LocationService } from "../services/LocationService";

const LocationsPage = () => {
  const { isAuthenticated } = useAuth();
  const [locations, setLocations] = useState([]);
  const [locationStats, setLocationStats] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    donorType: "all",
    bloodGroup: "",
    organ: "",
  });
  const [citySearch, setCitySearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const totalPages = Math.ceil(donors.length / ITEMS_PER_PAGE);

  const currentDonors = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return donors.slice(start, start + ITEMS_PER_PAGE);
  }, [donors, currentPage]);

  const getPageNumbers = () => {
    const pages = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  useEffect(() => {
    loadLocations();
    loadLocationStats();
  }, []);

  const loadLocations = async () => {
    try {
      const response = await LocationService.getAll();
      setLocations(response.data);
    } catch (error) {
      console.error("Error loading locations:", error);
    }
  };

  const loadLocationStats = async () => {
    if (!isAuthenticated) return;

    try {
      const response = await LocationService.getStats();
      setLocationStats(response.data);
    } catch (error) {
      console.error("Error loading location stats:", error);
    }
  };

  const handleLocationSelect = async (city) => {
    if (!isAuthenticated) {
      alert("Please login to view donors");
      return;
    }

    setSelectedLocation(city);
    setLoading(true);

    try {
      const filterParams = {};
      if (filters.donorType !== "all")
        filterParams.donorType = filters.donorType;
      if (filters.bloodGroup) filterParams.bloodGroup = filters.bloodGroup;
      if (filters.organ) filterParams.organ = filters.organ;

      const response = await LocationService.getDonorsByLocation(
        city,
        filterParams,
      );
      setDonors(response.data);
    } catch (error) {
      console.error("Error loading donors:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    if (name === "donorType") {
      setFilters((prev) => ({
        ...prev,
        donorType: value,
        bloodGroup: "",
        organ: "",
      }));
      return;
    }

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const applyFilters = () => {
    if (selectedLocation) {
      handleLocationSelect(selectedLocation);
    }
  };

  const filteredCities = locationStats.filter((stat) =>
    stat._id.city?.toLowerCase().includes(citySearch.toLowerCase()),
  );

  return (
    <div className="fade-in">
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
            Find Donors by Location
          </h1>
          <p style={{ fontSize: "1.1rem", color: "white" }}>
            Browse donors city-wise across India
          </p>
        </div>
      </div>

      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "0.2rem",
          marginTop: "1rem",
        }}
      >
        {/* Location Statistics */}
        {isAuthenticated && locationStats.length > 0 && (
          <div style={{ marginBottom: "3rem" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem",
              }}
            >
              <h2 style={{ fontSize: "1.75rem" }}>
                Top 4 Cities by Donor Count
              </h2>

              <input
                type="text"
                placeholder="Search city..."
                value={citySearch}
                onChange={(e) => setCitySearch(e.target.value)}
                className="form-input"
                style={{
                  maxWidth: "300px",
                }}
              />
            </div>
            <div className="grid-4">
              {/* only 4 cities show (0,4) */}
              {(citySearch.trim()
                ? filteredCities
                : locationStats.slice(0, 4)
              ).map((stat, index) => (
                <div
                  key={index}
                  className="card"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleLocationSelect(stat._id.city)}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                      marginBottom: "1rem",
                    }}
                  >
                    <div
                      style={{
                        width: "50px",
                        height: "50px",
                        background: "rgba(200, 30, 30, 0.1)",
                        borderRadius: "12px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "var(--primary)",
                        fontSize: "1.25rem",
                        fontWeight: 700,
                        border: "1px solid #c81e1e"
                      }}
                    >
                      {index + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3
                        style={{ fontSize: "1.25rem", marginBottom: "0.25rem" }}
                      >
                        {stat._id.city}
                      </h3>
                      <p
                        style={{
                          fontSize: "0.85rem",
                          color: "var(--text-muted)",
                        }}
                      >
                        {stat._id.state}
                      </p>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      paddingTop: "1rem",
                      borderTop: "1px solid var(--border)",
                    }}
                  >
                    <div style={{ textAlign: "center", flex: 1 }}>
                      <div
                        style={{
                          fontSize: "1.5rem",
                          fontWeight: 700,
                          color: "var(--primary)",
                        }}
                      >
                        {stat.totalDonors}
                      </div>
                      <div
                        style={{
                          fontSize: "0.8rem",
                          color: "var(--text-muted)",
                        }}
                      >
                        Total
                      </div>
                    </div>
                    <div style={{ textAlign: "center", flex: 1 }}>
                      <div
                        style={{
                          fontSize: "1.25rem",
                          fontWeight: 700,
                          color: "var(--primary)",
                        }}
                      >
                        {stat.bloodDonors}
                      </div>
                      <div
                        style={{
                          fontSize: "0.8rem",
                          color: "var(--text-muted)",
                        }}
                      >
                        Blood
                      </div>
                    </div>
                    <div style={{ textAlign: "center", flex: 1 }}>
                      <div
                        style={{
                          fontSize: "1.25rem",
                          fontWeight: 700,
                          color: "var(--secondary)",
                        }}
                      >
                        {stat.organDonors}
                      </div>
                      <div
                        style={{
                          fontSize: "0.8rem",
                          color: "var(--text-muted)",
                        }}
                      >
                        Organ
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {citySearch && filteredCities.length === 0 && (
              <div style={{ textAlign: "center", padding: "20px" }}>
                No city found
              </div>
            )}
          </div>
        )}

        {/* All Locations Grid */}
        <div>
          {!isAuthenticated && (
            <h2 style={{ fontSize: "1.75rem", marginBottom: "1.5rem" }}>
              Browse All Locations
            </h2>
          )}

          {!isAuthenticated && (
            <div className="alert alert-info" style={{ marginBottom: "2rem" }}>
              Please login to view donors by location
            </div>
          )}

          <div className="grid-4">
            {locations.map((location) => (
              <div
                key={location._id}
                className="card"
                style={{
                  cursor: isAuthenticated ? "pointer" : "not-allowed",
                  opacity: isAuthenticated ? 1 : 0.6,
                }}
                onClick={() =>
                  isAuthenticated && handleLocationSelect(location.city)
                }
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    marginBottom: "1rem",
                  }}
                >
                  <div
                    style={{
                      width: "50px",
                      height: "50px",
                      background:
                        "linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)",
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                    }}
                  >
                    <MapPin size={28} />
                  </div>
                  <div>
                    <h3
                      style={{ fontSize: "1.25rem", marginBottom: "0.25rem" }}
                    >
                      {location.city}
                    </h3>
                    <p
                      style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}
                    >
                      {location.state}
                    </p>
                  </div>
                </div>
                {location.areas && location.areas.length > 0 && (
                  <div
                    style={{
                      fontSize: "0.85rem",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {location.areas.length} area
                    {location.areas.length !== 1 ? "s" : ""} covered
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Selected Location Donors */}
        {selectedLocation && (
          <div style={{ marginTop: "0.2rem" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "2rem",
              }}
            >
              <h2 style={{ fontSize: "1.75rem" }}>
                Donors in {selectedLocation}
              </h2>
              <button
                onClick={() => setSelectedLocation(null)}
                className="btn-outline"
              >
                Back to Locations
              </button>
            </div>

            {/* Filters */}
            <div className="filter-bar">
              <div className="filter-item">
                <label className="form-label">Donor Type</label>
                <select
                  name="donorType"
                  value={filters.donorType}
                  onChange={handleFilterChange}
                  className="form-select"
                >
                  <option value="both">All Donors</option>
                  <option value="blood">Blood Donors</option>
                  <option value="organ">Organ Donors</option>
                  {/* <option value="both">Both</option> */}
                </select>
              </div>

              {/* Blood Group */}
              {filters.donorType === "blood" && (
                <div className="filter-item">
                  <label className="form-label">Blood Group</label>
                  <select
                    name="bloodGroup"
                    value={filters.bloodGroup}
                    onChange={handleFilterChange}
                    className="form-select"
                  >
                    <option value="">All Blood Groups</option>
                    {BLOOD_GROUPS.map((group) => (
                      <option key={group} value={group}>
                        {group}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Organ */}
              {filters.donorType === "organ" && (
                <div className="filter-item">
                  <label className="form-label">Organ</label>
                  <select
                    name="organ"
                    value={filters.organ}
                    onChange={handleFilterChange}
                    className="form-select"
                  >
                    <option value="">All Organs</option>
                    {ORGANS.map((organ) => (
                      <option key={organ} value={organ}>
                        {organ}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {(filters.donorType === "both" ||
                filters.donorType === "all") && (
                <>
                  <div className="filter-item">
                    <label className="form-label">Blood Group</label>
                    <select
                      name="bloodGroup"
                      value={filters.bloodGroup}
                      onChange={handleFilterChange}
                      className="form-select"
                    >
                      <option value="">All Blood Groups</option>
                      {BLOOD_GROUPS.map((group) => (
                        <option key={group} value={group}>
                          {group}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="filter-item">
                    <label className="form-label">Organ</label>
                    <select
                      name="organ"
                      value={filters.organ}
                      onChange={handleFilterChange}
                      className="form-select"
                    >
                      <option value="">All Organs</option>
                      {ORGANS.map((organ) => (
                        <option key={organ} value={organ}>
                          {organ}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              <div
                className="filter-item"
                style={{ display: "flex", alignItems: "flex-end" }}
              >
                <button
                  onClick={applyFilters}
                  className="btn-primary"
                  style={{ width: "100%" }}
                >
                  <Search size={18} />
                  Apply Filters
                </button>
              </div>
            </div>

            {/* Donors List */}
            {loading ? (
              <div className="loading">
                <div className="spinner"></div>
                <p style={{ color: "var(--text-muted)" }}>Loading donors...</p>
              </div>
            ) : donors.length > 0 ? (
              <div className="grid-4">
                {currentDonors.map((donor) => (
                  <div key={donor._id} className="card">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: "1rem",
                      }}
                    >
                      <div>
                        <h3
                          style={{
                            fontSize: "1.25rem",
                            marginBottom: "0.25rem",
                          }}
                        >
                          {donor.name}
                        </h3>
                        <p
                          style={{
                            color: "var(--text-muted)",
                            fontSize: "0.9rem",
                          }}
                        >
                          {donor.age} years • {donor.gender}
                        </p>
                      </div>
                      <span className={`badge badge-${donor.donorType}`}>
                        {donor.donorType}
                      </span>
                    </div>

                    {donor.bloodGroup && donor.bloodGroup !== "N/A" && (
                      <div
                        style={{
                          background: "rgba(200, 30, 30, 0.1)",
                          padding: "0.75rem",
                          borderRadius: "8px",
                          marginBottom: "1rem",
                          border: "1px solid #c81e1e"
                        }}
                      >
                        <div
                          style={{
                            fontSize: "0.85rem",
                            color: "var(--text-muted)",
                            marginBottom: "0.25rem",
                          }}
                        >
                          Blood Group
                        </div>
                        <div
                          style={{
                            fontSize: "1.5rem",
                            fontWeight: 700,
                            color: "var(--primary)",
                          }}
                        >
                          {donor.bloodGroup}
                        </div>
                      </div>
                    )}

                    {donor.organs && donor.organs.length > 0 && (
                      <div style={{ marginBottom: "1rem" }}>
                        <div
                          style={{
                            fontSize: "0.85rem",
                            color: "var(--text-muted)",
                            marginBottom: "0.5rem",
                          }}
                        >
                          Organs
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "0.5rem",
                          }}
                        >
                          {donor.organs.map((organ) => (
                            <span
                              key={organ}
                              style={{
                                background: "rgba(30, 58, 138, 0.1)",
                                color: "var(--secondary)",
                                padding: "0.25rem 0.75rem",
                                borderRadius: "6px",
                                fontSize: "0.85rem",
                                fontWeight: 600,
                              }}
                            >
                              {organ}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div
                      style={{
                        borderTop: "1px solid var(--border)",
                        paddingTop: "1rem",
                        marginTop: "1rem",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "0.9rem",
                          color: "var(--text-secondary)",
                          marginBottom: "0.5rem",
                        }}
                      >
                        📞 {donor.contact}
                      </div>
                      <div
                        style={{
                          fontSize: "0.9rem",
                          color: "var(--text-secondary)",
                        }}
                      >
                        ✉️ {donor.email}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                style={{
                  textAlign: "center",
                  padding: "4rem 2rem",
                  background: "var(--bg-card)",
                  borderRadius: "12px",
                  border: "1px solid var(--border)",
                }}
              >
                <MapPin
                  size={60}
                  style={{ color: "var(--text-muted)", marginBottom: "1rem" }}
                />
                <h3 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
                  No donors found
                </h3>
                <p style={{ color: "var(--text-secondary)" }}>
                  Try adjusting your filters or check other locations
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "8px",
            marginTop: "2rem",
            flexWrap: "wrap",
            gridColumn: "1 / -1",
          }}
        >
          <button
            className="btn-secondary"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Prev
          </button>

          {getPageNumbers().map((page, index) =>
            page === "..." ? (
              <span
                key={index}
                style={{
                  padding: "8px 12px",
                  color: "var(--text-muted)",
                }}
              >
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                style={{
                  minWidth: "42px",
                  height: "42px",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  cursor: "pointer",
                  fontWeight: 600,
                  background:
                    currentPage === page ? "var(--primary)" : "var(--bg-card)",
                  color: currentPage === page ? "#fff" : "var(--text-primary)",
                }}
              >
                {page}
              </button>
            ),
          )}

          <button
            className="btn-secondary"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default LocationsPage;
