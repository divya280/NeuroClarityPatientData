import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  UserPlus,
  ShieldAlert,
  LogOut,
  Activity,
  ChevronRight,
  X
} from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { role, logout, user } = useAuth();
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['admin', 'endUser'] },
    { name: 'New Patient', path: '/patient-form', icon: UserPlus, roles: ['endUser'] },
    { name: 'Admin Panel', path: '/admin', icon: ShieldAlert, roles: ['admin'] },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(2,8,23,0.3)', backdropFilter: 'blur(4px)', zIndex: 40 }}
          className="lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          width: '17rem',
          background: 'white',
          borderRight: '1px solid #e2eaf5',
          zIndex: 50,
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease',
          display: 'flex',
          flexDirection: 'column',
          padding: '1.5rem',
        }}
        className="lg:static lg:translate-x-0 lg:transform-none"
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem', padding: '0 0.5rem' }}>
          <div style={{ background: 'rgba(37,99,235,0.1)', padding: '0.5rem', borderRadius: '0.75rem' }}>
            <Activity size={26} color="#2563eb" />
          </div>
          <span style={{ fontSize: '1.375rem', fontWeight: 900, color: '#020817', letterSpacing: '-0.02em' }}>NeuroClarity</span>
          <button onClick={toggleSidebar} style={{ marginLeft: 'auto', color: '#94a3b8' }} className="lg:hidden">
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
          {navItems.filter(item => item.roles.includes(role)).map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.875rem',
                  textDecoration: 'none',
                  fontWeight: 700,
                  fontSize: '0.9375rem',
                  transition: 'all 0.15s ease',
                  background: isActive ? '#2563eb' : 'transparent',
                  color: isActive ? 'white' : '#64748b',
                  boxShadow: isActive ? '0 4px 12px rgba(37,99,235,0.3)' : 'none',
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = '#f4f7fb'; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Icon size={20} />
                  <span>{item.name}</span>
                </div>
                {isActive && <ChevronRight size={16} />}
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div style={{ borderTop: '1px solid #e2eaf5', paddingTop: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0 0.5rem', marginBottom: '1rem' }}>
            <div style={{
              width: '2.5rem', height: '2.5rem', borderRadius: '0.75rem',
              background: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 900, color: '#2563eb', fontSize: '1.1rem', border: '2px solid white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            }}>
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#020817', lineHeight: 1.2 }}>{user?.name}</p>
              <p style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'capitalize', letterSpacing: '0.05em', marginTop: '0.2rem' }}>{role}</p>
            </div>
          </div>
          <button
            onClick={logout}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.75rem 1rem', color: '#ef4444', background: 'transparent',
              border: 'none', borderRadius: '0.875rem', cursor: 'pointer',
              fontWeight: 700, fontSize: '0.9375rem', transition: 'background 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
