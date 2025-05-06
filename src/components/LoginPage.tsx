
import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertTriangle } from 'lucide-react';

interface LoginPageProps {
  onLogin: () => void;
}

// Hardcoded credentials - in a real app, this would be on the server side
const CREDENTIALS = {
  username: "admin",
  password: "admin321"
};

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { toast } = useToast();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    if (username === CREDENTIALS.username && password === CREDENTIALS.password) {
      // Store login state in session storage
      sessionStorage.setItem('isLoggedIn', 'true');
      toast({
        title: "Login Successful",
        description: "Welcome to AML Risk Navigator",
      });
      setError('');
      onLogin();
    } else {
      setError('Invalid username or password');
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Please check your credentials and try again.",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <div className="w-full max-w-md mx-auto">
        <Card className="w-full">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-4">
              <AlertTriangle className="h-10 w-10 text-primary mr-2" />
              <CardTitle className="text-2xl font-bold text-center">AML Risk Navigator</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Anti-Money Laundering Detection & Analysis Platform
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input 
                    id="username" 
                    placeholder="Enter your username" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="Enter your password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                {error && (
                  <div className="bg-destructive/10 text-destructive text-sm p-2 rounded-md flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    {error}
                  </div>
                )}
                <Button type="submit" className="w-full">Login</Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="border-t px-6 py-3">
            <p className="text-xs text-center w-full text-muted-foreground">
              Secured access - Authorized personnel only
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
