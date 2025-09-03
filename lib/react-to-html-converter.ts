import fs from 'fs';
import path from 'path';

/**
 * Service to convert React TSX/JSX components to standalone HTML pages
 * Based on the financial-advisor system's approach
 */
export class ReactToHtmlConverter {
  private dependencies = {
    tailwind: 'https://cdn.tailwindcss.com',
    react: 'https://unpkg.com/react@18/umd/react.production.min.js',
    reactDom: 'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
    babel: 'https://unpkg.com/@babel/standalone/babel.min.js'
  };

  private iconMap = {
    // Lucide React icons → Unicode equivalents
    'Calculator': '🧮',
    'TrendingUp': '📈',
    'Target': '🎯',
    'Percent': '%',
    'IndianRupee': '₹',
    'DollarSign': '$',
    'PiggyBank': '🏦',
    'TrendingDown': '📉',
    'BarChart': '📊',
    'LineChart': '📈',
    'Activity': '📊',
    'CreditCard': '💳',
    'Coins': '🪙',
    'Banknote': '💵',
    'Wallet': '👛',
    'Building': '🏢',
    'Home': '🏠',
    'Car': '🚗',
    'Plane': '✈️',
    'Calendar': '📅',
    'Clock': '⏰',
    'Info': 'ℹ️',
    'AlertCircle': '⚠️',
    'CheckCircle': '✅',
    'X': '✕',
    'Check': '✓',
    'Plus': '+',
    'Minus': '-',
    'Equal': '=',
    'ArrowUp': '↑',
    'ArrowDown': '↓',
    'ArrowLeft': '←',
    'ArrowRight': '→'
  };

