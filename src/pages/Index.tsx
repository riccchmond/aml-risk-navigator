
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
import SimulatorControls from '@/components/SimulatorControls';
import TransactionTable from '@/components/TransactionTable';
import TransactionDetails from '@/components/TransactionDetails';
import ModelPerformance from '@/components/ModelPerformance';
import RiskDashboard from '@/components/RiskDashboard';
import DashboardStats from '@/components/DashboardStats';
import LoginPage from '@/components/LoginPage';

const Index = () => {
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
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  
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
      setSelectedTransaction(null);
      
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
  
  const handleSelectTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
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
  
  return (
    <div className="container py-6">
      <Header onLogout={handleLogout} />
      
      <SimulatorControls
        transactionCount={transactionCount}
        setTransactionCount={setTransactionCount}
        smurfingPercent={smurfingPercent}
        setSmurfingPercent={setSmurfingPercent}
        layeringPercent={layeringPercent}
        setLayeringPercent={setLayeringPercent}
        randomSeed={randomSeed}
        setRandomSeed={setRandomSeed}
        onGenerateData={generateData}
        onDownloadSAR={handleDownloadSAR}
      />
      
      {transactions.length > 0 && (
        <>
          <DashboardStats transactions={transactions} sars={sars} />
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
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
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <ModelPerformance transactions={transactions} />
            <RiskDashboard sars={sars} onDownloadSAR={handleDownloadSAR} />
          </div>
        </>
      )}
    </div>
  );
};

export default Index;
