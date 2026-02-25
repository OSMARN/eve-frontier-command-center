import React, { useState } from 'react';
import { Assembly } from '../../types/assembly';

interface AssemblyListProps {
  assemblies: Assembly[];
  loading: boolean;
  ownerAddress: string | null;
  onToggleStatus?: (assemblyId: string) => void;
  onSetToll?: (gateId: string, toll: number) => void;
  onSetAccess?: (gateId: string, isPublic: boolean) => void;
}

export function AssemblyList({ 
  assemblies, 
  loading, 
  ownerAddress,
  onToggleStatus,
  onSetToll,
  onSetAccess
}: AssemblyListProps) {
  const [expandedAssembly, setExpandedAssembly] = useState<string | null>(null);
  const [tollInput, setTollInput] = useState<Record<string, string>>({});

  if (loading) {
    return (
      <div className="eve-card" style={{ padding: '0.75rem', height: '100%', boxSizing: 'border-box' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Loading assemblies...</p>
      </div>
    );
  }

  if (assemblies.length === 0) {
    return (
      <div className="eve-card" style={{ padding: '0.75rem', height: '100%', boxSizing: 'border-box' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No assemblies found</p>
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

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'gate': return '#00b8ff';
      case 'storage': return '#ffaa00';
      case 'turret': return '#ff4444';
      default: return 'var(--text-secondary)';
    }
  };

  const handleToggleStatus = (assembly: Assembly) => {
    if (onToggleStatus) {
      onToggleStatus(assembly.id);
    }
  };

  const handleSetToll = (assembly: Assembly) => {
    if (!onSetToll || assembly.type !== 'gate') return;
    
    const tollValue = parseInt(tollInput[assembly.id] || '0');
    if (isNaN(tollValue)) return;
    
    onSetToll(assembly.id, tollValue);
    setTollInput(prev => ({ ...prev, [assembly.id]: '' }));
  };

  const handleSetAccess = (assembly: Assembly, isPublic: boolean) => {
    if (!onSetAccess || assembly.type !== 'gate') return;
    onSetAccess(assembly.id, isPublic);
  };

  return (
    <div className="eve-card" style={{ 
      padding: '0.75rem', 
      height: '100%', 
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <h3 style={{ 
        margin: '0 0 0.5rem 0', 
        color: 'var(--text-primary)',
        fontFamily: 'Orbitron, sans-serif',
        fontSize: '0.9rem'
      }}>
        CLAN ASSEMBLIES ({assemblies.length})
      </h3>
      
      <div style={{ 
        flex: 1,
        overflowY: 'auto',
        display: 'flex', 
        flexDirection: 'column', 
        gap: '0.5rem',
        minHeight: 0
      }}>
        {assemblies.map((assembly) => (
          <div
            key={assembly.id}
            style={{
              padding: '0.5rem',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderLeft: `4px solid ${getTypeColor(assembly.type)}`,
            }}
          >
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
            onClick={() => setExpandedAssembly(
              expandedAssembly === assembly.id ? null : assembly.id
            )}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1rem' }}>{getTypeIcon(assembly.type)}</span>
                <span style={{ fontWeight: 'bold' }}>{assembly.name}</span>
                {assembly.type === 'gate' && assembly.toll !== undefined && (
                  <span style={{ 
                    fontSize: '0.7rem',
                    backgroundColor: 'var(--bg-card)',
                    padding: '0.1rem 0.3rem',
                    color: '#FF4700'
                  }}>
                    {assembly.toll} EVE
                  </span>
                )}
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ 
                  color: getStatusColor(assembly.isOnline),
                  fontSize: '0.8rem'
                }}>
                  {assembly.isOnline ? '● ONLINE' : '○ OFFLINE'}
                </span>
                <span style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
                  {expandedAssembly === assembly.id ? '▼' : '▶'}
                </span>
              </div>
            </div>

            {expandedAssembly === assembly.id && (
              <div style={{
                marginTop: '0.5rem',
                paddingTop: '0.5rem',
                borderTop: '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                fontSize: '0.8rem'
              }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.25rem',
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

                  {assembly.type === 'gate' && assembly.toll !== undefined && (
                    <>
                      <span>Current Toll:</span>
                      <span style={{ color: '#FF4700', fontWeight: 'bold' }}>
                        {assembly.toll} EVE
                      </span>
                    </>
                  )}
                </div>

                {assembly.type === 'gate' && (
                  <>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}>
                      <span style={{ color: 'var(--text-secondary)', width: '50px' }}>
                        Toll:
                      </span>
                      <input
                        type="text"
                        value={tollInput[assembly.id] || ''}
                        onChange={(e) => setTollInput({
                          ...tollInput,
                          [assembly.id]: e.target.value
                        })}
                        placeholder={assembly.toll?.toString() || '0'}
                        style={{
                          flex: 1,
                          padding: '0.2rem 0.3rem',
                          backgroundColor: 'var(--bg-primary)',
                          border: '1px solid var(--border-color)',
                          color: 'var(--text-primary)',
                          fontSize: '0.8rem'
                        }}
                      />
                      <span style={{ color: 'var(--text-secondary)' }}>EVE</span>
                      <button
                        onClick={() => handleSetToll(assembly)}
                        className="eve-button"
                        style={{
                          padding: '0.2rem 0.5rem',
                          fontSize: '0.8rem'
                        }}
                      >
                        Set
                      </button>
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}>
                      <span style={{ color: 'var(--text-secondary)', width: '50px' }}>
                        Access:
                      </span>
                      <button
                        onClick={() => handleSetAccess(assembly, true)}
                        style={{
                          flex: 1,
                          padding: '0.2rem',
                          backgroundColor: 'var(--bg-primary)',
                          border: '1px solid var(--border-color)',
                          color: 'var(--text-primary)',
                          cursor: 'pointer',
                          fontSize: '0.8rem'
                        }}
                      >
                        Public
                      </button>
                      <button
                        onClick={() => handleSetAccess(assembly, false)}
                        style={{
                          flex: 1,
                          padding: '0.2rem',
                          backgroundColor: 'var(--bg-primary)',
                          border: '1px solid var(--border-color)',
                          color: 'var(--text-primary)',
                          cursor: 'pointer',
                          fontSize: '0.8rem'
                        }}
                      >
                        Restricted
                      </button>
                    </div>
                  </>
                )}

                {assembly.type === 'storage' && (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '0.25rem',
                    color: 'var(--text-secondary)'
                  }}>
                    {assembly.itemCount !== undefined && (
                      <>
                        <span>Items:</span>
                        <span style={{ color: 'var(--text-primary)' }}>
                          {assembly.itemCount} / {assembly.capacity}
                        </span>
                      </>
                    )}
                    {assembly.value !== undefined && (
                      <>
                        <span>Value:</span>
                        <span style={{ color: '#FF4700', fontWeight: 'bold' }}>
                          {assembly.value} EVE
                        </span>
                      </>
                    )}
                  </div>
                )}

                <button
                  onClick={() => handleToggleStatus(assembly)}
                  className="eve-button"
                  style={{
                    width: '100%',
                    backgroundColor: assembly.isOnline 
                      ? 'var(--status-danger)' 
                      : 'var(--status-online)',
                    border: 'none',
                    padding: '0.3rem',
                    fontSize: '0.8rem'
                  }}
                >
                  {assembly.isOnline ? 'Take Offline' : 'Bring Online'}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
