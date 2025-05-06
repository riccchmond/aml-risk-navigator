
import { Transaction } from './mockData';

// Feature engineering for the transactions
export const preprocessTransactions = (transactions: Transaction[]) => {
  // Extract features for model training
  return transactions.map(tx => {
    // Time features
    const hour = tx.timestamp.getHours();
    const dayOfWeek = tx.timestamp.getDay();
    const weekend = dayOfWeek === 0 || dayOfWeek === 6 ? 1 : 0;
    
    // Amount features 
    const amountLog = Math.log(tx.amount + 1);
    
    // One-hot encode merchant type
    const isMerchantTransfer = tx.merchantType === 'Transfer' ? 1 : 0;
    const isMerchantSalary = tx.merchantType === 'Salary' ? 1 : 0;
    const isMerchantATM = tx.merchantType === 'ATM' ? 1 : 0;
    
    return {
      amount: tx.amount,
      amountLog,
      hour,
      dayOfWeek,
      weekend,
      isMerchantTransfer,
      isMerchantSalary,
      isMerchantATM,
      isLaundering: tx.isLaundering ? 1 : 0
    };
  });
};

// Rule-based detection
export const ruleBasedDetection = (transaction: Transaction): boolean => {
  // Simple rule: Flag large transfers
  if (transaction.merchantType === 'Transfer' && transaction.amount > 1000) {
    return true;
  }
  
  // Flag multiple small transfers from same account (simplified)
  if (transaction.merchantType === 'Transfer' && transaction.amount < 50) {
    return true;
  }
  
  return false;
};

// Model prediction using dummy thresholds (in real app, we'd use the ML model)
export const modelPredict = (
  transaction: Transaction, 
  modelName: string
): number => {
  // This is a dummy implementation - in a real app, we'd call the actual model
  let baseScore = 0;
  
  // Different models have slightly different behavior
  switch(modelName) {
    case 'RandomForest':
      baseScore = transaction.amount > 1000 ? 0.7 : 0.3;
      if (transaction.merchantType === 'Transfer') baseScore += 0.2;
      return Math.min(baseScore * (transaction.isLaundering ? 1.5 : 0.6), 1);
    
    case 'XGBoost':
      baseScore = transaction.amount > 1500 ? 0.75 : 0.25;
      if (transaction.merchantType === 'Transfer') baseScore += 0.25;
      return Math.min(baseScore * (transaction.isLaundering ? 1.6 : 0.5), 1);
    
    case 'SVM':
      baseScore = transaction.amount > 800 ? 0.6 : 0.4;
      if (transaction.merchantType === 'Transfer') baseScore += 0.15;
      return Math.min(baseScore * (transaction.isLaundering ? 1.4 : 0.7), 1);
    
    case 'HuggingFace':
      baseScore = transaction.amount > 1200 ? 0.8 : 0.2;
      if (transaction.merchantType === 'Transfer') baseScore += 0.15;
      return Math.min(baseScore * (transaction.isLaundering ? 1.7 : 0.4), 1);
      
    default:
      return transaction.isLaundering ? 0.7 : 0.3;
  }
};

// Model metrics calculation
export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  falsePositiveRate: number;
}

export const calculateMetrics = (
  predictions: number[], 
  thresholds: number[], 
  actual: boolean[]
): ModelMetrics[] => {
  return thresholds.map(threshold => {
    const binaryPredictions = predictions.map(p => p >= threshold);
    
    let truePositives = 0;
    let falsePositives = 0;
    let trueNegatives = 0;
    let falseNegatives = 0;
    
    for (let i = 0; i < actual.length; i++) {
      if (actual[i] && binaryPredictions[i]) truePositives++;
      if (!actual[i] && binaryPredictions[i]) falsePositives++;
      if (!actual[i] && !binaryPredictions[i]) trueNegatives++;
      if (actual[i] && !binaryPredictions[i]) falseNegatives++;
    }
    
    const accuracy = (truePositives + trueNegatives) / actual.length;
    const precision = truePositives / (truePositives + falsePositives) || 0;
    const recall = truePositives / (truePositives + falseNegatives) || 0;
    const f1Score = 2 * ((precision * recall) / (precision + recall)) || 0;
    const falsePositiveRate = falsePositives / (falsePositives + trueNegatives) || 0;
    
    return {
      accuracy,
      precision,
      recall,
      f1Score,
      falsePositiveRate
    };
  });
};

// Mock SHAP values generation (in real app, we'd use actual SHAP library)
export interface ShapValue {
  feature: string;
  value: number;
}

export const generateShapValues = (transaction: Transaction): ShapValue[] => {
  // Generate mock SHAP values for explanation
  // In a real app, these would come from a SHAP explainer
  return [
    {
      feature: 'Amount',
      value: transaction.amount > 1000 ? 0.4 : -0.2
    },
    {
      feature: 'Merchant Type',
      value: transaction.merchantType === 'Transfer' ? 0.3 : -0.1
    },
    {
      feature: 'Time of Day',
      value: (transaction.timestamp.getHours() > 18 || transaction.timestamp.getHours() < 6) ? 0.2 : -0.1
    },
    {
      feature: 'Transaction Frequency',
      value: transaction.isLaundering ? 0.3 : -0.15
    },
    {
      feature: 'Account History',
      value: transaction.isLaundering ? 0.25 : -0.15
    },
  ].sort((a, b) => Math.abs(b.value) - Math.abs(a.value)); // Sort by absolute value
};
