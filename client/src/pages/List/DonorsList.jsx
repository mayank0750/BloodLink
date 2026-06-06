import React from 'react';
import { Droplet, Heart, MapPin } from 'lucide-react';

const DonorsList = ({ donors, type }) => {
  
  if (!donors || donors.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid #c81e1e' }}>
        <div style={{ width: '80px', height: '80px', background: 'rgba(200, 30, 30, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--primary)' }}>
          {type === 'blood' ? <Droplet size={40} /> : <Heart size={40} />}
        </div>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>No donors found</h3>
        <p style={{ color: 'var(--text-secondary)' }}>Try adjusting your filters to find more donors</p>
      </div>
    );
  }

  return (
    <div className="grid-3">
      {donors.map(donor => (
        <div key={donor._id} className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{donor.name}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{donor.age} years • {donor.gender}</p>
            </div>
            <span className={`badge badge-${donor.donorType}`}>{donor.donorType}</span>
          </div>

          {donor.bloodGroup && donor.bloodGroup !== 'N/A' && (
            <div style={{ background: 'rgba(200, 30, 30, 0.1)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Blood Group</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)' }}>{donor.bloodGroup}</div>
            </div>
          )}

          {donor.organs && donor.organs.length > 0 && (
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Organs</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {donor.organs.map(organ => (
                  <span key={organ} style={{ background: 'rgba(30, 58, 138, 0.1)', color: 'var(--secondary)', padding: '0.25rem 0.75rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600 }}>{organ}</span>
                ))}
              </div>
            </div>
          )}

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
              <MapPin size={16} />
              <span>{donor.city}, {donor.state}</span>
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>📞 {donor.contact}</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>✉️ {donor.email}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DonorsList;