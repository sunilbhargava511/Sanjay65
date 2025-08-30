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
    <div className={`bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200 ${className}`}>
      {/* Header - Mobile Optimized */}
      <div className="mb-4">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Calculator className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-base sm:text-lg leading-tight break-words">
              {calculator.name}
            </h3>
            <div className="flex items-center space-x-2 mt-1 flex-wrap gap-1">
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

      {/* Description - Mobile Optimized */}
      <p className="text-gray-600 text-sm mb-4 sm:mb-6 line-clamp-3">
        {calculator.description}
      </p>

      {/* Action Button - Mobile Optimized */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
        <button
          onClick={handleOpen}
          disabled={!canOpen}
          className={`flex items-center justify-center sm:justify-start space-x-2 px-4 py-2.5 sm:py-2 rounded-lg font-medium text-sm transition-colors w-full sm:w-auto ${
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
        <div className="flex items-center justify-center sm:justify-end space-x-2">
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

      {/* Footer info for external calculators - Mobile Optimized */}
      {calculator.calculatorType === 'url' && (
        <div className="mt-4 pt-3 sm:pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500 flex items-center justify-center sm:justify-start">
            <ExternalLink className="w-3 h-3 mr-1" />
            Opens in new window • Safe external tool
          </p>
        </div>
      )}
    </div>
  );
}