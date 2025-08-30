// Calculator service for ZeroFinanx
// Adapted from the financial-advisor calculator system

export interface Calculator {
  id: string;
  name: string;
  description: string;
  url?: string;
  calculatorType: 'url' | 'code';
  codeContent?: string;
  fileName?: string;
  orderIndex: number;
  active: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export class CalculatorService {
  
  // Get all calculators
  async getAllCalculators(activeOnly: boolean = false): Promise<Calculator[]> {
    try {
      const url = `/api/calculators${activeOnly ? '?activeOnly=true' : ''}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch calculators: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch calculators');
      }
      
      return data.calculators || [];
    } catch (error) {
      console.error('Error fetching calculators:', error);
      throw error;
    }
  }

  // Get single calculator
  async getCalculator(id: string): Promise<Calculator | null> {
    try {
      const response = await fetch(`/api/calculators/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`Failed to fetch calculator: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch calculator');
      }
      
      return data.calculator;
    } catch (error) {
      console.error('Error fetching calculator:', error);
      throw error;
    }
  }

  // Create new calculator
  async createCalculator(calculatorData: {
    name: string;
    description: string;
    url?: string;
    calculatorType?: 'url' | 'code';
    codeContent?: string;
    fileName?: string;
    orderIndex?: number;
    isPublished?: boolean;
  }): Promise<Calculator> {
    try {
      const response = await fetch('/api/calculators', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(calculatorData),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to create calculator: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to create calculator');
      }
      
      return data.calculator;
    } catch (error) {
      console.error('Error creating calculator:', error);
      throw error;
    }
  }

  // Update calculator
  async updateCalculator(id: string, updates: Partial<Calculator>): Promise<Calculator> {
    try {
      const response = await fetch(`/api/calculators/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to update calculator: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to update calculator');
      }
      
      return data.calculator;
    } catch (error) {
      console.error('Error updating calculator:', error);
      throw error;
    }
  }

  // Delete calculator
  async deleteCalculator(id: string): Promise<void> {
    try {
      const response = await fetch(`/api/calculators/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to delete calculator: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to delete calculator');
      }
    } catch (error) {
      console.error('Error deleting calculator:', error);
      throw error;
    }
  }

  // Validate calculator URL
  validateUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  // Get calculator URL for display/access
  getCalculatorUrl(calculator: Calculator): string {
    if (calculator.calculatorType === 'url' && calculator.url) {
      return calculator.url;
    }
    
    if (calculator.calculatorType === 'code' && calculator.fileName) {
      return `/calculators/${calculator.fileName}`;
    }
    
    return '#';
  }

  // Check if calculator can be opened
  canOpenCalculator(calculator: Calculator): boolean {
    return calculator.active && calculator.isPublished && (
      (calculator.calculatorType === 'url' && !!calculator.url) ||
      (calculator.calculatorType === 'code' && !!calculator.fileName)
    );
  }
}

// Export singleton instance
export const calculatorService = new CalculatorService();