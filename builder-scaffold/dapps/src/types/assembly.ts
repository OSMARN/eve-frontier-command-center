// Types for Smart Assemblies in EVE Frontier

export type AssemblyType = 'gate' | 'storage' | 'turret' | 'unknown';

export interface Assembly {
  id: string;
  type: AssemblyType;
  name: string;
  isOnline: boolean;
  fuelAmount?: number;
  maxFuel?: number;
  location?: {
    x: number;
    y: number;
    z: number;
  };
  // Gate specific
  isLinked?: boolean;
  destinationId?: string;
  toll?: number;
  // Storage specific
  itemCount?: number;
  capacity?: number;
  value?: number;
}

// Mock data for testing (will be replaced with real data)
export const MOCK_ASSEMBLIES: Assembly[] = [
  {
    id: '0x1234...5678',
    type: 'gate',
    name: 'Alpha Gate',
    isOnline: true,
    fuelAmount: 7500,
    maxFuel: 10000,
    location: { x: 100, y: 200, z: 300 },
    isLinked: true,
    destinationId: '0x8765...4321',
    toll: 10
  },
  {
    id: '0x8765...4321',
    type: 'storage',
    name: 'Main Storage',
    isOnline: true,
    itemCount: 124,
    capacity: 200,
    value: 15234,
    location: { x: 150, y: 250, z: 350 }
  },
  {
    id: '0x9876...1234',
    type: 'gate',
    name: 'Beta Gate',
    isOnline: false,
    fuelAmount: 0,
    maxFuel: 10000,
    location: { x: -100, y: -200, z: -300 },
    isLinked: false
  }
];
