
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Transaction } from '@/lib/mockData';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, ArrowRight, Calendar, CircleDollarSign, Store, Tag } from 'lucide-react';

interface TransactionDetailsProps {
  transaction: Transaction | null;
}

const TransactionDetails: React.FC<TransactionDetailsProps> = ({ transaction }) => {
  if (!transaction) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Transaction Details</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64 text-muted-foreground">
          Select a transaction to view details
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold flex items-center">
            Transaction Details
            {transaction.isLaundering && (
              <Badge variant="destructive" className="ml-2">
                {transaction.launderingType || 'Suspicious'}
              </Badge>
            )}
          </CardTitle>
          <div className="text-sm font-mono text-muted-foreground">{transaction.id}</div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground">Date & Time</div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-primary" />
                <span>{format(transaction.timestamp, 'PPpp')}</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground">Amount</div>
              <div className="flex items-center">
                <CircleDollarSign className="h-4 w-4 mr-2 text-primary" />
                <span className="font-bold">${transaction.amount.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="text-sm font-medium text-muted-foreground">Account ID</div>
            <div className="font-mono">{transaction.accountId}</div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground">Source</div>
              <div className="font-medium">{transaction.source}</div>
            </div>
            
            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground">Destination</div>
              <div className="font-medium">{transaction.destination}</div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground">Merchant Type</div>
              <div className="flex items-center">
                <Store className="h-4 w-4 mr-2 text-primary" />
                <span>{transaction.merchantType}</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground">Purpose</div>
              <div className="flex items-center">
                <Tag className="h-4 w-4 mr-2 text-primary" />
                <span>{transaction.purpose}</span>
              </div>
            </div>
          </div>
          
          {transaction.isLaundering && (
            <div className="mt-6 p-3 bg-red-50 border border-red-100 rounded-md">
              <div className="flex items-center text-red-600">
                <AlertTriangle className="h-5 w-5 mr-2" />
                <span className="font-medium">Risk Factors</span>
              </div>
              <ul className="mt-2 list-disc list-inside text-sm">
                {transaction.launderingType === 'Smurfing' && (
                  <li>Multiple small transactions in short period</li>
                )}
                {transaction.launderingType === 'Layering' && (
                  <li>Complex chain of transfers between accounts</li>
                )}
                {transaction.launderingType === 'Large Amount' && (
                  <li>Unusually large transaction amount (${transaction.amount.toFixed(2)})</li>
                )}
                {transaction.amount > 8500 && (
                  <li>Transaction amount exceeds reporting threshold ($8,500)</li>
                )}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionDetails;
