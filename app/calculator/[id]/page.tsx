'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calculator as CalcIcon } from 'lucide-react';
import CalculatorRuntime from '@/components/CalculatorRuntime';

interface CalculatorTool {
  id: number;
  name: string;
  category: string;
  description: string;
  url: string;
  icon: string;
  color: string;
  isActive: boolean;
  code?: string;
  fields: Array<{
    name: string;
    label: string;
    type: string;
    placeholder?: string;
    required: boolean;
  }>;
}

export default function CalculatorPage() {
  const params = useParams();
  const [calculator, setCalculator] = useState<CalculatorTool | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCalculator = async () => {
      try {
        const response = await fetch(`/api/calculators/${params.id}`);
        if (!response.ok) {
          throw new Error('Calculator not found');
        }
        const data = await response.json();
        setCalculator(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load calculator');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchCalculator();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading calculator...</p>
        </div>
      </div>
    );
  }

  if (error || !calculator) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <CalcIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Calculator Not Found</h2>
          <p className="text-gray-600 mb-4">{error || 'The requested calculator could not be found.'}</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!calculator.isActive) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <CalcIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Calculator Unavailable</h2>
          <p className="text-gray-600 mb-4">This calculator is currently not available.</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-4xl px-4">
        {/* Navigation */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>

        {/* Calculator */}
        <CalculatorRuntime
          name={calculator.name}
          description={calculator.description}
          fields={calculator.fields}
          code={calculator.code}
          color={calculator.color}
        />

        {/* Additional Info */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Category: {calculator.category}</p>
        </div>
      </div>
    </div>
  );
}