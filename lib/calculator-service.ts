import { CalculatorTool, calculators, generateId } from '@/app/api/calculators/data';

export type Calculator = CalculatorTool;

export class CalculatorService {
  
  // Calculator Management
  async createCalculator(calculatorData: {
    name: string;
    category: string;
    description: string;
    url?: string;
    calculatorType?: 'url' | 'code';
    code?: string;
    fileName?: string;
    orderIndex?: number;
    icon?: string;
    color?: string;
    isActive?: boolean;
    isPublished?: boolean;
    fields?: Array<{
      name: string;
      label: string;
      type: string;
      placeholder?: string;
      required: boolean;
    }>;
  }): Promise<CalculatorTool> {
    const calculatorId = generateId();
    
    // Get the highest order index if not provided
    let orderIndex = calculatorData.orderIndex;
    if (orderIndex === undefined) {
      const existingCalculators = await this.getAllCalculators();
      orderIndex = existingCalculators.length;
    }
    
    const calculatorType = calculatorData.calculatorType || 'code';
    
    // Validate required fields based on calculator type
    if (calculatorType === 'url' && !calculatorData.url) {
      throw new Error('URL is required for URL-based calculators');
    }
    if (calculatorType === 'code' && !calculatorData.code) {
      throw new Error('Code content is required for code-based calculators');
    }
    
    const newCalculator: CalculatorTool = {
      id: calculatorId,
      name: calculatorData.name,
      category: calculatorData.category,
      description: calculatorData.description,
      url: calculatorData.url || `/calculator/${calculatorId}`,
      calculatorType,
      code: calculatorData.code,
      fileName: calculatorData.fileName,
      orderIndex,
      icon: calculatorData.icon || 'Calculator',
      color: calculatorData.color || 'bg-blue-500',
      isActive: calculatorData.isActive ?? true,
      isPublished: calculatorData.isPublished ?? true,
      fields: calculatorData.fields || []
    };

    calculators.set(calculatorId, newCalculator);
    return newCalculator;
  }

  async getCalculator(calculatorId: number): Promise<CalculatorTool | null> {
    return calculators.get(calculatorId) || null;
  }

  async getAllCalculators(activeOnly: boolean = false): Promise<CalculatorTool[]> {
    try {
      // Fetch from API instead of using local data
      const response = await fetch('/api/calculators');
      if (!response.ok) {
        throw new Error(`Failed to fetch calculators: ${response.statusText}`);
      }
      
      const allCalculators: CalculatorTool[] = await response.json();
      
      if (activeOnly) {
        return allCalculators
          .filter(calc => calc.isActive && calc.isPublished)
          .sort((a, b) => a.orderIndex - b.orderIndex);
      }
      
      return allCalculators.sort((a, b) => a.orderIndex - b.orderIndex);
    } catch (error) {
      console.error('Error fetching calculators from API:', error);
      // Fallback to local data if API fails
      const allCalculators = Array.from(calculators.values());
      
      if (activeOnly) {
        return allCalculators
          .filter(calc => calc.isActive && calc.isPublished)
          .sort((a, b) => a.orderIndex - b.orderIndex);
      }
      
      return allCalculators.sort((a, b) => a.orderIndex - b.orderIndex);
    }
  }

  async updateCalculator(calculatorId: number, updates: Partial<CalculatorTool>): Promise<void> {
    const calculator = calculators.get(calculatorId);
    if (!calculator) {
      throw new Error('Calculator not found');
    }

    const updatedCalculator = {
      ...calculator,
      ...updates,
      id: calculatorId // Ensure ID doesn't change
    };

    calculators.set(calculatorId, updatedCalculator);
  }

  async deleteCalculator(calculatorId: number): Promise<void> {
    if (!calculators.has(calculatorId)) {
      throw new Error('Calculator not found');
    }
    calculators.delete(calculatorId);
  }

  async reorderCalculators(calculatorIds: number[]): Promise<void> {
    // Update order index for each calculator
    for (let i = 0; i < calculatorIds.length; i++) {
      const calculator = calculators.get(calculatorIds[i]);
      if (calculator) {
        calculator.orderIndex = i;
        calculators.set(calculatorIds[i], calculator);
      }
    }
  }

  async toggleActive(calculatorId: number): Promise<void> {
    const calculator = calculators.get(calculatorId);
    if (calculator) {
      calculator.isActive = !calculator.isActive;
      calculators.set(calculatorId, calculator);
    }
  }

  async togglePublished(calculatorId: number): Promise<void> {
    const calculator = calculators.get(calculatorId);
    if (calculator) {
      calculator.isPublished = !calculator.isPublished;
      calculators.set(calculatorId, calculator);
    }
  }

  // URL validation
  validateUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  // Calculate file upload stats
  getUploadedCalculatorsCount(): number {
    return Array.from(calculators.values()).filter(calc => calc.calculatorType === 'url').length;
  }

  getCodeBasedCalculatorsCount(): number {
    return Array.from(calculators.values()).filter(calc => calc.calculatorType === 'code').length;
  }

  getCategoryStats(): Record<string, number> {
    const stats: Record<string, number> = {};
    Array.from(calculators.values()).forEach(calc => {
      stats[calc.category] = (stats[calc.category] || 0) + 1;
    });
    return stats;
  }
}

// Export singleton instance
export const calculatorService = new CalculatorService();