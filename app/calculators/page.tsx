'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import CalculatorsList from '@/components/CalculatorsList';

export default function CalculatorsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <Link 
          href="/dashboard" 
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
        
        <CalculatorsList showHeader={true} />
      </div>
    </div>
  );
}