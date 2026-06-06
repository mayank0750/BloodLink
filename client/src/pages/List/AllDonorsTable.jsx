import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';

const AllDonorsTable = ({ donors }) => {
  const [filters, setFilters] = useState({
    search: '',
    donorType: '',
    bloodGroup: '',
    status: '',
    city: '',
    state: ''
  });

  const [showFilters, setShowFilters] = useState(false);

  const donorTypes = ['blood', 'organ', 'both'];
  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const statuses = ['active', 'inactive'];

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      donorType: '',
      bloodGroup: '',
      status: '',
      city: '',
      state: ''
    });
  };

  const getFilteredDonors = () => {
    let filtered = [...(donors || [])];

    // Search filter (name, email, contact)
    if (filters.search) {
      filtered = filtered.filter(donor =>
        donor.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
        donor.email?.toLowerCase().includes(filters.search.toLowerCase()) ||
        donor.contact?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Donor Type filter
    if (filters.donorType) {
      filtered = filtered.filter(donor => donor.donorType === filters.donorType);
    }

    // Blood Group filter
    if (filters.bloodGroup) {
      filtered = filtered.filter(donor => donor.bloodGroup === filters.bloodGroup);
    }

    // Status filter
    if (filters.status) {
      const isActive = filters.status === 'active';
      filtered = filtered.filter(donor => donor.isActive === isActive);
    }

    // City filter
    if (filters.city) {
      filtered = filtered.filter(donor =>
        donor.city?.toLowerCase().includes(filters.city.toLowerCase())
      );
    }

    // State filter
    if (filters.state) {
      filtered = filtered.filter(donor =>
        donor.state?.toLowerCase().includes(filters.state.toLowerCase())
      );
    }

    return filtered;
  };

  const filteredDonors = getFilteredDonors();
  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <div>
      {/* Search and Filter Bar */}
      <div style={{
        background: 'var(--bg-card)',
        padding: '1.5rem',
        borderRadius: '12px',
        marginBottom: '1.5rem',
        border: '1px solid var(--border)'
      }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Search Input */}
          <div style={{ flex: 1, minWidth: '250px' }}>
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)'
              }} />
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search by name, email, or contact..."
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
          </div>

          <button
            className="btn-secondary"
            onClick={() => setShowFilters(!showFilters)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Filter size={18} />
            Filters
            {hasActiveFilters && (
              <span style={{
                background: 'var(--primary)',
                color: 'white',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem'
              }}>
                {Object.values(filters).filter(v => v !== '').length}
              </span>
            )}
          </button>

          {hasActiveFilters && (
            <button
              className="btn-secondary"
              onClick={clearFilters}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <X size={18} />
              Clear All
            </button>
          )}
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginTop: '1.5rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid var(--border)'
          }}>
            <div className="filter-item">
              <label className="form-label" style={{ fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                Donor Type
              </label>
              <select
                name="donorType"
                value={filters.donorType}
                onChange={handleFilterChange}
                className="form-select"
              >
                <option value="">All Types</option>
                {donorTypes.map(type => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-item">
              <label className="form-label" style={{ fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                Blood Group
              </label>
              <select
                name="bloodGroup"
                value={filters.bloodGroup}
                onChange={handleFilterChange}
                className="form-select"
              >
                <option value="">All Blood Groups</option>
                {bloodGroups.map(group => (
                  <option key={group} value={group}>{group}</option>
                ))}
              </select>
            </div>

            <div className="filter-item">
              <label className="form-label" style={{ fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                Status
              </label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="form-select"
              >
                <option value="">All Status</option>
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-item">
              <label className="form-label" style={{ fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                City
              </label>
              <input
                type="text"
                name="city"
                value={filters.city}
                onChange={handleFilterChange}
                className="form-input"
                placeholder="Enter city"
              />
            </div>

            <div className="filter-item">
              <label className="form-label" style={{ fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                State
              </label>
              <input
                type="text"
                name="state"
                value={filters.state}
                onChange={handleFilterChange}
                className="form-input"
                placeholder="Enter state"
              />
            </div>
          </div>
        )}
      </div>

      {/* Results Summary */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem',
        padding: '0 0.5rem'
      }}>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Showing {filteredDonors.length} of {donors?.length || 0} donors
        </div>
        {hasActiveFilters && (
          <div style={{ color: 'var(--primary)', fontSize: '0.85rem' }}>
            Filters applied
          </div>
        )}
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Blood Group</th>
              <th>Contact</th>
              <th>City</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredDonors.length > 0 ? (
              filteredDonors.map((donor) => (
                <tr key={donor._id}>
                  <td>
                    <strong>{donor.name}</strong>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {donor.age} years • {donor.gender}
                    </div>
                  </td>
                  <td>
                    <span className={`badge badge-${donor.donorType}`}>
                      {donor.donorType}
                    </span>
                  </td>
                  <td>
                    <strong style={{ color: 'var(--primary)' }}>
                      {donor.bloodGroup}
                    </strong>
                  </td>
                  <td>
                    <div>{donor.contact}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {donor.email}
                    </div>
                  </td>
                  <td>
                    {donor.city}, {donor.state}
                  </td>
                  <td>
                    <span
                      className={`badge ${donor.isActive ? 'badge-active' : 'badge-inactive'}`}
                    >
                      {donor.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '3rem' }}>
                  <div style={{ color: 'var(--text-muted)' }}>
                    No donors found matching your filters
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllDonorsTable;