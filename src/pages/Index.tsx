
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { 
  generateTransactions, 
  generateSARs, 
  Transaction, 
  SuspiciousActivityReport 
} from '@/lib/mockData';
import { modelPredict } from '@/lib/ml-models';
import Header from '@/components/Header';
import SidebarNav from '@/components/Sidebar';
import Dashboard from '@/pages/Dashboard';
import TransactionsPage from '@/pages/TransactionsPage';
import AccountsPage from '@/pages/AccountsPage';
import ReportsPage from '@/pages/ReportsPage';
import SettingsPage from '@/pages/SettingsPage';
import SimulatorControls from '@/components/SimulatorControls';
import LoginPage from '@/components/LoginPage';

interface IndexProps {
  activeTab?: string;
}

const Index: React.FC<IndexProps> = ({ activeTab = 'dashboard' }) => {
  const { toast } = useToast();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Simulator state
  const [transactionCount, setTransactionCount] = useState(2000);
  const [smurfingPercent, setSmurfingPercent] = useState(0.1);
  const [layeringPercent, setLayeringPercent] = useState(0.1);
  const [randomSeed, setRandomSeed] = useState(42);
  
  // Data state
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [sars, setSars] = useState<SuspiciousActivityReport[]>([]);
  
  // Check if user is logged in from session storage
  useEffect(() => {
    const loggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
    
    // Generate initial data if logged in
    if (loggedIn && transactions.length === 0) {
      generateData();
    }
  }, []);
  
  const handleLogin = () => {
    setIsLoggedIn(true);
    sessionStorage.setItem('isLoggedIn', 'true');
    generateData();
  };
  
  const handleLogout = () => {
    sessionStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
  };
  
  const generateData = () => {
    try {
      // Generate transactions
      const { transactions: newTransactions, accounts: newAccounts } = generateTransactions(
        transactionCount,
        smurfingPercent,
        layeringPercent,
        randomSeed
      );
      
      setTransactions(newTransactions);
      setAccounts(newAccounts);
      
      // Calculate risk scores (using XGBoost as our "best" model)
      const riskScores: Record<string, number> = {};
      newAccounts.forEach(account => {
        const accountTxs = newTransactions.filter(tx => tx.accountId === account.id);
        if (accountTxs.length > 0) {
          // Calculate average risk score for the account
          const scores = accountTxs.map(tx => modelPredict(tx, 'XGBoost'));
          riskScores[account.id] = scores.reduce((a, b) => a + b, 0) / scores.length;
        }
      });
      
      // Generate SARs
      const newSars = generateSARs(newTransactions, newAccounts, riskScores);
      setSars(newSars);
      
      toast({
        title: "Data Generated Successfully",
        description: `Generated ${transactionCount} transactions with ${newSars.length} risk alerts.`,
      });
    } catch (error) {
      console.error("Error generating data:", error);
      toast({
        variant: "destructive",
        title: "Error Generating Data",
        description: "There was a problem generating the transaction data.",
      });
    }
  };
  
  const handleDownloadSAR = () => {
    try {
      // Format SARs as CSV
      const headers = ["SAR ID", "Account ID", "Account Name", "Risk Score", "Flagged Transactions", "Description"];
      const csvContent = [
        headers.join(","),
        ...sars.map(sar => [
          sar.id,
          sar.accountId,
          sar.accountName,
          sar.riskScore.toFixed(2),
          sar.flaggedTransactions,
          `"${sar.description.replace(/"/g, '""')}"`
        ].join(","))
      ].join("\n");
      
      // Create and download the file
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", "suspicious_activity_report.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Export Successful",
        description: `${sars.length} suspicious activity reports exported to CSV.`,
      });
    } catch (error) {
      console.error("Error downloading SAR:", error);
      toast({
        variant: "destructive",
        title: "Export Failed",
        description: "There was a problem exporting the SARs to CSV.",
      });
    }
  };
  
  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }
  
  // Format accounts data for AccountsPage
  const accountsData = accounts.map(account => {
    const accountTxs = transactions.filter(tx => tx.accountId === account.id);
    const riskScore = accountTxs.length > 0 
      ? accountTxs.reduce((sum, tx) => sum + modelPredict(tx, 'XGBoost'), 0) / accountTxs.length
      : 0;
      
    return {
      id: account.id,
      name: account.name,
      balance: account.balance,
      riskScore: riskScore,
      transactionCount: accountTxs.length
    };
  });
  
  return (
    <div className="flex min-h-screen w-full">
      <SidebarNav onLogout={handleLogout} />
      
      <div className="flex-1 p-6 md:p-8 overflow-y-auto">
        <Header onLogout={handleLogout} />
        
        {activeTab === 'dashboard' && (
          <Dashboard 
            transactions={transactions} 
            sars={sars} 
            onDownloadSAR={handleDownloadSAR} 
          />
        )}
        
        {activeTab === 'transactions' && (
          <TransactionsPage transactions={transactions} />
        )}
        
        {activeTab === 'accounts' && (
          <AccountsPage accounts={accountsData} />
        )}
        
        {activeTab === 'reports' && (
          <ReportsPage sars={sars} onDownloadSAR={handleDownloadSAR} />
        )}
        
        {activeTab === 'settings' && (
          <SettingsPage
            transactionCount={transactionCount}
            setTransactionCount={setTransactionCount}
            smurfingPercent={smurfingPercent}
            setSmurfingPercent={setSmurfingPercent}
            layeringPercent={layeringPercent}
            setLayeringPercent={setLayeringPercent}
            randomSeed={randomSeed}
            setRandomSeed={setRandomSeed}
            onGenerateData={generateData}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
