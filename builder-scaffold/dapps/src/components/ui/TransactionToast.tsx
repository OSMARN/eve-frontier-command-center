import React, { useEffect } from 'react';
import { PendingTransaction } from '../../types/transactions';

interface TransactionToastProps {
  transactions: PendingTransaction[];
  onClose?: (id: string) => void;
}

export function TransactionToast({ transactions, onClose }: TransactionToastProps) {
  // Auto-hide successful transactions after 5 seconds
  useEffect(() => {
    const timers = transactions
      .filter(tx => tx.status !== 'pending')
      .map(tx => {
        return setTimeout(() => {
          if (onClose) onClose(tx.id);
        }, 5000);
      });

    return () => timers.forEach(clearTimeout);
  }, [transactions, onClose]);

  if (transactions.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '1rem',
      right: '1rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
      zIndex: 1000,
    }}>
      {transactions.map(tx => (
        <div
          key={tx.id}
          style={{
            padding: '0.75rem 1rem',
            backgroundColor: 'var(--bg-card)',
            border: `1px solid ${
              tx.status === 'pending' ? 'var(--accent-secondary)' :
              tx.status === 'success' ? 'var(--status-online)' :
              'var(--status-danger)'
            }`,
            borderRadius: '4px',
            minWidth: '250px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>
                {tx.assemblyName}
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                {tx.action}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {tx.timestamp.toLocaleTimeString()}
              </div>
            </div>
            <div style={{ marginLeft: '1rem' }}>
              {tx.status === 'pending' && (
                <div style={{ 
                  width: '20px', 
                  height: '20px',
                  border: '2px solid var(--accent-secondary)',
                  borderTopColor: 'transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
              )}
              {tx.status === 'success' && (
                <span style={{ color: 'var(--status-online)', fontSize: '1.2rem' }}>✓</span>
              )}
              {tx.status === 'failed' && (
                <span style={{ color: 'var(--status-danger)', fontSize: '1.2rem' }}>✗</span>
              )}
            </div>
          </div>
          {onClose && tx.status !== 'pending' && (
            <button
              onClick={() => onClose(tx.id)}
              style={{
                position: 'absolute',
                top: '0.25rem',
                right: '0.25rem',
                background: 'none',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              ×
            </button>
          )}
        </div>
      ))}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
