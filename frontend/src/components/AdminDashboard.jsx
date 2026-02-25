import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Upload, Download, CheckCircle, ExternalLink, ShieldCheck, Activity, Users, Search, ClipboardList } from 'lucide-react';

const AdminDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const { getToken } = useAuth();

  useEffect(() => { fetchPatients(); }, []);

  const fetchPatients = async () => {
    try {
      const token = await getToken();
      const res = await axios.get('http://localhost:3000/api/patients', { headers: { Authorization: `Bearer ${token}` } });
      setPatients(res.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const updateStatus = async (id, status) => {
    setUpdatingId(id);
    try {
      const token = await getToken();
      await axios.patch(`http://localhost:3000/api/patients/${id}/status`, { status }, { headers: { Authorization: `Bearer ${token}` } });
      fetchPatients();
    } catch { alert('Status update failed.'); }
    finally { setUpdatingId(null); }
  };

  const uploadPdf = async (id, file) => {
    if (!file) return;
    setUpdatingId(id);
    const fd = new FormData();
    fd.append('file', file);
    try {
      const token = await getToken();
      await axios.post(`http://localhost:3000/api/patients/${id}/upload-pdf`, fd, { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } });
      fetchPatients();
    } catch { alert('PDF upload failed.'); }
    finally { setUpdatingId(null); }
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ width: '3rem', height: '3rem', border: '4px solid #e2eaf5', borderTopColor: '#2563eb', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  const filtered = patients.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.scanType.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>

      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#2563eb', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '0.5rem' }}>
            <ShieldCheck size={13} /> System Administrator
          </div>
          <h1 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 900, color: '#020817', letterSpacing: '-0.02em' }}>Master Control</h1>
          <p style={{ color: '#94a3b8', fontWeight: 500, marginTop: '0.25rem' }}>Review all radiological cases and assign status</p>
        </div>
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }} />
          <input type="text" placeholder="Search..." style={{ paddingLeft: '2.5rem', paddingRight: '1rem', paddingTop: '0.625rem', paddingBottom: '0.625rem', background: 'white', border: '1px solid #e2eaf5', borderRadius: '0.875rem', fontSize: '0.875rem', outline: 'none', width: '20rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
        {[
          { label: 'Incoming Queue', val: patients.filter(p => p.status === 'To do').length, icon: <ClipboardList size={22} />, color: '#2563eb' },
          { label: 'Active Analysis', val: patients.filter(p => p.status === 'In progress').length, icon: <Activity size={22} />, color: '#6366f1' },
          { label: 'Reports Finalized', val: patients.filter(p => p.status === 'Completed').length, icon: <CheckCircle size={22} />, color: '#10b981' },
        ].map((s, i) => (
          <div key={i} style={{ background: 'linear-gradient(135deg, #f8fafc, #eff6ff)', border: '1px solid #e2eaf5', padding: '2rem', borderRadius: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>{s.label}</p>
              <p style={{ fontSize: '2.5rem', fontWeight: 900, color: '#020817', letterSpacing: '-0.03em', lineHeight: 1 }}>{s.val}</p>
            </div>
            <div style={{ padding: '1rem', background: 'white', borderRadius: '1.25rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', color: s.color }}>{s.icon}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: 'white', borderRadius: '2rem', border: '1px solid #e2eaf5', boxShadow: '0 2px 16px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {['Patient / Case', 'Scan & Metadata', 'Raw Data', 'Status Control', 'Report Action'].map(h => (
                  <th key={h} style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} style={{ borderTop: '1px solid #f4f7fb', transition: 'background 0.1s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  {/* Patient */}
                  <td style={{ padding: '1.125rem 1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '2.5rem', height: '2.5rem', background: '#020817', color: 'white', borderRadius: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 900, letterSpacing: '0.05em', flexShrink: 0 }}>NC</div>
                      <div>
                        <p style={{ fontWeight: 800, color: '#020817', fontSize: '0.9rem' }}>{p.name}</p>
                        <p style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.1rem', fontFamily: 'monospace' }}>ID:{p.id.slice(-6)}</p>
                      </div>
                    </div>
                  </td>
                  {/* Metadata */}
                  <td style={{ padding: '1.125rem 1.5rem' }}>
                    <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#334155' }}>{p.scanType} Protocol</p>
                    <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.15rem' }}>{p.age}y · {p.sex} · {p.complaints.slice(0,28)}...</p>
                  </td>
                  {/* ZIP */}
                  <td style={{ padding: '1.125rem 1.5rem' }}>
                    {p.zipFileUrl
                      ? <a href={p.zipFileUrl} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', color: '#2563eb', fontWeight: 700, fontSize: '0.8125rem', textDecoration: 'none' }}><Download size={15} /> ZIP File</a>
                      : <span style={{ color: '#f87171', fontSize: '0.75rem', fontStyle: 'italic' }}>Awaiting</span>}
                  </td>
                  {/* Status Control */}
                  <td style={{ padding: '1.125rem 1.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.375rem', background: '#f4f7fb', padding: '0.25rem', borderRadius: '0.875rem', width: 'fit-content' }}>
                      {p.status !== 'Completed' ? (
                        ['To do', 'In progress'].map(st => (
                          <button key={st} disabled={updatingId === p.id} onClick={() => updateStatus(p.id, st)}
                            style={{
                              padding: '0.375rem 0.75rem', borderRadius: '0.625rem', border: 'none', cursor: 'pointer',
                              fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', transition: 'all 0.15s',
                              background: p.status === st ? (st === 'In progress' ? '#2563eb' : '#020817') : 'transparent',
                              color: p.status === st ? 'white' : '#94a3b8',
                            }}>{st === 'In progress' ? 'Analysis' : 'Queue'}</button>
                        ))
                      ) : (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', padding: '0.375rem 0.875rem', background: '#10b981', color: 'white', borderRadius: '0.625rem', fontSize: '0.7rem', fontWeight: 800 }}>
                          <CheckCircle size={12} /> Finalized
                        </div>
                      )}
                    </div>
                  </td>
                  {/* Report */}
                  <td style={{ padding: '1.125rem 1.5rem' }}>
                    {p.status === 'Completed'
                      ? <a href={p.pdfReportUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', color: '#2563eb', fontWeight: 700, fontSize: '0.8125rem', textDecoration: 'none' }}>View Report <ExternalLink size={13} /></a>
                      : (
                        <div style={{ position: 'relative', display: 'inline-block' }}>
                          <input type="file" accept=".pdf" disabled={updatingId === p.id} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', zIndex: 2 }} onChange={e => uploadPdf(p.id, e.target.files[0])} />
                          <button style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', background: '#020817', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.75rem', border: 'none', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>
                            <Upload size={14} /> Upload PDF
                          </button>
                        </div>
                      )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
