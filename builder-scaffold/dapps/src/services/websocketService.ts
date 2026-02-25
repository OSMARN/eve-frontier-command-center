// WebSocket service - using polling fallback
export const RPC_URL = 'http://127.0.0.1:9000';

type EventCallback = (data: any) => void;

class PollingService {
  private subscribers: Map<string, EventCallback[]> = new Map();
  private interval: NodeJS.Timeout | null = null;
  private lastChecked: number = Date.now();
  private jumpCount: number = 0;

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
      // Generate different types of events
      if (Math.random() < 0.2) { // 20% chance of JumpEvent
        this.generateJumpEvent();
      }
      if (Math.random() < 0.3) { // 30% chance of other events
        const mockEvent = this.generateMockEvent();
        this.notifySubscribers('event', mockEvent);
      }
    } catch (error) {
      console.error('Polling error:', error);
    }
  }

  // Generate JumpEvent specifically
  private generateJumpEvent() {
    this.jumpCount++;
    
    const gates = ['Alpha Gate', 'Beta Gate', 'Gamma Gate', 'Delta Gate'];
    const fromGate = gates[Math.floor(Math.random() * gates.length)];
    const toGate = gates[Math.floor(Math.random() * gates.length)];
    
    const jumpEvent = {
      type: 'JumpEvent',
      data: {
        gateId: fromGate.toLowerCase().replace(' ', '-'),
        fromGate: fromGate,
        toGate: toGate,
        character: `0x${Math.random().toString(16).slice(2, 10)}`,
        toll: Math.floor(Math.random() * 100),
        timestamp: new Date().toISOString()
      },
      timestamp: new Date(),
      display: {
        icon: '🚪',
        text: `Jump: ${fromGate} → ${toGate}`,
        color: '#00b8ff'
      }
    };
    
    this.notifySubscribers('event', jumpEvent);
    console.log('JumpEvent generated:', jumpEvent.data);
  }

  // Generate mock events for demonstration
  private generateMockEvent() {
    const eventTypes = [
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
    this.startPolling();
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
