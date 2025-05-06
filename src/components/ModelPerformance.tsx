
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Transaction } from '@/lib/mockData';
import { ModelMetrics, calculateMetrics, modelPredict } from '@/lib/ml-models';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface ModelPerformanceProps {
  transactions: Transaction[];
}

const ModelPerformance: React.FC<ModelPerformanceProps> = ({ transactions }) => {
  const [threshold, setThreshold] = useState(0.5);
  
  // Define the models
  const models = ['RandomForest', 'XGBoost', 'SVM', 'HuggingFace', 'Rule-Based'];
  
  // Calculate metrics for each model using our mock functions
  const getModelMetrics = (modelName: string): ModelMetrics => {
    if (modelName === 'Rule-Based') {
      // Rule-based metrics (simplified)
      return {
        accuracy: 0.68,
        precision: 0.41,
        recall: 0.63,
        f1Score: 0.49,
        falsePositiveRate: 0.32
      };
    }
    
    // Get predictions from the model
    const predictions = transactions.map(tx => modelPredict(tx, modelName));
    
    // Get actual values
    const actual = transactions.map(tx => tx.isLaundering);
    
    // Calculate metrics
    const metrics = calculateMetrics(predictions, [threshold], actual);
    return metrics[0];
  };
  
  // Get metrics for all models
  const allMetrics = models.map(model => ({
    model,
    ...getModelMetrics(model)
  }));
  
  // Prepare data for the charts
  const accuracyData = models.map(model => ({
    name: model,
    accuracy: getModelMetrics(model).accuracy * 100
  }));
  
  const precisionRecallData = models.map(model => {
    const metrics = getModelMetrics(model);
    return {
      name: model,
      precision: metrics.precision * 100,
      recall: metrics.recall * 100,
      f1Score: metrics.f1Score * 100
    };
  });
  
  const falsePositiveData = models.map(model => ({
    name: model,
    falsePositiveRate: getModelMetrics(model).falsePositiveRate * 100
  }));
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold">Model Performance Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="accuracy">
          <TabsList className="mb-4">
            <TabsTrigger value="accuracy">Accuracy</TabsTrigger>
            <TabsTrigger value="precision-recall">Precision & Recall</TabsTrigger>
            <TabsTrigger value="false-positive">False Positives</TabsTrigger>
          </TabsList>
          
          <TabsContent value="accuracy" className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={accuracyData}
                margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis label={{ value: 'Accuracy (%)', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value) => [`${value.toFixed(1)}%`, 'Accuracy']} />
                <Legend />
                <Bar dataKey="accuracy" fill="#1a365d" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="precision-recall" className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={precisionRecallData}
                margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis label={{ value: 'Value (%)', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value) => [`${value.toFixed(1)}%`, '']} />
                <Legend />
                <Bar dataKey="precision" fill="#1a365d" name="Precision" />
                <Bar dataKey="recall" fill="#2c5282" name="Recall" />
                <Bar dataKey="f1Score" fill="#4299e1" name="F1 Score" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="false-positive" className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={falsePositiveData}
                margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis label={{ value: 'False Positive Rate (%)', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value) => [`${value.toFixed(1)}%`, 'False Positive Rate']} />
                <Legend />
                <Bar dataKey="falsePositiveRate" fill="#e53e3e" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6">
          <h4 className="font-medium mb-2">Key Findings:</h4>
          <ul className="text-sm list-disc pl-5 space-y-2">
            <li>ML models significantly outperform rule-based detection in precision and false positive rates.</li>
            <li>The XGBoost model provides the best balance between detection rate and false positives.</li>
            <li>HuggingFace models offer superior performance for complex patterns but require more computational resources.</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModelPerformance;
