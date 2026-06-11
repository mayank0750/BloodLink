import React, { useState } from "react";
import { Filter, Search, Navigation, CheckCircle } from "lucide-react";
import { BLOOD_GROUPS, ORGANS, getCurrentLocation } from "../services/api";

const LocationFilter = ({
  filters,
  setFilters,
  onApplyFilters,
  locationData,
  showOrganFilter = false,
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationCaptured, setLocationCaptured] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [districts, setDistricts] = useState([]);
  const [talukas, setTalukas] = useState([]);
  const [radius, setRadius] = useState(50);

  const handleCaptureLocation = async () => {
    setLocationLoading(true);
    setErrorMessage("");

    try {
      const position = await getCurrentLocation();
      console.log("Captured Location:", {
        latitude: position.latitude,
        longitude: position.longitude,
        accuracy: position.accuracy,
        time: new Date().toLocaleTimeString(),
      });

      const updatedFilters = {
        bloodGroup: "",
        organ: "",
        state: "",
        district: "",
        taluka: "",
        city: "",
        latitude: position.latitude,
        longitude: position.longitude,
        radius: radius,
      };
      console.log("Captured Location 2:", updatedFilters);
      setFilters(updatedFilters);
      setDistricts([]);
      setTalukas([]);
      // location mode ON
      setLocationCaptured(true);
      // filters panel close
      setShowFilters(false);
      // search immediately
      onApplyFilters(updatedFilters);
    } catch (error) {
      console.error(error);
      setErrorMessage(`Unable to get location: ${error.message}`);
      setLocationCaptured(false);
    } finally {
      setLocationLoading(false);
    }
  };

  const resetLocation = () => {
    setLocationCaptured(false);

    const updatedFilters = {
      ...filters,
      latitude: null,
      longitude: null,
      radius: "",
    };

    setFilters(updatedFilters);
  };

  const resetAllFilters = () => {
    const resetFilters = {
      bloodGroup: "",
      organ: "",
      state: "",
      district: "",
      taluka: "",
      city: "",
      latitude: null,
      longitude: null,
    };
    setFilters(resetFilters);
    setDistricts([]);
    setTalukas([]);
    setLocationCaptured(false);
    // All donors load
    onApplyFilters({});
  };

  const handleStateChange = (e) => {
    const stateId = Number(e.target.value);
    const selectedState = locationData.find((state) => state.id === stateId);
    setDistricts(selectedState?.districts || []);
    setTalukas([]);
    setFilters((prev) => ({
      ...prev,
      state: selectedState?.name || "",
      district: "",
      taluka: "",
    }));
  };

  const handleDistrictChange = (e) => {
    const districtId = Number(e.target.value);
    const selectedDistrict = districts.find(
      (district) => district.id === districtId,
    );
    setTalukas(selectedDistrict?.talukas || []);
    setFilters((prev) => ({
      ...prev,
      district: selectedDistrict?.name || "",
      taluka: "",
    }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    console.log("SEARCH FILTERS", filters);
    onApplyFilters(filters);
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: "0.5rem",
          flexWrap: "wrap",
          marginBottom: "1rem",
        }}
      >
        <label
          style={{
            display: "block",
            marginBottom: "4px",
            fontSize: "14px",
            fontWeight: "600",
          }}
        >
          Radius (KM)
        </label>

        <input
          type="number"
          min="1"
          value={radius}
          onChange={(e) => setRadius(e.target.value)}
          className="form-input"
          style={{ width: "80px", height: "35px" }}
        />
        <button
          type="button"
          onClick={handleCaptureLocation}
          disabled={locationLoading}
          className="btn-primary"
        >
          <Navigation size={18} />
          {locationLoading
            ? "Getting Location..."
            : locationCaptured
              ? "Location Captured ✓"
              : "Use Current Location"}
        </button>
        {errorMessage && (
          <div style={{ color: "red", marginTop: "10px" }}>{errorMessage}</div>
        )}

        {locationCaptured && !showFilters && (
          <div
            style={{
              padding: "0.75rem",
              background: "rgba(5, 150, 105, 0.1)",
              borderRadius: "8px",
              color: "var(--success)",
              fontSize: "0.9rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <CheckCircle size={18} />
            Location captured successfully!
          </div>
        )}
      </div>

      {locationCaptured && (
        <div
          style={{
            marginTop: "1rem",
            padding: "1rem",
            background: "rgba(5,150,105,0.1)",
            borderRadius: "8px",
            marginBottom: "1rem",
          }}
        >
          <p>
            <strong>Nearby donors up to {radius}km</strong>
          </p>
        </div>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          marginBottom: "1rem",
        }}
      >
        <button
          className="btn-secondary"
          onClick={() => {
            // Case 1:
            // Location search chal raha hai aur filters open kar rahe ho
            if (!showFilters && locationCaptured) {
              resetAllFilters();
              setShowFilters(true);
              return;
            }
            // Case 2:
            // Filters close kar rahe ho
            if (showFilters) {
              resetAllFilters();
              setShowFilters(false);
              return;
            }
            // Case 3:
            // Normal open
            setShowFilters(true);
          }}
        >
          <Filter size={18} />
          Filters
        </button>
      </div>

      {showFilters && (
        <div className="filter-bar">
          {showOrganFilter ? (
            <div className="filter-item">
              <label className="form-label">Organ</label>
              <select
                name="organ"
                value={filters.organ}
                onChange={handleFilterChange}
                className="form-select"
              >
                <option value="all">All Organs</option>
                {ORGANS.map((organ) => (
                  <option key={organ} value={organ}>
                    {organ}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="filter-item">
              <label className="form-label">Blood Group</label>
              <select
                name="bloodGroup"
                value={filters.bloodGroup}
                onChange={handleFilterChange}
                className="form-select"
              >
                <option value="all">All Blood Groups</option>
                {BLOOD_GROUPS.map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="filter-item">
            <label className="form-label">State</label>
            <select className="form-select" onChange={handleStateChange}>
              <option value="">Select State</option>
              {locationData.map((state) => (
                <option key={state.id} value={state.id}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>
          <div className="filter-item">
            <label className="form-label">District</label>
            <select
              className="form-select"
              onChange={handleDistrictChange}
              disabled={!filters.state}
            >
              <option value="">Select District</option>
              {districts.map((district) => (
                <option key={district.id} value={district.id}>
                  {district.name}
                </option>
              ))}
            </select>
          </div>
          <div className="filter-item">
            <label className="form-label">Taluka</label>
            <select
              className="form-select"
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, taluka: e.target.value }))
              }
              disabled={!filters.district}
            >
              <option value="">Select Taluka</option>
              {talukas.map((taluka, index) => (
                <option key={index} value={taluka}>
                  {taluka}
                </option>
              ))}
            </select>
          </div>
          <div className="filter-item">
            <label className="form-label">City</label>
            <input
              type="text"
              name="city"
              value={filters.city}
              onChange={handleFilterChange}
              className="form-input"
              placeholder="Enter city"
            />
          </div>
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
              Search
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default LocationFilter;
