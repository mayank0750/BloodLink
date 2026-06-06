import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';

const UsersTable = ({ users }) => {
  const [filters, setFilters] = useState({
    search: '',
    role: '',
    organization: '',
    dateFrom: '',
    dateTo: ''
  });

  const [showFilters, setShowFilters] = useState(false);

  const roles = ['admin', 'hospital', 'ngo', 'donor'];

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      role: '',
      organization: '',
      dateFrom: '',
      dateTo: ''
    });
  };

  const getFilteredUsers = () => {
    let filtered = [...(users || [])];

    // Search filter (name, email, mobile)
    if (filters.search) {
      filtered = filtered.filter(user =>
        user.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.email?.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.mobile?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Role filter
    if (filters.role) {
      filtered = filtered.filter(user => user.role === filters.role);
    }

    // Organization filter
    if (filters.organization) {
      filtered = filtered.filter(user =>
        user.organizationName?.toLowerCase().includes(filters.organization.toLowerCase())
      );
    }

    // Date range filter
    if (filters.dateFrom) {
      filtered = filtered.filter(user => 
        new Date(user.createdAt) >= new Date(filters.dateFrom)
      );
    }
    if (filters.dateTo) {
      filtered = filtered.filter(user => 
        new Date(user.createdAt) <= new Date(filters.dateTo)
      );
    }

    return filtered;
  };

  const filteredUsers = getFilteredUsers();
  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  // Get role badge class
  const getRoleBadgeClass = (role) => {
    switch(role) {
      case 'admin':
        return 'badge-blood';
      case 'hospital':
      case 'ngo':
        return 'badge-both';
      default:
        return 'badge-organ';
    }
  };

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
                placeholder="Search by name, email, or mobile..."
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
                Role
              </label>
              <select
                name="role"
                value={filters.role}
                onChange={handleFilterChange}
                className="form-select"
              >
                <option value="">All Roles</option>
                {roles.map(role => (
                  <option key={role} value={role}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-item">
              <label className="form-label" style={{ fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                Organization Name
              </label>
              <input
                type="text"
                name="organization"
                value={filters.organization}
                onChange={handleFilterChange}
                className="form-input"
                placeholder="Enter organization name"
              />
            </div>

            <div className="filter-item">
              <label className="form-label" style={{ fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                Registered From
              </label>
              <input
                type="date"
                name="dateFrom"
                value={filters.dateFrom}
                onChange={handleFilterChange}
                className="form-input"
              />
            </div>

            <div className="filter-item">
              <label className="form-label" style={{ fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                Registered To
              </label>
              <input
                type="date"
                name="dateTo"
                value={filters.dateTo}
                onChange={handleFilterChange}
                className="form-input"
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
          Showing {filteredUsers.length} of {users?.length || 0} users
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
              <th>Mobile</th>
              <th>Email</th>
              <th>Role</th>
              <th>Organization</th>
              <th>Registered</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <tr key={user._id}>
                  <td><strong>{user.name || 'N/A'}</strong></td>
                  <td>{user.mobile}</td>
                  <td>{user.email || 'N/A'}</td>
                  <td>
                    <span className={`badge ${getRoleBadgeClass(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>{user.organizationName || 'N/A'}</td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '3rem' }}>
                  <div style={{ color: 'var(--text-muted)' }}>
                    No users found matching your filters
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

export default UsersTable;