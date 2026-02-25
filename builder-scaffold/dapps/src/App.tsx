import React, { useState, useMemo, useCallback } from 'react';
import { useWallet } from './hooks/useWallet';
import { useAssemblies } from './hooks/useAssemblies';
import { useWebSocket } from './hooks/useWebSocket';
import { useTransactions } from './hooks/useTransactions';
import { useEveNotification } from './hooks/useEveNotification';
import { WalletButton } from './components/ui/WalletButton';
import { AssemblyList } from './components/dashboard/AssemblyList';
import { EventLog } from './components/dashboard/EventLog';
import { TransactionToast } from './components/ui/TransactionToast';
import { EveNotification } from './components/ui/EveNotification';
import { EveConfirmation } from './components/ui/EveConfirmation';
import { Marketplace } from './components/marketplace/Marketplace';
import './styles/eve-theme.css';

// Мемоизированные компоненты для оптимизации
const MemoizedAssemblyList = React.memo(AssemblyList);
const MemoizedEventLog = React.memo(EventLog);
const MemoizedMarketplace = React.memo(Marketplace);
const MemoizedWalletButton = React.memo(WalletButton);

function App() {
  const wallet = useWallet();
  const { 
    assemblies, 
    loading, 
    stats, 
    toggleAssemblyStatus,
    setGateToll,
    setGateAccess 
  } = useAssemblies(wallet.address);
  
  const { events, clearEvents, formatEvent, isConnected } = useWebSocket();
  const { pendingTransactions, clearOldTransactions } = useTransactions(wallet.address);
  const { 
    notifications, 
    confirmation,
    showNotification, 
    removeNotification,
    showConfirmation,
    closeConfirmation 
  } = useEveNotification();
  
  const storages = useMemo(() => 
    assemblies.filter(a => a.type === 'storage'), 
    [assemblies]
  );
  
  const [showMarketplace, setShowMarketplace] = useState(false);

  const handleBalanceUpdate = useCallback((newBalance: string) => {
    wallet.updateBalance(newBalance);
  }, [wallet]);

  const toggleMarketplace = useCallback(() => {
    setShowMarketplace(prev => !prev);
  }, []);

  // Мемоизированные значения для статистики
  const memoizedStats = useMemo(() => stats, [stats]);

  return (
    <div style={{ 
      height: '100vh',
      padding: '20px',
      backgroundColor: 'var(--bg-primary)',
      color: 'var(--text-primary)',
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
      overflow: 'hidden'
    }}>
      {/* EVE-style notifications */}
      {notifications.map(notification => (
        <EveNotification
          key={notification.id}
          message={notification.message}
          onClose={() => removeNotification(notification.id)}
        />
      ))}

      {/* EVE-style confirmation */}
      {confirmation && (
        <EveConfirmation
          key={confirmation.id}
          message={confirmation.message}
          onConfirm={() => {
            confirmation.onConfirm();
            closeConfirmation();
          }}
          onCancel={closeConfirmation}
        />
      )}

      {/* Header - фиксированная высота */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        padding: '15px 20px',
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <h1 className="eve-title" style={{ 
            margin: 0, 
            fontSize: 'clamp(1.2rem, 3vw, 2rem)',
            letterSpacing: '1px'
          }}>
            <span style={{ color: '#FF4700' }}>FRONTIER</span> COMMAND CENTER
          </h1>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: isConnected ? 'var(--status-online)' : 'var(--status-danger)',
            animation: isConnected ? 'pulse 2s infinite' : 'none'
          }} />
        </div>
        
        <div style={{ 
          display: 'flex', 
          gap: '15px', 
          alignItems: 'center'
        }}>
          <button
            onClick={toggleMarketplace}
            className="eve-button-secondary"
            style={{ 
              padding: '10px 20px',
              display: 'flex',
              alignItems: 'center',
              border: '1px solid var(--accent-secondary)',
              backgroundColor: 'transparent',
              color: 'var(--accent-secondary)',
              cursor: 'pointer',
              fontSize: 'clamp(0.8rem, 1.5vw, 1rem)',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease'
            }}
          >
            {showMarketplace ? '◀ Back to Dashboard' : '📦 Marketplace'}
          </button>
          <MemoizedWalletButton
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
      </header>

      {/* Main content - занимает всё оставшееся место */}
      <div style={{
        flex: 1,
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column'
      }}>
        {wallet.isConnected ? (
          <>
            {showMarketplace ? (
              <div style={{ flex: 1, overflow: 'auto' }}>
                <MemoizedMarketplace 
                  storages={storages} 
                  userBalance={wallet.balance}
                  onShowNotification={showNotification}
                  onShowConfirmation={showConfirmation}
                  onBalanceUpdate={handleBalanceUpdate}
                />
              </div>
            ) : (
              <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                minHeight: 0
              }}>
                {/* Top row - 60% высоты */}
                <div style={{
                  flex: 3,
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr',
                  gap: '20px',
                  minHeight: 0
                }}>
                  <div style={{ minHeight: 0, overflow: 'auto' }}>
                    <MemoizedAssemblyList 
                      assemblies={assemblies} 
                      loading={loading} 
                      ownerAddress={wallet.address}
                      onToggleStatus={toggleAssemblyStatus}
                      onSetToll={setGateToll}
                      onSetAccess={setGateAccess}
                    />
                  </div>

                  <div style={{ minHeight: 0, overflow: 'auto' }}>
                    <div className="eve-card" style={{ 
                      padding: '20px', 
                      height: '100%', 
                      boxSizing: 'border-box',
                      display: 'flex',
                      flexDirection: 'column'
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '10px', 
                        marginBottom: '15px'
                      }}>
                        <svg 
                          width="24" 
                          height="24" 
                          viewBox="0 0 30 30" 
                          fill="none" 
                          xmlns="http://www.w3.org/2000/svg"
                          style={{ display: 'block', flexShrink: 0 }}
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
                          fontSize: 'clamp(1rem, 2vw, 1.3rem)',
                          lineHeight: '1' 
                        }}>
                          CLAN STATISTICS
                        </h2>
                      </div>

                      <div style={{ 
                        flex: 1,
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: 'clamp(5px, 1vh, 10px)',
                        overflow: 'auto'
                      }}>
                        <StatRow label="Total Assemblies" value={memoizedStats.total} />
                        <StatRow label="Online" value={`${memoizedStats.online}/${memoizedStats.total}`} color="var(--status-online)" />
                        <StatRow label="Gates" value={memoizedStats.gates} />
                        <StatRow label="Storages" value={memoizedStats.storages} />
                        <StatRow label="Turrets" value={memoizedStats.turrets} />
                        <StatRow label="Total Fuel" value={memoizedStats.totalFuel} />
                        <StatRow label="Total Value" value={`${memoizedStats.totalValue} EVE`} color="#FF4700" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom row - 40% высоты */}
                <div style={{
                  flex: 2,
                  minHeight: 0
                }}>
                  <MemoizedEventLog 
                    events={events} 
                    formatEvent={formatEvent}
                    onClear={clearEvents}
                  />
                </div>
              </div>
            )}

            <TransactionToast 
              transactions={pendingTransactions}
              onClose={clearOldTransactions}
            />
          </>
        ) : (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
          }}>
            <div className="eve-card" style={{ maxWidth: '400px', textAlign: 'center', padding: '30px' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                marginBottom: '20px'
              }}>
                <svg 
                  width="40" 
                  height="40" 
                  viewBox="0 0 30 30" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
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
              <h2 className="eve-title" style={{ marginBottom: '15px', fontSize: '1.5rem' }}>
                Welcome Commander
              </h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
                Connect your wallet to start managing your clan
              </p>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <MemoizedWalletButton
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
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// Мемоизированный компонент для строк статистики
const StatRow = React.memo(({ label, value, color }: { label: string; value: string | number; color?: string }) => {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between',
      padding: '5px 0',
      borderBottom: '1px solid var(--border-color)',
      fontSize: 'clamp(0.8rem, 1.5vw, 0.95rem)'
    }}>
      <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
      <span style={{ fontWeight: 'bold', color: color || 'var(--text-primary)' }}>{value}</span>
    </div>
  );
});

export default App;
