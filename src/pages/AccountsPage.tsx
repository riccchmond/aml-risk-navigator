
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface Account {
  id: string;
  name: string;
  balance: number;
  riskScore: number;
  transactionCount: number;
}

interface AccountsPageProps {
  accounts: Account[];
}

const AccountsPage: React.FC<AccountsPageProps> = ({ accounts }) => {
  const getRiskBadge = (riskScore: number) => {
    if (riskScore >= 0.7) return <Badge className="bg-red-500">High Risk</Badge>;
    if (riskScore >= 0.4) return <Badge className="bg-yellow-500">Medium Risk</Badge>;
    return <Badge className="bg-green-500">Low Risk</Badge>;
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Account Monitoring</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>Account Risk Analysis</CardTitle>
          <CardDescription>Monitor customer accounts and risk scores</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Account ID</TableHead>
                <TableHead>Account Name</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Transaction Count</TableHead>
                <TableHead>Risk Score</TableHead>
                <TableHead>Risk Level</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accounts.length > 0 ? (
                accounts.map(account => (
                  <TableRow key={account.id}>
                    <TableCell>{account.id}</TableCell>
                    <TableCell>{account.name}</TableCell>
                    <TableCell>${account.balance.toFixed(2)}</TableCell>
                    <TableCell>{account.transactionCount}</TableCell>
                    <TableCell>{account.riskScore.toFixed(2)}</TableCell>
                    <TableCell>{getRiskBadge(account.riskScore)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">No accounts to display</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountsPage;
