import React from 'react';

export default function Banner() {
  return (
    <div style={{
      height: '64px',
      backgroundColor: 'var(--color-surface-card)',
      color: 'var(--color-body-strong)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0 var(--spacing-xl)',
      borderBottom: '1px solid var(--color-hairline)',
      fontFamily: 'var(--font-sans)',
      fontSize: '14px',
      fontWeight: 500,
      textAlign: 'center'
    }}>
      <span style={{ opacity: 0.85 }}>
        <strong>Early Access:</strong> S.U.T.R.A. is currently in the initial stages of development. Core consensus features are highly experimental.
      </span>
    </div>
  );
}
