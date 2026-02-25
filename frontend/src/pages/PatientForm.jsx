import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Clipboard, Upload, Check, ArrowLeft, Stethoscope, ChevronRight, ShieldCheck } from 'lucide-react';

const PatientForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editMode = location.state?.editMode || false;
  const existingPatient = location.state?.patient;

  const [formData, setFormData] = useState({ 
    name: existingPatient?.name || '', 
    age: existingPatient?.age || '', 
    sex: existingPatient?.sex || 'Male', 
    complaints: existingPatient?.complaints || '', 
    scanType: existingPatient?.scanType || 'MRI' 
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const { getToken } = useAuth();

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFile = e => {
    const f = e.target.files[0];
    if (f && !f.name.endsWith('.zip')) { setError('Only ZIP files are supported.'); return; }
    setFile(f); setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editMode && !file) { setError('Clinical scan data (ZIP) is required.'); return; }
    setLoading(true); setError('');
    try {
      const token = await getToken();
      
      let patientId = existingPatient?.id;
      if (editMode) {
        // Update Metadata
        await axios.put(`http://localhost:3000/api/patients/${patientId}`, formData, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        // Create Record
        const res = await axios.post('http://localhost:3000/api/patients', formData, { headers: { Authorization: `Bearer ${token}` } });
        patientId = res.data.id;
      }

      // If a new file is provided, upload it
      if (file) {
        const fd = new FormData();
        fd.append('patientId', patientId); 
        fd.append('file', file);
        await axios.post('http://localhost:3000/api/patients/upload-zip', fd, { headers: { Authorization: `Bearer ${token}` } });
      }

      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 2200);
    } catch (err) {
      setError(err.response?.data?.error || 'Submission failed. Please try again.');
    } finally { setLoading(false); }
  };

  if (success) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center' }}>
      <div style={{ width: '6rem', height: '6rem', background: '#f0fdf4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem', boxShadow: '0 8px 32px rgba(16,185,129,0.15)' }}>
        <Check size={48} color="#10b981" strokeWidth={3} />
      </div>
      <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#020817', letterSpacing: '-0.03em', marginBottom: '0.75rem' }}>{editMode ? 'Record Updated' : 'Record Submitted'}</h2>
      <p style={{ color: '#94a3b8', fontWeight: 600 }}>Redirecting to your dashboard…</p>
    </div>
  );

  const inputGroupStyle = { marginBottom: '1.5rem' };
  const labelStyle = { display: 'block', fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.5rem' };

  return (
    <div style={{ maxWidth: '56rem', margin: '0 auto' }}>
      {/* Back */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <button onClick={() => navigate('/dashboard')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
          <ArrowLeft size={16} /> Return to Registry
        </button>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '0.375rem 0.875rem', borderRadius: '0.5rem', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase' }}>
          <ShieldCheck size={14} /> Secure Entry
        </div>
      </div>

      {/* Main Card */}
      <div style={{ background: 'white', borderRadius: '2.5rem', border: '1px solid #e2eaf5', boxShadow: '0 8px 48px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        {/* Dark Header */}
        <div style={{ background: '#020817', padding: '2.5rem 3rem', position: 'relative', overflow: 'hidden' }}>
          <Stethoscope size={140} style={{ position: 'absolute', bottom: '-2rem', right: '-2rem', color: 'rgba(255,255,255,0.04)', transform: 'rotate(15deg)', pointerEvents: 'none' }} />
          <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'white', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>{editMode ? 'Edit Patient Record' : 'New Case Submission'}</h2>
          <p style={{ color: '#64748b', fontWeight: 500 }}>Update or provide accurate metadata for proper radiological identification</p>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '3rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
          {/* Left - Metadata */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem', paddingBottom: '1rem', borderBottom: '1px solid #e2eaf5' }}>
              <div style={{ background: '#eff6ff', padding: '0.625rem', borderRadius: '0.75rem' }}><User size={18} color="#2563eb" /></div>
              <h3 style={{ fontSize: '0.75rem', fontWeight: 900, color: '#020817', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Patient Metadata</h3>
            </div>

            <div style={inputGroupStyle}><label style={labelStyle}>Patient Full Name</label><input name="name" required placeholder="Enter full name" className="input-field" value={formData.name} onChange={handleChange} /></div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div><label style={labelStyle}>Age</label><input name="age" type="number" required placeholder="YY" className="input-field" value={formData.age} onChange={handleChange} /></div>
              <div><label style={labelStyle}>Biological Sex</label>
                <select name="sex" className="input-field" style={{ appearance: 'none', cursor: 'pointer' }} value={formData.sex} onChange={handleChange}>
                  <option>Male</option><option>Female</option><option>Other</option>
                </select>
              </div>
            </div>

            <div style={inputGroupStyle}>
              <label style={labelStyle}>Analysis Protocol (Scan Type)</label>
              <select 
                name="scanType" 
                className="input-field" 
                style={{ appearance: 'none', cursor: 'pointer' }} 
                value={formData.scanType} 
                onChange={handleChange}
              >
                <option value="MRI">MRI</option>
                <option value="PET">PET</option>
                <option value="CT">CT</option>
              </select>
            </div>
          </div>

          {/* Right - Analysis Params */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem', paddingBottom: '1rem', borderBottom: '1px solid #e2eaf5' }}>
              <div style={{ background: '#eff6ff', padding: '0.625rem', borderRadius: '0.75rem' }}><Clipboard size={18} color="#2563eb" /></div>
              <h3 style={{ fontSize: '0.75rem', fontWeight: 900, color: '#020817', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Case Parameters</h3>
            </div>

            <div style={inputGroupStyle}>
              <label style={labelStyle}>Clinical Manifestations</label>
              <textarea name="complaints" required rows={4} placeholder="Describe neurological presentations..." className="input-field" style={{ resize: 'none', height: '7rem' }} value={formData.complaints} onChange={handleChange} />
            </div>

            <div style={inputGroupStyle}>
              <label style={labelStyle}>Radiological Data Packet (ZIP) {editMode && '(Optional)'}</label>
              <div style={{
                position: 'relative', border: `3px dashed ${file ? '#10b981' : '#e2eaf5'}`,
                borderRadius: '1.25rem', padding: '2.25rem', textAlign: 'center',
                background: file ? '#f0fdf4' : '#f8fafc', transition: 'all 0.2s',
                cursor: 'pointer',
              }}>
                <input type="file" accept=".zip" onChange={handleFile} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', zIndex: 2 }} />
                <div style={{ padding: '0.875rem', background: 'white', borderRadius: '1rem', display: 'inline-flex', marginBottom: '0.75rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', color: file ? '#10b981' : '#94a3b8' }}>
                  <Upload size={28} />
                </div>
                <p style={{ fontWeight: 800, color: file ? '#065f46' : '#334155', fontSize: '0.9375rem' }}>{file ? file.name : (editMode ? 'Click to replace existing ZIP' : 'Drop ZIP file here or click to browse')}</p>
                <p style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.375rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Max 1.0GB · DICOM Format</p>
              </div>
            </div>
          </div>

          {/* Full-width Submit */}
          <div style={{ gridColumn: '1 / -1' }}>
            {error && <div style={{ padding: '0.875rem 1rem', background: '#fef2f2', borderLeft: '4px solid #ef4444', color: '#b91c1c', borderRadius: '0.75rem', marginBottom: '1.5rem', fontWeight: 600, fontSize: '0.875rem' }}>{error}</div>}
            <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', padding: '1.125rem', borderRadius: '1.25rem', fontSize: '1.0625rem', justifyContent: 'center', boxShadow: '0 8px 32px rgba(37,99,235,0.25)' }}>
              {loading
                ? <><div style={{ width: '1.25rem', height: '1.25rem', border: '3px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /><span>{editMode ? 'Updating…' : 'Submitting…'}</span></>
                : <><span>{editMode ? 'Update Clinical Record' : 'Submit Clinical Record'}</span><ChevronRight size={22} /></>
              }
            </button>
          </div>
        </form>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default PatientForm;
