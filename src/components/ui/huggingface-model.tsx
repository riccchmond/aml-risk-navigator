
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { pipeline } from '@huggingface/transformers';

interface HuggingFaceModelProps {
  transactionText: string;
}

const HuggingFaceModel: React.FC<HuggingFaceModelProps> = ({ transactionText }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ label: string; score: number }[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const classifyTransaction = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Initialize text classification pipeline
      const classifier = await pipeline(
        'text-classification',
        'facebook/bart-large-mnli',
        { topk: 2 }
      );

      // Define labels for zero-shot classification
      const labels = ['suspicious transaction', 'normal transaction'];
      
      // Run the model
      const output = await classifier(transactionText, labels);
      
      setResult(output);
    } catch (err) {
      console.error('Error running HuggingFace model:', err);
      setError('Failed to run the model. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold">HuggingFace Model Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Analyze transaction text using HuggingFace's zero-shot text classification model.
        </p>

        <div className="bg-muted p-3 rounded-md mb-4">
          <p className="text-sm whitespace-pre-wrap">{transactionText || "Select a transaction to analyze its description"}</p>
        </div>

        <Button 
          onClick={classifyTransaction}
          disabled={loading || !transactionText}
          className="mb-4 w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
              Processing...
            </>
          ) : (
            "Analyze with HuggingFace"
          )}
        </Button>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4 flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {result && (
          <div className="space-y-3">
            <h4 className="font-medium">Analysis Results:</h4>
            {result.map((item, i) => (
              <div 
                key={i} 
                className={`flex items-center justify-between p-2 rounded-md ${
                  item.label.includes('suspicious') ? 'bg-red-50' : 'bg-green-50'
                }`}
              >
                <div className="flex items-center">
                  {item.label.includes('suspicious') ? (
                    <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                  ) : (
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  )}
                  <span className="text-sm">{item.label}</span>
                </div>
                <span className="text-sm font-semibold">{(item.score * 100).toFixed(1)}%</span>
              </div>
            ))}
            <p className="text-xs text-muted-foreground mt-2">
              Note: This is a demonstration of HuggingFace's transformers.js capabilities. 
              For production AML systems, specialized models with proper training data would be used.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HuggingFaceModel;
