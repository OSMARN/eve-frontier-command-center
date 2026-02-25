// Mock blockchain service for development
export const LOCAL_NODE_URL = 'http://127.0.0.1:9000';

// Mock data for testing
const MOCK_ADDRESS = '0xf081b74773489595dbb8d99c46e1654b5596353f195e4af9eeb77336a2bc0308';
const MOCK_BALANCE = '1000000000000'; // 1000 SUI in MIST

// Mock getBalance function
export async function getBalance(address: string) {
  console.log('Mock getBalance called with:', address);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    totalBalance: MOCK_BALANCE
  };
}
