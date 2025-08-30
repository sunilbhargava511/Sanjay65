'use client';

import { useState, useEffect } from 'react';
import { Play, Clock, Tag, ChevronDown, ChevronUp } from 'lucide-react';
import { Lesson } from '@/app/api/lessons/route';
import { lessonService } from '@/lib/lesson-service';
import LessonViewer from './LessonViewer';

interface LessonsListProps {
  category?: 'general' | 'young-adult' | 'older-adult';
  showHeader?: boolean;
  className?: string;
  initialDisplayLimit?: number;
}

export default function LessonsList({ 
  category, 
  showHeader = true, 
  className = '',
  initialDisplayLimit = 3
}: LessonsListProps) {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    loadLessons();
  }, [category]);

  const loadLessons = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const filters = {
        activeOnly: true,
        ...(category && { category })
      };
      
      const data = await lessonService.getLessons(filters);
      setLessons(data.lessons);
      setCategoryCounts(data.categories);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load lessons');
      console.error('Error loading lessons:', err);
    } finally {
      setLoading(false);
    }
  };

  const displayedLessons = showAll ? lessons : lessons.slice(0, initialDisplayLimit);
  const hasMoreLessons = lessons.length > initialDisplayLimit;

  if (loading) {
    return (
      <div className={`bg-white rounded-xl border border-gray-200 shadow-sm ${className}`}>
        {showHeader && (
          <div className="border-b border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900">Lessons</h2>
            <p className="mt-2 text-gray-600">Educational content to guide your financial journey</p>
          </div>
        )}
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading lessons...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-xl border border-gray-200 shadow-sm ${className}`}>
        {showHeader && (
          <div className="border-b border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900">Lessons</h2>
            <p className="mt-2 text-gray-600">Educational content to guide your financial journey</p>
          </div>
        )}
        <div className="p-8 text-center">
          <div className="text-red-600 mb-2">⚠️ Error</div>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={loadLessons}
            className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-lg hover:opacity-90 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (lessons.length === 0) {
    return (
      <div className={`bg-white rounded-xl border border-gray-200 shadow-sm ${className}`}>
        {showHeader && (
          <div className="border-b border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900">Lessons</h2>
            <p className="mt-2 text-gray-600">Educational content to guide your financial journey</p>
          </div>
        )}
        <div className="p-8 text-center">
          <div className="text-gray-400 mb-2">📚</div>
          <p className="text-gray-600">No lessons available{category ? ` for ${lessonService.getCategoryDisplayName(category)}` : ''}.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`bg-white rounded-xl border border-gray-200 shadow-sm ${className}`}>
        {showHeader && (
          <div className="border-b border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {category ? lessonService.getCategoryDisplayName(category) : 'All'} Lessons
            </h2>
            <p className="mt-2 text-gray-600">
              {category 
                ? lessonService.getCategoryDescription(category)
                : 'Educational content to guide your financial journey'
              }
            </p>
            {!category && (
              <div className="mt-4 flex gap-4 text-sm text-gray-600">
                <span>General: {categoryCounts.general || 0}</span>
                <span>Young Adult: {categoryCounts['young-adult'] || 0}</span>
                <span>Older Adult: {categoryCounts['older-adult'] || 0}</span>
              </div>
            )}
          </div>
        )}
        
        <div className="p-6">
          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
            {displayedLessons.map((lesson) => (
              <div 
                key={lesson.id} 
                className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-start gap-4">
                  {/* Thumbnail */}
                  <div className="flex-shrink-0">
                    <div className="relative">
                      {lessonService.getYouTubeThumbnail(lesson.youtubeUrl) && (
                        <img 
                          src={lessonService.getYouTubeThumbnail(lesson.youtubeUrl)!}
                          alt={lesson.title}
                          className="w-20 h-15 object-cover rounded-lg"
                        />
                      )}
                      <button
                        onClick={() => setSelectedLessonId(lesson.id)}
                        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg hover:bg-opacity-60 transition"
                      >
                        <Play className="w-6 h-6 text-white" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-gray-900 text-sm leading-tight">
                        {lesson.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-gray-500 flex-shrink-0">
                        {lesson.duration && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{lessonService.formatDuration(lesson.duration)}</span>
                          </div>
                        )}
                        {!category && (
                          <span className="bg-gray-100 px-2 py-1 rounded-full text-xs">
                            {lessonService.getCategoryDisplayName(lesson.category)}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                      {lesson.description}
                    </p>
                    
                    {lesson.tags && lesson.tags.length > 0 && (
                      <div className="flex items-center gap-2 mt-2">
                        <Tag className="w-3 h-3 text-gray-400" />
                        <div className="flex gap-1 flex-wrap">
                          {lesson.tags.slice(0, 3).map((tag) => (
                            <span 
                              key={tag} 
                              className="text-xs text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                          {lesson.tags.length > 3 && (
                            <span className="text-xs text-gray-400">+{lesson.tags.length - 3}</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {hasMoreLessons && (
            <div className="mt-6 text-center">
              <button
                onClick={() => setShowAll(!showAll)}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                {showAll ? (
                  <>
                    <ChevronUp className="w-4 h-4" />
                    Show Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4" />
                    Show {lessons.length - initialDisplayLimit} More Lessons
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Legacy Video Modal - kept for compatibility */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Lesson Video</h3>
              <button
                onClick={() => setSelectedVideo(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            <div className="aspect-video">
              <iframe
                src={lessonService.getYouTubeEmbedUrl(selectedVideo) || ''}
                title="Lesson Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      )}

      {/* Lesson Viewer */}
      {selectedLessonId && (
        <LessonViewer 
          lessonId={selectedLessonId}
          onClose={() => setSelectedLessonId(null)}
        />
      )}
    </>
  );
}