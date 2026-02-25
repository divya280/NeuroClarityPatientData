import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 2rem', height: '4.25rem',
      background: 'rgba(255,255,255,0.9)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid #e2eaf5',
      boxShadow: '0 1px 12px rgba(0,0,0,0.04)',
    }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none' }}>
        <div style={{ background: 'rgba(37,99,235,0.1)', padding: '0.4rem', borderRadius: '0.625rem' }}>
          <Activity size={22} color="#2563eb" />
        </div>
        <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#020817', letterSpacing: '-0.02em' }}>NeuroClarity</span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {user ? (
          <>
            <Link to="/dashboard" className="btn-secondary" style={{ padding: '0.5rem 1.25rem', borderRadius: '0.75rem', fontSize: '0.875rem' }}>Dashboard</Link>
            <button onClick={logout} className="btn-primary" style={{ padding: '0.5rem 1.25rem', borderRadius: '0.75rem', fontSize: '0.875rem' }}>Sign Out</button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn-secondary" style={{ padding: '0.5rem 1.25rem', borderRadius: '0.75rem', fontSize: '0.875rem' }}>Login</Link>
            <Link to="/signup" className="btn-primary" style={{ padding: '0.5rem 1.25rem', borderRadius: '0.75rem', fontSize: '0.875rem' }}>Sign Up <ArrowRight size={14} /></Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
