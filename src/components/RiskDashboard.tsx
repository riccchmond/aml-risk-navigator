
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { SuspiciousActivityReport } from '@/lib/mockData';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Download, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';

interface RiskDashboardProps {
  sars: SuspiciousActivityReport[];
  onDownloadSAR: () => void;
}

const getRiskBadge = (score: number) => {
  if (score >= 0.8) {
    return <Badge className="bg-red-600">High</Badge>;
  } else if (score >= 0.6) {
    return <Badge className="bg-amber-500">Medium</Badge>;
  } else {
    return <Badge className="bg-green-600">Low</Badge>;
  }
};

const RiskDashboard: React.FC<RiskDashboardProps> = ({ sars, onDownloadSAR }) => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter SARs based on risk level
  const filteredSARs = sars.filter(sar => {
    // Apply risk filter
    if (filter === 'high' && sar.riskScore < 0.8) return false;
    if (filter === 'medium' && (sar.riskScore < 0.6 || sar.riskScore >= 0.8)) return false;
    if (filter === 'low' && sar.riskScore >= 0.6) return false;
    
    // Apply search
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        sar.accountId.toLowerCase().includes(searchLower) ||
        sar.accountName.toLowerCase().includes(searchLower) ||
        sar.description.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold">Risk Dashboard</CardTitle>
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Search SARs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-60"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-1" /> Risk Level
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setFilter('all')}>All Levels</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter('high')}>High Risk</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter('medium')}>Medium Risk</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter('low')}>Low Risk</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" size="sm" onClick={onDownloadSAR}>
              <Download className="h-4 w-4 mr-1" /> Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">SAR ID</TableHead>
                <TableHead>Account</TableHead>
                <TableHead>Generated Date</TableHead>
                <TableHead className="w-16">Flags</TableHead>
                <TableHead className="w-16">Risk</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSARs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                    No suspicious activity reports match your criteria
                  </TableCell>
                </TableRow>
              ) : (
                filteredSARs.map((sar) => (
                  <TableRow key={sar.id}>
                    <TableCell className="font-medium">{sar.id}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{sar.accountName}</div>
                        <div className="text-xs text-muted-foreground">{sar.accountId}</div>
                      </div>
                    </TableCell>
                    <TableCell>{format(sar.dateGenerated, 'MMM d, yyyy')}</TableCell>
                    <TableCell className="text-center">{sar.flaggedTransactions}</TableCell>
                    <TableCell>
                      {getRiskBadge(sar.riskScore)}
                      <div className="text-xs mt-1">{(sar.riskScore * 100).toFixed(0)}%</div>
                    </TableCell>
                    <TableCell className="max-w-md truncate">
                      {sar.description}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <div className="mt-2 text-xs text-right text-muted-foreground">
          Showing {filteredSARs.length} of {sars.length} suspicious activity reports
        </div>
      </CardContent>
    </Card>
  );
};

export default RiskDashboard;
