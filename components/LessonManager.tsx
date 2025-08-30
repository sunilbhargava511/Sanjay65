'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Play, ExternalLink, Clock, Tag } from 'lucide-react';
import { Lesson } from '@/app/api/lessons/route';
import { lessonService } from '@/lib/lesson-service';

export default function LessonManager() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  useEffect(() => {
    loadLessons();
  }, []);

  const loadLessons = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await lessonService.getLessons({});
      setLessons(data.lessons);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load lessons');
      console.error('Error loading lessons:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLesson = () => {
    setEditingLesson(null);
    setShowCreateForm(true);
  };

  const handleEditLesson = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setShowCreateForm(true);
  };

  const handleFormClose = () => {
    setShowCreateForm(false);
    setEditingLesson(null);
    loadLessons(); // Refresh the list
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading lessons...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
        <div className="text-center">
          <div className="text-red-600 mb-2">⚠️ Error</div>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={loadLessons}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Lesson Management</h2>
              <p className="mt-2 text-gray-600">Create and manage educational video lessons</p>
            </div>
            <button
              onClick={handleCreateLesson}
              className="inline-flex items-center gap-2 bg-red-600 text-white rounded-lg px-4 py-2 font-semibold hover:bg-red-700 transition"
            >
              <Plus className="w-4 h-4" />
              Add Lesson
            </button>
          </div>
        </div>

        {/* Lessons List */}
        <div className="p-6">
          {lessons.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-2">📚</div>
              <p className="text-gray-600">No lessons created yet.</p>
              <button
                onClick={handleCreateLesson}
                className="mt-4 inline-flex items-center gap-2 bg-red-600 text-white rounded-lg px-4 py-2 font-semibold hover:bg-red-700 transition"
              >
                <Plus className="w-4 h-4" />
                Create First Lesson
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {lessons.map((lesson) => (
                <div 
                  key={lesson.id} 
                  className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition"
                >
                  <div className="flex items-start gap-4">
                    {/* Thumbnail */}
                    <div className="flex-shrink-0">
                      <div className="relative">
                        {lessonService.getYouTubeThumbnail(lesson.youtubeUrl) && (
                          <img 
                            src={lessonService.getYouTubeThumbnail(lesson.youtubeUrl)!}
                            alt={lesson.title}
                            className="w-24 h-18 object-cover rounded-lg"
                          />
                        )}
                        <button
                          onClick={() => setSelectedVideo(lesson.youtubeUrl)}
                          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg hover:bg-opacity-60 transition"
                        >
                          <Play className="w-6 h-6 text-white" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-gray-900 leading-tight">
                          {lesson.title}
                        </h3>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <div className="flex items-center gap-2 text-xs">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              lesson.isPublished 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {lesson.isPublished ? 'Published' : 'Draft'}
                            </span>
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                              {lessonService.getCategoryDisplayName(lesson.category)}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                        {lesson.description}
                      </p>
                      
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        {lesson.duration && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{lessonService.formatDuration(lesson.duration)}</span>
                          </div>
                        )}
                        <span>Order: {lesson.orderIndex}</span>
                        <a 
                          href={lesson.youtubeUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                        >
                          <ExternalLink className="w-3 h-3" />
                          YouTube
                        </a>
                      </div>
                      
                      {lesson.tags && lesson.tags.length > 0 && (
                        <div className="flex items-center gap-2 mt-2">
                          <Tag className="w-3 h-3 text-gray-400" />
                          <div className="flex gap-1 flex-wrap">
                            {lesson.tags.slice(0, 4).map((tag) => (
                              <span 
                                key={tag} 
                                className="text-xs text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                            {lesson.tags.length > 4 && (
                              <span className="text-xs text-gray-400">+{lesson.tags.length - 4}</span>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* Actions */}
                      <div className="flex items-center gap-2 mt-3">
                        <button
                          onClick={() => handleEditLesson(lesson)}
                          className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
                        >
                          <Edit className="w-3 h-3" />
                          Edit
                        </button>
                        <button
                          onClick={() => console.log('Delete:', lesson.id)}
                          className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Form Modal */}
      {showCreateForm && (
        <LessonForm 
          lesson={editingLesson}
          onClose={handleFormClose}
        />
      )}

      {/* Video Preview Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Preview Lesson</h3>
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
                title="Lesson Preview"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

interface LessonFormProps {
  lesson?: Lesson | null;
  onClose: () => void;
}

function LessonForm({ lesson, onClose }: LessonFormProps) {
  const [formData, setFormData] = useState({
    title: lesson?.title || '',
    description: lesson?.description || '',
    youtubeUrl: lesson?.youtubeUrl || '',
    category: lesson?.category || 'general' as const,
    duration: lesson?.duration || '',
    orderIndex: lesson?.orderIndex?.toString() || '',
    tags: lesson?.tags?.join(', ') || '',
    isPublished: lesson?.isPublished ?? true
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const lessonData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        youtubeUrl: formData.youtubeUrl.trim(),
        category: formData.category,
        duration: formData.duration.trim() || undefined,
        orderIndex: formData.orderIndex ? parseInt(formData.orderIndex, 10) : undefined,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
        isPublished: formData.isPublished
      };

      await lessonService.createLesson(lessonData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save lesson');
      console.error('Error saving lesson:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              {lesson ? 'Edit Lesson' : 'Create New Lesson'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
              placeholder="Lesson title"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 h-20"
              placeholder="Lesson description"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">YouTube URL *</label>
            <input
              type="url"
              value={formData.youtubeUrl}
              onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
              placeholder="https://www.youtube.com/watch?v=..."
              required
            />
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                required
              >
                <option value="general">General</option>
                <option value="young-adult">Young Adult</option>
                <option value="older-adult">Older Adult</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                placeholder="15:30"
              />
            </div>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Order Index</label>
              <input
                type="number"
                value={formData.orderIndex}
                onChange={(e) => setFormData({ ...formData, orderIndex: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                placeholder="0"
                min="0"
              />
            </div>
            
            <div className="flex items-center">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <input
                  type="checkbox"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                  className="rounded border-gray-300 text-red-600 focus:ring-red-600"
                />
                Published
              </label>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
              placeholder="budgeting, basics, money management"
            />
            <p className="text-xs text-gray-500 mt-1">Separate tags with commas</p>
          </div>
          
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
          
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              {submitting ? 'Saving...' : lesson ? 'Update Lesson' : 'Create Lesson'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}