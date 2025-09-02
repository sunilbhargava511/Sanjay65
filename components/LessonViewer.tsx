'use client';

import { useState, useEffect } from 'react';
import { X, Clock, Tag, ArrowLeft } from 'lucide-react';
import { Lesson } from '@/app/api/lessons/route';
import { lessonService } from '@/lib/lesson-service';

interface LessonViewerProps {
  lessonId: string;
  onClose: () => void;
  onBack?: () => void;
}

export default function LessonViewer({ lessonId, onClose, onBack }: LessonViewerProps) {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadLesson();
  }, [lessonId]);

  const loadLesson = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await lessonService.getLessons({});
      const foundLesson = data.lessons.find(l => l.id === lessonId);
      if (foundLesson) {
        setLesson(foundLesson);
      } else {
        setError('Lesson not found');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load lesson');
      console.error('Error loading lesson:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-2 sm:p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden mx-2">
          <div className="p-6 sm:p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading lesson...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-2 sm:p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden mx-2">
          <div className="p-6 sm:p-8 text-center">
            <div className="text-red-600 mb-2 text-xl sm:text-2xl">⚠️ Error</div>
            <p className="text-gray-600">{error || 'Lesson not found'}</p>
            <button 
              onClick={onClose}
              className="mt-4 px-4 py-2.5 sm:py-2 bg-gray-900 text-white rounded-lg hover:opacity-90 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  const embedUrl = lesson.videoUrl ? lessonService.getYouTubeEmbedUrl(lessonService.extractYouTubeVideoId(lesson.videoUrl) || '') : null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden mx-2">
        
        {/* Header - Mobile Optimized */}
        <div className="p-4 sm:p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-start justify-between gap-2 sm:gap-4">
            <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
              {onBack && (
                <button
                  onClick={onBack}
                  className="p-1.5 sm:p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition flex-shrink-0 mt-0.5"
                >
                  <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                    {lessonService.getCategoryDisplayName(lesson.category)}
                  </span>
                  {lesson.duration && (
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>{lessonService.formatDuration(lesson.duration)}</span>
                    </div>
                  )}
                </div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight break-words">
                  {lesson.title}
                </h1>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition flex-shrink-0"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>

        {/* Content - Mobile Optimized */}
        <div className="overflow-y-auto max-h-[calc(95vh-80px)] sm:max-h-[calc(90vh-100px)]">
          
          {/* One-liner Introduction - Mobile Optimized */}
          <div className="p-4 sm:p-6 bg-blue-50 border-b border-gray-200">
            <p className="text-gray-800 leading-relaxed text-sm sm:text-base">
              {lesson.description}
            </p>
            {lesson.tags && lesson.tags.length > 0 && (
              <div className="flex items-start gap-2 mt-3">
                <Tag className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                <div className="flex gap-1 flex-wrap">
                  {lesson.tags.map((tag) => (
                    <span 
                      key={tag} 
                      className="text-xs text-gray-600 bg-white px-2 py-1 rounded-full border"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Video Player */}
          <div className="bg-black">
            {embedUrl ? (
              <div className="aspect-video">
                <iframe
                  src={embedUrl}
                  title={lesson.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            ) : (
              <div className="aspect-video flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="text-red-400 mb-2">⚠️</div>
                  <p>Unable to load video</p>
                  {lesson.videoUrl && (
                    <a 
                      href={lesson.videoUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="mt-2 inline-block text-blue-400 hover:text-blue-300 underline"
                    >
                      Watch on YouTube
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Start Message */}
          {lesson.startMessage && (
            <div className="p-4 sm:p-6 bg-blue-50 border-b border-blue-200">
              <div className="prose prose-sm sm:prose-base max-w-none">
                <p className="text-blue-800 leading-relaxed font-medium">
                  {lesson.startMessage}
                </p>
              </div>
            </div>
          )}

          {/* Video Summary - displayed below video */}
          {lesson.videoSummary && (
            <div className="p-4 sm:p-6 bg-gray-50 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">About this Video</h3>
              <div className="prose prose-sm sm:prose-base max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  {lesson.videoSummary}
                </p>
              </div>
            </div>
          )}

          {/* Lesson Content */}
          <div className="p-4 sm:p-6">
            <div className="prose prose-sm sm:prose-base max-w-none">
              <div 
                className="text-gray-800 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: lesson.content.replace(/\n/g, '<br>') }}
              />
            </div>
          </div>

          {/* Educational Disclaimer - Mobile Optimized */}
          <div className="p-4 sm:p-6 bg-amber-50 border-t border-amber-200">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-amber-600 text-sm font-bold">i</span>
              </div>
              <div>
                <h3 className="font-semibold text-amber-900 mb-2 text-sm sm:text-base">Educational Content Only</h3>
                <p className="text-xs sm:text-sm text-amber-800 leading-relaxed">
                  This content is for educational purposes only and does not constitute financial, investment, legal, or tax advice. 
                  ZeroFinanx is not yet an SEC-registered advisor. For personalized guidance, consider consulting ChatGPT for general questions 
                  or speaking with a qualified financial advisor who can provide advice specific to your situation.
                </p>
                <p className="text-xs text-amber-700 mt-2 font-medium">
                  Always consult with qualified professionals before making financial decisions.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}