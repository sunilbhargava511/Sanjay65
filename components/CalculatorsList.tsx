'use client';

import React, { useState, useEffect } from 'react';
import { Calculator as CalculatorIcon, ArrowLeft, RefreshCw, AlertCircle } from 'lucide-react';
import CalculatorCard from './CalculatorCard';
import { calculatorService, Calculator } from '@/lib/calculator-service';

interface CalculatorsListProps {
  onBack?: () => void;
  className?: string;
  showHeader?: boolean;
}

export default function CalculatorsList({ 
  onBack, 
  className = '', 
  showHeader = true 
}: CalculatorsListProps) {
  const [calculators, setCalculators] = useState<Calculator[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load calculators on component mount
  useEffect(() => {
    loadCalculators();
  }, []);

  const loadCalculators = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const calculatorList = await calculatorService.getAllCalculators(true);
      setCalculators(calculatorList);
    } catch (error) {
      console.error('Error loading calculators:', error);
      setError(error instanceof Error ? error.message : 'Failed to load calculators');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    loadCalculators();
  };

  if (isLoading) {
    return (
      <div className={`bg-white rounded-xl p-6 ${className}`}>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Calculators</h3>
            <p className="text-gray-600">Please wait while we fetch the available financial calculators...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-xl p-6 ${className}`}>
        <div className="flex items-center justify-center py-12">
          <div className="text-center max-w-md">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Calculators</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={handleRetry}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl p-6 ${className}`}>
      {/* Header */}
      {showHeader && (
        <div className="mb-8">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          )}
          
          <div className="text-center mb-6">
            <CalculatorIcon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Financial Calculators</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Access powerful financial tools to help you make informed decisions about savings, investments, and retirement planning.
            </p>
          </div>
        </div>
      )}

      {/* Calculators Grid */}
      {calculators.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {calculators.map((calculator) => (
            <CalculatorCard
              key={calculator.id}
              calculator={calculator}
              className="transition-transform hover:scale-[1.02]"
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-12">
          <CalculatorIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Calculators Available</h3>
          <p className="text-gray-600 mb-6">
            Financial calculators will appear here once they are configured.
          </p>
          <button
            onClick={handleRetry}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      )}

      {/* Info Footer */}
      {calculators.length > 0 && (
        <div className="mt-8 bg-gray-50 rounded-lg p-4">
          <div className="text-center">
            <h3 className="font-semibold text-gray-900 mb-2">🔗 Calculator Access</h3>
            <p className="text-sm text-gray-600">
              These calculators are safe to use and designed for educational purposes. 
              External tools open in new windows and don&apos;t require personal information from your account.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}