import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { calculatorRepository } from '@/lib/repositories/calculators';
import { reactToHtmlConverter } from '@/lib/react-to-html-converter';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const calculatorType = formData.get('calculatorType') as 'file' | 'url';
    const url = formData.get('url') as string;
    const file = formData.get('file') as File | null;

    // Validate required fields
    if (!name || !description) {
      return NextResponse.json(
        { success: false, error: 'Name and description are required' },
        { status: 400 }
      );
    }

    let calculatorUrl = '';
    let fileName = '';
    let standaloneUrl: string | null = null;
    let processedContent = ''; // Declare at function scope

    if (calculatorType === 'file') {
      if (!file) {
        return NextResponse.json(
          { success: false, error: 'File is required for file uploads' },
          { status: 400 }
        );
      }

      // Validate file type
      const allowedExtensions = ['.tsx', '.ts', '.jsx', '.js', '.html', '.htm'];
      const fileExtension = path.extname(file.name).toLowerCase();
      
      if (!allowedExtensions.includes(fileExtension)) {
        return NextResponse.json(
          { success: false, error: 'Invalid file type. Only .tsx, .ts, .jsx, .js, .html, .htm files are allowed' },
          { status: 400 }
        );
      }

      // Handle different file types with sophisticated processing
      const fileContent = await file.text();
      processedContent = fileContent;

      // Check if we're in a production/serverless environment
      const isProduction = process.env.NODE_ENV === 'production';

      if (fileExtension === '.tsx' || fileExtension === '.jsx' || fileExtension === '.ts' || fileExtension === '.js') {
        // Use the advanced React-to-HTML converter
        try {
          console.log(`🔧 Processing ${file.name} with ReactToHtmlConverter...`);
          processedContent = await reactToHtmlConverter.convertToStandaloneHtml(
            fileContent,
            file.name,
            name,
            description
          );
          console.log(`✅ React-to-HTML conversion successful for ${file.name}`);
          
          // Only save standalone files in development/local
          if (!isProduction) {
            console.log(`💾 Saving standalone file for ${file.name}...`);
            // We'll get the actual ID after creating the calculator
            standaloneUrl = await reactToHtmlConverter.processAndSaveCalculator(
              fileContent,
              file.name,
              name,
              description,
              'temp' // Temporary ID, will be replaced
            );
            console.log(`✅ Standalone calculator saved: ${standaloneUrl}`);
          } else {
            console.log(`🚀 Production mode: Standalone file will be served via API`);
          }
        } catch (error) {
          console.error('❌ Advanced processing failed:', error);
          console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace');
          console.log('🔄 Falling back to basic wrapper...');
          // Fallback to basic processing
          processedContent = wrapReactComponentInHTML(fileContent, file.name, name);
        }
      }
      // For .html/.htm files, use as-is

      // In production, we can't write files to the filesystem
      // So we'll store the processed content in the calculator object instead
      if (isProduction) {
        // Store processed HTML content directly in calculator data - URL will be set after creation
        calculatorUrl = ''; // Will be set after we create the calculator and get its ID
      } else {
        // Local development: write files as before
        const calculatorsDir = path.join(process.cwd(), 'public', 'calculators');
        if (!existsSync(calculatorsDir)) {
          await mkdir(calculatorsDir, { recursive: true });
        }

        // Create a temporary directory name - will be updated after getting real ID
        const tempDir = path.join(calculatorsDir, 'temp');
        if (!existsSync(tempDir)) {
          await mkdir(tempDir, { recursive: true });
        }

        fileName = `calculator-temp.html`;
        const filePath = path.join(tempDir, fileName);
        await writeFile(filePath, processedContent);
        calculatorUrl = ''; // Will be set after creation
      }

    } else if (calculatorType === 'url') {
      if (!url) {
        return NextResponse.json(
          { success: false, error: 'URL is required for URL-based calculators' },
          { status: 400 }
        );
      }

      // Validate URL format
      try {
        new URL(url);
        calculatorUrl = url;
      } catch {
        return NextResponse.json(
          { success: false, error: 'Invalid URL format' },
          { status: 400 }
        );
      }
    }

    // Get the highest order index
    const existingCalculators = calculatorRepository.findAll();
    const orderIndex = existingCalculators.length;

    // Create calculator object first to get the ID
    const newCalculator = calculatorRepository.create({
      name: name.trim(),
      category: 'financial', // Default category
      description: description.trim(),
      url: calculatorUrl || '/temp', // Temporary URL, will be updated
      icon: 'Calculator',
      color: 'bg-blue-500',
      isActive: true,
      calculatorType: calculatorType === 'file' ? 'code' as const : 'url' as const,
      fileName: fileName || undefined,
      orderIndex,
      isPublished: true,
      fields: [],
      // Store processed content for production environments
      content: calculatorType === 'file' && processedContent ? processedContent : undefined
    });

    // Now fix the URLs and file paths with the real ID
    if (calculatorType === 'file') {
      const isProduction = process.env.NODE_ENV === 'production';
      
      if (isProduction) {
        // Update the URL to point to the view endpoint
        calculatorUrl = `/api/calculators/${newCalculator.id}/view`;
        calculatorRepository.update(newCalculator.id, { url: calculatorUrl });
      } else {
        // Move the file from temp location to the proper location with real ID
        const calculatorsDir = path.join(process.cwd(), 'public', 'calculators');
        const realDir = path.join(calculatorsDir, newCalculator.id.toString());
        const tempDir = path.join(calculatorsDir, 'temp');
        
        if (!existsSync(realDir)) {
          await mkdir(realDir, { recursive: true });
        }
        
        const realFileName = `calculator-${newCalculator.id}.html`;
        const realFilePath = path.join(realDir, realFileName);
        const tempFilePath = path.join(tempDir, 'calculator-temp.html');
        
        // Copy file from temp to real location
        if (existsSync(tempFilePath)) {
          await writeFile(realFilePath, processedContent);
          // Clean up temp file
          try {
            const fs = require('fs');
            fs.unlinkSync(tempFilePath);
          } catch (e) {
            // Ignore cleanup errors
          }
        }
        
        calculatorUrl = `/calculators/${newCalculator.id}/${realFileName}`;
        calculatorRepository.update(newCalculator.id, { 
          url: calculatorUrl,
          fileName: realFileName 
        });
        
        // Update standalone URL with real ID if it was created
        if (standaloneUrl) {
          standaloneUrl = await reactToHtmlConverter.processAndSaveCalculator(
            fileContent,
            file.name,
            name,
            description,
            newCalculator.id.toString()
          );
        }
      }
    }

    // Get the final calculator state after updates
    const finalCalculator = calculatorRepository.findById(newCalculator.id) || newCalculator;
    
    return NextResponse.json({
      success: true,
      calculator: {
        ...finalCalculator,
        standaloneUrl
      },
      message: 'Calculator uploaded successfully',
      standaloneUrl
    });

  } catch (error) {
    console.error('Calculator upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Fallback function for basic React component wrapping
function wrapReactComponentInHTML(reactCode: string, fileName: string, name: string): string {
  const componentName = fileName.replace(/\.(tsx|ts|jsx|js)$/, '').replace(/[^a-zA-Z0-9]/g, '');
  
  const cleanedCode = reactCode
    .replace(/^import\s+.*?from\s+['"][^'"]*['"];?\s*$/gm, '') // Remove import statements
    .replace(/^export\s+default\s+/gm, 'window.Calculator = ') // Convert default export
    .replace(/^export\s+/gm, 'window.') // Convert named exports
    .replace(/export\s*{\s*([^}]+)\s*}/g, (match, exports) => {
      return exports.split(',').map((exp: string) => {
        const [name, alias] = exp.split(' as ').map((s: string) => s.trim());
        const targetName = alias || name;
        return `window.${targetName} = ${name};`;
      }).join('\n');
    });
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${name}</title>
    <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }
        #root {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
    </style>
</head>
<body>
    <div id="root"></div>
    
    <script>
        window.exports = {};
        window.module = { exports: window.exports };
    </script>
    
    <script type="text/babel" data-presets="react,env">
        ${cleanedCode}
        
        const componentNames = ['Calculator', '${componentName}', 'App', 'default'];
        let ComponentToRender = null;
        
        for (const name of componentNames) {
            if (typeof window[name] !== 'undefined') {
                ComponentToRender = window[name];
                break;
            }
        }
        
        if (ComponentToRender) {
            const root = ReactDOM.createRoot(document.getElementById('root'));
            root.render(React.createElement(ComponentToRender));
        } else {
            document.getElementById('root').innerHTML = '<div><h1>Calculator Loaded</h1><p>Component could not be automatically rendered.</p></div>';
        }
    </script>
</body>
</html>`;
}

export async function GET() {
  // Return list of uploaded calculators
  const uploadedCalculators = calculatorRepository.findAll();
  return NextResponse.json({
    success: true,
    calculators: uploadedCalculators
  });
}