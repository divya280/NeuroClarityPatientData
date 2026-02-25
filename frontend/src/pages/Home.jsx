import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Shield, Database, UploadCloud, ArrowRight, Zap, CheckCircle, Linkedin } from 'lucide-react';

const Home = () => {
  const styles = {
    page: { background: 'white', minHeight: '100vh', fontFamily: "'Inter', system-ui, sans-serif" },

    hero: {
      background: 'linear-gradient(150deg, #f8fafc 0%, #eff6ff 60%, #eef2ff 100%)',
      padding: '8rem 1.5rem 6rem',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
    },
    badge: {
      display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
      padding: '0.5rem 1rem', borderRadius: '9999px',
      background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.15)',
      color: '#2563eb', fontSize: '0.8125rem', fontWeight: 700, marginBottom: '2rem',
    },
    h1: {
      fontSize: 'clamp(2.75rem, 6vw, 5rem)', fontWeight: 900,
      color: '#020817', lineHeight: 1.06, letterSpacing: '-0.03em',
      marginBottom: '1.5rem',
    },
    accent: { color: '#2563eb' },
    subtitle: {
      fontSize: 'clamp(1.063rem, 2vw, 1.25rem)', color: '#64748b',
      maxWidth: '40rem', margin: '0 auto 3rem', lineHeight: 1.6, fontWeight: 500,
    },
    ctaRow: { display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' },

    section: { padding: '6rem 1.5rem', maxWidth: '80rem', margin: '0 auto' },
    sectionTitle: {
      fontSize: 'clamp(1.875rem, 3.5vw, 2.75rem)', fontWeight: 900,
      color: '#020817', textAlign: 'center', marginBottom: '1rem', letterSpacing: '-0.02em',
    },
    sectionSub: {
      textAlign: 'center', color: '#94a3b8', fontWeight: 700, fontSize: '0.75rem',
      textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '4rem',
    },
    grid3: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' },
    card: {
      padding: '2.5rem', borderRadius: '2rem',
      background: '#f8fafc', border: '1px solid #e2eaf5',
      transition: 'all 0.25s ease',
    },
    iconBox: {
      width: '3.5rem', height: '3.5rem', borderRadius: '1rem',
      background: 'white', boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      marginBottom: '1.5rem',
    },
    cardTitle: { fontSize: '1.25rem', fontWeight: 800, color: '#020817', marginBottom: '0.75rem' },
    cardDesc: { color: '#64748b', lineHeight: 1.7, fontWeight: 500 },

    darkBand: {
      background: '#020817', padding: '5rem 1.5rem',
      position: 'relative', overflow: 'hidden',
    },
    darkInner: { maxWidth: '80rem', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '3rem', alignItems: 'center', textAlign: 'center' },
    darkTitle: { fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 900, color: 'white', letterSpacing: '-0.02em' },
    darkSub: { color: '#94a3b8', fontWeight: 600, marginTop: '0.5rem' },
    statsRow: { display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' },
    stat: {
      padding: '1.5rem 2.5rem', background: 'rgba(255,255,255,0.05)',
      borderRadius: '1.25rem', border: '1px solid rgba(255,255,255,0.08)',
      backdropFilter: 'blur(8px)',
    },
    statVal: { fontSize: '2rem', fontWeight: 900, color: '#2563eb', textTransform: 'uppercase' },
    statLabel: { fontSize: '0.65rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: '0.25rem' },

    cta: { padding: '8rem 1.5rem', textAlign: 'center' },
    ctaH2: { fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 900, letterSpacing: '-0.03em', color: '#020817', marginBottom: '2.5rem' },
    trust: { marginTop: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em' },
  };

  return (
    <div style={styles.page}>
      {/* Hero */}
      <section style={styles.hero}>
        {/* Orbs */}
        <div style={{ position: 'absolute', top: '-10rem', right: '-10rem', width: '40rem', height: '40rem', background: 'radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-8rem', left: '-8rem', width: '32rem', height: '32rem', background: 'radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '64rem', margin: '0 auto' }}>
          <div style={styles.badge}><Zap size={14} /> v2.0 Now Live — Advanced Radiological Analysis</div>
          <h1 style={styles.h1}>
            Radiology. <span style={styles.accent}>Organized.</span><br />
            Intelligence Simplified.
          </h1>
          <p style={styles.subtitle}>
            A state-of-the-art clinical platform for managing neuro-radiological scans with surgical precision and cloud-scale security.
          </p>
          <div style={styles.ctaRow}>
            <Link to="/signup" className="btn-primary" style={{ fontSize: '1.0625rem', padding: '1rem 2rem', borderRadius: '1.25rem' }}>
              Start Free Registration <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn-secondary" style={{ fontSize: '1.0625rem', padding: '1rem 2rem', borderRadius: '1.25rem' }}>
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Clinical Power. Cloud Efficiency.</h2>
        <p style={styles.sectionSub}>Engineered for Neurosurgery</p>
        <div style={styles.grid3}>
          {[
            { title: 'Data Sovereignty', desc: 'End-to-end encrypted Firestore infrastructure with HIPAA-grade compliance standards.', icon: <Shield size={28} color="#2563eb" />, },
            { title: 'Massive Scan Support', desc: 'Optimized handlers for high-resolution DICOM ZIP files up to 1GB per patient.', icon: <UploadCloud size={28} color="#6366f1" />, },
            { title: 'Unified Records', desc: 'Centralized patient management with real-time status tracking and report generation.', icon: <Database size={28} color="#10b981" />, },
          ].map((f, i) => (
            <div key={i} style={styles.card}
              onMouseEnter={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.07)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}>
              <div style={styles.iconBox}>{f.icon}</div>
              <h3 style={styles.cardTitle}>{f.title}</h3>
              <p style={styles.cardDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Dark Stats Band */}
      <section style={styles.darkBand}>
        <div style={styles.darkInner}>
          <div>
            <h4 style={styles.darkTitle}>The Professional Choice.</h4>
            <p style={styles.darkSub}>Trusted by 45+ neurology departments nationwide.</p>
          </div>
          <div style={styles.statsRow}>
            {[{ val: '99.9%', label: 'Uptime' }, { val: '12k+', label: 'Scans/Mo' }, { val: '<50ms', label: 'Latency' }].map((s, i) => (
              <div key={i} style={styles.stat}>
                <p style={styles.statVal}>{s.val}</p>
                <p style={styles.statLabel}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section style={styles.cta}>
        <h2 style={styles.ctaH2}>Ready to streamline<br />your workflow?</h2>
        <Link to="/signup" className="btn-primary" style={{ fontSize: '1.125rem', padding: '1.125rem 3rem', borderRadius: '1.5rem' }}>
          Get Access Now
        </Link>
        <div style={styles.trust}>
          <CheckCircle size={14} /> HIPAA Compliant Infrastructure
        </div>
      </section>

      {/* Footer */}
      <footer style={{ 
        padding: '4rem 1.5rem', 
        borderTop: '1px solid #e2eaf5', 
        textAlign: 'center',
        background: '#f8fafc'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <Activity size={20} color="#2563eb" />
          <span style={{ fontSize: '1.125rem', fontWeight: 900, color: '#020817', letterSpacing: '-0.02em' }}>NeuroClarity</span>
        </div>
        <p style={{ color: '#94a3b8', fontSize: '0.875rem', fontWeight: 500, marginBottom: '1rem' }}>
          &copy; 2026 NeuroClarity Clinical Platform. All rights reserved.
        </p>
        <a 
          href="https://www.linkedin.com/in/divyashree-v-1245a71b8/" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ 
            fontSize: '0.875rem', 
            color: '#64748b', 
            textDecoration: 'none', 
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#2563eb'}
          onMouseLeave={e => e.currentTarget.style.color = '#64748b'}
        >
          <Linkedin size={16} />
          Developed by Divyashree V
        </a>
      </footer>
    </div>
  );
};

export default Home;
