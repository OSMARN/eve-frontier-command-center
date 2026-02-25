import React from 'react';
import { useWallet } from './hooks/useWallet';
import { WalletButton } from './components/ui/WalletButton';
import './styles/eve-theme.css';

function App() {
  const wallet = useWallet();

  return (
    <div style={{ 
      minHeight: '100vh', 
      padding: '2rem',
      backgroundColor: 'var(--bg-primary)',
      color: 'var(--text-primary)',
    }}>
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        padding: '1rem',
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: '4px',
      }}>
        <h1 className="eve-title" style={{ margin: 0, fontSize: '1.5rem' }}>
          <span className="eve-title-accent">🚀 FRONTIER</span> COMMAND CENTER
        </h1>
        
        <WalletButton
          isConnected={wallet.isConnected}
          isConnecting={wallet.isConnecting}
          address={wallet.address}
          balance={wallet.balance}
          onConnect={wallet.connect}
          onDisconnect={wallet.disconnect}
          formatAddress={wallet.formatAddress}
          formatBalance={wallet.formatBalance}
        />
      </header>

      {wallet.isConnected ? (
        <div className="eve-card">
          <h2 className="eve-title" style={{ margin: '0 0 1rem 0', fontSize: '1.2rem' }}>
            📊 CLAN DASHBOARD
          </h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            Wallet connected. Loading data...
          </p>
        </div>
      ) : (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '300px',
        }}>
          <div className="eve-card" style={{ maxWidth: '400px', textAlign: 'center' }}>
            <h2 className="eve-title" style={{ marginBottom: '1rem' }}>
              Welcome Commander
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Connect your wallet to start managing your clan
            </p>
            <WalletButton
              isConnected={wallet.isConnected}
              isConnecting={wallet.isConnecting}
              address={wallet.address}
              balance={wallet.balance}
              onConnect={wallet.connect}
              onDisconnect={wallet.disconnect}
              formatAddress={wallet.formatAddress}
              formatBalance={wallet.formatBalance}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
