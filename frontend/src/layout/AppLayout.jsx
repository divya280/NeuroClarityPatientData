import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { Bell, Search, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AppLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f4f7fb' }}>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>

        {/* Top Header */}
        <header style={{
          height: '5rem',
          background: 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid #e2eaf5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 2rem',
          position: 'sticky',
          top: 0,
          zIndex: 30,
          boxShadow: '0 1px 12px rgba(0,0,0,0.04)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => setIsSidebarOpen(true)}
              style={{ padding: '0.5rem', color: '#64748b', background: 'none', border: 'none', cursor: 'pointer', borderRadius: '0.5rem' }}
              className="lg:hidden"
            >
              <Menu size={24} />
            </button>

            {/* Search bar */}
            <div style={{ position: 'relative', display: 'none' }} className="md:block">
              <Search style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={17} />
              <input
                type="text"
                placeholder="Search patients, reports..."
                style={{
                  paddingLeft: '2.5rem', paddingRight: '1rem', paddingTop: '0.625rem', paddingBottom: '0.625rem',
                  background: '#f4f7fb', border: 'none', borderRadius: '0.875rem',
                  width: '22rem', fontSize: '0.875rem', outline: 'none', color: '#334155',
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button style={{
              position: 'relative', padding: '0.625rem', background: '#f4f7fb',
              color: '#64748b', border: 'none', borderRadius: '0.875rem', cursor: 'pointer',
            }}>
              <Bell size={20} />
              <span style={{
                position: 'absolute', top: '0.5rem', right: '0.5rem', width: '0.5rem', height: '0.5rem',
                background: '#2563eb', borderRadius: '50%', border: '2px solid white',
              }} />
            </button>

            <div style={{ height: '2rem', width: '1px', background: '#e2eaf5' }} className="hidden sm:block" />

            <div style={{ textAlign: 'right', display: 'none' }} className="sm:block">
              <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#020817', lineHeight: 1.2 }}>{user?.name}</p>
              <p style={{ fontSize: '0.65rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '0.2rem' }}>Standard Account</p>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ flex: 1, padding: '2.5rem', maxWidth: '1400px', width: '100%', margin: '0 auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
