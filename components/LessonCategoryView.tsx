'use client';

import { useState, useEffect } from 'react';
import LessonsList from './LessonsList';
import { Lesson } from '@/app/api/lessons/route';
import { lessonService } from '@/lib/lesson-service';

interface LessonCategoryViewProps {
  className?: string;
}

export default function LessonCategoryView({ className = '' }: LessonCategoryViewProps) {
  const [activeCategory, setActiveCategory] = useState<'general' | 'young-adult' | 'older-adult' | 'all'>('all');
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategoryCounts();
  }, []);

  const loadCategoryCounts = async () => {
    try {
      setLoading(true);
      const data = await lessonService.getLessons({ activeOnly: true });
      setCategoryCounts(data.categories);
    } catch (error) {
      console.error('Error loading category counts:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { 
      key: 'all' as const, 
      name: 'All Lessons', 
      description: 'Complete collection of financial education',
      count: Object.values(categoryCounts).reduce((a, b) => a + b, 0)
    },
    { 
      key: 'general' as const, 
      name: 'General', 
      description: lessonService.getCategoryDescription('general'),
      count: categoryCounts.general || 0
    },
    { 
      key: 'young-adult' as const, 
      name: 'Young Adult', 
      description: lessonService.getCategoryDescription('young-adult'),
      count: categoryCounts['young-adult'] || 0
    },
    { 
      key: 'older-adult' as const, 
      name: 'Older Adult', 
      description: lessonService.getCategoryDescription('older-adult'),
      count: categoryCounts['older-adult'] || 0
    }
  ];

  if (loading) {
    return (
      <div className={`bg-white rounded-xl border border-gray-200 shadow-sm ${className}`}>
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading lessons...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl border border-gray-200 shadow-sm ${className}`}>
      {/* Category Tabs */}
      <div className="border-b border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Lessons</h2>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.key}
              onClick={() => setActiveCategory(category.key)}
              className={`px-4 py-2 text-sm font-medium rounded-lg border transition ${
                activeCategory === category.key
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {category.name}
              {category.count > 0 && (
                <span className="ml-2 text-xs opacity-75">
                  ({category.count})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Active Category Description */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <p className="text-sm text-gray-600">
          {categories.find(c => c.key === activeCategory)?.description}
        </p>
      </div>

      {/* Lessons List */}
      <div className="p-0">
        <LessonsList 
          category={activeCategory === 'all' ? undefined : activeCategory}
          showHeader={false}
          className="border-0 shadow-none rounded-none"
        />
      </div>
    </div>
  );
}