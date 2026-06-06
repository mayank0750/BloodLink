import React from 'react';
import { AlertTriangle, Clock } from 'lucide-react';
import { URGENCY_LEVELS } from '../../services/api';

const OrganRequestsList = ({ requests }) => {
  const getUrgencyColor = (urgency) => {
    const level = URGENCY_LEVELS.find(u => u.value === urgency);
    return level?.color || 'var(--text-muted)';
  };

  if (!requests || requests.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid #c81e1e' }}>
        <AlertTriangle size={60} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
        <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>No organ requests</h3>
        <p style={{ color: 'var(--text-secondary)' }}>There are no pending organ requests at the moment</p>
      </div>
    );
  }

  return (
    <div className="grid-2">
      {requests.map(request => (
        <div key={request._id} className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{request.patientName}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{request.age} years • {request.gender}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ background: getUrgencyColor(request.urgencyLevel) + '20', color: getUrgencyColor(request.urgencyLevel), padding: '0.35rem 0.75rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'inline-block', marginBottom: '0.5rem' }}>
                {request.urgencyLevel}
              </span>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{request.status}</div>
            </div>
          </div>

          <div style={{ background: 'rgba(30, 58, 138, 0.1)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Organ Needed</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--secondary)' }}>{request.organNeeded}</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Blood Group: <strong>{request.bloodGroup}</strong></div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Medical Condition</div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>{request.medicalCondition}</p>
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: '1rem' }}>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}><strong>Hospital:</strong> {request.hospitalName}</div>
            {request.doctorName && <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}><strong>Doctor:</strong> {request.doctorName}</div>}
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}><strong>Contact:</strong> {request.contactPerson} - {request.contact}</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}><strong>Location:</strong> {request.city}, {request.state}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
              <Clock size={14} style={{ display: 'inline', marginRight: '0.25rem' }} />
              Requested on {new Date(request.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrganRequestsList;