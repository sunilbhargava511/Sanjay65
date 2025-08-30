'use client';

import React from 'react';
import { Calculator, ExternalLink } from 'lucide-react';
import { calculatorService, Calculator as CalculatorType } from '@/lib/calculator-service';

interface CalculatorCardProps {
  calculator: CalculatorType;
  className?: string;
  onOpen?: (calculator: CalculatorType) => void;
}

export default function CalculatorCard({ calculator, className = '', onOpen }: CalculatorCardProps) {
  
  const handleOpen = () => {
    if (!calculatorService.canOpenCalculator(calculator)) {
      return;
    }
    
    if (onOpen) {
      onOpen(calculator);
      return;
    }
    
    const url = calculatorService.getCalculatorUrl(calculator);
    
    if (calculator.calculatorType === 'url') {
      // Open external URLs in new tab
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      // Open local calculators in new tab as well for better UX
      window.open(url, '_blank');
    }
  };

  const canOpen = calculatorService.canOpenCalculator(calculator);

  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-200 ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Calculator className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 text-lg leading-tight">
              {calculator.name}
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                calculator.calculatorType === 'url' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {calculator.calculatorType === 'url' ? 'External' : 'Built-in'}
              </span>
              {calculator.calculatorType === 'url' && (
                <ExternalLink className="w-3 h-3 text-gray-400" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-6 line-clamp-2">
        {calculator.description}
      </p>

      {/* Action Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleOpen}
          disabled={!canOpen}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
            canOpen
              ? 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>{canOpen ? 'Open Calculator' : 'Unavailable'}</span>
          {calculator.calculatorType === 'url' && canOpen && (
            <ExternalLink className="w-3 h-3" />
          )}
        </button>

        {/* Status indicator */}
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${
            calculator.active && calculator.isPublished 
              ? 'bg-green-500' 
              : 'bg-gray-300'
          }`} />
          <span className="text-xs text-gray-500">
            {calculator.active && calculator.isPublished ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      {/* Footer info for external calculators */}
      {calculator.calculatorType === 'url' && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500 flex items-center">
            <ExternalLink className="w-3 h-3 mr-1" />
            Opens in new window • Safe external tool
          </p>
        </div>
      )}
    </div>
  );
}