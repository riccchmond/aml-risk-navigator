
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Transaction } from '@/lib/mockData';
import { ShapValue, generateShapValues } from '@/lib/ml-models';
import { format } from 'date-fns';
import { AlertTriangle, Info } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface TransactionDetailsProps {
  transaction: Transaction | null;
}

const TransactionDetails: React.FC<TransactionDetailsProps> = ({ transaction }) => {
  if (!transaction) {
    return (
      <Card className="h-[400px]">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Transaction Details</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px] text-muted-foreground">
          <div className="text-center">
            <Info className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Select a transaction to view details</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Get SHAP values for model explainability
  const shapValues: ShapValue[] = generateShapValues(transaction);
  const maxAbsShap = Math.max(...shapValues.map(s => Math.abs(s.value)));

  return (
    <Card className="h-[400px] overflow-y-auto">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold">Transaction Details</CardTitle>
          {transaction.isLaundering && (
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-1" />
              <span className="text-red-500 font-medium">Suspicious Activity</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Transaction ID</p>
              <p className="font-semibold">{transaction.id}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Amount</p>
              <p className="font-semibold">${transaction.amount.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Date & Time</p>
              <p className="font-semibold">{format(transaction.timestamp, 'PPpp')}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Account</p>
              <p className="font-semibold">{transaction.accountId}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Merchant Type</p>
              <p className="font-semibold">{transaction.merchantType}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <p className={transaction.isLaundering ? "font-semibold text-red-500" : "font-semibold text-green-500"}>
                {transaction.isLaundering ? "Suspicious" : "Normal"}
              </p>
            </div>
          </div>
          
          {transaction.launderingType && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">Suspicious Activity Type</p>
              <p className="font-semibold text-red-500">{transaction.launderingType}</p>
            </div>
          )}
          
          <Separator />
          
          <div>
            <h3 className="font-semibold mb-3">Model Explanation (SHAP Values)</h3>
            <p className="text-sm text-muted-foreground mb-4">
              The chart below shows how different features contributed to the risk score prediction.
              Red bars indicate features that increased the risk score, while blue bars decreased it.
            </p>
            
            <div className="space-y-3">
              {shapValues.map((shap, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{shap.feature}</span>
                    <span className={`text-sm font-medium ${shap.value > 0 ? 'text-red-600' : 'text-blue-600'}`}>
                      {shap.value > 0 ? '+' : ''}{shap.value.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-1/2 h-3 flex justify-end">
                      {shap.value < 0 && (
                        <div 
                          className="bg-blue-500 rounded-sm" 
                          style={{ 
                            width: `${(Math.abs(shap.value) / maxAbsShap) * 100}%`, 
                            maxWidth: '100%',
                            height: '100%' 
                          }}
                        />
                      )}
                    </div>
                    <div className="w-1/2 h-3">
                      {shap.value > 0 && (
                        <div 
                          className="bg-red-500 rounded-sm" 
                          style={{ 
                            width: `${(Math.abs(shap.value) / maxAbsShap) * 100}%`, 
                            maxWidth: '100%',
                            height: '100%' 
                          }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionDetails;
