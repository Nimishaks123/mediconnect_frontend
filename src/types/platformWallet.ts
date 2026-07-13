export interface PlatformWallet {
  walletId: string;
  balance: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface PlatformWalletTransaction {
  id: string;
  transactionRef: string;
  appointmentId?: string;
  amount: number;
  description: string;
  type: string;
  source: string;
  createdAt: string;
}

export interface PlatformWalletResponse {
  walletId: string;
  balance: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface PlatformWalletTransactionResponse {
  transactions: PlatformWalletTransaction[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}