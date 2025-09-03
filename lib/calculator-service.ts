// Only import repository on server side
let calculatorRepository: any = null;
let CalculatorTool: any = null;

if (typeof window === 'undefined') {
  // Server side import
  const { calculatorRepository: repo, CalculatorTool: tool } = require('@/lib/repositories/calculators');
  calculatorRepository = repo;
  CalculatorTool = tool;
}

export type Calculator = any;

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
    
    // Get the highest order index if not provided
    let orderIndex = calculatorData.orderIndex;
    if (orderIndex === undefined) {
      const existingCalculators = calculatorRepository.findAll();
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
    
    const newCalculator = calculatorRepository.create({
      name: calculatorData.name,
      category: calculatorData.category,
      description: calculatorData.description,
      url: calculatorData.url || '/temp',
      calculatorType,
      code: calculatorData.code,
      fileName: calculatorData.fileName,
      orderIndex,
      icon: calculatorData.icon || 'Calculator',
      color: calculatorData.color || 'bg-blue-500',
      isActive: calculatorData.isActive ?? true,
      isPublished: calculatorData.isPublished ?? true,
      fields: calculatorData.fields || []
    });

    // Update URL with real ID if needed
    if (!calculatorData.url) {
      calculatorRepository.update(newCalculator.id, { 
        url: `/calculator/${newCalculator.id}` 
      });
    }

    return newCalculator;
  }

  async getCalculator(calculatorId: number): Promise<CalculatorTool | null> {
    return calculatorRepository.findById(calculatorId);
  }

  async getAllCalculators(activeOnly: boolean = false): Promise<Calculator[]> {
    // Check if we're running on the server side
    if (typeof window === 'undefined' && calculatorRepository) {
      // Server side: use repository directly
      return activeOnly 
        ? calculatorRepository.findPublished()
        : calculatorRepository.findAll();
    } else {
      // Client side: fetch from API
      try {
        const response = await fetch(`/api/calculators${activeOnly ? '?active=true' : ''}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch calculators: ${response.statusText}`);
        }
        const calculators: Calculator[] = await response.json();
        return calculators;
      } catch (error) {
        console.error('Error fetching calculators from API:', error);
        return [];
      }
    }
  }

  async updateCalculator(calculatorId: number, updates: Partial<CalculatorTool>): Promise<void> {
    const updatedCalculator = calculatorRepository.update(calculatorId, updates);
    if (!updatedCalculator) {
      throw new Error('Calculator not found');
    }
  }

  async deleteCalculator(calculatorId: number): Promise<void> {
    const deleted = calculatorRepository.delete(calculatorId);
    if (!deleted) {
      throw new Error('Calculator not found');
    }
  }

  async reorderCalculators(calculatorIds: number[]): Promise<void> {
    // Update order index for each calculator
    for (let i = 0; i < calculatorIds.length; i++) {
      calculatorRepository.update(calculatorIds[i], { orderIndex: i });
    }
  }

  async toggleActive(calculatorId: number): Promise<void> {
    const calculator = calculatorRepository.findById(calculatorId);
    if (calculator) {
      calculatorRepository.update(calculatorId, { isActive: !calculator.isActive });
    }
  }

  async togglePublished(calculatorId: number): Promise<void> {
    const calculator = calculatorRepository.findById(calculatorId);
    if (calculator) {
      calculatorRepository.update(calculatorId, { isPublished: !calculator.isPublished });
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
    return calculatorRepository.findAll().filter(calc => calc.calculatorType === 'url').length;
  }

  getCodeBasedCalculatorsCount(): number {
    return calculatorRepository.findAll().filter(calc => calc.calculatorType === 'code').length;
  }

  getCategoryStats(): Record<string, number> {
    const stats: Record<string, number> = {};
    calculatorRepository.findAll().forEach(calc => {
      stats[calc.category] = (stats[calc.category] || 0) + 1;
    });
    return stats;
  }

  // Check if a calculator can be opened (has valid URL or content)
  canOpenCalculator(calculator: CalculatorTool): boolean {
    if (!calculator.isActive || !calculator.isPublished) {
      return false;
    }
    
    if (calculator.calculatorType === 'url') {
      return !!calculator.url && this.validateUrl(calculator.url);
    }
    
    if (calculator.calculatorType === 'code') {
      return !!calculator.url || !!calculator.content;
    }
    
    return false;
  }

  // Get the URL for opening a calculator
  getCalculatorUrl(calculator: CalculatorTool): string {
    if (calculator.calculatorType === 'url') {
      return calculator.url;
    }
    
    // For code-based calculators, return the URL or fallback to view endpoint
    return calculator.url || `/api/calculators/${calculator.id}/view`;
  }
}

// Export singleton instance
export const calculatorService = new CalculatorService();