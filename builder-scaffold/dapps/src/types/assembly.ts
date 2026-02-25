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

// Mock data with GATES for testing
export const MOCK_ASSEMBLIES: Assembly[] = [
  {
    id: 'gate-alpha-001',
    type: 'gate',
    name: 'Alpha Gate',
    isOnline: false,
    fuelAmount: 7500,
    maxFuel: 10000,
    location: { x: 100, y: 200, z: 300 },
    isLinked: true,
    destinationId: 'gate-beta-002',
    toll: 10
  },
  {
    id: 'gate-beta-002',
    type: 'gate',
    name: 'Beta Gate',
    isOnline: false,
    fuelAmount: 5000,
    maxFuel: 10000,
    location: { x: -100, y: -200, z: -300 },
    isLinked: true,
    destinationId: 'gate-alpha-001',
    toll: 15
  },
  {
    id: 'storage-main-001',
    type: 'storage',
    name: 'Main Storage',
    isOnline: true,
    itemCount: 124,
    capacity: 200,
    value: 15234,
    location: { x: 150, y: 250, z: 350 }
  },
  {
    id: 'gate-gamma-003',
    type: 'gate',
    name: 'Gamma Gate',
    isOnline: false,
    fuelAmount: 2000,
    maxFuel: 10000,
    location: { x: 300, y: 400, z: 500 },
    isLinked: false,
    toll: 5
  },
  {
    id: 'turret-north-001',
    type: 'turret',
    name: 'North Turret',
    isOnline: true,
    location: { x: 50, y: 50, z: 50 }
  }
];
