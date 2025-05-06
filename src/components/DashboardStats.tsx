
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Transaction, SuspiciousActivityReport } from '@/lib/mockData';
import { AlertTriangle, ArrowUp, BarChart3, TrendingUp } from 'lucide-react';

interface DashboardStatsProps {
  transactions: Transaction[];
  sars: SuspiciousActivityReport[];
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ transactions, sars }) => {
  // Calculate statistics
  const transactionCount = transactions.length;
  const flaggedCount = transactions.filter(tx => tx.isLaundering).length;
  const flaggedPercent = transactionCount > 0 ? (flaggedCount / transactionCount) * 100 : 0;
  
  // Calculate average risk score
  const avgRiskScore = sars.length > 0 
    ? sars.reduce((sum, sar) => sum + sar.riskScore, 0) / sars.length
    : 0;
  
  // Calculate high risk accounts
  const highRiskCount = sars.filter(sar => sar.riskScore >= 0.8).length;
  
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-4 mb-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Transactions</p>
              <h3 className="text-2xl font-bold">{transactionCount.toLocaleString()}</h3>
            </div>
            <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Flagged Transactions</p>
              <h3 className="text-2xl font-bold">
                {flaggedCount.toLocaleString()} 
                <span className="text-sm font-normal text-muted-foreground ml-1">
                  ({flaggedPercent.toFixed(1)}%)
                </span>
              </h3>
            </div>
            <div className="h-12 w-12 rounded-full bg-red-50 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Average Risk Score</p>
              <h3 className="text-2xl font-bold">{(avgRiskScore * 100).toFixed(1)}%</h3>
            </div>
            <div className="h-12 w-12 rounded-full bg-amber-50 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">High Risk Accounts</p>
              <h3 className="text-2xl font-bold">{highRiskCount}</h3>
            </div>
            <div className="h-12 w-12 rounded-full bg-purple-50 flex items-center justify-center">
              <ArrowUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
