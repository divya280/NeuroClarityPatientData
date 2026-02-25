import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FileText, Download, Clock, CheckCircle, AlertCircle, Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../api.config';

const getStatusStyle = (status) => {
  switch(status) {
    case 'Completed': return { background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0' };
    case 'In progress': return { background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' };
    default: return { background: '#f8fafc', color: '#64748b', border: '1px solid #e2e8f0' };
  }
};

const getStatusIcon = (status) => {
  switch(status) {
    case 'Completed': return <CheckCircle size={13} />;
    case 'In progress': return <Clock size={13} />;
    default: return <AlertCircle size={13} />;
  }
};

const UserDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { getToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { fetchPatients(); }, []);

  const fetchPatients = async () => {
    try {
      const token = await getToken();
      const res = await axios.get(`${API_BASE_URL}/api/patients`, { headers: { Authorization: `Bearer ${token}` } });
      setPatients(res.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record? This will also remove all associated files.')) return;
    try {
      const token = await getToken();
      await axios.delete(`${API_BASE_URL}/api/patients/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchPatients();
    } catch (err) {
      alert('Failed to delete record: ' + (err.response?.data?.error || err.message));
    }
  };

  const filtered = patients.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.scanType.toLowerCase().includes(search.toLowerCase()));

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '1rem' }}>
      <div style={{ width: '3rem', height: '3rem', border: '4px solid #e2eaf5', borderTopColor: '#2563eb', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <p style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Syncing Records…</p>
    </div>
  );

  const statCards = [
    { label: 'Total Records', val: patients.length, color: '#2563eb' },
    { label: 'Pending', val: patients.filter(p => p.status === 'To do').length, color: '#94a3b8' },
    { label: 'In Analysis', val: patients.filter(p => p.status === 'In progress').length, color: '#6366f1' },
    { label: 'Completed', val: patients.filter(p => p.status === 'Completed').length, color: '#10b981' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <p style={{ fontSize: '0.65rem', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '0.5rem' }}>Patient Analytics</p>
          <h1 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 900, color: '#020817', letterSpacing: '-0.02em' }}>Clinical Overview</h1>
          <p style={{ color: '#94a3b8', fontWeight: 500, marginTop: '0.25rem' }}>Manage and track neuro-radiological records</p>
        </div>
        <Link to="/patient-form" className="btn-primary">
          <Plus size={18} /> Add New Patient data
        </Link>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem' }}>
        {statCards.map((s, i) => (
          <div key={i} style={{ background: 'white', padding: '1.5rem', borderRadius: '1.5rem', border: '1px solid #e2eaf5', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.375rem' }}>{s.label}</p>
              <p style={{ fontSize: '2.25rem', fontWeight: 900, color: '#020817', letterSpacing: '-0.03em', lineHeight: 1 }}>{s.val}</p>
            </div>
            <div style={{ padding: '0.875rem', borderRadius: '1rem', background: '#f4f7fb' }}>
              <FileText size={22} color={s.color} />
            </div>
          </div>
        ))}
      </div>

      {/* Table Card */}
      <div style={{ background: 'white', borderRadius: '2rem', border: '1px solid #e2eaf5', boxShadow: '0 2px 16px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f4f7fb', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input type="text" placeholder="Search patients..." style={{ paddingLeft: '2.5rem', paddingRight: '1rem', paddingTop: '0.625rem', paddingBottom: '0.625rem', background: '#f4f7fb', border: 'none', borderRadius: '0.875rem', fontSize: '0.875rem', outline: 'none', width: '20rem' }}
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div style={{ padding: '5rem', textAlign: 'center' }}>
            <div style={{ width: '5rem', height: '5rem', background: '#f4f7fb', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', color: '#cbd5e1' }}><FileText size={36} /></div>
            <h3 style={{ fontWeight: 800, color: '#020817', marginBottom: '0.5rem' }}>No records found</h3>
            <p style={{ color: '#94a3b8' }}>Click "Add New Patient data" to get started.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  {['S.No', 'Name', 'Age', 'Scan', 'Status', 'Report', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '0.875rem 1.5rem', textAlign: 'left', fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => {
                  const st = getStatusStyle(p.status);
                  return (
                    <tr key={p.id} style={{ borderTop: '1px solid #f4f7fb' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ padding: '1rem 1.5rem', color: '#64748b', fontSize: '0.875rem', fontWeight: 600 }}>{i + 1}</td>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{ width: '2.25rem', height: '2.25rem', borderRadius: '0.75rem', background: 'linear-gradient(135deg, #eff6ff, #dbeafe)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#2563eb', fontSize: '0.9rem' }}>
                            {p.name?.[0]}
                          </div>
                          <div>
                            <p style={{ fontWeight: 700, color: '#020817', fontSize: '0.9rem' }}>{p.name}</p>
                            <p style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.1rem', fontFamily: 'monospace' }}>#{p.id.slice(-8)}</p>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '1rem 1.5rem', color: '#64748b', fontSize: '0.875rem', fontWeight: 600 }}>{p.age}y</td>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <span style={{ padding: '0.3rem 0.75rem', background: '#f4f7fb', border: '1px solid #e2eaf5', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{p.scanType}</span>
                      </td>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', padding: '0.3rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700, ...st }}>
                          {getStatusIcon(p.status)} {p.status}
                        </span>
                      </td>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        {p.status === 'Completed' && p.pdfReportUrl ? (
                          <a href={p.pdfReportUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', color: '#2563eb', fontWeight: 700, fontSize: '0.8125rem', textDecoration: 'none' }}>
                            <Download size={15} /> Download
                          </a>
                        ) : (
                          <span style={{ color: '#cbd5e1', fontSize: '0.75rem', fontStyle: 'italic' }}>Pending</span>
                        )}
                      </td>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <div style={{ display: 'flex', gap: '0.625rem' }}>
                          <button 
                            onClick={() => navigate('/patient-form', { state: { editMode: true, patient: p } })}
                            style={{ 
                              background: '#f8fafc', 
                              border: '1px solid #e2eaf5', 
                              borderRadius: '0.625rem',
                              cursor: 'pointer', 
                              color: '#6366f1', 
                              padding: '0.5rem',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.15s'
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = '#eff6ff'}
                            onMouseLeave={e => e.currentTarget.style.background = '#f8fafc'}
                            title="Edit Record"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button 
                            onClick={() => handleDelete(p.id)}
                            style={{ 
                              background: '#f8fafc', 
                              border: '1px solid #fee2e2', 
                              borderRadius: '0.625rem',
                              cursor: 'pointer', 
                              color: '#ef4444', 
                              padding: '0.5rem',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.15s'
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
                            onMouseLeave={e => e.currentTarget.style.background = '#f8fafc'}
                            title="Delete Record"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default UserDashboard;
