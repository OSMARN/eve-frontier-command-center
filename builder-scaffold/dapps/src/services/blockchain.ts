import { SuiClient } from '@mysten/sui/dist/client';

// Local blockchain configuration
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
