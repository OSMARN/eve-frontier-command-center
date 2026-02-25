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
        <h1 className="eve-title" style={{ 
          margin: 0, 
          fontSize: '2rem',
          letterSpacing: '1px'
        }}>
          <span style={{ color: '#FF4700' }}>FRONTIER</span> COMMAND CENTER
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
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem', 
            marginBottom: '1rem',
            height: '2rem'  // Фиксированная высота для выравнивания
          }}>
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 30 30" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              style={{ display: 'block' }}
            >
              <rect x="0.5" y="0.5" width="5" height="5" stroke="#FF4700" strokeOpacity="0.5" />
              <rect x="1" y="9" width="4" height="4" stroke="#FF4700" strokeWidth="2" />
              <rect x="8.5" y="16.5" width="5" height="5" stroke="#FF4700" strokeOpacity="0.5" />
              <rect x="0.5" y="16.5" width="5" height="5" stroke="#FF4700" strokeOpacity="0.5" />
              <rect x="9" y="1" width="4" height="4" stroke="#FF4700" strokeWidth="2" />
              <rect x="9" y="9" width="4" height="4" stroke="#FF4700" strokeWidth="2" />
              <rect x="1" y="25" width="4" height="4" stroke="#FF4700" strokeWidth="2" />
              <rect x="8.5" y="24.5" width="5" height="5" stroke="#FF4700" strokeOpacity="0.5" />
              <rect x="16.5" y="8.5" width="5" height="5" stroke="#FF4700" strokeOpacity="0.5" />
              <rect x="17" y="1" width="4" height="4" stroke="#FF4700" strokeWidth="2" />
              <rect x="17" y="17" width="4" height="4" stroke="#FF4700" strokeWidth="2" />
              <rect x="16.5" y="24.5" width="5" height="5" stroke="#FF4700" strokeOpacity="0.5" />
              <rect x="24.5" y="0.5" width="5" height="5" stroke="#FF4700" strokeOpacity="0.5" />
              <rect x="24.5" y="16.5" width="5" height="5" stroke="#FF4700" strokeOpacity="0.5" />
              <rect x="25" y="9" width="4" height="4" stroke="#FF4700" strokeWidth="2" />
              <rect x="25" y="25" width="4" height="4" stroke="#FF4700" strokeWidth="2" />
            </svg>
            <h2 className="eve-title" style={{ 
              margin: 0, 
              fontSize: '1.3rem',
              lineHeight: '1' 
            }}>
              CLAN DASHBOARD
            </h2>
          </div>
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
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              marginBottom: '1rem',
              height: '2rem'
            }}>
              <svg 
                width="32" 
                height="32" 
                viewBox="0 0 30 30" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                style={{ display: 'block' }}
              >
                <rect x="0.5" y="0.5" width="5" height="5" stroke="#FF4700" strokeOpacity="0.5" />
                <rect x="1" y="9" width="4" height="4" stroke="#FF4700" strokeWidth="2" />
                <rect x="8.5" y="16.5" width="5" height="5" stroke="#FF4700" strokeOpacity="0.5" />
                <rect x="0.5" y="16.5" width="5" height="5" stroke="#FF4700" strokeOpacity="0.5" />
                <rect x="9" y="1" width="4" height="4" stroke="#FF4700" strokeWidth="2" />
                <rect x="9" y="9" width="4" height="4" stroke="#FF4700" strokeWidth="2" />
                <rect x="1" y="25" width="4" height="4" stroke="#FF4700" strokeWidth="2" />
                <rect x="8.5" y="24.5" width="5" height="5" stroke="#FF4700" strokeOpacity="0.5" />
                <rect x="16.5" y="8.5" width="5" height="5" stroke="#FF4700" strokeOpacity="0.5" />
                <rect x="17" y="1" width="4" height="4" stroke="#FF4700" strokeWidth="2" />
                <rect x="17" y="17" width="4" height="4" stroke="#FF4700" strokeWidth="2" />
                <rect x="16.5" y="24.5" width="5" height="5" stroke="#FF4700" strokeOpacity="0.5" />
                <rect x="24.5" y="0.5" width="5" height="5" stroke="#FF4700" strokeOpacity="0.5" />
                <rect x="24.5" y="16.5" width="5" height="5" stroke="#FF4700" strokeOpacity="0.5" />
                <rect x="25" y="9" width="4" height="4" stroke="#FF4700" strokeWidth="2" />
                <rect x="25" y="25" width="4" height="4" stroke="#FF4700" strokeWidth="2" />
              </svg>
            </div>
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
