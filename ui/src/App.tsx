import React, { useState, useEffect } from 'react';
import './App.css';

// Mock Data for the Swarm Simulation
const mockSwarmData = [
  { id: 1, state: 'LEADER', lat: 26.1102, lon: 85.3901, status: 'Active', residual: 0.0 },
  { id: 2, state: 'FOLLOWER', lat: 26.1105, lon: 85.3895, status: 'Active', residual: 1.2 },
  { id: 3, state: 'FOLLOWER', lat: 26.1110, lon: 85.3888, status: 'Spoofed', residual: 18.5 },
  { id: 4, state: 'FOLLOWER', lat: 26.1098, lon: 85.3912, status: 'Active', residual: 0.8 },
];

const mockLogs = [
  "[System] Initializing SwarmRaft Consensus Engine v1.0",
  "[Node 1] Elected LEADER for Term 42",
  "[Node 2] Telemetry validated. Ranging distance: 45m",
  "[Node 3] WARNING: GNSS Residual exceeds threshold (18.5m > 10.0m)",
  "[Node 1] Byzantine behavior detected on Node 3. Recovering spatial coordinates...",
  "[Node 1] Finalizing secure Swarm State Map."
];

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    // Simulate log streaming
    let i = 0;
    const interval = setInterval(() => {
      if (i < mockLogs.length) {
        setLogs(prev => [...prev, mockLogs[i]]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {/* Top Navigation */}
      <nav className="top-nav">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '18px' }}>✱</span>
          <span>Swarm Command</span>
        </div>
        <div style={{ display: 'flex', gap: '24px' }}>
          <span className="text-link" style={{ cursor: 'pointer' }}>Dashboard</span>
          <span style={{ color: 'var(--color-muted)', cursor: 'pointer' }}>Nodes</span>
          <span style={{ color: 'var(--color-muted)', cursor: 'pointer' }}>PoPW Config</span>
        </div>
        <button className="button-primary">Execute Protocol</button>
      </nav>

      {/* Hero Section */}
      <section className="section" style={{ padding: '96px 0', backgroundColor: 'var(--color-canvas)' }}>
        <div className="container grid-2" style={{ alignItems: 'center' }}>
          <div>
            <h1 className="display-xl" style={{ margin: '0 0 24px 0' }}>Jam-Proof Drone Swarm Consensus</h1>
            <p className="body-md" style={{ color: 'var(--color-body)', marginBottom: '32px', maxWidth: '480px' }}>
              Real-time monitoring of decentralized UAV networks operating in GNSS-denied environments. 
              Powered by SwarmRaft, Rûm-based MANET logic, and Proof-of-Physical-Work identity primitives.
            </p>
            <div style={{ display: 'flex', gap: '16px' }}>
              <button className="button-primary">View Global Map</button>
              <button className="button-secondary">System Settings</button>
            </div>
          </div>
          
          {/* Featured Code Window */}
          <div className="code-window-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', color: 'var(--color-muted-soft)' }}>
              <span>swarm_node/node.py</span>
              <span>Running...</span>
            </div>
            {logs.map((log, idx) => (
              <div key={idx} style={{ 
                color: log.includes('WARNING') || log.includes('Byzantine') ? 'var(--color-accent-amber)' : 
                       log.includes('LEADER') ? 'var(--color-success)' : 'inherit',
                marginBottom: '4px'
              }}>
                {log}
              </div>
            ))}
            {logs.length < mockLogs.length && <span style={{ animation: 'blink 1s step-end infinite' }}>_</span>}
          </div>
        </div>
      </section>

      {/* Main Dashboard Content */}
      <section className="section" style={{ backgroundColor: 'var(--color-canvas)' }}>
        <div className="container">
          
          <div className="grid-3" style={{ marginBottom: '48px' }}>
            {/* Coral Callout Card */}
            <div className="callout-card-coral" style={{ gridColumn: '1 / -1' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2 className="display-sm" style={{ margin: '0 0 8px 0' }}>Network Integrity Alert</h2>
                  <p className="body-md" style={{ margin: 0 }}>GNSS Spoofing detected in Sector Alpha. SwarmRaft spatial recovery is actively triangulating affected nodes.</p>
                </div>
                <button style={{ 
                  backgroundColor: 'var(--color-canvas)', 
                  color: 'var(--color-ink)',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: 'var(--rounded-md)',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}>Override Controls</button>
              </div>
            </div>
          </div>

          <div className="grid-2">
            {/* Active Swarm Product Surface */}
            <div className="product-mockup-card-dark">
              <h3 className="title-md" style={{ margin: '0 0 24px 0' }}>Live Swarm Nodes</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {mockSwarmData.map(node => (
                  <div key={node.id} style={{ 
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '16px', backgroundColor: 'var(--color-surface-dark-soft)', borderRadius: 'var(--rounded-md)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ 
                        width: '8px', height: '8px', borderRadius: '50%', 
                        backgroundColor: node.state === 'LEADER' ? 'var(--color-success)' : 
                                       node.status === 'Spoofed' ? 'var(--color-error)' : 'var(--color-accent-teal)'
                      }}></div>
                      <div>
                        <div className="title-sm">UAV-{node.id}</div>
                        <div className="body-sm" style={{ color: 'var(--color-muted)' }}>{node.state}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div className="code-text" style={{ fontSize: '13px', color: 'var(--color-on-dark-soft)' }}>
                        LAT: {node.lat.toFixed(4)} | LON: {node.lon.toFixed(4)}
                      </div>
                      {node.status === 'Spoofed' && (
                        <span className="badge-coral" style={{ marginTop: '8px', fontSize: '10px' }}>BYZANTINE</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Feature Cards Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div className="feature-card">
                <div style={{ fontSize: '24px', marginBottom: '16px' }}>⛓️</div>
                <h3 className="title-md" style={{ margin: '0 0 12px 0' }}>Proof of Physical Work</h3>
                <p className="body-md" style={{ color: 'var(--color-body)', margin: 0 }}>
                  Nodes must submit cryptographic signatures of waypoint arrivals to earn voting authority. Sybil resistance enforced via on-chain validation.
                </p>
              </div>

              <div className="feature-card">
                <div style={{ fontSize: '24px', marginBottom: '16px' }}>📡</div>
                <h3 className="title-md" style={{ margin: '0 0 12px 0' }}>Rûm MANET Protocol</h3>
                <p className="body-md" style={{ color: 'var(--color-body)', margin: 0 }}>
                  Asynchronous packet delivery tolerating up to 40% connection omission. Cryptographic hashes mathematically reject spoofed traces.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Dark Footer */}
      <footer style={{ backgroundColor: 'var(--color-surface-dark)', color: 'var(--color-on-dark-soft)', padding: '64px 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-on-dark)' }}>
            <span style={{ fontSize: '18px' }}>✱</span>
            <span className="title-sm">Deepmind Advanced Agentic Coding</span>
          </div>
          <div className="body-sm">
            SwarmRaft Simulator UI | Alpha v1.0
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
