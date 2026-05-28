import React from 'react';

export default function Footer() {
  return (
    <footer style={{ 
      backgroundColor: 'var(--color-canvas)', 
      color: 'var(--color-muted)', 
      padding: '96px 0 64px 0', 
      marginTop: 'auto',
      borderTop: '1px solid var(--color-hairline)',
      transition: 'background-color 0.3s, color 0.3s, border-color 0.3s'
    }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '48px', marginBottom: '96px' }}>
          
          {/* Brand Column */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-ink)', marginBottom: '24px' }}>
              <span style={{ fontSize: '24px', fontWeight: 'bold', fontFamily: 'var(--font-sans)', letterSpacing: '-1px' }}>S.U.T.R.A.</span>
            </div>
            <p className="body-md" style={{ color: 'var(--color-ink)', maxWidth: '300px' }}>
              Secure Unjammable Tactical Resilient Array. Advanced SwarmRaft simulator pushing consensus safety to the frontier.
            </p>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="title-sm" style={{ color: 'var(--color-ink)', marginBottom: '16px' }}>Technology</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <li><a href="#" className="nav-text text-link">SwarmRaft</a></li>
              <li><a href="#" className="nav-text text-link">Rûm MANET</a></li>
              <li><a href="#" className="nav-text text-link">PoPW Smart Contracts</a></li>
              <li><a href="#" className="nav-text text-link">Cryptography</a></li>
            </ul>
          </div>

          <div>
            <h4 className="title-sm" style={{ color: 'var(--color-ink)', marginBottom: '16px' }}>Developers</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <li><a href="#" className="nav-text text-link">Documentation</a></li>
              <li><a href="#" className="nav-text text-link">API Reference</a></li>
              <li><a href="#" className="nav-text text-link">GitHub</a></li>
            </ul>
          </div>

          <div>
            <h4 className="title-sm" style={{ color: 'var(--color-ink)', marginBottom: '16px' }}>Research</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <li><a href="/sutra-whitepaper.pdf" target="_blank" rel="noopener noreferrer" className="nav-text text-link">Whitepaper (PDF)</a></li>
              <li><a href="#" className="nav-text text-link">GNSS Security</a></li>
              <li><a href="#" className="nav-text text-link">Simulations</a></li>
            </ul>
          </div>
          
        </div>
        
        {/* Footer Bottom Bar */}
        <div style={{ 
          borderTop: '1px solid var(--color-hairline)', 
          paddingTop: '32px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          fontFamily: 'var(--font-sans)', 
          fontSize: '14px' 
        }}>
          <span>&copy; {new Date().getFullYear()} S.U.T.R.A. Defense Systems. All rights reserved.</span>
          <div style={{ display: 'flex', gap: '32px' }}>
            <a href="#" className="text-link">Privacy Policy</a>
            <a href="#" className="text-link">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
