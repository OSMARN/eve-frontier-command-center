import { SuiClient } from '@mysten/sui/client';
import { getFullnodeUrl } from '@mysten/sui/client';

// Local blockchain configuration
export const NETWORK = 'local';
export const LOCAL_NODE_URL = 'http://127.0.0.1:9000';

// Create Sui client instance
export const suiClient = new SuiClient({ 
  url: LOCAL_NODE_URL 
});

// Fetch balance for a given address
export async function getBalance(address: string) {
  try {
    const balance = await suiClient.getBalance({
      owner: address,
    });
    return balance;
  } catch (error) {
    console.error('Error fetching balance:', error);
    return null;
  }
}

// Fetch objects owned by address
export async function getOwnedObjects(address: string) {
  try {
    const objects = await suiClient.getOwnedObjects({
      owner: address,
    });
    return objects;
  } catch (error) {
    console.error('Error fetching owned objects:', error);
    return [];
  }
}
