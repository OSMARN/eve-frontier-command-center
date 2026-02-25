// Simple RPC client for Sui blockchain
export const RPC_URL = 'http://127.0.0.1:9000';

// Generic RPC call function
async function rpcCall(method: string, params: any[] = []) {
  try {
    const response = await fetch(RPC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method,
        params,
      }),
    });
    
    const data = await response.json();
    if (data.error) {
      console.error('RPC error:', data.error);
      return null;
    }
    return data.result;
  } catch (error) {
    console.error('RPC call failed:', error);
    return null;
  }
}

// Get balance for an address
export async function getBalance(address: string) {
  const result = await rpcCall('suix_getBalance', [address]);
  return result;
}

// Get owned objects
export async function getOwnedObjects(address: string) {
  const result = await rpcCall('suix_getOwnedObjects', [address, {
    options: { showContent: true }
  }]);
  return result;
}

// Get object details
export async function getObject(id: string) {
  const result = await rpcCall('sui_getObject', [id, {
    showContent: true
  }]);
  return result;
}
