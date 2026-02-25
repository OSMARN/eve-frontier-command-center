import React, { useState } from 'react';
import { Assembly } from '../../types/assembly';
import { useTransactions } from '../../hooks/useTransactions';

interface AssemblyListProps {
  assemblies: Assembly[];
  loading: boolean;
  ownerAddress: string | null;
  onStatusChange?: () => void; // Callback to refresh data
}

export function AssemblyList({ 
  assemblies, 
  loading, 
  ownerAddress,
  onStatusChange 
}: AssemblyListProps) {
  const [expandedAssembly, setExpandedAssembly] = useState<string | null>(null);
  const [tollInput, setTollInput] = useState<Record<string, string>>({});
  
  const { 
    toggleStatus, 
    setToll, 
    setAccess, 
    isProcessing 
  } = useTransactions(ownerAddress);

  if (loading) {
    return (
      <div className="eve-card" style={{ padding: '1rem' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading assemblies...</p>
      </div>
    );
  }

  if (assemblies.length === 0) {
    return (
      <div className="eve-card" style={{ padding: '1rem' }}>
        <p style={{ color: 'var(--text-secondary)' }}>No assemblies found</p>
      </div>
    );
  }

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'gate': return '🚪';
      case 'storage': return '📦';
      case 'turret': return '🔫';
      default: return '📡';
    }
  };

  const getStatusColor = (isOnline: boolean) => {
    return isOnline ? 'var(--status-online)' : 'var(--status-danger)';
  };

  const handleToggleStatus = async (assembly: Assembly) => {
    if (!ownerAddress) return;
    
    const result = await toggleStatus(
      assembly.id,
      assembly.name,
      assembly.isOnline
    );
    
    if (result?.success && onStatusChange) {
      // Wait a bit for blockchain to update
      setTimeout(onStatusChange, 2000);
    }
  };

  const handleSetToll = async (assembly: Assembly) => {
    if (!ownerAddress || assembly.type !== 'gate') return;
    
    const tollValue = parseInt(tollInput[assembly.id] || '0');
    if (isNaN(tollValue)) return;
    
    const result = await setToll(
      assembly.id,
      assembly.name,
      tollValue
    );
    
    if (result?.success) {
      setTollInput(prev => ({ ...prev, [assembly.id]: '' }));
      if (onStatusChange) setTimeout(onStatusChange, 2000);
    }
  };

  const handleSetAccess = async (assembly: Assembly, isPublic: boolean) => {
    if (!ownerAddress || assembly.type !== 'gate') return;
    
    await setAccess(
      assembly.id,
      assembly.name,
      isPublic,
      isPublic ? undefined : 'tribe123' // Mock tribe ID
    );
    
    if (onStatusChange) setTimeout(onStatusChange, 2000);
  };

  return (
    <div className="eve-card" style={{ padding: '1.5rem' }}>
      <h3 style={{ 
        margin: '0 0 1rem 0', 
        color: 'var(--text-primary)',
        fontFamily: 'Orbitron, sans-serif',
        fontSize: '1rem'
      }}>
        CLAN ASSEMBLIES ({assemblies.length})
      </h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {assemblies.map((assembly) => (
          <div
            key={assembly.id}
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: '4px',
            }}
          >
            {/* Main row - always visible */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: expandedAssembly === assembly.id ? '1rem' : 0,
              cursor: 'pointer'
            }}
            onClick={() => setExpandedAssembly(
              expandedAssembly === assembly.id ? null : assembly.id
            )}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.2rem' }}>{getTypeIcon(assembly.type)}</span>
                <span style={{ fontWeight: 'bold' }}>{assembly.name}</span>
                {assembly.type === 'gate' && (
                  <span style={{ 
                    fontSize: '0.8rem',
                    backgroundColor: 'var(--bg-card)',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '4px',
                    color: 'var(--text-secondary)'
                  }}>
                    Gate
                  </span>
                )}
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ 
                  color: getStatusColor(assembly.isOnline),
                  fontSize: '0.9rem'
                }}>
                  {assembly.isOnline ? '● ONLINE' : '○ OFFLINE'}
                </span>
                <span style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>
                  {expandedAssembly === assembly.id ? '▼' : '▶'}
                </span>
              </div>
            </div>

            {/* Expanded controls */}
            {expandedAssembly === assembly.id && (
              <div style={{
                marginTop: '1rem',
                paddingTop: '1rem',
                borderTop: '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}>
                {/* Basic info */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.5rem',
                  fontSize: '0.9rem',
                  color: 'var(--text-secondary)'
                }}>
                  {assembly.fuelAmount !== undefined && (
                    <>
                      <span>Fuel:</span>
                      <span style={{ color: 'var(--text-primary)' }}>
                        {assembly.fuelAmount} / {assembly.maxFuel || '?'}
                      </span>
                    </>
                  )}
                  
                  {assembly.location && (
                    <>
                      <span>Location:</span>
                      <span style={{ color: 'var(--text-primary)' }}>
                        ({assembly.location.x}, {assembly.location.y})
                      </span>
                    </>
                  )}
                </div>

                {/* Gate-specific controls */}
                {assembly.type === 'gate' && (
                  <>
                    {/* Toll control */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <span style={{ color: 'var(--text-secondary)', width: '60px' }}>
                        Toll:
                      </span>
                      <input
                        type="number"
                        value={tollInput[assembly.id] || ''}
                        onChange={(e) => setTollInput({
                          ...tollInput,
                          [assembly.id]: e.target.value
                        })}
                        placeholder={assembly.toll?.toString() || '0'}
                        style={{
                          flex: 1,
                          padding: '0.3rem 0.5rem',
                          backgroundColor: 'var(--bg-primary)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '4px',
                          color: 'var(--text-primary)'
                        }}
                      />
                      <span style={{ color: 'var(--text-secondary)' }}>EVE</span>
                      <button
                        onClick={() => handleSetToll(assembly)}
                        disabled={isProcessing}
                        className="eve-button"
                        style={{
                          padding: '0.3rem 1rem',
                          fontSize: '0.9rem'
                        }}
                      >
                        Set
                      </button>
                    </div>

                    {/* Access control */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <span style={{ color: 'var(--text-secondary)', width: '60px' }}>
                        Access:
                      </span>
                      <button
                        onClick={() => handleSetAccess(assembly, true)}
                        disabled={isProcessing}
                        style={{
                          flex: 1,
                          padding: '0.3rem',
                          backgroundColor: 'var(--bg-primary)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '4px',
                          color: 'var(--text-primary)',
                          cursor: 'pointer'
                        }}
                      >
                        Public
                      </button>
                      <button
                        onClick={() => handleSetAccess(assembly, false)}
                        disabled={isProcessing}
                        style={{
                          flex: 1,
                          padding: '0.3rem',
                          backgroundColor: 'var(--bg-primary)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '4px',
                          color: 'var(--text-primary)',
                          cursor: 'pointer'
                        }}
                      >
                        Restricted
                      </button>
                    </div>
                  </>
                )}

                {/* Toggle button */}
                <button
                  onClick={() => handleToggleStatus(assembly)}
                  disabled={isProcessing}
                  className="eve-button"
                  style={{
                    width: '100%',
                    backgroundColor: assembly.isOnline 
                      ? 'var(--status-danger)' 
                      : 'var(--status-online)',
                    opacity: isProcessing ? 0.7 : 1,
                    border: 'none'
                  }}
                >
                  {isProcessing 
                    ? 'Processing...' 
                    : assembly.isOnline 
                      ? 'Take Offline' 
                      : 'Bring Online'
                  }
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
