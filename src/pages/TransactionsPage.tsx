
import React, { useState } from 'react';
import { Transaction } from '@/lib/mockData';
import TransactionTable from '@/components/TransactionTable';
import TransactionDetails from '@/components/TransactionDetails';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface TransactionsPageProps {
  transactions: Transaction[];
}

const TransactionsPage: React.FC<TransactionsPageProps> = ({ transactions }) => {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  
  const handleSelectTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Transactions</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>Transaction Analysis</CardTitle>
          <CardDescription>View and analyze all transaction data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3">
              <TransactionTable 
                transactions={transactions} 
                onSelectTransaction={handleSelectTransaction} 
              />
            </div>
            <div className="lg:col-span-2">
              <TransactionDetails transaction={selectedTransaction} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionsPage;
