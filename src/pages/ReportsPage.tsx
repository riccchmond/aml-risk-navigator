
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Download, Eye } from 'lucide-react';
import { SuspiciousActivityReport } from '@/lib/mockData';

interface ReportsPageProps {
  sars: SuspiciousActivityReport[];
  onDownloadSAR: () => void;
}

const ReportsPage: React.FC<ReportsPageProps> = ({ sars, onDownloadSAR }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Suspicious Activity Reports</h2>
      
      <div className="flex justify-end">
        <Button onClick={onDownloadSAR}>
          <Download className="w-4 h-4 mr-2" />
          Export SAR CSV
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Generated SAR Reports</CardTitle>
          <CardDescription>Review and export reports for regulatory compliance</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SAR ID</TableHead>
                <TableHead>Account ID</TableHead>
                <TableHead>Account Name</TableHead>
                <TableHead>Risk Score</TableHead>
                <TableHead>Flagged Transactions</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sars.length > 0 ? (
                sars.map(sar => (
                  <TableRow key={sar.id}>
                    <TableCell>{sar.id}</TableCell>
                    <TableCell>{sar.accountId}</TableCell>
                    <TableCell>{sar.accountName}</TableCell>
                    <TableCell>{sar.riskScore.toFixed(2)}</TableCell>
                    <TableCell>{sar.flaggedTransactions}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">No SARs to display</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsPage;
