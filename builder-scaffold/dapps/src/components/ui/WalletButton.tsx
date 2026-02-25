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
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '0.5rem 1rem',
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: '4px',
      }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            {formatAddress(address)}
          </div>
          <div style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--accent-primary)' }}>
            {formatBalance(balance)} SUI
          </div>
        </div>
        <button
          onClick={onDisconnect}
          style={{
            backgroundColor: 'transparent',
            border: '1px solid var(--status-danger)',
            color: 'var(--status-danger)',
            padding: '0.25rem 0.75rem',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.9rem',
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
      }}
    >
      {isConnecting ? 'Connecting...' : 'Connect Wallet'}
    </button>
  );
}
