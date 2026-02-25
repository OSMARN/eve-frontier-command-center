import { useState, useEffect } from 'react';
import { getOwnedObjects, getObject } from '../services/rpcClient';
import { Assembly, AssemblyType, MOCK_ASSEMBLIES } from '../types/assembly';

export function useAssemblies(address: string | null) {
  const [assemblies, setAssemblies] = useState<Assembly[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!address) {
      setAssemblies([]);
      return;
    }

    const loadAssemblies = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Try to get real data from blockchain
        const objects = await getOwnedObjects(address);
        
        if (objects?.data?.length > 0) {
          // Parse real objects
          const parsed = objects.data
            .map((item: any) => parseAssembly(item))
            .filter((a: Assembly | null) => a !== null);
          setAssemblies(parsed);
        } else {
          // Use mock data for development
          console.log('No objects found, using mock data');
          setAssemblies(MOCK_ASSEMBLIES);
        }
      } catch (err) {
        console.error('Failed to load assemblies:', err);
        setError('Failed to load assemblies');
        setAssemblies(MOCK_ASSEMBLIES); // Fallback to mock
      } finally {
        setLoading(false);
      }
    };

    loadAssemblies();
  }, [address]);

  // Parse blockchain object into Assembly type
  const parseAssembly = (obj: any): Assembly | null => {
    try {
      const content = obj?.data?.content;
      if (!content) return null;

      // Determine type based on content
      let type: AssemblyType = 'unknown';
      if (content.type?.includes('gate')) type = 'gate';
      else if (content.type?.includes('storage')) type = 'storage';
      else if (content.type?.includes('turret')) type = 'turret';

      return {
        id: obj.data.objectId || obj.data.objectId,
        type,
        name: `Assembly ${obj.data.objectId?.slice(0, 8)}`,
        isOnline: content.fields?.is_online || false,
        fuelAmount: content.fields?.fuel_amount,
        maxFuel: content.fields?.max_fuel,
      };
    } catch (e) {
      console.error('Parse error:', e);
      return null;
    }
  };

  // Calculate clan stats
  const stats = {
    total: assemblies.length,
    online: assemblies.filter(a => a.isOnline).length,
    gates: assemblies.filter(a => a.type === 'gate').length,
    storages: assemblies.filter(a => a.type === 'storage').length,
    totalFuel: assemblies.reduce((sum, a) => sum + (a.fuelAmount || 0), 0),
    totalValue: assemblies.reduce((sum, a) => sum + (a.value || 0), 0),
  };

  return {
    assemblies,
    loading,
    error,
    stats,
  };
}
