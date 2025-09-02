import { NextRequest, NextResponse } from 'next/server';

// Mock data store - in production, this would connect to your database
const feedbackSubmissions: Array<{
  id: string;
  type: 'feedback' | 'topic_suggestion';
  content: string;
  timestamp: Date;
  userEmail?: string;
}> = [];

const contentStats = {
  lessons: {
    total: 4,
    published: 4,
    byCategory: {
      basics: 2,
      savings: 1,
      debt: 1,
      investing: 0,
      planning: 0
    }
  },
  calculators: {
    total: 2,
    active: 1,
    inactive: 1,
    byCategory: {
      financial: 1,
      savings: 1,
      debt: 0,
      investing: 0,
      retirement: 0
    }
  },
  userEngagement: {
    totalFeedbackSubmissions: feedbackSubmissions.filter(f => f.type === 'feedback').length,
    totalTopicSuggestions: feedbackSubmissions.filter(f => f.type === 'topic_suggestion').length,
    recentSubmissions: feedbackSubmissions
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 10)
  }
};

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json(contentStats);
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, content, userEmail } = body;
    
    if (!type || !content) {
      return NextResponse.json(
        { error: 'Type and content are required' },
        { status: 400 }
      );
    }
    
    const submission = {
      id: Date.now().toString(),
      type: type as 'feedback' | 'topic_suggestion',
      content: content.trim(),
      timestamp: new Date(),
      userEmail
    };
    
    feedbackSubmissions.push(submission);
    
    // Update stats
    contentStats.userEngagement.totalFeedbackSubmissions = feedbackSubmissions.filter(f => f.type === 'feedback').length;
    contentStats.userEngagement.totalTopicSuggestions = feedbackSubmissions.filter(f => f.type === 'topic_suggestion').length;
    contentStats.userEngagement.recentSubmissions = feedbackSubmissions
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 10);
    
    return NextResponse.json({ success: true, id: submission.id });
  } catch (error) {
    console.error('Error saving submission:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}