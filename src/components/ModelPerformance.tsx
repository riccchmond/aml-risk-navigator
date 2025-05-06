
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Transaction } from '@/lib/mockData';
import { modelPredict } from '@/lib/ml-models';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  TooltipProps,
} from 'recharts';
import { ValueType, NameType } from 'recharts/types/component/DefaultTooltipContent';

interface ModelPerformanceProps {
  transactions: Transaction[];
}

const ModelPerformance: React.FC<ModelPerformanceProps> = ({ transactions }) => {
  const [modelTab, setModelTab] = useState('all');
  
  // Calculate model performance metrics
  const models = ['RandomForest', 'XGBoost', 'SVM'];
  const metrics = ['precision', 'recall', 'f1'];
  
  // Rule-based (anything over $10,000)
  const ruleBasedMetrics = calculateMetrics(
    transactions,
    (tx) => tx.amount > 10000,
    'Rule-Based'
  );
  
  // ML model metrics
  const modelMetrics = models.map((model) => {
    return calculateMetrics(
      transactions,
      (tx) => modelPredict(tx, model) > 0.7,
      model
    );
  });
  
  // Combine all metrics for comparison
  const allMetrics = [ruleBasedMetrics, ...modelMetrics];
  
  // Create data for chart
  const chartData = metrics.map((metric) => {
    const data: any = { name: metric[0].toUpperCase() + metric.slice(1) };
    allMetrics.forEach((m) => {
      data[m.model] = m[metric];
    });
    return data;
  });
  
  // Format tooltip value as percentage
  const formatTooltipValue = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };
  
  // Custom tooltip for bar chart
  const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border rounded shadow-sm">
          <p className="font-medium">{label}</p>
          {payload.map((entry, index) => {
            const value = typeof entry.value === 'number' ? entry.value : 0;
            return (
              <p key={index} style={{ color: entry.color }}>
                {`${entry.name}: ${(value * 100).toFixed(1)}%`}
              </p>
            );
          })}
        </div>
      );
    }
    return null;
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold">Model Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue="all"
          className="w-full"
          onValueChange={(value) => setModelTab(value)}
        >
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Models</TabsTrigger>
            {models.map((model) => (
              <TabsTrigger key={model} value={model}>
                {model}
              </TabsTrigger>
            ))}
            <TabsTrigger value="rule">Rule-Based</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-0">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis
                    tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                    domain={[0, 1]}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="Rule-Based" fill="#8884d8" />
                  {models.map((model, index) => (
                    <Bar key={model} dataKey={model} fill={getModelColor(model)} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-4 gap-2 mt-4 text-center text-sm">
              {allMetrics.map((m) => (
                <div
                  key={m.model}
                  className="p-2 rounded-md"
                  style={{ backgroundColor: `${getModelColor(m.model)}20` }}
                >
                  <div className="font-medium">{m.model}</div>
                  <div className="flex justify-between text-xs mt-1">
                    <span>Precision:</span>
                    <span>{(m.precision * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Recall:</span>
                    <span>{(m.recall * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>F1:</span>
                    <span>{(m.f1 * 100).toFixed(1)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          {/* Individual model tabs */}
          {[...models, 'rule'].map((model) => {
            const modelData =
              model === 'rule'
                ? allMetrics[0]
                : allMetrics.find((m) => m.model === model);
            
            if (!modelData) return null;
            
            const singleModelData = [
              { name: 'Precision', value: modelData.precision },
              { name: 'Recall', value: modelData.recall },
              { name: 'F1', value: modelData.f1 },
            ];
            
            return (
              <TabsContent key={model} value={model} className="mt-0">
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={singleModelData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis
                        tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                        domain={[0, 1]}
                      />
                      <Tooltip
                        formatter={(value: number) => [
                          `${(value * 100).toFixed(1)}%`,
                          'Value',
                        ]}
                      />
                      <Bar dataKey="value">
                        {singleModelData.map((entry, index) => (
                          <Cell key={index} fill={getModelColor(modelData.model)} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="mt-4 p-4 bg-muted/30 rounded-md">
                  <h3 className="text-lg font-medium mb-2">
                    {model === 'rule' ? 'Rule-Based' : model} Detection Details
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {model === 'rule'
                      ? 'Simple threshold-based detection flagging transactions above $10,000'
                      : `${model} uses machine learning to identify suspicious patterns based on transaction features`}
                  </p>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-2 bg-white/50 rounded-md">
                      <div className="text-xs text-muted-foreground">Precision</div>
                      <div className="text-lg font-bold">
                        {(modelData.precision * 100).toFixed(1)}%
                      </div>
                    </div>
                    <div className="p-2 bg-white/50 rounded-md">
                      <div className="text-xs text-muted-foreground">Recall</div>
                      <div className="text-lg font-bold">
                        {(modelData.recall * 100).toFixed(1)}%
                      </div>
                    </div>
                    <div className="p-2 bg-white/50 rounded-md">
                      <div className="text-xs text-muted-foreground">F1 Score</div>
                      <div className="text-lg font-bold">
                        {(modelData.f1 * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      </CardContent>
    </Card>
  );
};

// Helper function to calculate metrics
function calculateMetrics(
  transactions: Transaction[],
  predictFn: (tx: Transaction) => boolean,
  modelName: string
) {
  const predictions = transactions.map((tx) => ({ 
    actual: tx.isLaundering, 
    predicted: predictFn(tx) 
  }));
  
  // Calculate true positives, false positives, etc.
  const tp = predictions.filter((p) => p.actual && p.predicted).length;
  const fp = predictions.filter((p) => !p.actual && p.predicted).length;
  const fn = predictions.filter((p) => p.actual && !p.predicted).length;
  const tn = predictions.filter((p) => !p.actual && !p.predicted).length;
  
  // Calculate metrics
  const precision = tp / (tp + fp || 1);
  const recall = tp / (tp + fn || 1);
  const f1 = 2 * (precision * recall) / (precision + recall || 1);
  
  return {
    model: modelName,
    precision,
    recall,
    f1,
    tp,
    fp,
    fn,
    tn,
  };
}

// Helper function to get color for model
function getModelColor(model: string) {
  switch (model) {
    case 'RandomForest':
      return '#4e79a7';
    case 'XGBoost':
      return '#f28e2b';
    case 'SVM':
      return '#e15759';
    case 'Rule-Based':
      return '#76b7b2';
    default:
      return '#59a14f';
  }
}

export default ModelPerformance;
