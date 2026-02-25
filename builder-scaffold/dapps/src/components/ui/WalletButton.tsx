import React from 'react';

interface WalletButtonProps {
  isConnected: boolean;
  isConnecting: boolean;
  address: string | null;
  balance: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
  formatAddress: (addr: string | null) => string;
  formatBalance: (balance: string | null) => string;
}

export function WalletButton({
  isConnected,
  isConnecting,
  address,
  balance,
  onConnect,
  onDisconnect,
  formatAddress,
  formatBalance,
}: WalletButtonProps) {
  if (isConnected) {
    return (
      <div className="wallet-info" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '0.75rem 1.5rem',
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        minHeight: '60px',
        boxSizing: 'border-box'
      }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            {formatAddress(address)}
          </div>
          <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--accent-primary)' }}>
            {formatBalance(balance)} SUI
          </div>
        </div>
        <button
          onClick={onDisconnect}
          className="eve-button-secondary"
          style={{
            backgroundColor: 'transparent',
            border: '1px solid var(--status-danger)',
            color: 'var(--status-danger)',
            padding: '0.5rem 1rem',
            cursor: 'pointer',
            fontSize: '1rem',
            minHeight: '40px',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={onConnect}
      disabled={isConnecting}
      className="eve-button"
      style={{
        opacity: isConnecting ? 0.7 : 1,
        cursor: isConnecting ? 'not-allowed' : 'pointer',
        minHeight: '60px',
        padding: '0 2rem',
        display: 'flex',
        alignItems: 'center',
        fontSize: '1rem'
      }}
    >
      {isConnecting ? 'Connecting...' : 'Connect Wallet'}
    </button>
  );
}
