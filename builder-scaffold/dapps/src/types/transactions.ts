// Transaction types for EVE Frontier

export interface Transaction {
  digest: string;
  sender: string;
  timestamp: Date;
  status: 'pending' | 'success' | 'failed';
  type: 'toggle' | 'setToll' | 'setAccess' | 'transfer';
  details: any;
}

export interface PendingTransaction {
  id: string;
  assemblyId: string;
  assemblyName: string;
  action: string;
  status: 'pending' | 'success' | 'failed';
  timestamp: Date;
}
