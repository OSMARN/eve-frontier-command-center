import React, { useRef, useEffect, useState } from 'react';
import { BlockchainEvent, useWebSocket } from '../../hooks/useWebSocket';

interface EventLogProps {
  events: BlockchainEvent[];
  formatEvent: (event: BlockchainEvent) => any;
  onClear?: () => void;
}

const STORAGE_KEYS = {
  FILTER: 'eventLogFilter',
  EVENTS: 'eventLogEvents'
};

export function EventLog({ events: newEvents, formatEvent, onClear }: EventLogProps) {
  const logRef = useRef<HTMLDivElement>(null);
  
  const [events, setEvents] = useState<BlockchainEvent[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.EVENTS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((e: any) => ({
          ...e,
          timestamp: new Date(e.timestamp)
        }));
      } catch (e) {
        console.error('Failed to load saved events:', e);
        return [];
      }
    }
    return [];
  });

  const [filter, setFilter] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FILTER);
    return saved || 'all';
  });

  useEffect(() => {
    if (newEvents.length > 0) {
      setEvents(prev => {
        const combined = [...newEvents, ...prev];
        const unique = combined.filter((event, index, self) =>
          index === self.findIndex(e => 
            e.timestamp.getTime() === event.timestamp.getTime()
          )
        );
        
        const limited = unique.slice(0, 1000);
        
        localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(limited));
        
        return limited;
      });
    }
  }, [newEvents]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FILTER, filter);
  }, [filter]);

  useEffect(() => {
    if (logRef.current && filter === 'all') {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [events, filter]);

  const filteredEvents = events.filter(event => {
    if (filter === 'all') return true;
    if (filter === 'jump') return event.type === 'JumpEvent';
    if (filter === 'inventory') return event.type === 'InventoryUpdateEvent';
    if (filter === 'status') return event.type === 'AssemblyStatusEvent';
    return true;
  });

  const stats = {
    all: events.length,
    jump: events.filter(e => e.type === 'JumpEvent').length,
    inventory: events.filter(e => e.type === 'InventoryUpdateEvent').length,
    status: events.filter(e => e.type === 'AssemblyStatusEvent').length,
    lastHour: events.filter(e => 
      e.timestamp > new Date(Date.now() - 60 * 60 * 1000)
    ).length,
    lastDay: events.filter(e => 
      e.timestamp > new Date(Date.now() - 24 * 60 * 60 * 1000)
    ).length
  };

  const handleClear = () => {
    setEvents([]);
    localStorage.removeItem(STORAGE_KEYS.EVENTS);
    if (onClear) onClear();
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
            All ({stats.all})
          </FilterButton>
          <FilterButton 
            active={filter === 'jump'} 
            onClick={() => setFilter('jump')} 
            color="#00b8ff"
          >
            🚪 ({stats.jump})
          </FilterButton>
          <FilterButton 
            active={filter === 'inventory'} 
            onClick={() => setFilter('inventory')} 
            color="#ffaa00"
          >
            📦 ({stats.inventory})
          </FilterButton>
          <FilterButton 
            active={filter === 'status'} 
            onClick={() => setFilter('status')} 
            color="#00ff95"
          >
            ⚡ ({stats.status})
          </FilterButton>
        </div>

        {events.length > 0 && (
          <button
            onClick={handleClear}
            style={{
              backgroundColor: 'transparent',
              border: '1px solid var(--border-color)',
              color: 'var(--text-secondary)',
              padding: '5px 12px',
              fontSize: '0.8rem',
              cursor: 'pointer'
            }}
          >
            Clear History
          </button>
        )}
      </div>

      {events.length > 0 && (
        <div style={{
          display: 'flex',
          gap: '15px',
          marginBottom: '10px',
          padding: '8px',
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          fontSize: '0.8rem'
        }}>
          <div>
            <span style={{ color: 'var(--text-secondary)' }}>Last Hour: </span>
            <span style={{ color: '#FF4700', fontWeight: 'bold' }}>{stats.lastHour}</span>
          </div>
          <div>
            <span style={{ color: 'var(--text-secondary)' }}>Last 24h: </span>
            <span style={{ color: '#FF4700', fontWeight: 'bold' }}>{stats.lastDay}</span>
          </div>
          <div>
            <span style={{ color: 'var(--text-secondary)' }}>Total: </span>
            <span style={{ color: '#FF4700', fontWeight: 'bold' }}>{stats.all}</span>
          </div>
        </div>
      )}

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
                key={`${event.timestamp.getTime()}-${index}`}
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
