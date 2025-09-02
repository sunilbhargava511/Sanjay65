'use client';

import { Calculator, ArrowLeft, PiggyBank, CreditCard, DollarSign } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SaveSpendCalculator() {
  const router = useRouter();
  const [income, setIncome] = useState('');
  const [housing, setHousing] = useState('');
  const [food, setFood] = useState('');
  const [transportation, setTransportation] = useState('');
  const [utilities, setUtilities] = useState('');
  const [insurance, setInsurance] = useState('');
  const [otherExpenses, setOtherExpenses] = useState('');
  const [debtPayments, setDebtPayments] = useState('');

  const monthlyIncome = parseFloat(income) || 0;
  const totalFixedExpenses = (
    parseFloat(housing) || 0
  ) + (
    parseFloat(food) || 0
  ) + (
    parseFloat(transportation) || 0
  ) + (
    parseFloat(utilities) || 0
  ) + (
    parseFloat(insurance) || 0
  ) + (
    parseFloat(otherExpenses) || 0
  ) + (
    parseFloat(debtPayments) || 0
  );

  const saveNumber = totalFixedExpenses * 0.20;
  const spendNumber = monthlyIncome - totalFixedExpenses - saveNumber;

  const hasValidInputs = monthlyIncome > 0 && totalFixedExpenses > 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </button>
            </div>
            <h1 className="text-xl font-semibold">Save/Spend Calculator</h1>
            <div className="w-24" />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <Calculator className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Save/Spend Calculator</h1>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
            Calculate your Save Number (20% of expenses) and Spend Number (guilt-free spending money)
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Enter Your Financial Information</h2>
            
            {/* Monthly Income */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monthly After-Tax Income
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="number"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  placeholder="5000"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Fixed Expenses */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Monthly Fixed Expenses</h3>
              
              <div>
                <label className="block text-sm text-gray-700 mb-1">Housing (Rent/Mortgage)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    value={housing}
                    onChange={(e) => setHousing(e.target.value)}
                    placeholder="1500"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">Food & Groceries</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    value={food}
                    onChange={(e) => setFood(e.target.value)}
                    placeholder="600"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">Transportation</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    value={transportation}
                    onChange={(e) => setTransportation(e.target.value)}
                    placeholder="400"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">Utilities</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    value={utilities}
                    onChange={(e) => setUtilities(e.target.value)}
                    placeholder="200"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">Insurance</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    value={insurance}
                    onChange={(e) => setInsurance(e.target.value)}
                    placeholder="300"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">Minimum Debt Payments</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    value={debtPayments}
                    onChange={(e) => setDebtPayments(e.target.value)}
                    placeholder="250"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">Other Fixed Expenses</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    value={otherExpenses}
                    onChange={(e) => setOtherExpenses(e.target.value)}
                    placeholder="150"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-6">
            {/* Summary */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Monthly Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Monthly Income:</span>
                  <span className="font-semibold">${monthlyIncome.toFixed(0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Fixed Expenses:</span>
                  <span className="font-semibold">${totalFixedExpenses.toFixed(0)}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Remaining after expenses:</span>
                    <span>${(monthlyIncome - totalFixedExpenses).toFixed(0)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Save Number */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-green-500">
                  <PiggyBank className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-green-900">Your Save Number</h3>
              </div>
              <div className="text-3xl font-bold text-green-900 mb-2">
                ${hasValidInputs ? saveNumber.toFixed(0) : '0'}/month
              </div>
              <p className="text-sm text-green-800 mb-3">
                This is 20% of your expenses - the minimum you should save monthly for financial security.
              </p>
              <div className="text-xs text-green-700">
                <div>• 10% for retirement savings</div>
                <div>• 5% for emergency fund</div>
                <div>• 5% for other financial goals</div>
              </div>
            </div>

            {/* Spend Number */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-blue-500">
                  <CreditCard className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-blue-900">Your Spend Number</h3>
              </div>
              <div className="text-3xl font-bold text-blue-900 mb-2">
                ${hasValidInputs && spendNumber > 0 ? spendNumber.toFixed(0) : '0'}/month
              </div>
              <p className="text-sm text-blue-800 mb-3">
                This is your guilt-free spending money after covering all essentials and savings.
              </p>
              {hasValidInputs && spendNumber <= 0 && (
                <div className="bg-red-100 border border-red-300 rounded-lg p-3 mt-3">
                  <p className="text-sm text-red-800">
                    ⚠️ Your expenses exceed your income. Consider reducing expenses or increasing income.
                  </p>
                </div>
              )}
            </div>

            {!hasValidInputs && (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
                <p className="text-gray-600">Enter your income and expenses to see your Save and Spend numbers.</p>
              </div>
            )}
          </div>
        </div>

        {/* Tips Section */}
        {hasValidInputs && (
          <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Next Steps</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">For Your Save Number (${saveNumber.toFixed(0)}):</h4>
                <ul className="text-gray-600 space-y-1">
                  <li>• Set up automatic transfers</li>
                  <li>• Use separate savings accounts</li>
                  <li>• Review and adjust every 3 months</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">For Your Spend Number (${Math.max(0, spendNumber).toFixed(0)}):</h4>
                <ul className="text-gray-600 space-y-1">
                  <li>• Put in separate checking account</li>
                  <li>• Use for dining, entertainment, hobbies</li>
                  <li>• Spend guilt-free within this limit</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}