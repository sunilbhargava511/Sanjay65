'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function DynamicCalculatorPage() {
  const params = useParams();
  const [calculatorHtml, setCalculatorHtml] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const loadCalculator = async () => {
      try {
        const response = await fetch(`/calculators/${params.id}/index.html`);
        if (response.ok) {
          const html = await response.text();
          setCalculatorHtml(html);
        } else {
          setError('Calculator not found');
        }
      } catch (err) {
        setError('Failed to load calculator');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      loadCalculator();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-4xl px-4 py-8">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-4xl px-4 py-8">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Calculator Not Found</h1>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <Link 
          href="/dashboard" 
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
        
        {/* Render the calculator HTML in an iframe for security and isolation */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <iframe
            srcDoc={calculatorHtml}
            className="w-full h-96 border-0 rounded-lg"
            sandbox="allow-scripts allow-same-origin"
            title="Calculator"
          />
        </div>
      </div>
    </div>
  );
}