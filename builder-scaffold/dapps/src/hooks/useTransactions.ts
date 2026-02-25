import { useState, useCallback } from 'react';
import { 
  sendTransaction, 
  toggleAssemblyStatus,
  setGateToll,
  setGateAccess,
  TransactionResult 
} from '../services/transactionService';
import { PendingTransaction } from '../types/transactions';

export function useTransactions(ownerAddress: string | null) {
  const [pendingTransactions, setPendingTransactions] = useState<PendingTransaction[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Execute a transaction
  const executeTransaction = useCallback(async (
    assemblyId: string,
    assemblyName: string,
    action: string,
    transactionFn: () => Promise<TransactionResult>
  ) => {
    if (!ownerAddress) {
      console.error('No wallet connected');
      return null;
    }

    // Add to pending
    const pendingId = Date.now().toString();
    const pending: PendingTransaction = {
      id: pendingId,
      assemblyId,
      assemblyName,
      action,
      status: 'pending',
      timestamp: new Date()
    };

    setPendingTransactions(prev => [pending, ...prev]);
    setIsProcessing(true);

    try {
      const result = await transactionFn();

      // Update pending transaction status
      setPendingTransactions(prev =>
        prev.map(tx =>
          tx.id === pendingId
            ? { ...tx, status: result.success ? 'success' : 'failed' }
            : tx
        )
      );

      if (result.success) {
        console.log(`Transaction successful: ${result.digest}`);
      } else {
        console.error(`Transaction failed: ${result.error}`);
      }

      return result;
    } catch (error) {
      setPendingTransactions(prev =>
        prev.map(tx =>
          tx.id === pendingId
            ? { ...tx, status: 'failed' }
            : tx
        )
      );
      console.error('Transaction error:', error);
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, [ownerAddress]);

  // Toggle assembly status
  const toggleStatus = useCallback(async (
    assemblyId: string,
    assemblyName: string,
    currentStatus: boolean
  ) => {
    return executeTransaction(
      assemblyId,
      assemblyName,
      `Toggle ${currentStatus ? 'off' : 'on'}`,
      () => toggleAssemblyStatus(assemblyId, ownerAddress!, currentStatus)
    );
  }, [ownerAddress, executeTransaction]);

  // Set gate toll
  const setToll = useCallback(async (
    gateId: string,
    gateName: string,
    tollAmount: number
  ) => {
    return executeTransaction(
      gateId,
      gateName,
      `Set toll to ${tollAmount} EVE`,
      () => setGateToll(gateId, ownerAddress!, tollAmount)
    );
  }, [ownerAddress, executeTransaction]);

  // Set gate access
  const setAccess = useCallback(async (
    gateId: string,
    gateName: string,
    isPublic: boolean,
    allowedTribe?: string
  ) => {
    return executeTransaction(
      gateId,
      gateName,
      `Set access to ${isPublic ? 'public' : 'restricted'}`,
      () => setGateAccess(gateId, ownerAddress!, isPublic, allowedTribe)
    );
  }, [ownerAddress, executeTransaction]);

  // Clear old transactions
  const clearOldTransactions = useCallback(() => {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    setPendingTransactions(prev =>
      prev.filter(tx => tx.timestamp > oneHourAgo)
    );
  }, []);

  return {
    pendingTransactions,
    isProcessing,
    toggleStatus,
    setToll,
    setAccess,
    clearOldTransactions,
  };
}