  /**
   * Convert React TSX/JSX to standalone HTML
   */
  async convertToStandaloneHtml(
    reactCode: string, 
    fileName: string,
    calculatorName: string,
    calculatorDescription: string
  ): Promise<string> {
    try {
      // Extract component name from code or use calculator name
      const componentName = this.extractComponentName(reactCode) || 
        this.sanitizeComponentName(calculatorName);

      // Process the React code
      const processedCode = this.processReactCode(reactCode);

      // Generate complete HTML
      const html = this.generateStandaloneHtml({
        componentName,
        processedCode,
        calculatorName,
        calculatorDescription,
        fileName
      });

      return html;
    } catch (error) {
      console.error('ReactToHtmlConverter error:', error);
      throw new Error(`Failed to convert React code: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Process React code for browser execution
   */
  private processReactCode(reactCode: string): string {
    let processedCode = reactCode;

    // Apply aggressive cleaning first - this is what makes it work!
    processedCode = this.aggressiveClean(processedCode);

    // Replace Lucide icons
    processedCode = this.replaceLucideIcons(processedCode);

    return processedCode;
  }

  /**
   * Aggressive cleaning - removes ALL module system references
   */
  private aggressiveClean(code: string): string {
    let cleaned = code;
    
    // Step 1: Remove ALL import statements
    cleaned = cleaned.replace(/^[\s]*import\s+.*?from\s+['"][^'"]*['"];?\s*$/gm, '');
    cleaned = cleaned.replace(/^[\s]*import\s+['"][^'"]*['"];?\s*$/gm, '');
    
    // Step 2: Remove ALL export statements completely
    cleaned = cleaned.replace(/^[\s]*export\s+.*$/gm, '');
    
    // Step 3: Remove any references to exports, module, require
    cleaned = cleaned.replace(/exports\./g, 'window.');
    cleaned = cleaned.replace(/module\.exports/g, 'window.Calculator');
    cleaned = cleaned.replace(/require\(/g, '// require(');
    
    return cleaned;
  }

  /**
   * Replace Lucide React icons with Unicode/HTML equivalents
   */
  private replaceLucideIcons(code: string): string {
    let result = code;

    // Replace icon components with simple emoji spans
    Object.entries(this.iconMap).forEach(([iconName, unicode]) => {
      // Self-closing tags
      result = result.replace(new RegExp(`<${iconName}[^>]*/>`, 'g'), `<span>${unicode}</span>`);
      // Open/close tags  
      result = result.replace(new RegExp(`<${iconName}[^>]*>`, 'g'), `<span>${unicode}`);
      result = result.replace(new RegExp(`</${iconName}>`, 'g'), '</span>');
    });

    return result;
  }

  /**
   * Extract component name from React code
   */
  private extractComponentName(code: string): string | null {
    // Try different patterns
    const patterns = [
      /const\s+(\w+)\s*=\s*\(\s*\)\s*=>/,  // const ComponentName = () =>
      /function\s+(\w+)\s*\(/,              // function ComponentName(
      /export\s+default\s+function\s+(\w+)/, // export default function ComponentName
      /class\s+(\w+)\s+extends/             // class ComponentName extends
    ];

    for (const pattern of patterns) {
      const match = code.match(pattern);
      if (match) {
        return match[1];
      }
    }

    return null;
  }

  /**
   * Sanitize calculator name to valid component name
   */
  private sanitizeComponentName(name: string): string {
    return name
      .replace(/[^a-zA-Z0-9]/g, '')
      .replace(/^[0-9]/, 'Component$&')
      .replace(/^./, (c) => c.toUpperCase()) || 'Calculator';
  }

  /**
   * Generate complete standalone HTML document
   */
  private generateStandaloneHtml(options: {
    componentName: string;
    processedCode: string;
    calculatorName: string;
    calculatorDescription: string;
    fileName: string;
  }): string {
    const { componentName, processedCode, calculatorName, calculatorDescription, fileName } = options;

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${calculatorName}</title>
    <meta name="description" content="${calculatorDescription}">
    
    <!-- Tailwind CSS -->
    <script src="${this.dependencies.tailwind}"></script>
    
    <!-- Custom Styles -->
    <style>
        /* Range slider styles */
        input[type="range"] {
            -webkit-appearance: none;
            appearance: none;
        }
        
        input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            height: 20px;
            width: 20px;
            border-radius: 50%;
            background: #3B82F6;
            cursor: pointer;
            border: 2px solid #ffffff;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        input[type="range"]::-moz-range-thumb {
            height: 20px;
            width: 20px;
            border-radius: 50%;
            background: #3B82F6;
            cursor: pointer;
            border: 2px solid #ffffff;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            border: none;
        }

        /* Icon styles */
        .icon {
            display: inline-block;
            width: 1.25rem;
            height: 1.25rem;
            text-align: center;
            line-height: 1.25rem;
            font-size: 1rem;
        }
        
        .lucide-icon {
            vertical-align: middle;
        }

        /* Loading states */
        .calculating {
            opacity: 0.6;
            pointer-events: none;
        }

        /* Ensure full height on mobile */
        body, html {
            min-height: 100vh;
            margin: 0;
            padding: 0;
        }

        /* Print styles */
        @media print {
            .no-print {
                display: none !important;
            }
        }

        /* Source attribution */
        .source-info {
            font-size: 0.75rem;
            color: #6B7280;
            text-align: center;
            padding: 1rem;
            border-top: 1px solid #E5E7EB;
            background: #F9FAFB;
        }
    </style>
</head>
<body>
    <!-- Calculator Content -->
    <div id="app">
        <div class="flex items-center justify-center min-h-screen bg-gray-100">
            <div class="text-center p-8">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p class="text-gray-600">Loading...</p>
            </div>
        </div>
    </div>

    <!-- Source Information -->
    <div class="source-info no-print">
        <p>Generated from: ${fileName} | Calculator: ${calculatorName}</p>
        <p>Powered by Financial Advisor Platform</p>
    </div>

    <!-- React Dependencies -->
    <script crossorigin src="${this.dependencies.react}"></script>
    <script crossorigin src="${this.dependencies.reactDom}"></script>
    <script crossorigin src="${this.dependencies.babel}"></script>
    
    <!-- Application Code -->
    <script type="text/babel">
        // React hooks - MUST be before component code
        const { useState, useEffect } = React;
        
        // Application code converted from React
        ${processedCode}
        
        // Component mounting logic
        const container = document.getElementById('app');
        const root = ReactDOM.createRoot(container);
        
        if (typeof ${componentName} !== 'undefined') {
            root.render(React.createElement(${componentName}));
            console.log('✅ Calculator loaded');
        } else {
            container.innerHTML = '<div class="p-8 text-center text-red-600">Calculator not found</div>';
            console.error('❌ ${componentName} undefined');
        }

        // Add error boundary
        window.addEventListener('error', (event) => {
            console.error('💥 Global error:', event.error);
        });

        window.addEventListener('unhandledrejection', (event) => {
            console.error('💥 Unhandled promise rejection:', event.reason);
        });
    </script>
</body>
</html>`;
  }

  /**
   * Save standalone HTML to public directory
   */
  async saveStandaloneHtml(
    htmlContent: string, 
    calculatorId: string
  ): Promise<string> {
    // Check if we're in production/serverless environment
    const isProduction = process.env.NODE_ENV === 'production' && process.env.VERCEL;
    
    if (isProduction) {
      // In production, we can't write files, so return API endpoint URL
      console.log(`🚀 Production mode: Content will be served via API endpoint`);
      return `/api/calculators/${calculatorId}/view`;
    }
    
    // Development mode: write files as before
    const publicDir = path.join(process.cwd(), 'public', 'calculators');
    
    // Ensure directory exists
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    const fileName = `${calculatorId}.html`;
    const filePath = path.join(publicDir, fileName);
    
    fs.writeFileSync(filePath, htmlContent, 'utf8');
    console.log(`📁 Saved calculator to: ${filePath}`);
    
    return `/calculators/${fileName}`;
  }

  /**
   * Generate standalone HTML and save to public directory
   */
  async processAndSaveCalculator(
    reactCode: string,
    fileName: string,
    calculatorName: string,
    calculatorDescription: string,
    calculatorId: string
  ): Promise<string> {
    const htmlContent = await this.convertToStandaloneHtml(
      reactCode,
      fileName,
      calculatorName,
      calculatorDescription
    );
    
    const publicUrl = await this.saveStandaloneHtml(htmlContent, calculatorId);
    
    return publicUrl;
  }
}

// Export singleton instance
export const reactToHtmlConverter = new ReactToHtmlConverter();