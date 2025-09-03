'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Edit3, Trash2, BookOpen, Eye } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface Lesson {
  id: number;
  title: string;
  category: string;
  duration: string;
  difficulty: string;
  description: string;
  content: string;
  videoUrl?: string;
  videoSummary?: string;
  startMessage?: string;
  orderIndex: number;
  icon: string;
  color: string;
  completed: boolean;
  active: boolean;
}

export default function LessonsManagement() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    videoUrl: '',
    videoSummary: '',
    startMessage: '',
    active: true
  });

  // Load lessons on component mount
  useEffect(() => {
    loadLessons();
  }, []);

  // Handle escape key and click outside to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showAddModal) {
        handleCloseModal();
      }
    };

    if (showAddModal) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [showAddModal]);

  const loadLessons = async () => {
    try {
      const response = await fetch('/api/lessons');
      if (response.ok) {
        const data = await response.json();
        setLessons(data);
      }
    } catch (error) {
      console.error('Failed to load lessons:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingLesson ? `/api/lessons/${editingLesson.id}` : '/api/lessons';
      const method = editingLesson ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await loadLessons();
        handleCloseModal();
      } else {
        alert('Failed to save lesson. Please try again.');
      }
    } catch (error) {
      console.error('Error saving lesson:', error);
      alert('Failed to save lesson. Please try again.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this lesson?')) return;

    try {
      const response = await fetch(`/api/lessons/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await loadLessons();
      } else {
        alert('Failed to delete lesson. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting lesson:', error);
      alert('Failed to delete lesson. Please try again.');
    }
  };

  const handleEdit = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setFormData({
      title: lesson.title,
      description: lesson.description,
      videoUrl: lesson.videoUrl || '',
      videoSummary: lesson.videoSummary || '',
      startMessage: lesson.startMessage || '',
      active: lesson.active
    });
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingLesson(null);
    setFormData({
      title: '',
      description: '',
      videoUrl: '',
      videoSummary: '',
      startMessage: '',
      active: true
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link 
              href="/admin" 
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Admin
            </Link>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Lessons Management</h1>
              <p className="text-gray-600 mt-2">
                Create and manage educational lessons for your users
              </p>
            </div>
            
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 bg-purple-600 text-white rounded-lg px-4 py-2 font-medium hover:bg-purple-700 transition"
            >
              <Plus className="h-4 w-4" />
              Add Lesson
            </button>
          </div>
        </div>

        {/* Lessons List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading lessons...</p>
          </div>
        ) : lessons.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No lessons yet</h3>
            <p className="text-gray-600 mb-4">Create your first educational lesson to get started.</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 bg-purple-600 text-white rounded-lg px-4 py-2 font-medium hover:bg-purple-700 transition"
            >
              <Plus className="h-4 w-4" />
              Create First Lesson
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {lessons.map((lesson) => (
              <div key={lesson.id} className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-lg ${lesson.color}`}>
                    <BookOpen className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{lesson.title}</h3>
                    <div className="text-xs text-gray-500 mt-1">
                      <span>Educational Content</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {lesson.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(lesson)}
                      className="inline-flex items-center gap-1 text-blue-600 text-sm hover:text-blue-800"
                    >
                      <Edit3 className="h-4 w-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(lesson.id)}
                      className="inline-flex items-center gap-1 text-red-600 text-sm hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                  <Link
                    href={`/learn?lesson=${lesson.id}`}
                    className="inline-flex items-center gap-1 text-purple-600 text-sm hover:text-purple-800"
                  >
                    <Eye className="h-4 w-4" />
                    Preview
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add/Edit Modal */}
        {showAddModal && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                handleCloseModal();
              }
            }}
          >
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold">
                  {editingLesson ? 'Edit Lesson' : 'Add New Lesson'}
                </h2>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    required
                  />
                </div>


                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    YouTube Video URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    placeholder="https://youtube.com/watch?v=..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Message (Text Intro)
                  </label>
                  <textarea
                    value={formData.startMessage}
                    onChange={(e) => setFormData({ ...formData, startMessage: e.target.value })}
                    rows={3}
                    placeholder="Welcome message shown before the lesson content..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Video Summary (Content below video)
                  </label>
                  <textarea
                    value={formData.videoSummary}
                    onChange={(e) => setFormData({ ...formData, videoSummary: e.target.value })}
                    rows={4}
                    placeholder="Summary or follow-up content to display below the video..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>


                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="active"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <label htmlFor="active" className="text-sm text-gray-700">
                    Active (visible to users)
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    {editingLesson ? 'Update Lesson' : 'Create Lesson'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}