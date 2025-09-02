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
    url: '/calculator/save-spend',
    category: 'financial',
    icon: 'Calculator',
    color: 'bg-blue-500',
    isActive: true,
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
    url: '/calculator/emergency-fund',
    category: 'savings',
    icon: 'Shield',
    color: 'bg-green-500',
    isActive: false,
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
      }
    ]
  });
}

// ID generator for new calculators
export let nextId = 3; // Start from 3 since we have 2 initial calculators

export function generateId(): number {
  return nextId++;
}