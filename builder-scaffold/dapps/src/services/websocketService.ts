// WebSocket service - currently disabled (Sui version doesn't support WebSocket)
// Using polling as fallback

export const WS_URL = 'ws://127.0.0.1:9000';
export const RPC_URL = 'http://127.0.0.1:9000';

type EventCallback = (data: any) => void;

class PollingService {
  private subscribers: Map<string, EventCallback[]> = new Map();
  private interval: NodeJS.Timeout | null = null;
  private lastChecked: number = Date.now();

  // Start polling for events
  startPolling(intervalMs: number = 5000) {
    if (this.interval) return;

    this.interval = setInterval(() => {
      this.checkForEvents();
    }, intervalMs);

    console.log('Polling started');
  }

  // Stop polling
  stopPolling() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
      console.log('Polling stopped');
    }
  }

  // Check for new events (mock implementation)
  private async checkForEvents() {
    try {
      // In a real implementation, you would fetch recent transactions
      // For now, generate mock events occasionally
      if (Math.random() < 0.3) { // 30% chance of new event
        const mockEvent = this.generateMockEvent();
        this.notifySubscribers('event', mockEvent);
      }
    } catch (error) {
      console.error('Polling error:', error);
    }
  }

  // Generate mock events for demonstration
  private generateMockEvent() {
    const eventTypes = [
      {
        type: 'JumpEvent',
        icon: '🚪',
        text: 'Gate jump detected',
        color: '#00b8ff'
      },
      {
        type: 'InventoryUpdateEvent',
        icon: '📦',
        text: 'Storage inventory updated',
        color: '#ffaa00'
      },
      {
        type: 'AssemblyStatusEvent',
        icon: Math.random() > 0.5 ? '🟢' : '🔴',
        text: Math.random() > 0.5 ? 'Assembly ONLINE' : 'Assembly OFFLINE',
        color: Math.random() > 0.5 ? '#00ff95' : '#ff4444'
      }
    ];

    const randomEvent = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    
    return {
      type: randomEvent.type,
      data: {
        assemblyId: `0x${Math.random().toString(16).slice(2, 10)}`,
        isOnline: randomEvent.icon === '🟢'
      },
      timestamp: new Date(),
      display: randomEvent
    };
  }

  // Subscribe to events
  subscribeToEvents(callback: EventCallback) {
    if (!this.subscribers.has('event')) {
      this.subscribers.set('event', []);
    }
    this.subscribers.get('event')!.push(callback);
    this.startPolling(); // Start polling when first subscriber appears
  }

  // Unsubscribe from events
  unsubscribeFromEvents(callback: EventCallback) {
    const callbacks = this.subscribers.get('event') || [];
    const index = callbacks.indexOf(callback);
    if (index > -1) {
      callbacks.splice(index, 1);
    }
    
    // Stop polling if no subscribers left
    if (this.subscribers.get('event')?.length === 0) {
      this.stopPolling();
    }
  }

  // Notify all subscribers
  private notifySubscribers(eventType: string, data: any) {
    const callbacks = this.subscribers.get(eventType) || [];
    callbacks.forEach(cb => cb(data));
  }
}

export const wsService = new PollingService();
