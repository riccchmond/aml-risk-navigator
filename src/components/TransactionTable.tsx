
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Transaction } from '@/lib/mockData';
import { AlertTriangle, CheckCircle, Filter } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';

interface TransactionTableProps {
  transactions: Transaction[];
  onSelectTransaction: (transaction: Transaction) => void;
}

const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  onSelectTransaction,
}) => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTransactions = transactions.filter(tx => {
    // Apply filter
    if (filter === 'suspicious' && !tx.isLaundering) return false;
    if (filter === 'normal' && tx.isLaundering) return false;
    
    // Apply search
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        tx.id.toLowerCase().includes(searchLower) ||
        tx.accountId.toLowerCase().includes(searchLower) ||
        tx.merchantType.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold">Recent Transactions</CardTitle>
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-60"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-1" /> Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setFilter('all')}>
                  All Transactions
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter('suspicious')}>
                  Suspicious Only
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter('normal')}>
                  Normal Only
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-32">ID</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Account</TableHead>
                <TableHead>Merchant</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="w-20 text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                    No transactions match your filters
                  </TableCell>
                </TableRow>
              ) : (
                filteredTransactions.slice(0, 15).map((transaction) => (
                  <TableRow 
                    key={transaction.id} 
                    className={transaction.isLaundering ? "bg-red-50/50" : ""}
                    onClick={() => onSelectTransaction(transaction)}
                    style={{ cursor: 'pointer' }}
                  >
                    <TableCell className="font-medium">{transaction.id}</TableCell>
                    <TableCell>{format(transaction.timestamp, 'MMM d, h:mm a')}</TableCell>
                    <TableCell>{transaction.accountId}</TableCell>
                    <TableCell>
                      {transaction.merchantType}
                      {transaction.launderingType && (
                        <Badge variant="destructive" className="ml-2">
                          {transaction.launderingType}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">${transaction.amount.toFixed(2)}</TableCell>
                    <TableCell className="text-center">
                      {transaction.isLaundering ? (
                        <AlertTriangle className="h-5 w-5 text-red-500 inline" />
                      ) : (
                        <CheckCircle className="h-5 w-5 text-green-500 inline" />
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <div className="mt-2 text-xs text-right text-muted-foreground">
          Showing {Math.min(15, filteredTransactions.length)} of {filteredTransactions.length} transactions. Click on a row to see details.
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionTable;
