
import { formatDistanceToNow, subDays, subHours, subMinutes } from 'date-fns';

export interface Transaction {
  id: string;
  amount: number;
  timestamp: Date;
  merchantType: string;
  accountId: string;
  isLaundering: boolean;
  launderingType?: string;
  source: string;
  destination: string;
  purpose: string;
}

export interface Account {
  id: string;
  name: string;
  riskScore?: number;
}

export interface SuspiciousActivityReport {
  id: string;
  accountId: string;
  accountName: string;
  riskScore: number;
  flaggedTransactions: number;
  dateGenerated: Date;
  description: string;
}

// Generate random merchant types
const merchantTypes = [
  'Retail', 'Grocery', 'Restaurant', 'Travel', 'Utility', 
  'Entertainment', 'Transfer', 'Salary', 'ATM', 'Online'
];

// Generate random accounts
const generateAccounts = (count: number): Account[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `A${1000 + i}`,
    name: `Account ${1000 + i}`,
  }));
};

// Generate transaction purposes
const transactionPurposes = [
  'Purchase', 'Bill Payment', 'Salary', 'Investment', 'Loan Payment',
  'Rent', 'Gift', 'Services', 'Subscription', 'Other'
];

// Generate synthetic transaction data with configurable laundering patterns
export const generateTransactions = (
  count: number,
  smurfingPercent: number,
  layeringPercent: number,
  seed = 42
): { transactions: Transaction[], accounts: Account[] } => {
  // Initialize with seed for reproducibility
  const setSeed = (seed: number) => {
    Math.random = () => {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };
  };
  
  setSeed(seed);
  
  const accounts = generateAccounts(50);
  const transactions: Transaction[] = [];
  
  // Calculate the number of transactions for each type
  const smurfingCount = Math.floor(count * smurfingPercent);
  const layeringCount = Math.floor(count * layeringPercent);
  const normalCount = count - smurfingCount - layeringCount;
  
  // Generate normal transactions
  for (let i = 0; i < normalCount; i++) {
    const timestamp = subMinutes(new Date(), Math.floor(Math.random() * 60 * 24 * 7)); // Last week
    const sourceAccount = accounts[Math.floor(Math.random() * accounts.length)];
    let destAccount;
    do {
      destAccount = accounts[Math.floor(Math.random() * accounts.length)];
    } while (destAccount.id === sourceAccount.id);
    
    const amount = Math.floor(Math.random() * 500) + 50; // $50-$550
    const merchantType = merchantTypes[Math.floor(Math.random() * merchantTypes.length)];
    const purpose = transactionPurposes[Math.floor(Math.random() * transactionPurposes.length)];
    
    transactions.push({
      id: `TX${i}`,
      amount,
      timestamp,
      merchantType,
      accountId: sourceAccount.id,
      isLaundering: false,
      source: sourceAccount.name,
      destination: merchantType === 'Transfer' ? destAccount.name : merchantType,
      purpose
    });
  }
  
  // Generate smurfing transactions (many small amounts)
  for (let i = 0; i < smurfingCount; i++) {
    const timestamp = subMinutes(new Date(), Math.floor(Math.random() * 60 * 24 * 3)); // Last 3 days
    // Select same account for a group of transactions
    const sourceAccountIndex = Math.floor(Math.random() * accounts.length);
    let destAccountIndex;
    do {
      destAccountIndex = Math.floor(Math.random() * accounts.length);
    } while (destAccountIndex === sourceAccountIndex);
    
    transactions.push({
      id: `TX${normalCount + i}`,
      amount: Math.floor(Math.random() * 45) + 5, // $5-$50 small amounts
      timestamp,
      merchantType: 'Transfer',
      accountId: accounts[sourceAccountIndex].id,
      isLaundering: true,
      launderingType: 'Smurfing',
      source: accounts[sourceAccountIndex].name,
      destination: accounts[destAccountIndex].name,
      purpose: 'Transfer'
    });
  }
  
  // Generate layering transactions (chains of transfers)
  let currentIndex = normalCount + smurfingCount;
  for (let i = 0; i < layeringCount; i++) {
    const timestamp = subMinutes(new Date(), Math.floor(Math.random() * 60 * 24 * 5)); // Last 5 days
    // Create chains between a few accounts
    const sourceAccountIndex = Math.floor(Math.random() * (accounts.length / 2));
    const targetAccountIndex = Math.floor(Math.random() * (accounts.length / 2)) + accounts.length / 2;
    
    // Add high value transactions (for flagging)
    const amount = Math.floor(Math.random() * 2000) + 1000; // $1000-$3000 larger amounts
    
    transactions.push({
      id: `TX${currentIndex + i}`,
      amount,
      timestamp,
      merchantType: 'Transfer',
      accountId: accounts[i % 2 === 0 ? sourceAccountIndex : targetAccountIndex].id,
      isLaundering: true,
      launderingType: 'Layering',
      source: accounts[i % 2 === 0 ? sourceAccountIndex : targetAccountIndex].name,
      destination: accounts[i % 2 === 0 ? targetAccountIndex : sourceAccountIndex].name,
      purpose: 'Investment'
    });
  }
  
  // Flag transactions above 8500
  transactions.forEach(tx => {
    if (tx.amount > 8500) {
      tx.isLaundering = true;
      tx.launderingType = tx.launderingType || 'Large Amount';
    }
  });
  
  // Sort transactions by timestamp (newest first)
  transactions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  
  return { transactions, accounts };
};

// Generate synthetic SARs based on flagged transactions
export const generateSARs = (
  transactions: Transaction[], 
  accounts: Account[],
  riskScores: Record<string, number>
): SuspiciousActivityReport[] => {
  const accountTransactionMap: Record<string, Transaction[]> = {};
  
  // Group transactions by account
  transactions.forEach(tx => {
    if (tx.isLaundering) {
      if (!accountTransactionMap[tx.accountId]) {
        accountTransactionMap[tx.accountId] = [];
      }
      accountTransactionMap[tx.accountId].push(tx);
    }
  });
  
  // Generate SARs for accounts with suspicious transactions
  return Object.entries(accountTransactionMap).map(([accountId, txs], i) => {
    const account = accounts.find(a => a.id === accountId);
    const riskScore = riskScores[accountId] || (Math.random() * 0.5 + 0.5); // 0.5-1.0
    
    // Determine predominant laundering type
    const smurfingCount = txs.filter(tx => tx.launderingType === 'Smurfing').length;
    const layeringCount = txs.filter(tx => tx.launderingType === 'Layering').length;
    const largeAmountCount = txs.filter(tx => tx.launderingType === 'Large Amount').length;
    
    let predominantType = 'Unknown';
    if (smurfingCount > layeringCount && smurfingCount > largeAmountCount) {
      predominantType = 'Smurfing';
    } else if (layeringCount > smurfingCount && layeringCount > largeAmountCount) {
      predominantType = 'Layering';
    } else if (largeAmountCount > 0) {
      predominantType = 'Large Amount';
    }
    
    return {
      id: `SAR${i+1}`,
      accountId,
      accountName: account?.name || `Unknown Account`,
      riskScore,
      flaggedTransactions: txs.length,
      dateGenerated: new Date(),
      description: `Suspicious ${predominantType} pattern detected: ${txs.length} flagged transactions over ${formatDistanceToNow(txs[txs.length-1].timestamp)}.`
    };
  });
};
