import { NextRequest, NextResponse } from 'next/server';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

// Import the same in-memory storage (in production, this would be a database)
declare global {
  var uploadedCalculators: any[] | undefined;
}

const uploadedCalculators = globalThis.uploadedCalculators || [];
if (!globalThis.uploadedCalculators) {
  globalThis.uploadedCalculators = uploadedCalculators;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const file = formData.get('file') as File;
    const calculatorUrl = formData.get('url') as string;
    
    if (!name || !description) {
      return NextResponse.json(
        { success: false, error: 'Name and description are required' },
        { status: 400 }
      );
    }
    
    const calculatorId = uuidv4();
    const calculator = {
      id: calculatorId,
      name: name,
      description: description,
      type: file ? 'local' : 'url',
      created: Date.now(),
    };
    
    if (file && file.size > 0) {
      // Handle file upload - create local calculator
      const fileContent = await file.text();
      
      // Create calculator directory
      const calculatorDir = join(process.cwd(), 'public', 'calculators', calculatorId);
      
      try {
        if (!existsSync(calculatorDir)) {
          mkdirSync(calculatorDir, { recursive: true });
        }
        
        // Determine file extension and write file
        const fileName = file.name.toLowerCase();
        let targetFileName = 'index.html';
        
        if (fileName.endsWith('.tsx') || fileName.endsWith('.jsx')) {
          // For React components, we'll wrap them in a basic HTML template
          const wrappedContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${name}</title>
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <style>
        body { margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
        .calculator-container { max-width: 800px; margin: 0 auto; }
    </style>
</head>
<body>
    <div id="calculator-root"></div>
    <script type="text/babel">
        ${fileContent}
        
        // Try to render the component
        const container = document.getElementById('calculator-root');
        const root = ReactDOM.createRoot(container);
        
        // Try to find and render the main component
        try {
            const ComponentName = Object.keys(window).find(key => 
                key.includes('Calculator') || key.includes('Component')
            );
            if (ComponentName && window[ComponentName]) {
                root.render(React.createElement(window[ComponentName]));
            } else {
                // Fallback: try to render default export if available
                root.render(React.createElement('div', {}, 'Calculator loaded'));
            }
        } catch (error) {
            console.error('Error rendering calculator:', error);
            root.render(React.createElement('div', {}, 'Error loading calculator'));
        }
    </script>
</body>
</html>`;
          writeFileSync(join(calculatorDir, targetFileName), wrappedContent);
        } else {
          // For HTML files, use as-is
          writeFileSync(join(calculatorDir, targetFileName), fileContent);
        }
        
        calculator.url = `/calculators/${calculatorId}`;
        
      } catch (fileError) {
        console.error('Error saving calculator file:', fileError);
        return NextResponse.json(
          { success: false, error: 'Failed to save calculator file' },
          { status: 500 }
        );
      }
      
    } else if (calculatorUrl) {
      // Handle URL-based calculator
      try {
        new URL(calculatorUrl); // Validate URL
        calculator.url = calculatorUrl;
      } catch (urlError) {
        return NextResponse.json(
          { success: false, error: 'Invalid calculator URL' },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        { success: false, error: 'Either file or URL must be provided' },
        { status: 400 }
      );
    }
    
    // Add to calculators list (in production, save to database)
    uploadedCalculators.push(calculator);
    
    return NextResponse.json({
      success: true,
      calculator,
      message: 'Calculator uploaded successfully'
    });
    
  } catch (error) {
    console.error('Calculator upload error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Upload failed' 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Return list of uploaded calculators
  return NextResponse.json({
    success: true,
    calculators: uploadedCalculators
  });
}