import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, Activity, ArrowRight, ShieldCheck } from 'lucide-react';

const s = {
  page: {
    minHeight: '92vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'linear-gradient(150deg, #f8fafc 0%, #eff6ff 60%, #eef2ff 100%)',
    padding: '3rem 1.5rem', position: 'relative', overflow: 'hidden',
  },
  orb1: { position: 'absolute', top: '-8rem', right: '-8rem', width: '32rem', height: '32rem', background: 'radial-gradient(circle, rgba(37,99,235,0.1) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' },
  orb2: { position: 'absolute', bottom: '-8rem', left: '-8rem', width: '28rem', height: '28rem', background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' },
  card: {
    width: '100%', maxWidth: '26rem',
    background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(24px)',
    border: '1px solid rgba(255,255,255,0.4)',
    borderRadius: '2rem', padding: '3rem',
    boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
    position: 'relative', zIndex: 1,
  },
  icon: { background: 'rgba(37,99,235,0.08)', padding: '1rem', borderRadius: '1rem', display: 'inline-flex', marginBottom: '1.5rem' },
  h2: { fontSize: '2rem', fontWeight: 900, color: '#020817', letterSpacing: '-0.03em', marginBottom: '0.5rem' },
  sub: { color: '#94a3b8', fontWeight: 500, marginBottom: '2rem', fontSize: '0.9375rem' },
  label: { display: 'block', fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.5rem' },
  inputWrap: { position: 'relative', marginBottom: '1.25rem' },
  iconInInput: { position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' },
  badge: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#94a3b8', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '2rem' },
  divider: { borderTop: '1px solid #e2eaf5', padding: '1.5rem 0 0', marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: '#64748b' },
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.search.includes('signup=success')) {
      setSuccess('Registration complete! Please log in.');
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch {
      setError('Authentication failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.orb1} /><div style={s.orb2} />
      <div style={s.card}>
        <div style={{ textAlign: 'center' }}>
          <div style={s.icon}><Activity size={34} color="#2563eb" /></div>
          <h2 style={s.h2}>Welcome Back</h2>
          <p style={s.sub}>Enter your medical credentials to continue</p>
        </div>

        {error && <div style={{ padding: '0.875rem 1rem', background: '#fef2f2', border: '1px solid #fecaca', borderLeft: '4px solid #ef4444', color: '#b91c1c', borderRadius: '0.75rem', marginBottom: '1.5rem', fontSize: '0.875rem', fontWeight: 600 }}>{error}</div>}
        {success && <div style={{ padding: '0.875rem 1rem', background: '#f0fdf4', border: '1px solid #bbf7d0', borderLeft: '4px solid #10b981', color: '#065f46', borderRadius: '0.75rem', marginBottom: '1.5rem', fontSize: '0.875rem', fontWeight: 600 }}>{success}</div>}

        <form onSubmit={handleSubmit}>
          <div>
            <label style={s.label}>Email / Medical ID</label>
            <div style={s.inputWrap}>
              <Mail style={s.iconInInput} size={18} />
              <input type="email" placeholder="name@hospital.com" required className="input-field" style={{ paddingLeft: '2.875rem' }} value={email} onChange={e => setEmail(e.target.value)} />
            </div>
          </div>
          <div>
            <label style={s.label}>Password</label>
            <div style={s.inputWrap}>
              <Lock style={s.iconInInput} size={18} />
              <input type="password" placeholder="••••••••" required className="input-field" style={{ paddingLeft: '2.875rem' }} value={password} onChange={e => setPassword(e.target.value)} />
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', marginTop: '0.75rem', padding: '1rem', borderRadius: '1rem', fontSize: '1rem', justifyContent: 'center' }}>
            {loading ? 'Authenticating...' : <><span>Sign In</span><ArrowRight size={18} /></>}
          </button>
        </form>

        <div style={s.divider}>
          New here? <Link to="/signup" style={{ color: '#2563eb', fontWeight: 700, textDecoration: 'none' }}>Create an account</Link>
        </div>
        <div style={s.badge}><ShieldCheck size={14} /> FIPS-140-2 Encrypted Session</div>
      </div>
    </div>
  );
};

export default Login;
