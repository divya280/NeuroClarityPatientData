import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, Mail, Lock, ShieldCheck, Activity, ArrowRight, UserCheck, UserPlus } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'endUser' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:3000/api/auth/signup', formData);
      if (res.status === 201) navigate('/login?signup=success');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const s = {
    page: {
      minHeight: '95vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(150deg, #f8fafc 0%, #eff6ff 60%, #eef2ff 100%)',
      padding: '3rem 1.5rem', position: 'relative', overflow: 'hidden',
    },
    card: {
      width: '100%', maxWidth: '36rem',
      background: 'rgba(255,255,255,0.82)', backdropFilter: 'blur(24px)',
      border: '1px solid rgba(255,255,255,0.4)',
      borderRadius: '2rem', padding: '3rem',
      boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
      position: 'relative', zIndex: 1,
    },
    label: { display: 'block', fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.5rem' },
    row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' },
    inputWrap: { position: 'relative' },
    iconInInput: { position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' },
  };

  return (
    <div style={s.page}>
      <div style={{ position: 'absolute', top: '-8rem', right: '-8rem', width: '32rem', height: '32rem', background: 'radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 70%)', borderRadius: '50%' }} />
      <div style={s.card}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ background: 'white', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', padding: '1rem', borderRadius: '1.25rem', display: 'inline-flex', marginBottom: '1.25rem' }}>
            <UserPlus size={36} color="#2563eb" />
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#020817', letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>Medical Registration</h2>
          <p style={{ color: '#94a3b8', fontWeight: 500 }}>Join the future of neurological analytics</p>
        </div>

        {error && <div style={{ padding: '0.875rem 1rem', background: '#fef2f2', borderLeft: '4px solid #ef4444', color: '#b91c1c', borderRadius: '0.75rem', marginBottom: '1.5rem', fontSize: '0.875rem', fontWeight: 600 }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Name + Email row */}
          <div style={s.row}>
            <div>
              <label style={s.label}>Full Name</label>
              <div style={s.inputWrap}>
                <User style={s.iconInInput} size={17} />
                <input type="text" name="name" placeholder="Dr. John Doe" required className="input-field" style={{ paddingLeft: '2.875rem' }} value={formData.name} onChange={handleChange} />
              </div>
            </div>
            <div>
              <label style={s.label}>Email</label>
              <div style={s.inputWrap}>
                <Mail style={s.iconInInput} size={17} />
                <input type="email" name="email" placeholder="john@clinic.com" required className="input-field" style={{ paddingLeft: '2.875rem' }} value={formData.email} onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={s.label}>Password</label>
            <div style={s.inputWrap}>
              <Lock style={s.iconInInput} size={17} />
              <input type="password" name="password" placeholder="Min. 8 characters" required minLength="8" className="input-field" style={{ paddingLeft: '2.875rem' }} value={formData.password} onChange={handleChange} />
            </div>
          </div>

          {/* Role Selector */}
          <div style={{ marginBottom: '1.75rem' }}>
            <label style={s.label}>Select Access Protocol</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.5rem' }}>
              {[
                { id: 'endUser', label: 'Clinician', desc: 'Patient Management', icon: <Activity size={22} /> },
                { id: 'admin', label: 'Administrator', desc: 'Master Control', icon: <ShieldCheck size={22} /> }
              ].map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, role: item.id })}
                  style={{
                    padding: '1.25rem', borderRadius: '1.25rem',
                    border: formData.role === item.id ? '2px solid #2563eb' : '1.5px solid #e2eaf5',
                    background: formData.role === item.id ? 'rgba(37,99,235,0.04)' : 'white',
                    cursor: 'pointer', textAlign: 'left',
                    boxShadow: formData.role === item.id ? '0 0 0 4px rgba(37,99,235,0.08)' : 'none',
                    transition: 'all 0.2s ease', position: 'relative',
                  }}
                >
                  <div style={{ color: formData.role === item.id ? '#2563eb' : '#94a3b8', marginBottom: '0.625rem' }}>{item.icon}</div>
                  <p style={{ fontSize: '0.875rem', fontWeight: 800, color: formData.role === item.id ? '#020817' : '#64748b' }}>{item.label}</p>
                  <p style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.2rem' }}>{item.desc}</p>
                  {formData.role === item.id && (
                    <div style={{ position: 'absolute', top: '0.625rem', right: '0.625rem', color: '#2563eb', background: 'rgba(37,99,235,0.1)', borderRadius: '50%', padding: '0.125rem' }}>
                      <UserCheck size={14} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', padding: '1rem', borderRadius: '1rem', fontSize: '1rem', justifyContent: 'center' }}>
            {loading ? 'Processing...' : <><span>Complete Registration</span><ArrowRight size={18} /></>}
          </button>
        </form>

        <p style={{ marginTop: '1.5rem', textAlign: 'center', color: '#64748b', fontSize: '0.875rem', borderTop: '1px solid #e2eaf5', paddingTop: '1.5rem' }}>
          Already registered? <Link to="/login" style={{ color: '#2563eb', fontWeight: 700, textDecoration: 'none' }}>Log in here</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
