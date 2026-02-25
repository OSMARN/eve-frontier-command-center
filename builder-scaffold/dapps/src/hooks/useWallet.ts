import { useState, useCallback } from 'react';
import { getBalance } from '../services/rpcClient';

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

  const connect = useCallback(async () => {
    setWallet(prev => ({ ...prev, isConnecting: true }));
    
    try {
      const adminAddress = '0xf081b74773489595dbb8d99c46e1654b5596353f195e4af9eeb77336a2bc0308';
      const balance = await getBalance(adminAddress);
      
      setWallet({
        address: adminAddress,
        balance: balance?.totalBalance || '1000000000000',
        isConnected: true,
        isConnecting: false,
      });
    } catch (error) {
      console.error('Connection error:', error);
      setWallet(prev => ({ ...prev, isConnecting: false }));
    }
  }, []);

  const disconnect = useCallback(() => {
    setWallet({
      address: null,
      balance: null,
      isConnected: false,
      isConnecting: false,
    });
  }, []);

  // New function to update balance directly (for demo mode)
  const updateBalance = useCallback((newBalance: string) => {
    setWallet(prev => ({
      ...prev,
      balance: newBalance
    }));
  }, []);

  const refreshBalance = useCallback(async () => {
    if (!wallet.address) return;
    
    try {
      const balance = await getBalance(wallet.address);
      if (balance) {
        setWallet(prev => ({
          ...prev,
          balance: balance.totalBalance
        }));
      }
    } catch (error) {
      console.error('Failed to refresh balance:', error);
    }
  }, [wallet.address]);

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
    refreshBalance,
    updateBalance,  // New function for demo mode
    formatAddress,
    formatBalance,
  };
}
