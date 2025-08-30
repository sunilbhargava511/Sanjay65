'use client';

import React, { useState, useEffect } from 'react';

export default function UserGuidePage() {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadGuide() {
      try {
        const response = await fetch('/api/docs/user-guide');
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header - Mobile Optimized */}
      <header className="sticky top-0 z-10 border-b border-gray-100 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <a 
              href="/" 
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 whitespace-nowrap"
            >
              ← Home
            </a>
          </div>
          <div className="text-center flex-shrink-0">
            <h1 className="text-base sm:text-lg font-semibold tracking-tight">zerofinanx</h1>
            <p className="text-xs text-gray-500 hidden sm:block">User Guide</p>
          </div>
          <nav className="flex justify-end min-w-0 flex-1">
            <a
              href="/login"
              className="inline-flex items-center rounded-lg border border-gray-300 px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium text-gray-900 hover:bg-gray-50 whitespace-nowrap"
            >
              Login
            </a>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-6 sm:py-12">
        {/* Welcome Section - Mobile Optimized */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">{title}</h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Everything you need to know to get started with ZeroFinanx and make the most of your financial education journey.
          </p>
          <div className="mt-4 sm:mt-6">
            <a
              href="/login"
              className="inline-flex items-center rounded-xl bg-gray-900 px-4 sm:px-6 py-2.5 sm:py-3 text-sm font-semibold text-white hover:opacity-90"
            >
              Start Your Free Trial
            </a>
          </div>
        </div>

        {/* Content - Mobile Optimized */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 sm:p-8">
            <div 
              className="max-w-none"
              dangerouslySetInnerHTML={{ __html: convertMarkdownToHtml(content) }}
            />
          </div>
        </div>

        {/* Call to Action - Mobile Optimized */}
        <div className="mt-8 sm:mt-12 text-center">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 sm:p-8">
            <h2 className="text-lg sm:text-xl font-semibold text-amber-900 mb-3 sm:mb-4">Ready to Start Your Journey?</h2>
            <p className="text-amber-800 mb-4 sm:mb-6 text-sm sm:text-base">
              Join the limited beta program with 30 days free and special early-user benefits.
            </p>
            <a
              href="/login"
              className="inline-flex items-center rounded-xl bg-amber-900 px-4 sm:px-6 py-2.5 sm:py-3 text-sm font-semibold text-white hover:opacity-90"
            >
              Start Free Trial Today
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-6 text-center text-sm text-gray-600">
          <p>Questions? Contact us at support@zerofinanx.com</p>
        </div>
      </footer>
    </div>
  );
}

// Enhanced markdown to HTML converter with better formatting support
function convertMarkdownToHtml(markdown: string): string {
  let html = markdown;
  
  // Escape HTML entities first
  html = html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  
  // Handle horizontal rules
  html = html.replace(/^---$/gm, '<hr>');
  
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
  
  // Details/Summary collapsible sections
  html = html.replace(/<details>\s*<summary><strong>(.*?)<\/strong><\/summary>/g, '<details class="my-4 border border-gray-200 rounded-lg"><summary class="cursor-pointer p-4 bg-gray-50 font-semibold text-gray-900 hover:bg-gray-100">$1</summary><div class="p-4">');
  html = html.replace(/<\/details>/g, '</div></details>');
  
  // Bold and italic (must come after code blocks to avoid conflicts)
  html = html.replace(/\*\*\*(.*?)\*\*\*/g, '<strong class="font-bold text-gray-900"><em>$1</em></strong>');
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');
  
  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800">$1</code>');
  
  // Links with proper styling
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">$1</a>');
  
  // Special alert/warning blocks with colored backgrounds
  html = html.replace(/^> ⚠️ \*\*Important Disclaimers\*\*$/gm, '<div class="bg-amber-50 border border-amber-200 rounded-lg p-4 my-4"><div class="flex items-start gap-2"><span class="text-xl">⚠️</span><span class="font-semibold text-amber-800">Important Disclaimers</span></div>');
  html = html.replace(/^> 💡 \*\*(.*?)\*\*: (.*)$/gm, '<div class="bg-blue-50 border border-blue-200 rounded-lg p-4 my-4"><div class="flex items-start gap-2"><span class="text-xl">💡</span><div><span class="font-semibold text-blue-800">$1</span><span class="text-blue-700">: $2</span></div></div></div>');
  html = html.replace(/^> 🔒 \*\*(.*?)\*\*: (.*)$/gm, '<div class="bg-gray-50 border border-gray-200 rounded-lg p-4 my-4"><div class="flex items-start gap-2"><span class="text-xl">🔒</span><div><span class="font-semibold text-gray-800">$1</span><span class="text-gray-700">: $2</span></div></div></div>');
  html = html.replace(/^> ⏰ \*\*(.*?)\*\*: (.*)$/gm, '<div class="bg-red-50 border border-red-200 rounded-lg p-4 my-4"><div class="flex items-start gap-2"><span class="text-xl">⏰</span><div><span class="font-semibold text-red-800">$1</span><span class="text-red-700">: $2</span></div></div></div>');
  
  // Unordered lists with better styling
  html = html.replace(/^- (.*$)/gm, '<li class="my-1 ml-4">$1</li>');
  html = html.replace(/(<li class="my-1 ml-4">.*<\/li>)/gs, '<ul class="list-disc pl-4 my-3 space-y-1 text-gray-700">$1</ul>');
  
  // Ordered lists  
  html = html.replace(/^\d+\. (.*$)/gm, '<li class="my-1 ml-4">$1</li>');
  
  // Fix nested lists
  html = html.replace(/<\/ul>\s*<ul class="list-disc pl-4 my-3 space-y-1 text-gray-700">/g, '');
  html = html.replace(/<\/ol>\s*<ol class="list-decimal pl-4 my-3 space-y-1 text-gray-700">/g, '');
  
  // Line breaks - convert double newlines to paragraphs
  const lines = html.split('\n');
  let inList = false;
  let inTable = false;
  let inCodeBlock = false;
  let inDetails = false;
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
    if (line.includes('<details')) inDetails = true;
    if (line.includes('</details>')) inDetails = false;
    
    if (inCodeBlock || inTable || line.startsWith('<h') || line.startsWith('<hr') || 
        line.startsWith('<ul') || line.startsWith('<ol') || line.startsWith('<li') ||
        line.startsWith('<blockquote') || line.startsWith('<details') || line.startsWith('<div class="flex')) {
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