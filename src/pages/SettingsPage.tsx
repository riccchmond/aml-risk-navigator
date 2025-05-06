
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';

interface SettingsPageProps {
  transactionCount: number;
  setTransactionCount: (count: number) => void;
  smurfingPercent: number;
  setSmurfingPercent: (percent: number) => void;
  layeringPercent: number;
  setLayeringPercent: (percent: number) => void;
  randomSeed: number;
  setRandomSeed: (seed: number) => void;
  onGenerateData: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({
  transactionCount,
  setTransactionCount,
  smurfingPercent,
  setSmurfingPercent,
  layeringPercent,
  setLayeringPercent,
  randomSeed,
  setRandomSeed,
  onGenerateData
}) => {
  const { toast } = useToast();
  const [enableRealTimeAlerts, setEnableRealTimeAlerts] = useState(true);
  const [flagAmount, setFlagAmount] = useState(8500);
  
  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your configuration has been updated."
    });
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">System Settings</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Simulation Settings</CardTitle>
            <CardDescription>Configure data generation parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="transactionCount">Transaction Count: {transactionCount}</Label>
              <Slider
                id="transactionCount"
                min={1000}
                max={10000}
                step={100}
                value={[transactionCount]}
                onValueChange={(value) => setTransactionCount(value[0])}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="smurfingPercent">Smurfing Percentage: {(smurfingPercent * 100).toFixed(0)}%</Label>
              <Slider
                id="smurfingPercent"
                min={0}
                max={0.5}
                step={0.01}
                value={[smurfingPercent]}
                onValueChange={(value) => setSmurfingPercent(value[0])}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="layeringPercent">Layering Percentage: {(layeringPercent * 100).toFixed(0)}%</Label>
              <Slider
                id="layeringPercent"
                min={0}
                max={0.5}
                step={0.01}
                value={[layeringPercent]}
                onValueChange={(value) => setLayeringPercent(value[0])}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="randomSeed">Random Seed</Label>
              <Input
                id="randomSeed"
                type="number"
                value={randomSeed}
                onChange={(e) => setRandomSeed(parseInt(e.target.value))}
              />
            </div>
            
            <Button onClick={onGenerateData} className="w-full">Generate New Data</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Detection Settings</CardTitle>
            <CardDescription>Configure risk detection parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="realTimeAlerts">Enable Real-Time Alerts</Label>
              <Switch
                id="realTimeAlerts"
                checked={enableRealTimeAlerts}
                onCheckedChange={setEnableRealTimeAlerts}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="flagAmount">Flag Transactions Above ($)</Label>
              <Input
                id="flagAmount"
                type="number"
                value={flagAmount}
                onChange={(e) => setFlagAmount(parseInt(e.target.value))}
              />
            </div>
            
            <div className="pt-6">
              <Button onClick={handleSaveSettings} className="w-full">Save Settings</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
