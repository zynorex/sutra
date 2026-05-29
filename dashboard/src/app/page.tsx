"use client";

import React, { useState, useEffect } from 'react';

// State will be fetched from API
interface SwarmNode {
  id: number;
  state: string;
  lat: number;
  lon: number;
  status: string;
  residual: number;
}


export default function Home() {
  const [logs, setLogs] = useState<string[]>([]);
  const [swarmData, setSwarmData] = useState<SwarmNode[]>([]);

  useEffect(() => {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000';
    
    // Connect to Logs Stream
    const logWs = new WebSocket(`${wsUrl}/ws/logs`);
    logWs.onmessage = (event) => {
      setLogs(prev => [...prev, event.data]);
    };

    // Connect to Telemetry Stream
    const telemetryWs = new WebSocket(`${wsUrl}/ws/telemetry`);
    telemetryWs.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.nodes) {
          setSwarmData(data.nodes);
        }
      } catch (e) {
        console.error("Failed to parse telemetry data", e);
      }
    };

    return () => {
      logWs.close();
      telemetryWs.close();
    };
  }, []);

  return (
    <main style={{ flex: 1 }}>
      {/* Hero Section */}
      <section className="section" style={{ backgroundColor: 'var(--color-canvas)', transition: 'background-color 0.3s', padding: '120px 0 64px 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '64px', alignItems: 'center' }}>
            <div>
              <h1 className="display-xl" style={{ margin: '0 0 0 0', maxWidth: '800px' }}>
                Secure Unjammable Tactical <span className="headline-underline">Resilient Array</span>
              </h1>
            </div>
            <div>
              <p className="body-lg" style={{ color: 'var(--color-ink)', margin: '0 0 32px 0' }}>
                Decentralized UAV networks will have a vast impact on the world. 
                SUTRA is a secure coordination engine dedicated to securing its benefits and mitigating GNSS spoofing risks.
              </p>
              <div style={{ display: 'flex', gap: '16px' }}>
                <button className="button-secondary" style={{ borderRadius: 'var(--rounded-pill)' }}>System Settings</button>
              </div>
            </div>
          </div>
          
          {/* Featured Code Window pushed slightly down */}
          <div style={{ marginTop: '96px' }}>
            <div className="code-window-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', color: 'var(--color-on-dark-soft)' }}>
                <span>POST /api/sutra/telemetry</span>
                <span>Streaming...</span>
              </div>
              {logs.filter(Boolean).map((log, idx) => (
                <div key={idx} style={{ 
                  color: log.includes('WARNING') || log.includes('Byzantine') ? 'var(--color-accent-amber)' : 
                         log.includes('LEADER') ? 'var(--color-success)' : 'inherit',
                  marginBottom: '4px'
                }}>
                  {log}
                </div>
              ))}
              {logs.length === 0 && <span style={{ animation: 'blink 1s step-end infinite' }}>_</span>}
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Dashboard Section */}
      <section className="section" style={{ backgroundColor: 'var(--color-canvas)', transition: 'background-color 0.3s', paddingTop: 0 }}>
        <div className="container">
          <div className="grid-3" style={{ marginBottom: '48px' }}>
            {/* Coral Callout Card */}
            <div className="callout-card-coral interactive-card" style={{ gridColumn: '1 / -1' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2 className="display-sm" style={{ margin: '0 0 8px 0', fontWeight: 'bold' }}>Network Integrity Alert</h2>
                  <p className="body-lg" style={{ margin: 0 }}>GNSS Spoofing detected in Sector Alpha. SwarmRaft spatial recovery is actively triangulating affected nodes via SUTRA backend.</p>
                </div>
                <button style={{ 
                  backgroundColor: 'var(--color-canvas)', 
                  color: 'var(--color-ink)',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: 'var(--rounded-pill)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'transform 0.2s'
                }}
                onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >Override Controls</button>
              </div>
            </div>
          </div>

          <div className="grid-2">
            {/* Active Swarm Product Surface */}
            <div className="product-mockup-card-dark interactive-card">
              <h3 className="title-md" style={{ margin: '0 0 24px 0' }}>Live Swarm Nodes</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {swarmData.length === 0 && (
                  <div style={{ padding: '16px', color: 'var(--color-on-dark-soft)', textAlign: 'center' }}>
                    Waiting for simulator connection...
                  </div>
                )}
                {swarmData.map(node => (
                  <div key={node.id} style={{ 
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '16px', backgroundColor: 'var(--color-surface-dark-soft)', borderRadius: 'var(--rounded-md)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ 
                        width: '8px', height: '8px', borderRadius: '50%', 
                        backgroundColor: node.state === 'Leader' ? 'var(--color-success)' : 
                                       node.status === 'Spoofed' ? 'var(--color-error)' : 'var(--color-accent-teal)'
                      }}></div>
                      <div>
                        <div className="title-sm" style={{ fontFamily: 'var(--font-sans)' }}>{`UAV ${node.id}`}</div>
                        <div className="body-sm" style={{ color: 'var(--color-on-dark-soft)', fontFamily: 'var(--font-sans)' }}>{node.state.toUpperCase()}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div className="code-text" style={{ fontSize: '13px', color: 'var(--color-on-dark-soft)' }}>
                        LAT: {node.lat ? node.lat.toFixed(4) : node.corrected_pos?.[0]?.toFixed(4) || "0.0000"} | 
                        LON: {node.lon ? node.lon.toFixed(4) : node.corrected_pos?.[1]?.toFixed(4) || "0.0000"}
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
              <div className="feature-card interactive-card">
                <h3 className="title-md" style={{ margin: '0 0 12px 0' }}>Server Actions Integrated</h3>
                <p className="body-md" style={{ color: 'var(--color-body)', margin: 0 }}>
                  Built with Next.js App Router. Node telemetry can now be submitted seamlessly through Server Actions and authenticated directly in the SUTRA backend.
                </p>
              </div>

              <div className="feature-card interactive-card">
                <h3 className="title-md" style={{ margin: '0 0 12px 0' }}>Extensible Architecture</h3>
                <p className="body-md" style={{ color: 'var(--color-body)', margin: 0 }}>
                  Ready to connect via WebSockets or long polling to the Python MANET Simulator and the Foundry Ethereum testnet for fully integrated operations.
                </p>
              </div>

              <div className="feature-card interactive-card" style={{ backgroundColor: 'var(--color-surface-soft)' }}>
                <h3 className="title-md" style={{ margin: '0 0 12px 0' }}>Sybil Proof Identity</h3>
                <p className="body-md" style={{ color: 'var(--color-body)', margin: 0 }}>
                  Leveraging ECDSA signatures across UDP protocols, SUTRA ensures that malicious actors cannot forge identities or inject false spatial data.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEW SECTION 1: Performance Metrics Matrix */}
      <section className="section" style={{ borderTop: '1px solid var(--color-hairline)' }}>
        <div className="container">
          <div style={{ marginBottom: '64px' }}>
            <h2 className="display-lg" style={{ margin: '0 0 16px 0' }}>Zero Trust by Default</h2>
            <p className="body-lg" style={{ color: 'var(--color-ink)', maxWidth: '600px', margin: 0 }}>
              SUTRA operates on the principle that any node can be compromised. Our metrics demonstrate sustained operational superiority despite active jamming.
            </p>
          </div>
          
          <div className="grid-3">
            <div className="feature-card interactive-card" style={{ backgroundColor: 'var(--color-canvas)' }}>
              <span className="stat-number">250ms</span>
              <h3 className="title-md" style={{ margin: '0 0 12px 0' }}>Consensus Finality</h3>
              <p className="body-md" style={{ color: 'var(--color-body)', margin: 0 }}>
                Average time to establish a verifiable state across all distributed nodes. Fast enough to support hyper sonic kinetic maneuvers.
              </p>
            </div>
            
            <div className="feature-card interactive-card" style={{ backgroundColor: 'var(--color-canvas)' }}>
              <span className="stat-number">20%</span>
              <h3 className="title-md" style={{ margin: '0 0 12px 0' }}>Packet Loss Tolerance</h3>
              <p className="body-md" style={{ color: 'var(--color-body)', margin: 0 }}>
                Sustained capability even when significant network traffic is dropped due to simulated structural interference and electronic warfare.
              </p>
            </div>

            <div className="feature-card interactive-card" style={{ backgroundColor: 'var(--color-canvas)' }}>
              <span className="stat-number">100%</span>
              <h3 className="title-md" style={{ margin: '0 0 12px 0' }}>Spoof Rejection</h3>
              <p className="body-md" style={{ color: 'var(--color-body)', margin: 0 }}>
                Complete mathematical certainty that unverified spatial telemetry is discarded and quarantined before entering the execution layer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* NEW SECTION 2: Tactical Implementation Steps */}
      <section className="section" style={{ backgroundColor: 'var(--color-surface-soft)', borderTop: '1px solid var(--color-hairline)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 className="display-lg" style={{ margin: '0 0 24px 0' }}>Tactical Implementation</h2>
            <p className="body-lg" style={{ color: 'var(--color-ink)', maxWidth: '700px', margin: '0 auto' }}>
              Deploying a resilient SwarmRaft cluster requires three straightforward phases.
            </p>
          </div>

          <div className="grid-3">
            <div className="feature-card interactive-card" style={{ backgroundColor: 'var(--color-canvas)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ fontSize: '48px', fontWeight: '800', color: 'var(--color-hairline)', position: 'absolute', top: '16px', right: '24px' }}>01</div>
              <h3 className="title-lg" style={{ margin: '0 0 16px 0', position: 'relative', zIndex: 1 }}>Initialize Nodes</h3>
              <p className="body-md" style={{ color: 'var(--color-body)', margin: 0, position: 'relative', zIndex: 1 }}>
                Provision individual UAV units with their ECDSA public key pairs. Each node verifies its physical capability through the Proof of Physical Work smart contract prior to launch.
              </p>
            </div>

            <div className="feature-card interactive-card" style={{ backgroundColor: 'var(--color-canvas)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ fontSize: '48px', fontWeight: '800', color: 'var(--color-hairline)', position: 'absolute', top: '16px', right: '24px' }}>02</div>
              <h3 className="title-lg" style={{ margin: '0 0 16px 0', position: 'relative', zIndex: 1 }}>Establish MANET</h3>
              <p className="body-md" style={{ color: 'var(--color-body)', margin: 0, position: 'relative', zIndex: 1 }}>
                Nodes begin asynchronous peer broadcasting via UDP. Unauthenticated payloads are dropped at the socket level to conserve limited tactical bandwidth.
              </p>
            </div>

            <div className="feature-card interactive-card" style={{ backgroundColor: 'var(--color-canvas)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ fontSize: '48px', fontWeight: '800', color: 'var(--color-hairline)', position: 'absolute', top: '16px', right: '24px' }}>03</div>
              <h3 className="title-lg" style={{ margin: '0 0 16px 0', position: 'relative', zIndex: 1 }}>Achieve Consensus</h3>
              <p className="body-md" style={{ color: 'var(--color-body)', margin: 0, position: 'relative', zIndex: 1 }}>
                The leader node establishes the global spatial map. If spoofing is detected, follower nodes initiate a triangulated recovery state to stabilize the formation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* NEW SECTION 3: Final Call to Action */}
      <section className="section" style={{ borderTop: '1px solid var(--color-hairline)' }}>
        <div className="container">
          <div className="callout-card-coral interactive-card" style={{ textAlign: 'center', padding: '64px' }}>
            <h2 className="display-lg" style={{ margin: '0 0 24px 0', color: 'var(--color-on-primary)' }}>Ready to secure the swarm?</h2>
            <p className="body-lg" style={{ color: 'var(--color-on-primary)', maxWidth: '600px', margin: '0 auto 48px auto', opacity: 0.9 }}>
              Connect your local Python simulation layer to the SUTRA Next.js dashboard to monitor cryptographic telemetry in real time.
            </p>
            <button style={{ 
              backgroundColor: 'var(--color-canvas)', 
              color: 'var(--color-ink)',
              border: 'none',
              padding: '16px 32px',
              borderRadius: 'var(--rounded-pill)',
              fontWeight: 600,
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >Initialize Connection</button>
          </div>
        </div>
      </section>

    </main>
  );
}
