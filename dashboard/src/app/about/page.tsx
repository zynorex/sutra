import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Architecture | S.U.T.R.A.',
  description: 'Learn about the architecture and principles of the Secure Unjammable Tactical Resilient Array.',
};

export default function AboutPage() {
  return (
    <main style={{ flex: 1, backgroundColor: 'var(--color-canvas)', transition: 'background-color 0.3s' }}>
      {/* Hero Section */}
      <section className="section" style={{ padding: '120px 0 64px 0' }}>
        <div className="container">
          <h1 className="display-xl" style={{ margin: '0 0 24px 0', maxWidth: '800px' }}>
            The Architecture of <span className="headline-underline">Resilience</span>
          </h1>
          <p className="body-lg" style={{ color: 'var(--color-ink)', maxWidth: '640px', marginBottom: '48px' }}>
            S.U.T.R.A. is engineered to coordinate Unmanned Aerial Vehicles (UAVs) in highly contested, GNSS denied environments through three fundamental pillars of decentralized security.
          </p>
        </div>
      </section>

      {/* Pillars Section */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {/* Pillar 1 */}
            <div className="feature-card" style={{ padding: '48px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '48px', alignItems: 'start' }}>
                <div>
                  <div className="title-sm" style={{ color: 'var(--color-primary)', marginBottom: '8px', letterSpacing: '1px' }}>PILLAR 01</div>
                  <h3 className="display-sm" style={{ margin: '0 0 16px 0' }}>SwarmRaft Consensus</h3>
                </div>
                <div>
                  <p className="body-lg" style={{ color: 'var(--color-ink)', margin: '0 0 24px 0' }}>
                    A customized implementation of the Raft consensus algorithm optimized for spatial recovery. When nodes experience GNSS spoofing, the network utilizes a 6 step workflow (Sense, Inform, Estimate, Evaluate, Recover, Finalize) to substitute faulty telemetry with peer range triangulated estimates.
                  </p>
                  <p className="body-md" style={{ color: 'var(--color-muted)', margin: 0 }}>
                    Engineered to strictly enforce <em>n &ge; 2f + 1</em> Byzantine fault tolerance across tactical edge computing units.
                  </p>
                </div>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="feature-card" style={{ padding: '48px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '48px', alignItems: 'start' }}>
                <div>
                  <div className="title-sm" style={{ color: 'var(--color-primary)', marginBottom: '8px', letterSpacing: '1px' }}>PILLAR 02</div>
                  <h3 className="display-sm" style={{ margin: '0 0 16px 0' }}>Cryptographic MANET</h3>
                </div>
                <div>
                  <p className="body-lg" style={{ color: 'var(--color-ink)', margin: '0 0 24px 0' }}>
                    An asynchronous peer to peer Mobile Ad hoc Network (MANET) operating over UDP sockets. It enforces absolute cryptographic semantic integrity using standard <strong>secp256k1 (ECDSA)</strong> to sign and verify every single coordination packet.
                  </p>
                  <p className="body-md" style={{ color: 'var(--color-muted)', margin: 0 }}>
                    Simulates extreme lossy conditions while actively discarding unauthenticated packets to prevent Byzantine injection and replay attacks.
                  </p>
                </div>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="feature-card" style={{ padding: '48px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '48px', alignItems: 'start' }}>
                <div>
                  <div className="title-sm" style={{ color: 'var(--color-primary)', marginBottom: '8px', letterSpacing: '1px' }}>PILLAR 03</div>
                  <h3 className="display-sm" style={{ margin: '0 0 16px 0' }}>Proof of Physical Work</h3>
                </div>
                <div>
                  <p className="body-lg" style={{ color: 'var(--color-ink)', margin: '0 0 24px 0' }}>
                    An on chain Sybil defense mechanism deployed via Solidity smart contracts. Drones must provide authorized cryptographic proofs of physical waypoint arrival to claim Voting Power (DVP).
                  </p>
                  <p className="body-md" style={{ color: 'var(--color-muted)', margin: 0 }}>
                    Ensures that network authority is inextricably linked to kinetic reality, structurally preventing remote attackers from spawning virtual nodes.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* PDF Download Section */}
      <section className="section" style={{ backgroundColor: 'var(--color-surface-soft)', borderTop: '1px solid var(--color-hairline)' }}>
        <div className="container" style={{ textAlign: 'center', padding: '64px 0' }}>
          <h2 className="display-sm" style={{ margin: '0 0 16px 0' }}>Deep Dive into the Technical Specifications</h2>
          <p className="body-lg" style={{ color: 'var(--color-ink)', margin: '0 auto 32px auto', maxWidth: '600px' }}>
            We have prepared a comprehensive whitepaper detailing the mathematical proofs behind SwarmRaft spatial recovery and the cryptographic implementations of our MANET.
          </p>
          <a href="/sutra-whitepaper.pdf" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', textDecoration: 'none' }}>
            <button className="button-primary" style={{ padding: '16px 32px', fontSize: '16px', borderRadius: 'var(--rounded-pill)', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Read the Full Whitepaper (PDF)
            </button>
          </a>
          <p className="body-sm" style={{ color: 'var(--color-muted)', marginTop: '24px', opacity: 0.8 }}>
            (To view the whitepaper locally, ensure you rename your PDF to <code>sutra whitepaper.pdf</code> and place it inside the <code>dashboard/public/</code> directory).
          </p>
        </div>
      </section>
    </main>
  );
}
