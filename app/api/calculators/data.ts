// Shared data store for calculators API routes
// In production, this would be replaced with a proper database

export interface CalculatorTool {
  id: number;
  name: string;
  category: string;
  description: string;
  url: string;
  icon: string;
  color: string;
  isActive: boolean;
  calculatorType: 'url' | 'code'; // Type of calculator
  code?: string; // JavaScript/TypeScript code for the calculator logic
  fileName?: string; // For tracking uploaded files
  artifactUrl?: string; // For Claude artifact URLs
  orderIndex: number; // For ordering calculators
  isPublished: boolean; // Draft/published state
  content?: string; // Processed HTML content for production file uploads
  fields: Array<{
    name: string;
    label: string;
    type: string;
    placeholder?: string;
    required: boolean;
  }>;
}

// Shared calculators Map that all routes can access
export const calculators: Map<number, CalculatorTool> = new Map();

// Initialize with default calculators
if (calculators.size === 0) {
  calculators.set(1, {
    id: 1,
    name: 'Save/Spend Calculator',
    description: 'Calculate your optimal savings rate and spending plan based on your income and expenses.',
    url: '/calculator/1',
    category: 'financial',
    icon: 'Calculator',
    color: 'bg-blue-500',
    isActive: true,
    calculatorType: 'code',
    orderIndex: 0,
    isPublished: true,
    code: `function calculate(inputs) {
      const totalExpenses = inputs.housing + inputs.food + inputs.transportation + inputs.utilities + inputs.insurance;
      const monthlySavings = inputs.monthly_income - totalExpenses;
      const savingsRate = (monthlySavings / inputs.monthly_income) * 100;
      const yearlyProjection = monthlySavings * 12;
      
      return {
        totalExpenses: totalExpenses,
        monthlySavings: monthlySavings,
        savingsRate: savingsRate.toFixed(1) + '%',
        yearlyProjection: yearlyProjection,
        emergencyFund: totalExpenses * 6,
        recommendation: savingsRate >= 20 ? 'Excellent savings rate!' : savingsRate >= 10 ? 'Good progress, aim for 20%+' : 'Consider reducing expenses'
      };
    }`,
    fields: [
      {
        name: 'monthly_income',
        label: 'Monthly After-Tax Income',
        type: 'number',
        placeholder: '5000',
        required: true
      },
      {
        name: 'housing',
        label: 'Housing (Rent/Mortgage)',
        type: 'number',
        placeholder: '1500',
        required: true
      },
      {
        name: 'food',
        label: 'Food & Groceries',
        type: 'number',
        placeholder: '600',
        required: true
      },
      {
        name: 'transportation',
        label: 'Transportation',
        type: 'number',
        placeholder: '400',
        required: true
      },
      {
        name: 'utilities',
        label: 'Utilities',
        type: 'number',
        placeholder: '200',
        required: true
      },
      {
        name: 'insurance',
        label: 'Insurance',
        type: 'number',
        placeholder: '300',
        required: true
      }
    ]
  });

  calculators.set(2, {
    id: 2,
    name: 'Emergency Fund Calculator',
    description: 'Determine how much you need in your emergency fund based on your expenses.',
    url: '/calculator/2',
    category: 'savings',
    icon: 'Shield',
    color: 'bg-green-500',
    isActive: true,
    calculatorType: 'code',
    orderIndex: 1,
    isPublished: true,
    code: `function calculate(inputs) {
      const targetFund = inputs.monthly_expenses * inputs.months_coverage;
      const monthsToGoal = targetFund / (inputs.current_savings || 1);
      
      return {
        targetAmount: targetFund,
        currentProgress: ((inputs.current_savings || 0) / targetFund * 100).toFixed(1) + '%',
        amountNeeded: Math.max(0, targetFund - (inputs.current_savings || 0)),
        monthsToGoal: monthsToGoal.toFixed(1),
        recommendation: inputs.months_coverage < 3 ? 'Consider increasing to at least 3-6 months' : inputs.months_coverage > 12 ? 'Great coverage! Consider investing excess' : 'Good coverage target!'
      };
    }`,
    fields: [
      {
        name: 'monthly_expenses',
        label: 'Monthly Essential Expenses',
        type: 'number',
        placeholder: '3000',
        required: true
      },
      {
        name: 'months_coverage',
        label: 'Months of Coverage',
        type: 'number',
        placeholder: '6',
        required: true
      },
      {
        name: 'current_savings',
        label: 'Current Emergency Savings',
        type: 'number',
        placeholder: '5000',
        required: false
      }
    ]
  });
}

// ID generator for new calculators
export let nextId = 3; // Start from 3 since we have 2 initial calculators

export function generateId(): number {
  return nextId++;
}