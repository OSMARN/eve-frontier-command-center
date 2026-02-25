import { useState } from 'react';
import { getBalance } from '../services/blockchain';

export interface WalletState {
  address: string | null;
  balance: string | null;
  isConnected: boolean;
  isConnecting: boolean;
}

export function useWallet() {
  const [wallet, setWallet] = useState<WalletState>({
    address: null,
    balance: null,
    isConnected: false,
    isConnecting: false,
  });

  const connect = async () => {
    setWallet(prev => ({ ...prev, isConnecting: true }));
    
    try {
      // Mock admin address
      const adminAddress = '0xf081b74773489595dbb8d99c46e1654b5596353f195e4af9eeb77336a2bc0308';
      
      // Use mock getBalance
      const balance = await getBalance(adminAddress);
      
      setWallet({
        address: adminAddress,
        balance: balance.totalBalance,
        isConnected: true,
        isConnecting: false,
      });
    } catch (error) {
      console.error('Connection error:', error);
      setWallet(prev => ({ ...prev, isConnecting: false }));
    }
  };

  const disconnect = () => {
    setWallet({
      address: null,
      balance: null,
      isConnected: false,
      isConnecting: false,
    });
  };

  const formatAddress = (addr: string | null) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formatBalance = (balance: string | null) => {
    if (!balance) return '0';
    const suiBalance = parseInt(balance) / 1_000_000_000;
    return suiBalance.toFixed(2);
  };

  return {
    ...wallet,
    connect,
    disconnect,
    formatAddress,
    formatBalance,
  };
}
