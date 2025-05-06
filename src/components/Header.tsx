
import React from 'react';
import { AlertTriangle, BarChart2 } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-primary text-white p-4 sm:p-6 mb-6 rounded-lg flex items-center justify-between">
      <div>
        <div className="flex items-center">
          <AlertTriangle className="h-6 w-6 mr-2" />
          <h1 className="text-2xl font-bold">AML Risk Navigator</h1>
        </div>
        <p className="text-sm text-primary-foreground/80 mt-1">
          Anti-Money Laundering Detection & Analysis Platform
        </p>
      </div>
      
      <div className="flex items-center">
        <BarChart2 className="h-5 w-5 mr-2" />
        <span className="text-sm font-medium">Powered by Machine Learning</span>
      </div>
    </header>
  );
};

export default Header;
