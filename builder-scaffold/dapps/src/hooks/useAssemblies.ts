import { useState, useEffect, useCallback } from 'react';
import { MOCK_ASSEMBLIES, Assembly } from '../types/assembly';

export function useAssemblies(address: string | null) {
  const [assemblies, setAssemblies] = useState<Assembly[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load mock assemblies
  const loadAssemblies = useCallback(async () => {
    if (!address) {
      setAssemblies([]);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // Always use mock data for testing
      setAssemblies(MOCK_ASSEMBLIES);
    } catch (err) {
      console.error('Failed to load assemblies:', err);
      setError('Failed to load assemblies');
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    loadAssemblies();
  }, [address, loadAssemblies]);

  // Toggle assembly status
  const toggleAssemblyStatus = useCallback((assemblyId: string) => {
    setAssemblies(prev => 
      prev.map(a => 
        a.id === assemblyId 
          ? { ...a, isOnline: !a.isOnline }
          : a
      )
    );
  }, []);

  // Set gate toll
  const setGateToll = useCallback((gateId: string, toll: number) => {
    setAssemblies(prev => 
      prev.map(a => 
        a.id === gateId && a.type === 'gate'
          ? { ...a, toll }
          : a
      )
    );
  }, []);

  // Set gate access
  const setGateAccess = useCallback((gateId: string, isPublic: boolean) => {
    console.log(`Gate ${gateId} access set to: ${isPublic ? 'public' : 'restricted'}`);
    // In a real app, this would update the blockchain
  }, []);

  // Calculate clan stats
  const stats = {
    total: assemblies.length,
    online: assemblies.filter(a => a.isOnline).length,
    gates: assemblies.filter(a => a.type === 'gate').length,
    storages: assemblies.filter(a => a.type === 'storage').length,
    turrets: assemblies.filter(a => a.type === 'turret').length,
    totalFuel: assemblies.reduce((sum, a) => sum + (a.fuelAmount || 0), 0),
    totalValue: assemblies.reduce((sum, a) => sum + (a.value || 0), 0),
  };

  return {
    assemblies,
    loading,
    error,
    stats,
    toggleAssemblyStatus,
    setGateToll,
    setGateAccess,
  };
}
