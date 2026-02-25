import React, { useRef, useEffect } from 'react';
import { BlockchainEvent, useWebSocket } from '../../hooks/useWebSocket';

interface EventLogProps {
  events: BlockchainEvent[];
  formatEvent: (event: BlockchainEvent) => any;
  onClear?: () => void;
}

export function EventLog({ events, formatEvent, onClear }: EventLogProps) {
  const logRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new events
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [events]);

  return (
    <div className="eve-card" style={{ 
      padding: '1.5rem',
      gridColumn: 'span 2',
      marginTop: '1rem'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <h3 style={{ 
            margin: 0, 
            color: 'var(--text-primary)',
            fontFamily: 'Orbitron, sans-serif',
            fontSize: '1rem'
          }}>
            EVENT LOG
          </h3>
          {events.length > 0 && (
            <span style={{
              backgroundColor: 'var(--accent-primary)',
              color: 'white',
              padding: '0.2rem 0.5rem',
              borderRadius: '4px',
              fontSize: '0.8rem'
            }}>
              {events.length}
            </span>
          )}
        </div>
        {onClear && events.length > 0 && (
          <button
            onClick={onClear}
            style={{
              backgroundColor: 'transparent',
              border: '1px solid var(--border-color)',
              color: 'var(--text-secondary)',
              padding: '0.3rem 0.8rem',
              borderRadius: '4px',
              fontSize: '0.8rem',
              cursor: 'pointer'
            }}
          >
            Clear
          </button>
        )}
      </div>

      <div
        ref={logRef}
        style={{
          maxHeight: '200px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          padding: '0.5rem',
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: '4px'
        }}
      >
        {events.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            color: 'var(--text-muted)',
            padding: '1rem'
          }}>
            No events yet. Waiting for blockchain activity...
          </div>
        ) : (
          events.map((event, index) => {
            const formatted = formatEvent(event);
            return (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '4px',
                  fontSize: '0.9rem'
                }}
              >
                <span style={{ fontSize: '1.1rem' }}>{formatted.icon}</span>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                  {formatted.time}
                </span>
                <span style={{ color: formatted.color || 'var(--text-primary)' }}>
                  {formatted.text}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
