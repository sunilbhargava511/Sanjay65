'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Edit3, Trash2, Calculator, Eye } from 'lucide-react';
import CalculatorUpload from '@/components/CalculatorUpload';

export const dynamic = 'force-dynamic';

interface CalculatorTool {
  id: number;
  name: string;
  category: string;
  description: string;
  url: string;
  icon: string;
  color: string;
  isActive: boolean;
  calculatorType: 'url' | 'code';
  code?: string;
  fileName?: string;
  orderIndex: number;
  isPublished: boolean;
  fields: Array<{
    name: string;
    label: string;
    type: string;
    placeholder?: string;
    required: boolean;
  }>;
}

export default function CalculatorsManagement() {
  const [calculators, setCalculators] = useState<CalculatorTool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCalculator, setEditingCalculator] = useState<CalculatorTool | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'financial',
    description: '',
    url: '',
    icon: 'Calculator',
    color: 'bg-blue-500',
    isActive: true,
    calculatorType: 'code' as 'url' | 'code',
    code: '',
    fileName: '',
    isPublished: true,
    fields: '[]'
  });

  // Load calculators on component mount
  useEffect(() => {
    loadCalculators();
  }, []);

  // Handle escape key and click outside to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showAddModal) {
        handleCloseModal();
      }
    };

    if (showAddModal) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [showAddModal]);

  const loadCalculators = async () => {
    try {
      const response = await fetch('/api/calculators');
      if (response.ok) {
        const data = await response.json();
        setCalculators(data);
      }
    } catch (error) {
      console.error('Failed to load calculators:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingCalculator ? `/api/calculators/${editingCalculator.id}` : '/api/calculators';
      const method = editingCalculator ? 'PUT' : 'POST';
      
      const payload = {
        ...formData,
        fields: JSON.parse(formData.fields || '[]'),
        code: formData.code || undefined
      };
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        await loadCalculators();
        handleCloseModal();
      } else {
        alert('Failed to save calculator. Please try again.');
      }
    } catch (error) {
      console.error('Error saving calculator:', error);
      alert('Failed to save calculator. Please check the fields JSON format.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this calculator?')) return;

    try {
      const response = await fetch(`/api/calculators/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await loadCalculators();
      } else {
        alert('Failed to delete calculator. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting calculator:', error);
      alert('Failed to delete calculator. Please try again.');
    }
  };

  const handleEdit = (calculator: CalculatorTool) => {
    setEditingCalculator(calculator);
    setFormData({
      name: calculator.name,
      category: calculator.category,
      description: calculator.description,
      url: calculator.url,
      icon: calculator.icon,
      color: calculator.color,
      isActive: calculator.isActive,
      code: calculator.code || '',
      fields: JSON.stringify(calculator.fields || [], null, 2)
    });
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingCalculator(null);
    setFormData({
      name: '',
      category: 'financial',
      description: '',
      url: '',
      icon: 'Calculator',
      color: 'bg-blue-500',
      isActive: true,
      code: '',
      fields: '[]'
    });
  };

  const handleToggleActive = async (id: number, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/calculators/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (response.ok) {
        await loadCalculators();
      }
    } catch (error) {
      console.error('Error toggling calculator status:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link 
              href="/admin" 
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Admin
            </Link>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Calculators Management</h1>
              <p className="text-gray-600 mt-2">
                Create and manage financial calculators and tools
              </p>
            </div>
            
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 bg-blue-600 text-white rounded-lg px-4 py-2 font-medium hover:bg-blue-700 transition"
            >
              <Plus className="h-4 w-4" />
              Add Calculator
            </button>
          </div>
        </div>

        {/* Calculator Upload Section */}
        <CalculatorUpload 
          onUploadSuccess={(calculator) => {
            setCalculators(prev => [...prev, calculator]);
          }}
          className="mb-6"
        />

        {/* Calculators List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading calculators...</p>
          </div>
        ) : calculators.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <Calculator className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No calculators yet</h3>
            <p className="text-gray-600 mb-4">Create your first financial calculator to get started.</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 bg-blue-600 text-white rounded-lg px-4 py-2 font-medium hover:bg-blue-700 transition"
            >
              <Plus className="h-4 w-4" />
              Create First Calculator
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {calculators.map((calculator) => (
              <div key={calculator.id} className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-lg ${calculator.color}`}>
                    <Calculator className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900 truncate">{calculator.name}</h3>
                      <div className={`w-2 h-2 rounded-full ${calculator.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1 capitalize">
                      {calculator.category}
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {calculator.description}
                </p>

                <div className="text-xs text-gray-500 mb-4">
                  <span className="font-medium">URL:</span> {calculator.url || 'Not set'}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(calculator)}
                      className="inline-flex items-center gap-1 text-blue-600 text-sm hover:text-blue-800"
                    >
                      <Edit3 className="h-4 w-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(calculator.id)}
                      className="inline-flex items-center gap-1 text-red-600 text-sm hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggleActive(calculator.id, calculator.isActive)}
                      className={`text-sm px-2 py-1 rounded ${
                        calculator.isActive 
                          ? 'text-red-600 hover:text-red-800' 
                          : 'text-green-600 hover:text-green-800'
                      }`}
                    >
                      {calculator.isActive ? 'Disable' : 'Enable'}
                    </button>
                    {calculator.url && (
                      <Link
                        href={calculator.url}
                        className="inline-flex items-center gap-1 text-blue-600 text-sm hover:text-blue-800"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add/Edit Modal */}
        {showAddModal && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                handleCloseModal();
              }
            }}
          >
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold">
                  {editingCalculator ? 'Edit Calculator' : 'Add New Calculator'}
                </h2>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="financial">Financial</option>
                      <option value="savings">Savings</option>
                      <option value="debt">Debt</option>
                      <option value="investing">Investing</option>
                      <option value="retirement">Retirement</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Color Theme
                    </label>
                    <select
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="bg-blue-500">Blue</option>
                      <option value="bg-green-500">Green</option>
                      <option value="bg-purple-500">Purple</option>
                      <option value="bg-orange-500">Orange</option>
                      <option value="bg-red-500">Red</option>
                      <option value="bg-indigo-500">Indigo</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL Path
                  </label>
                  <input
                    type="text"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    placeholder="/calculator/save-spend"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Calculator Code (JavaScript)
                  </label>
                  <textarea
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    rows={10}
                    placeholder={`// Example calculator function
function calculate(inputs) {
  const { income, expenses } = inputs;
  const savings = income - expenses;
  const savingsRate = (savings / income) * 100;
  
  return {
    monthlySavings: savings,
    savingsRate: savingsRate.toFixed(2) + '%',
    yearlyProjection: savings * 12
  };
}`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Define your calculator logic as a JavaScript function that takes inputs and returns results
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Form Fields (JSON)
                  </label>
                  <textarea
                    value={formData.fields}
                    onChange={(e) => setFormData({ ...formData, fields: e.target.value })}
                    rows={6}
                    placeholder={`[
  {
    "name": "income",
    "label": "Monthly Income",
    "type": "number",
    "placeholder": "5000",
    "required": true
  }
]`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Define the input fields for your calculator in JSON format
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="isActive" className="text-sm text-gray-700">
                    Active (visible to users)
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {editingCalculator ? 'Update Calculator' : 'Create Calculator'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}