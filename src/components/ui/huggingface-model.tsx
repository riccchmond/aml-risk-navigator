
import React, { useState, useEffect } from 'react';
import { pipeline, env } from '@huggingface/transformers';
import type { TextClassificationPipeline, TextClassificationOutput } from '@huggingface/transformers';

interface HuggingfaceModelProps {
  modelId: string;
  input: string;
  task?: 'text-classification' | 'sentiment-analysis';
  onResult?: (result: { label: string; score: number }[]) => void;
}

// Fix environment
env.allowLocalModels = true;
env.useBrowserCache = true;

const HuggingfaceModel: React.FC<HuggingfaceModelProps> = ({
  modelId,
  input,
  task = 'text-classification',
  onResult,
}) => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{ label: string; score: number }[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const runInference = async () => {
      if (!input) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Create pipeline with the specified task
        const classify = await pipeline(task, modelId, {
          quantized: false,
        });
        
        // Run inference
        const result = await classify(input);

        // Process and normalize results
        let processedResults: { label: string; score: number }[];
        
        if (Array.isArray(result)) {
          if (typeof result[0] === 'object' && 'label' in result[0] && 'score' in result[0]) {
            processedResults = result.map(item => ({
              label: String(item.label),
              score: Number(item.score)
            }));
          } else {
            // Handle unexpected format
            processedResults = [];
            setError('Unexpected result format');
          }
        } else if (typeof result === 'object' && 'label' in result && 'score' in result) {
          processedResults = [{ 
            label: String(result.label), 
            score: Number(result.score) 
          }];
        } else {
          // Handle unexpected format
          processedResults = [];
          setError('Unexpected result format');
        }
        
        setResults(processedResults);
        if (onResult) onResult(processedResults);
      } catch (err) {
        console.error('Error running Hugging Face model:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    runInference();
  }, [input, modelId, task, onResult]);

  if (error) {
    return <div className="text-destructive text-sm">{error}</div>;
  }

  // This component doesn't render anything by default, but could show loading state
  return loading ? (
    <div className="text-muted-foreground text-sm animate-pulse">
      Running model...
    </div>
  ) : null;
};

export default HuggingfaceModel;
