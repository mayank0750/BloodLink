import React from 'react';

const Analytics = ({ stats }) => {
  return (
    <div>
      <div className="grid-2" style={{ marginBottom: '2rem' }}>
        <div className="card">
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Blood Group Distribution</h3>
          {stats.bloodGroupDistribution.map(item => (
            <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'var(--bg-main)', borderRadius: '8px', marginBottom: '0.5rem', border: "1px solid #c81e1e", }}>
              <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{item._id}</span>
              <span style={{ background: 'var(--primary)', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '6px', fontSize: '0.9rem', fontWeight: 600 }}>{item.count}</span>
            </div>
          ))}
        </div>

        <div className="card">
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Organ Distribution</h3>
          {stats.organDistribution.map(item => (
            <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'var(--bg-main)', borderRadius: '8px', marginBottom: '0.5rem', border: "1px solid #c81e1e",}}>
              <span style={{ fontWeight: 600 }}>{item._id}</span>
              <span style={{ background: 'var(--secondary)', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '6px', fontSize: '0.9rem', fontWeight: 600 }}>{item.count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Top Locations</h3>
        <div className="grid-4">
          {stats.topLocations.map((item, index) => (
            <div key={index} style={{ padding: '1rem', background: 'var(--bg-main)', borderRadius: '8px', textAlign: 'center' ,border: '1px solid #c81e1e'}}>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>{item.count}</div>
              <div style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{item._id || 'Not specified'}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;