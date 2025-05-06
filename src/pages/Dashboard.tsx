
import React from 'react';
import { useToast } from '@/components/ui/use-toast';
import DashboardStats from '@/components/DashboardStats';
import ModelPerformance from '@/components/ModelPerformance';
import RiskDashboard from '@/components/RiskDashboard';
import { Transaction, SuspiciousActivityReport } from '@/lib/mockData';

interface DashboardProps {
  transactions: Transaction[];
  sars: SuspiciousActivityReport[];
  onDownloadSAR: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  transactions, sars, onDownloadSAR 
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Dashboard Overview</h2>
      
      {transactions.length > 0 && (
        <>
          <DashboardStats transactions={transactions} sars={sars} />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <ModelPerformance transactions={transactions} />
            <RiskDashboard sars={sars} onDownloadSAR={onDownloadSAR} />
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
