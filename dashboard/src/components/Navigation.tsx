"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="navbar-glass">
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <span style={{ fontSize: '18px', fontWeight: 'bold', fontFamily: 'var(--font-sans)', letterSpacing: '-0.5px' }}>S.U.T.R.A.</span>
        </Link>
      </div>
      
      <div className="nav-text" style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
        <Link href="/" className="text-link" style={{ color: pathname === '/' ? 'var(--color-ink)' : 'var(--color-muted)', fontWeight: pathname === '/' ? 600 : 500 }}>Dashboard</Link>
        <Link href="/about" className="text-link" style={{ color: pathname === '/about' ? 'var(--color-ink)' : 'var(--color-muted)', fontWeight: pathname === '/about' ? 600 : 500 }}>Architecture</Link>
        <span className="text-link" style={{ color: 'var(--color-muted)', cursor: 'pointer', display: 'flex', gap: '6px', alignItems: 'center' }}>
          Protocols
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.6 }}>
            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
        <span className="text-link" style={{ color: 'var(--color-muted)', cursor: 'pointer' }}>Network</span>
      </div>
      
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <button className="button-primary" style={{ borderRadius: 'var(--rounded-pill)' }}>Deploy Simulator</button>
      </div>
    </nav>
  );
}
