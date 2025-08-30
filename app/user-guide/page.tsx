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
              className="prose prose-slate max-w-none
                prose-headings:text-gray-900 
                prose-h1:text-2xl prose-h1:font-bold prose-h1:border-b prose-h1:border-gray-200 prose-h1:pb-2 prose-h1:mb-6
                prose-h2:text-xl prose-h2:font-semibold prose-h2:mt-10 prose-h2:mb-4
                prose-h3:text-lg prose-h3:font-medium prose-h3:mt-8 prose-h3:mb-3
                prose-p:text-gray-700 prose-p:leading-relaxed
                prose-ul:text-gray-700 prose-ol:text-gray-700
                prose-li:my-1
                prose-strong:text-gray-900 prose-strong:font-semibold
                prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm
                prose-pre:bg-gray-900 prose-pre:text-gray-100
                prose-blockquote:border-l-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:p-4
                prose-a:text-blue-600 prose-a:hover:text-blue-800"
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

// Simple markdown to HTML converter for basic formatting
function convertMarkdownToHtml(markdown: string): string {
  let html = markdown;
  
  // Headers
  html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');
  
  // Bold and italic
  html = html.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // Code blocks
  html = html.replace(/```[\s\S]*?```/g, (match) => {
    const code = match.replace(/```/g, '').trim();
    return `<pre><code>${code}</code></pre>`;
  });
  
  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  
  // Lists
  html = html.replace(/^- (.*$)/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
  
  // Numbered lists
  html = html.replace(/^\d+\. (.*$)/gm, '<li>$1</li>');
  
  // Paragraphs
  html = html.replace(/\n\n/g, '</p><p>');
  html = '<p>' + html + '</p>';
  
  // Clean up empty paragraphs
  html = html.replace(/<p><\/p>/g, '');
  html = html.replace(/<p>(<h[1-6]>)/g, '$1');
  html = html.replace(/(<\/h[1-6]>)<\/p>/g, '$1');
  html = html.replace(/<p>(<ul>)/g, '$1');
  html = html.replace(/(<\/ul>)<\/p>/g, '$1');
  html = html.replace(/<p>(<pre>)/g, '$1');
  html = html.replace(/(<\/pre>)<\/p>/g, '$1');
  
  return html;
}