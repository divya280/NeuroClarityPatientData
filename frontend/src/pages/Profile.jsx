import React from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Calendar, MapPin, Edit3, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../api.config';

const Profile = () => {
  const { user, role, getToken } = useAuth();
  const [patientCount, setPatientCount] = React.useState(0);
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = await getToken();
        const res = await axios.get(`${API_BASE_URL}/api/patients`, { 
          headers: { Authorization: `Bearer ${token}` } 
        });
        const data = Array.isArray(res.data) ? res.data : [];
        setPatientCount(data.length);
      } catch (e) {
        console.error("Failed to fetch profile stats:", e);
      }
    };
    if (user) fetchStats();
  }, [user, getToken]);

  const formatDate = (isoString) => {
    if (!isoString) return 'Feb 22, 2026'; // Fallback
    return new Date(isoString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div style={{ maxWidth: '56rem', margin: '0 auto' }}>
      {/* Back Button */}
      <button 
        onClick={() => navigate('/dashboard')} 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem', 
          background: 'none', 
          border: 'none', 
          cursor: 'pointer', 
          color: '#94a3b8', 
          fontSize: '0.75rem', 
          fontWeight: 800, 
          textTransform: 'uppercase', 
          letterSpacing: '0.12em',
          marginBottom: '2rem'
        }}
      >
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      <div style={{ 
        background: 'white', 
        borderRadius: '2.5rem', 
        border: '1px solid #e2eaf5', 
        boxShadow: '0 8px 48px rgba(0,0,0,0.06)', 
        overflow: 'hidden' 
      }}>
        {/* Header/Banner */}
        <div style={{ 
          height: '10rem', 
          background: 'linear-gradient(135deg, #020817, #1e293b)', 
          position: 'relative' 
        }}>
          <div style={{ 
            position: 'absolute', 
            bottom: '-4rem', 
            left: '3rem', 
            width: '8rem', 
            height: '8rem', 
            borderRadius: '2.25rem', 
            background: 'linear-gradient(135deg, #eff6ff, #dbeafe)', 
            border: '6px solid white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '3rem',
            fontWeight: 900,
            color: '#2563eb',
            boxShadow: '0 12px 24px rgba(0,0,0,0.1)'
          }}>
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '6rem 3rem 3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem' }}>
            <div>
              <h1 style={{ fontSize: '2.25rem', fontWeight: 900, color: '#020817', letterSpacing: '-0.03em' }}>{user?.name}</h1>
              <p style={{ color: '#94a3b8', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                <Mail size={16} /> {user?.email}
              </p>
            </div>
            <span style={{ 
              padding: '0.5rem 1rem', 
              background: role === 'admin' ? '#020817' : '#f4f7fb', 
              color: role === 'admin' ? 'white' : '#334155', 
              borderRadius: '0.75rem', 
              fontSize: '0.75rem', 
              fontWeight: 800, 
              textTransform: 'uppercase', 
              letterSpacing: '0.05em',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <Shield size={14} /> {role === 'admin' ? 'System Admin' : 'Medical Professional'}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem' }}>
            {/* Account Details */}
            <div style={{ background: '#f8fafc', padding: '2rem', borderRadius: '1.75rem', border: '1px solid #e2eaf5' }}>
              <h3 style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <User size={14} /> Profile Information
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', marginBottom: '0.25rem' }}>Full Name</p>
                  <p style={{ fontWeight: 700, color: '#020817' }}>{user?.name}</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', marginBottom: '0.25rem' }}>Email Address</p>
                  <p style={{ fontWeight: 700, color: '#020817' }}>{user?.email}</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', marginBottom: '0.25rem' }}>Security Role</p>
                  <p style={{ fontWeight: 700, color: '#020817', textTransform: 'capitalize' }}>{role}</p>
                </div>
              </div>
            </div>

            {/* Account Status / Metadata */}
            <div style={{ background: '#f8fafc', padding: '2rem', borderRadius: '1.75rem', border: '1px solid #e2eaf5' }}>
              <h3 style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calendar size={14} /> System Activity
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', marginBottom: '0.25rem' }}>Account Created</p>
                  <p style={{ fontWeight: 700, color: '#020817' }}>{formatDate(user?.createdAt)}</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', marginBottom: '0.25rem' }}>Total Clinical Cases</p>
                  <p style={{ fontWeight: 700, color: '#2563eb' }}>{patientCount} Records Managed</p>
                </div>
                <div 
                  onClick={() => navigate('/dashboard')}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: '#2563eb', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', marginTop: '0.5rem' }}
                >
                  <Edit3 size={14} /> View Registry Dashboard
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
