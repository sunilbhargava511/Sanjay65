'use client';

import React, { useState, useEffect } from 'react';

// Force this page to be dynamic - it makes API calls
export const dynamic = 'force-dynamic';

export default function AdminGuidePage() {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadGuide() {
      try {
        const response = await fetch('/api/docs/admin-guide');
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to load guide');
        }
        
        setContent(data.content);
        setTitle(data.title);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load guide');
      } finally {
        setLoading(false);
      }
    }

    loadGuide();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="mx-auto max-w-4xl px-4">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="mx-auto max-w-4xl px-4">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="text-red-600 text-center">
              <h1 className="text-2xl font-bold mb-2">Error Loading Guide</h1>
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-4xl px-4">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <a 
              href="/admin" 
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
            >
              ← Back to Admin Panel
            </a>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-600 mt-2">
            Complete guide for configuring and managing ZeroFinanx
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-8">
            <div 
              className="max-w-none"
              dangerouslySetInnerHTML={{ __html: convertMarkdownToHtml(content) }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            Need help? Contact support or check the troubleshooting section above.
          </p>
        </div>
      </div>
    </div>
  );
}

// Enhanced markdown to HTML converter with better formatting support
function convertMarkdownToHtml(markdown: string): string {
  let html = markdown;
  
  // Escape HTML entities first
  html = html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  
  // Handle horizontal rules
  html = html.replace(/^---$/gm, '<hr class="border-t border-gray-300 my-8">');
  
  // Handle blockquotes with proper styling
  html = html.replace(/^> (.*$)/gm, '<blockquote class="border-l-4 border-blue-500 bg-blue-50 p-4 my-4 rounded-r-lg">$1</blockquote>');
  // Merge consecutive blockquotes
  html = html.replace(/(<blockquote[^>]*>.*?<\/blockquote>)\s*(<blockquote[^>]*>.*?<\/blockquote>)/gs, (match, first, second) => {
    const firstContent = first.replace(/<\/?blockquote[^>]*>/g, '');
    const secondContent = second.replace(/<\/?blockquote[^>]*>/g, '');
    return `<blockquote class="border-l-4 border-blue-500 bg-blue-50 p-4 my-4 rounded-r-lg">${firstContent}<br>${secondContent}</blockquote>`;
  });
  
  // Handle tables
  html = html.replace(/^\|(.+)\|$/gm, (match, content, offset, string) => {
    const cells = content.split('|').map(cell => cell.trim()).filter(cell => cell);
    // Check if this is a header separator row (contains only dashes and pipes)
    if (cells.every(cell => /^-+$/.test(cell))) {
      return ''; // Skip separator rows
    }
    // Determine if this is likely a header row (first table row)
    const beforeMatch = string.substring(0, offset);
    const isFirstRow = !beforeMatch.includes('<tr>');
    const cellTag = isFirstRow ? 'th' : 'td';
    const cellClass = isFirstRow ? 'class="bg-gray-50 font-semibold text-gray-900 px-3 py-2 border border-gray-300"' : 'class="px-3 py-2 border border-gray-300 text-gray-700"';
    return `<tr>${cells.map(cell => `<${cellTag} ${cellClass}>${cell}</${cellTag}>`).join('')}</tr>`;
  });
  html = html.replace(/(<tr>.*?<\/tr>[\s\S]*?<tr>.*?<\/tr>)/gs, '<table class="w-full border-collapse border border-gray-300 my-6 rounded-lg overflow-hidden">$1</table>');
  
  // Code blocks with language support
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
    return `<pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4"><code class="language-${lang || 'text'}">${code.trim()}</code></pre>`;
  });
  
  // Simple code blocks without language
  html = html.replace(/```\n?([\s\S]*?)```/g, '<pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4"><code>$1</code></pre>');
  
  // Headers with proper anchor links and styling
  html = html.replace(/^#### (.*$)/gm, '<h4 class="text-base font-medium mt-6 mb-2 text-gray-900">$1</h4>');
  html = html.replace(/^### (.*$)/gm, '<h3 class="text-lg font-medium mt-8 mb-3 text-gray-900">$1</h3>');
  html = html.replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold mt-10 mb-4 text-gray-900 border-b border-gray-200 pb-2">$1</h2>');
  html = html.replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mb-6 text-gray-900 border-b border-gray-200 pb-3">$1</h1>');
  
  // Bold and italic (must come after code blocks to avoid conflicts)
  html = html.replace(/\*\*\*(.*?)\*\*\*/g, '<strong class="font-bold text-gray-900"><em>$1</em></strong>');
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');
  
  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800">$1</code>');
  
  // Links with proper styling
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">$1</a>');
  
  // Special admin-focused alert boxes
  html = html.replace(/^\*\*Problem\*\*: (.*$)/gm, '<div class="bg-red-50 border border-red-200 rounded-lg p-4 my-4"><div class="flex items-start gap-2"><span class="text-xl">⚠️</span><div><span class="font-semibold text-red-800">Problem</span><span class="text-red-700">: $1</span></div></div></div>');
  html = html.replace(/^- \*\*Check\*\*: (.*$)/gm, '<div class="bg-blue-50 border border-blue-200 rounded-lg p-3 my-2 ml-4"><div class="flex items-start gap-2"><span class="text-sm">🔍</span><div><span class="font-semibold text-blue-800">Check</span><span class="text-blue-700">: $1</span></div></div></div>');
  html = html.replace(/^- \*\*Verify\*\*: (.*$)/gm, '<div class="bg-green-50 border border-green-200 rounded-lg p-3 my-2 ml-4"><div class="flex items-start gap-2"><span class="text-sm">✅</span><div><span class="font-semibold text-green-800">Verify</span><span class="text-green-700">: $1</span></div></div></div>');
  html = html.replace(/^- \*\*Solution\*\*: (.*$)/gm, '<div class="bg-green-50 border border-green-200 rounded-lg p-3 my-2 ml-4"><div class="flex items-start gap-2"><span class="text-sm">💡</span><div><span class="font-semibold text-green-800">Solution</span><span class="text-green-700">: $1</span></div></div></div>');
  html = html.replace(/^- \*\*Note\*\*: (.*$)/gm, '<div class="bg-gray-50 border border-gray-200 rounded-lg p-3 my-2 ml-4"><div class="flex items-start gap-2"><span class="text-sm">📝</span><div><span class="font-semibold text-gray-800">Note</span><span class="text-gray-700">: $1</span></div></div></div>');
  
  // Unordered lists with better styling
  html = html.replace(/^- (.*$)/gm, '<li class="my-1 ml-4">$1</li>');
  html = html.replace(/(<li class="my-1 ml-4">.*<\/li>)/gs, '<ul class="list-disc pl-4 my-3 space-y-1 text-gray-700">$1</ul>');
  
  // Ordered lists  
  html = html.replace(/^\d+\. (.*$)/gm, '<li class="my-1 ml-4">$1</li>');
  
  // Checkbox lists for checklists
  html = html.replace(/^- \[ \] (.*$)/gm, '<li class="flex items-center gap-2 my-1"><input type="checkbox" class="rounded" disabled> <span class="text-gray-700">$1</span></li>');
  html = html.replace(/^- \[x\] (.*$)/gm, '<li class="flex items-center gap-2 my-1"><input type="checkbox" class="rounded" checked disabled> <span class="text-gray-700 line-through">$1</span></li>');
  
  // Fix nested lists
  html = html.replace(/<\/ul>\s*<ul class="list-disc pl-4 my-3 space-y-1 text-gray-700">/g, '');
  html = html.replace(/<\/ol>\s*<ol class="list-decimal pl-4 my-3 space-y-1 text-gray-700">/g, '');
  
  // Line breaks - convert double newlines to paragraphs
  const lines = html.split('\n');
  let inList = false;
  let inTable = false;
  let inCodeBlock = false;
  let result = '';
  let currentParagraph = '';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Track context
    if (line.includes('<pre')) inCodeBlock = true;
    if (line.includes('</pre>')) inCodeBlock = false;
    if (line.includes('<ul') || line.includes('<ol')) inList = true;
    if (line.includes('</ul>') || line.includes('</ol>')) inList = false;
    if (line.includes('<table')) inTable = true;
    if (line.includes('</table>')) inTable = false;
    
    if (inCodeBlock || inTable || line.startsWith('<h') || line.startsWith('<hr') || 
        line.startsWith('<ul') || line.startsWith('<ol') || line.startsWith('<li') ||
        line.startsWith('<blockquote') || line.startsWith('<div class=')) {
      // Flush any pending paragraph
      if (currentParagraph.trim()) {
        result += `<p class="my-3 text-gray-700 leading-relaxed">${currentParagraph.trim()}</p>\n`;
        currentParagraph = '';
      }
      result += line + '\n';
    } else if (line === '') {
      // Empty line - end current paragraph if any
      if (currentParagraph.trim()) {
        result += `<p class="my-3 text-gray-700 leading-relaxed">${currentParagraph.trim()}</p>\n`;
        currentParagraph = '';
      }
    } else {
      // Regular content line
      if (currentParagraph) currentParagraph += ' ';
      currentParagraph += line;
    }
  }
  
  // Flush any final paragraph
  if (currentParagraph.trim()) {
    result += `<p class="my-3 text-gray-700 leading-relaxed">${currentParagraph.trim()}</p>\n`;
  }
  
  return result.trim();
}