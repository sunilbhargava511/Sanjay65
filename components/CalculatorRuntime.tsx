'use client';

import React, { useState, useEffect } from 'react';
import { Calculator, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

interface CalculatorField {
  name: string;
  label: string;
  type: string;
  placeholder?: string;
  required: boolean;
}

interface CalculatorRuntimeProps {
  name: string;
  description: string;
  fields: CalculatorField[];
  code?: string;
  color?: string;
}

export default function CalculatorRuntime({
  name,
  description,
  fields,
  code,
  color = 'bg-blue-500'
}: CalculatorRuntimeProps) {
  const [inputs, setInputs] = useState<Record<string, any>>({});
  const [results, setResults] = useState<Record<string, any> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Initialize inputs with default values
  useEffect(() => {
    const initialInputs: Record<string, any> = {};
    fields.forEach(field => {
      initialInputs[field.name] = field.type === 'number' ? 0 : '';
    });
    setInputs(initialInputs);
  }, [fields]);

  const handleInputChange = (fieldName: string, value: any, fieldType: string) => {
    setInputs(prev => ({
      ...prev,
      [fieldName]: fieldType === 'number' ? parseFloat(value) || 0 : value
    }));
    setError(null);
  };

  const executeCalculator = () => {
    setIsCalculating(true);
    setError(null);
    setResults(null);

    try {
      // Check if all required fields are filled
      const missingFields = fields
        .filter(field => field.required && !inputs[field.name])
        .map(field => field.label);

      if (missingFields.length > 0) {
        throw new Error(`Please fill in required fields: ${missingFields.join(', ')}`);
      }

      if (!code) {
        throw new Error('Calculator code is not defined');
      }

      // Create a safe execution environment
      const safeCode = `
        (function() {
          const inputs = ${JSON.stringify(inputs)};
          ${code}
          
          // Try to find and call the calculate function
          if (typeof calculate === 'function') {
            return calculate(inputs);
          }
          
          // If no calculate function, try to execute as expression
          return eval(\`${code}\`);
        })()
      `;

      // Execute the calculator code
      const result = eval(safeCode);
      
      // Format the results
      if (typeof result === 'object' && result !== null) {
        setResults(result);
      } else {
        setResults({ result });
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Calculation failed');
      console.error('Calculator execution error:', err);
    } finally {
      setIsCalculating(false);
    }
  };

  const formatResult = (value: any): string => {
    if (typeof value === 'number') {
      return value.toLocaleString('en-US', {
        maximumFractionDigits: 2,
        minimumFractionDigits: value % 1 !== 0 ? 2 : 0
      });
    }
    return String(value);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200">
      {/* Header */}
      <div className={`${color} text-white p-6 rounded-t-xl`}>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{name}</h2>
            <p className="text-white/90 mt-1">{description}</p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-6">
        {/* Input Fields */}
        <div className="space-y-4 mb-6">
          {fields.map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              <input
                type={field.type}
                value={inputs[field.name] || ''}
                onChange={(e) => handleInputChange(field.name, e.target.value, field.type)}
                placeholder={field.placeholder}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          ))}
        </div>

        {/* Calculate Button */}
        <button
          onClick={executeCalculator}
          disabled={isCalculating}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {isCalculating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Calculating...
            </>
          ) : (
            <>
              <Calculator className="w-5 h-5" />
              Calculate
            </>
          )}
        </button>

        {/* Error Message */}
        {error && (
          <div className="mt-4 flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Results */}
        {results && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-green-900">Results</h3>
            </div>
            <div className="space-y-2">
              {Object.entries(results).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center">
                  <span className="text-sm text-gray-700 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').trim()}:
                  </span>
                  <span className="font-semibold text-gray-900">
                    {formatResult(value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}