
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RefreshCw, Download } from 'lucide-react';

interface SimulatorControlsProps {
  transactionCount: number;
  setTransactionCount: (value: number) => void;
  smurfingPercent: number;
  setSmurfingPercent: (value: number) => void;
  layeringPercent: number;
  setLayeringPercent: (value: number) => void;
  randomSeed: number;
  setRandomSeed: (value: number) => void;
  onGenerateData: () => void;
  onDownloadSAR: () => void;
}

const SimulatorControls: React.FC<SimulatorControlsProps> = ({
  transactionCount,
  setTransactionCount,
  smurfingPercent,
  setSmurfingPercent,
  layeringPercent,
  setLayeringPercent,
  randomSeed,
  setRandomSeed,
  onGenerateData,
  onDownloadSAR,
}) => {
  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold">Simulator Controls</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="transactionCount">Transaction Count: {transactionCount}</Label>
              </div>
              <Slider
                id="transactionCount"
                min={500}
                max={10000}
                step={500}
                value={[transactionCount]}
                onValueChange={(value) => setTransactionCount(value[0])}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="smurfingPercent">Smurfing %: {(smurfingPercent * 100).toFixed(1)}%</Label>
              </div>
              <Slider
                id="smurfingPercent"
                min={0}
                max={0.5}
                step={0.01}
                value={[smurfingPercent]}
                onValueChange={(value) => setSmurfingPercent(value[0])}
              />
              <p className="text-xs text-muted-foreground">
                Smurfing: Breaking large transactions into multiple smaller ones
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="layeringPercent">Layering %: {(layeringPercent * 100).toFixed(1)}%</Label>
              </div>
              <Slider
                id="layeringPercent"
                min={0}
                max={0.5}
                step={0.01}
                value={[layeringPercent]}
                onValueChange={(value) => setLayeringPercent(value[0])}
              />
              <p className="text-xs text-muted-foreground">
                Layering: Creating chains of transfers between multiple accounts
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="randomSeed">Random Seed</Label>
              <Input
                id="randomSeed"
                type="number"
                min={0}
                max={9999}
                value={randomSeed}
                onChange={(e) => setRandomSeed(parseInt(e.target.value))}
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-between mt-6">
          <Button 
            onClick={onGenerateData} 
            className="bg-primary hover:bg-primary/90"
          >
            <RefreshCw className="mr-2 h-4 w-4" /> Generate Data
          </Button>
          
          <Button 
            onClick={onDownloadSAR} 
            variant="outline"
          >
            <Download className="mr-2 h-4 w-4" /> Export SARs
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SimulatorControls;
