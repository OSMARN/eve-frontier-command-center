import React from 'react';
import { Assembly } from '../../types/assembly';

interface AssemblyListProps {
  assemblies: Assembly[];
  loading: boolean;
}

export function AssemblyList({ assemblies, loading }: AssemblyListProps) {
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
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.2rem' }}>{getTypeIcon(assembly.type)}</span>
                <span style={{ fontWeight: 'bold' }}>{assembly.name}</span>
              </div>
              <span style={{ 
                color: getStatusColor(assembly.isOnline),
                fontSize: '0.9rem'
              }}>
                {assembly.isOnline ? '● ONLINE' : '○ OFFLINE'}
              </span>
            </div>

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
              
              {assembly.type === 'gate' && assembly.toll !== undefined && (
                <>
                  <span>Toll:</span>
                  <span style={{ color: 'var(--text-primary)' }}>
                    {assembly.toll} EVE
                  </span>
                </>
              )}

              {assembly.type === 'storage' && assembly.itemCount !== undefined && (
                <>
                  <span>Items:</span>
                  <span style={{ color: 'var(--text-primary)' }}>
                    {assembly.itemCount} / {assembly.capacity}
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
          </div>
        ))}
      </div>
    </div>
  );
}
