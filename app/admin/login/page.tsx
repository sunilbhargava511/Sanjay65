'use client';

import React, { useState } from 'react';
import LessonManager from '@/components/LessonManager';
import StripeManager from '@/components/StripeManager';
import CalculatorUpload from '@/components/CalculatorUpload';

// Admin Guide Content Component
function AdminGuideContent() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadGuide = async () => {
    try {
      const response = await fetch('/api/docs/admin-guide');
      const data = await response.json();
      
      if (response.ok) {
        setContent(data.content);
      } else {
        setError(data.error || 'Failed to load admin guide');
      }
    } catch (err) {
      setError('Failed to load admin guide');
      console.error('Error loading admin guide:', err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadGuide();
  }, []);

  const convertMarkdownToHtml = (markdown: string) => {
    return markdown
      .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold text-gray-900 mb-4 mt-6">$1</h1>')
      .replace(/^## (.+)$/gm, '<h2 class="text-xl font-semibold text-gray-900 mb-3 mt-5">$2</h2>')
      .replace(/^### (.+)$/gm, '<h3 class="text-lg font-medium text-gray-900 mb-2 mt-4">$3</h3>')
      .replace(/^\* (.+)$/gm, '<li class="ml-4 mb-1">$1</li>')
      .replace(/^(\d+)\. (.+)$/gm, '<li class="ml-4 mb-1">$2</li>')
      .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-2 py-1 rounded text-sm font-mono">$1</code>')
      .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      .replace(/^(.+)$/gm, '<p class="mb-3">$1</p>')
      .replace(/<p class="mb-3"><li/g, '<ul><li')
      .replace(/<\/li><\/p>/g, '</li></ul>')
      .replace(/<\/ul>\s*<ul>/g, '');
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mb-4"></div>
          <p className="text-gray-600">Loading admin guide...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl border border-red-200 shadow-sm p-8">
        <div className="text-center">
          <div className="text-red-400 mb-4 text-4xl">⚠️</div>
          <h2 className="text-lg font-semibold text-red-900 mb-2">Error Loading Guide</h2>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={loadGuide}
            className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">Admin Configuration & Operations Guide</h1>
        <p className="text-gray-600 text-sm mt-1">Complete setup and management instructions</p>
      </div>
      <div className="p-6">
        <div 
          className="prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: convertMarkdownToHtml(content) }}
        />
      </div>
    </div>
  );
}

// Calculator Management Component
function CalculatorManagement() {
  const [calculators, setCalculators] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  const loadCalculators = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/calculators/upload');
      const data = await response.json();
      if (data.success) {
        setCalculators(data.calculators);
      }
    } catch (error) {
      console.error('Failed to load calculators:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load calculators on component mount
  React.useEffect(() => {
    loadCalculators();
  }, []);

  const handleUploadSuccess = (calculator: any) => {
    setCalculators(prev => [...prev, calculator]);
    setShowUpload(false);
  };

  const handleDeleteCalculator = async (calculatorId: string) => {
    if (!confirm('Are you sure you want to delete this calculator?')) return;
    
    try {
      const response = await fetch(`/api/calculators/${calculatorId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setCalculators(prev => prev.filter(calc => calc.id !== calculatorId));
      } else {
        alert('Failed to delete calculator');
      }
    } catch (error) {
      console.error('Error deleting calculator:', error);
      alert('Failed to delete calculator');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Calculator Management</h2>
          <p className="text-gray-600 text-sm">Upload and manage financial calculators</p>
        </div>
        <button
          onClick={() => setShowUpload(!showUpload)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
        >
          {showUpload ? 'Hide Upload' : 'Upload Calculator'}
        </button>
      </div>

      {/* Upload Section */}
      {showUpload && (
        <CalculatorUpload
          onUploadSuccess={handleUploadSuccess}
          className="mb-6"
        />
      )}

      {/* Calculator List */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Uploaded Calculators ({calculators.length})
          </h3>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-gray-600 mt-2">Loading calculators...</p>
            </div>
          ) : calculators.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-2 text-3xl">📊</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Calculators Yet</h3>
              <p className="text-gray-600 mb-4">Upload your first calculator to get started</p>
              <button
                onClick={() => setShowUpload(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Upload Calculator
              </button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {calculators.map((calculator) => (
                <div key={calculator.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-sm">{calculator.name}</h4>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">{calculator.description}</p>
                    </div>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      calculator.type === 'local' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {calculator.type === 'local' ? 'Local' : 'URL'}
                    </span>
                  </div>
                  
                  <div className="text-xs text-gray-500 mb-3">
                    Created: {new Date(calculator.created).toLocaleDateString()}
                  </div>
                  
                  <div className="flex gap-2">
                    <a
                      href={calculator.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center px-3 py-2 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700 transition"
                    >
                      Preview
                    </a>
                    <button
                      onClick={() => handleDeleteCalculator(calculator.id)}
                      className="px-3 py-2 bg-red-100 text-red-700 rounded text-xs font-medium hover:bg-red-200 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'lessons' | 'calculators' | 'stripe' | 'guide'>('dashboard');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Simple demo authentication - in production, use proper auth
    if (email === 'admin@zerofinanx.com' && accessCode === 'demo123') {
      setIsAuthorized(true);
    } else {
      setError('Invalid admin credentials');
    }
  };

  if (isAuthorized) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Admin Header - Mobile Optimized */}
        <header className="border-b border-red-200 bg-red-50">
          <div className="mx-auto max-w-6xl px-4 py-3 sm:py-4">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <h1 className="text-base sm:text-lg font-semibold text-red-900 truncate">ZeroFinanx Admin</h1>
                <p className="text-xs sm:text-sm text-red-700 truncate">Administrative Dashboard</p>
              </div>
              <div className="flex gap-2 sm:gap-3 ml-4">
                <a
                  href="/"
                  className="inline-flex items-center rounded-lg border border-red-300 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-red-900 hover:bg-red-100"
                >
                  Home
                </a>
                <button
                  onClick={() => setIsAuthorized(false)}
                  className="inline-flex items-center rounded-lg border border-red-300 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-red-900 hover:bg-red-100"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Navigation - Mobile Optimized */}
        <nav className="border-b border-gray-200 bg-white overflow-x-auto">
          <div className="mx-auto max-w-6xl px-4">
            <div className="flex gap-4 sm:gap-6 min-w-max">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium border-b-2 transition whitespace-nowrap ${
                  activeTab === 'dashboard'
                    ? 'border-red-600 text-red-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('lessons')}
                className={`px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium border-b-2 transition whitespace-nowrap ${
                  activeTab === 'lessons'
                    ? 'border-red-600 text-red-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Lessons
              </button>
              <button
                onClick={() => setActiveTab('calculators')}
                className={`px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium border-b-2 transition whitespace-nowrap ${
                  activeTab === 'calculators'
                    ? 'border-red-600 text-red-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Calculators
              </button>
              <button
                onClick={() => setActiveTab('stripe')}
                className={`px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium border-b-2 transition whitespace-nowrap ${
                  activeTab === 'stripe'
                    ? 'border-red-600 text-red-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Stripe
              </button>
              <button
                onClick={() => setActiveTab('guide')}
                className={`px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium border-b-2 transition whitespace-nowrap ${
                  activeTab === 'guide'
                    ? 'border-red-600 text-red-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Admin Guide
              </button>
            </div>
          </div>
        </nav>

        {/* Admin Content - Mobile Optimized */}
        <main className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
          {activeTab === 'dashboard' && (
            <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            
            {/* System Status */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">System Status</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">API Status</span>
                  <span className="text-sm text-green-600 font-medium">✓ Online</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Cookie System</span>
                  <span className="text-sm text-green-600 font-medium">✓ Active</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Email System</span>
                  <span className="text-sm text-yellow-600 font-medium">⚠ Demo Mode</span>
                </div>
              </div>
            </div>

            {/* User Analytics */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">User Analytics</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Users</span>
                  <span className="text-sm font-medium">0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Active Sessions</span>
                  <span className="text-sm font-medium">0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Cookie Enabled</span>
                  <span className="text-sm font-medium">0</span>
                </div>
              </div>
            </div>

            {/* Content Management */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Content</h2>
              <div className="space-y-2">
                <button 
                  onClick={() => setActiveTab('lessons')}
                  className="w-full text-left text-sm text-gray-700 hover:text-gray-900 border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-50"
                >
                  📚 Manage Lessons
                </button>
                <button 
                  onClick={() => setActiveTab('calculators')}
                  className="w-full text-left text-sm text-gray-700 hover:text-gray-900 border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-50"
                >
                  📊 Manage Calculators
                </button>
                <button className="w-full text-left text-sm text-gray-700 hover:text-gray-900 border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-50">
                  ⚙️ Site Settings
                </button>
              </div>
            </div>

            {/* Customer Management */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm sm:col-span-2 lg:col-span-3">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Customer Management</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-4">
                  Passwordless authentication is active. Customers are identified by email only.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button className="bg-red-600 text-white rounded-lg px-4 py-2.5 sm:py-2 text-sm font-semibold hover:bg-red-700 transition">
                    Export Customer Data
                  </button>
                  <button className="border border-gray-300 text-gray-900 rounded-lg px-4 py-2.5 sm:py-2 text-sm font-semibold hover:bg-gray-50 transition">
                    View Customer List
                  </button>
                  <button className="border border-gray-300 text-gray-900 rounded-lg px-4 py-2.5 sm:py-2 text-sm font-semibold hover:bg-gray-50 transition">
                    Cookie Analytics
                  </button>
                </div>
              </div>
            </div>
            </div>
          )}

          {activeTab === 'lessons' && (
            <LessonManager />
          )}

          {activeTab === 'calculators' && (
            <CalculatorManagement />
          )}

          {activeTab === 'stripe' && (
            <StripeManager />
          )}

          {activeTab === 'guide' && (
            <AdminGuideContent />
          )}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold tracking-tight">Admin Access</h1>
            <p className="text-sm text-gray-600 mt-2">Administrative access to ZeroFinanx</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Admin Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                placeholder="admin@zerofinanx.com"
                required
              />
            </div>
            
            <div>
              <label htmlFor="accessCode" className="block text-sm font-medium text-gray-700 mb-1">
                Access Code
              </label>
              <input
                type="password"
                id="accessCode"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                placeholder="Enter access code"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-red-600 text-white rounded-lg px-4 py-3 font-semibold hover:bg-red-700 transition"
            >
              Admin Sign In
            </button>
          </form>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <div className="mt-6">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-600 mb-1">Demo Credentials:</p>
              <p className="text-xs text-gray-700">Email: admin@zerofinanx.com</p>
              <p className="text-xs text-gray-700">Code: demo123</p>
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <a href="/" className="text-sm text-gray-600 hover:text-gray-900">
              ← Back to home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}