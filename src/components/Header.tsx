
import React from 'react';
import { AlertTriangle, BarChart2, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';

interface HeaderProps {
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  return (
    <header className="bg-primary text-white p-4 sm:p-6 mb-6 rounded-lg flex items-center justify-between">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="text-white border-white hover:bg-primary-foreground hover:text-primary mr-2" />
        <div>
          <div className="flex items-center">
            <AlertTriangle className="h-6 w-6 mr-2" />
            <h1 className="text-2xl font-bold">AML Risk Navigator</h1>
          </div>
          <p className="text-sm text-primary-foreground/80 mt-1">
            Anti-Money Laundering Detection & Analysis Platform
          </p>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="hidden md:flex items-center">
          <BarChart2 className="h-5 w-5 mr-2" />
          <span className="text-sm font-medium">Powered by Machine Learning</span>
        </div>
        
        {onLogout && (
          <Button variant="outline" size="sm" className="text-white border-white hover:bg-primary-foreground hover:text-primary" onClick={onLogout}>
            <LogOut className="h-4 w-4 mr-1" />
            Logout
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;
