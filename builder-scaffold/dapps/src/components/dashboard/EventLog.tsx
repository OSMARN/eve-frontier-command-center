import React, { useRef, useEffect, useState } from 'react';
import { BlockchainEvent, useWebSocket } from '../../hooks/useWebSocket';

interface EventLogProps {
  events: BlockchainEvent[];
  formatEvent: (event: BlockchainEvent) => any;
  onClear?: () => void;
}

export function EventLog({ events, formatEvent, onClear }: EventLogProps) {
  const logRef = useRef<HTMLDivElement>(null);
  
  // Load filter from localStorage or default to 'all'
  const [filter, setFilter] = useState<string>(() => {
    const saved = localStorage.getItem('eventLogFilter');
    return saved || 'all';
  });

  // Save filter to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('eventLogFilter', filter);
  }, [filter]);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [events]);

  const filteredEvents = events.filter(event => {
    if (filter === 'all') return true;
    if (filter === 'jump') return event.type === 'JumpEvent';
    if (filter === 'inventory') return event.type === 'InventoryUpdateEvent';
    if (filter === 'status') return event.type === 'AssemblyStatusEvent';
    return true;
  });

  const counts = {
    all: events.length,
    jump: events.filter(e => e.type === 'JumpEvent').length,
    inventory: events.filter(e => e.type === 'InventoryUpdateEvent').length,
    status: events.filter(e => e.type === 'AssemblyStatusEvent').length,
  };

  return (
    <div className="eve-card" style={{ 
      padding: '20px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '15px',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h3 style={{ 
            margin: 0, 
            color: 'var(--text-primary)',
            fontFamily: 'Orbitron, sans-serif',
            fontSize: 'clamp(0.9rem, 1.8vw, 1.1rem)'
          }}>
            EVENT LOG
          </h3>
          {events.length > 0 && (
            <span style={{
              backgroundColor: 'var(--accent-primary)',
              color: 'white',
              padding: '2px 8px',
              fontSize: '0.8rem'
            }}>
              {events.length}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
          <FilterButton 
            active={filter === 'all'} 
            onClick={() => setFilter('all')}
          >
            All ({counts.all})
          </FilterButton>
          <FilterButton 
            active={filter === 'jump'} 
            onClick={() => setFilter('jump')} 
            color="#00b8ff"
          >
            🚪 ({counts.jump})
          </FilterButton>
          <FilterButton 
            active={filter === 'inventory'} 
            onClick={() => setFilter('inventory')} 
            color="#ffaa00"
          >
            📦 ({counts.inventory})
          </FilterButton>
          <FilterButton 
            active={filter === 'status'} 
            onClick={() => setFilter('status')} 
            color="#00ff95"
          >
            ⚡ ({counts.status})
          </FilterButton>
        </div>

        {onClear && events.length > 0 && (
          <button
            onClick={onClear}
            style={{
              backgroundColor: 'transparent',
              border: '1px solid var(--border-color)',
              color: 'var(--text-secondary)',
              padding: '5px 12px',
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
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          padding: '8px',
          backgroundColor: 'var(--bg-secondary)',
          minHeight: 0
        }}
      >
        {filteredEvents.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            color: 'var(--text-muted)',
            padding: '20px',
            fontSize: '0.9rem'
          }}>
            No events yet
          </div>
        ) : (
          filteredEvents.map((event, index) => {
            const formatted = formatEvent(event);
            return (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 10px',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  fontSize: 'clamp(0.8rem, 1.5vw, 0.9rem)',
                  borderLeft: event.type === 'JumpEvent' ? '4px solid #00b8ff' : 
                              event.type === 'InventoryUpdateEvent' ? '4px solid #ffaa00' :
                              event.type === 'AssemblyStatusEvent' ? '4px solid #00ff95' : 
                              '4px solid var(--border-color)',
                  minHeight: '32px'
                }}
              >
                <span style={{ 
                  fontSize: '1rem', 
                  minWidth: '24px',
                  textAlign: 'center'
                }}>
                  {formatted.icon}
                </span>
                <span style={{ 
                  color: 'var(--text-secondary)', 
                  fontSize: '0.8rem',
                  minWidth: '65px'
                }}>
                  {formatted.time}
                </span>
                <span style={{ 
                  color: formatted.color || 'var(--text-primary)',
                  flex: 1,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {formatted.text}
                </span>
                {event.type === 'JumpEvent' && (
                  <span style={{
                    fontSize: '0.7rem',
                    backgroundColor: '#00b8ff20',
                    padding: '2px 6px',
                    color: '#00b8ff',
                    minWidth: '40px',
                    textAlign: 'center'
                  }}>
                    JUMP
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function FilterButton({ active, onClick, children, color }: any) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '5px 12px',
        backgroundColor: active ? (color || 'var(--accent-primary)') : 'transparent',
        border: '1px solid var(--border-color)',
        color: active ? (color ? (color === '#00ff95' ? 'black' : 'white') : 'white') : 'var(--text-secondary)',
        cursor: 'pointer',
        fontSize: '0.8rem',
        whiteSpace: 'nowrap',
        transition: 'all 0.2s ease'
      }}
    >
      {children}
    </button>
  );
}
