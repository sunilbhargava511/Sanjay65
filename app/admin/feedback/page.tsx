'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, MessageSquare, Lightbulb, User, Calendar, Mail } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface Submission {
  id: string;
  type: 'feedback' | 'topic_suggestion';
  content: string;
  timestamp: Date;
  userEmail?: string;
}

interface AdminStats {
  userEngagement: {
    totalFeedbackSubmissions: number;
    totalTopicSuggestions: number;
    recentSubmissions: Submission[];
  };
  lessons: {
    total: number;
    byCategory: Record<string, number>;
  };
  calculators: {
    total: number;
    active: number;
    inactive: number;
  };
}

export default function FeedbackManagement() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'feedback' | 'topics'>('all');

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to load admin stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (timestamp: Date | string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredSubmissions = stats?.userEngagement.recentSubmissions.filter(submission => {
    if (activeTab === 'all') return true;
    if (activeTab === 'feedback') return submission.type === 'feedback';
    if (activeTab === 'topics') return submission.type === 'topic_suggestion';
    return false;
  }) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    );
  }

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
          
          <div>
            <h1 className="text-3xl font-bold text-gray-900">User Feedback & Topic Suggestions</h1>
            <p className="text-gray-600 mt-2">
              Review feedback and topic suggestions from your users
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <MessageSquare className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Feedback</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.userEngagement.totalFeedbackSubmissions || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100">
                <Lightbulb className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Topic Suggestions</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.userEngagement.totalTopicSuggestions || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <User className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Submissions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(stats?.userEngagement.totalFeedbackSubmissions || 0) + (stats?.userEngagement.totalTopicSuggestions || 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { key: 'all', label: 'All Submissions', count: filteredSubmissions.length },
                { key: 'feedback', label: 'Feedback', count: stats?.userEngagement.totalFeedbackSubmissions || 0 },
                { key: 'topics', label: 'Topic Suggestions', count: stats?.userEngagement.totalTopicSuggestions || 0 }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                  <span className="bg-gray-100 text-gray-600 rounded-full px-2 py-0.5 text-xs">
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Submissions List */}
        <div className="space-y-4">
          {filteredSubmissions.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <div className="text-gray-400 mb-4">
                {activeTab === 'feedback' ? (
                  <MessageSquare className="h-12 w-12 mx-auto" />
                ) : activeTab === 'topics' ? (
                  <Lightbulb className="h-12 w-12 mx-auto" />
                ) : (
                  <User className="h-12 w-12 mx-auto" />
                )}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No {activeTab === 'all' ? 'submissions' : activeTab === 'feedback' ? 'feedback' : 'topic suggestions'} yet
              </h3>
              <p className="text-gray-600">
                {activeTab === 'topics' 
                  ? 'User topic suggestions will appear here once they start submitting ideas.'
                  : activeTab === 'feedback'
                  ? 'User feedback will appear here once they start submitting questions and comments.'
                  : 'User submissions will appear here once they start using the feedback forms.'
                }
              </p>
            </div>
          ) : (
            filteredSubmissions.map((submission) => (
              <div key={submission.id} className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg ${
                    submission.type === 'topic_suggestion' 
                      ? 'bg-purple-100' 
                      : 'bg-blue-100'
                  }`}>
                    {submission.type === 'topic_suggestion' ? (
                      <Lightbulb className={`h-5 w-5 ${
                        submission.type === 'topic_suggestion' 
                          ? 'text-purple-600' 
                          : 'text-blue-600'
                      }`} />
                    ) : (
                      <MessageSquare className="h-5 w-5 text-blue-600" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        submission.type === 'topic_suggestion'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {submission.type === 'topic_suggestion' ? 'Topic Suggestion' : 'Feedback'}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar className="h-3 w-3" />
                        {formatDate(submission.timestamp)}
                      </div>
                      {submission.userEmail && (
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Mail className="h-3 w-3" />
                          {submission.userEmail}
                        </div>
                      )}
                    </div>
                    
                    <div className="text-gray-900 whitespace-pre-wrap">
                      {submission.content}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}