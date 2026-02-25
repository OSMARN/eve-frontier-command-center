import { useState, useEffect, useCallback } from 'react';
import { wsService } from '../services/websocketService';

export interface BlockchainEvent {
  type: string;
  data: any;
  timestamp: Date;
  display?: {
    icon: string;
    text: string;
    color: string;
  };
}

export function useWebSocket() {
  const [isConnected, setIsConnected] = useState(true);
  const [events, setEvents] = useState<BlockchainEvent[]>([]);
  const [lastEvent, setLastEvent] = useState<BlockchainEvent | null>(null);

  useEffect(() => {
    const handleEvent = (event: BlockchainEvent) => {
      setEvents(prev => [event, ...prev].slice(0, 50));
      setLastEvent(event);
    };

    wsService.subscribeToEvents(handleEvent);

    return () => {
      wsService.unsubscribeFromEvents(handleEvent);
    };
  }, []);

  const clearEvents = useCallback(() => {
    setEvents([]);
    setLastEvent(null);
  }, []);

  const formatEvent = useCallback((event: BlockchainEvent) => {
    const time = event.timestamp.toLocaleTimeString();
    
    if (event.display) {
      return {
        time,
        icon: event.display.icon,
        text: event.display.text,
        color: event.display.color
      };
    }
    
    switch (event.type) {
      case 'JumpEvent':
        return {
          time,
          icon: '🚪',
          text: `Gate jump: ${event.data.gateId || 'unknown'}`,
          color: '#00b8ff'
        };
      case 'InventoryUpdateEvent':
        return {
          time,
          icon: '📦',
          text: `Inventory updated: ${event.data.assemblyId || 'unknown'}`,
          color: '#ffaa00'
        };
      case 'AssemblyStatusEvent':
        return {
          time,
          icon: event.data.isOnline ? '🟢' : '🔴',
          text: `${event.data.assemblyId || 'Assembly'} is ${event.data.isOnline ? 'ONLINE' : 'OFFLINE'}`,
          color: event.data.isOnline ? '#00ff95' : '#ff4444'
        };
      default:
        return {
          time,
          icon: '📡',
          text: `${event.type}: ${JSON.stringify(event.data).slice(0, 50)}`,
          color: '#8b95a1'
        };
    }
  }, []);

  return {
    isConnected,
    events,
    lastEvent,
    clearEvents,
    formatEvent,
  };
}
