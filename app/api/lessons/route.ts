import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for demo purposes
// In production, this would be a proper database
const lessons: Map<string, Lesson> = new Map();

export interface Lesson {
  id: string;
  title: string;
  description: string;
  youtubeUrl: string;
  category: 'general' | 'young-adult' | 'older-adult';
  duration?: string; // e.g., "15:30" for 15 minutes 30 seconds
  orderIndex: number;
  active: boolean;
  isPublished: boolean;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

// Initialize with demo lessons
if (lessons.size === 0) {
  const now = new Date().toISOString();
  
  // General lessons
  lessons.set('basic-budgeting', {
    id: 'basic-budgeting',
    title: 'Basic Budgeting Fundamentals',
    description: 'Learn the essential principles of creating and maintaining a personal budget.',
    youtubeUrl: 'https://www.youtube.com/watch?v=HQzoZfc3GwQ',
    category: 'general',
    duration: '12:45',
    orderIndex: 0,
    active: true,
    isPublished: true,
    tags: ['budgeting', 'basics', 'money management'],
    createdAt: now,
    updatedAt: now
  });

  lessons.set('emergency-funds', {
    id: 'emergency-funds',
    title: 'Building Your Emergency Fund',
    description: 'Understand why emergency funds are crucial and how to build one step by step.',
    youtubeUrl: 'https://www.youtube.com/watch?v=sRc2fxqfQyM',
    category: 'general',
    duration: '8:20',
    orderIndex: 1,
    active: true,
    isPublished: true,
    tags: ['emergency fund', 'savings', 'financial security'],
    createdAt: now,
    updatedAt: now
  });

  lessons.set('debt-elimination', {
    id: 'debt-elimination',
    title: 'Debt Elimination Strategies',
    description: 'Effective methods to pay off debt faster and become debt-free.',
    youtubeUrl: 'https://www.youtube.com/watch?v=3SBXBWj69gQ',
    category: 'general',
    duration: '16:15',
    orderIndex: 2,
    active: true,
    isPublished: true,
    tags: ['debt', 'elimination', 'financial freedom'],
    createdAt: now,
    updatedAt: now
  });

  // Young adult lessons
  lessons.set('first-job-finances', {
    id: 'first-job-finances',
    title: 'Managing Finances in Your First Job',
    description: 'Essential financial tips for young adults starting their career journey.',
    youtubeUrl: 'https://www.youtube.com/watch?v=R8nK5WcxOWA',
    category: 'young-adult',
    duration: '14:30',
    orderIndex: 0,
    active: true,
    isPublished: true,
    tags: ['first job', 'career', 'young adults', 'salary'],
    createdAt: now,
    updatedAt: now
  });

  lessons.set('student-loans', {
    id: 'student-loans',
    title: 'Student Loan Management',
    description: 'Smart strategies for managing and paying off student loans efficiently.',
    youtubeUrl: 'https://www.youtube.com/watch?v=1S-_HsGxBeQ',
    category: 'young-adult',
    duration: '11:45',
    orderIndex: 1,
    active: true,
    isPublished: true,
    tags: ['student loans', 'education', 'debt management'],
    createdAt: now,
    updatedAt: now
  });

  lessons.set('building-credit', {
    id: 'building-credit',
    title: 'Building Credit from Scratch',
    description: 'How to establish and build a strong credit history as a young adult.',
    youtubeUrl: 'https://www.youtube.com/watch?v=Sp_b1qGOJHU',
    category: 'young-adult',
    duration: '13:20',
    orderIndex: 2,
    active: true,
    isPublished: true,
    tags: ['credit score', 'credit history', 'financial foundation'],
    createdAt: now,
    updatedAt: now
  });

  // Older adult lessons
  lessons.set('retirement-planning', {
    id: 'retirement-planning',
    title: 'Retirement Planning Essentials',
    description: 'Comprehensive guide to planning for a secure retirement.',
    youtubeUrl: 'https://www.youtube.com/watch?v=WcceJBDTuCo',
    category: 'older-adult',
    duration: '18:40',
    orderIndex: 0,
    active: true,
    isPublished: true,
    tags: ['retirement', 'planning', 'investments', '401k'],
    createdAt: now,
    updatedAt: now
  });

  lessons.set('healthcare-costs', {
    id: 'healthcare-costs',
    title: 'Managing Healthcare Costs in Retirement',
    description: 'Strategies for handling medical expenses and insurance in later years.',
    youtubeUrl: 'https://www.youtube.com/watch?v=4QLwk8wjVlQ',
    category: 'older-adult',
    duration: '15:25',
    orderIndex: 1,
    active: true,
    isPublished: true,
    tags: ['healthcare', 'medicare', 'insurance', 'medical costs'],
    createdAt: now,
    updatedAt: now
  });

  lessons.set('estate-planning', {
    id: 'estate-planning',
    title: 'Estate Planning Basics',
    description: 'Important considerations for protecting and transferring wealth.',
    youtubeUrl: 'https://www.youtube.com/watch?v=HKbVNHNz8vA',
    category: 'older-adult',
    duration: '20:10',
    orderIndex: 2,
    active: true,
    isPublished: true,
    tags: ['estate planning', 'will', 'inheritance', 'legacy'],
    createdAt: now,
    updatedAt: now
  });
}

function generateId(): string {
  return 'lesson_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('activeOnly') === 'true';
    const category = searchParams.get('category') as 'general' | 'young-adult' | 'older-adult' | null;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;

    let lessonList = Array.from(lessons.values());
    
    if (activeOnly) {
      lessonList = lessonList.filter(lesson => lesson.active && lesson.isPublished);
    }
    
    if (category) {
      lessonList = lessonList.filter(lesson => lesson.category === category);
    }
    
    // Sort by category first, then by orderIndex
    lessonList.sort((a, b) => {
      if (a.category !== b.category) {
        const categoryOrder = { 'general': 0, 'young-adult': 1, 'older-adult': 2 };
        return categoryOrder[a.category] - categoryOrder[b.category];
      }
      return a.orderIndex - b.orderIndex;
    });

    if (limit) {
      lessonList = lessonList.slice(0, limit);
    }

    return NextResponse.json({
      success: true,
      lessons: lessonList,
      count: lessonList.length,
      categories: {
        general: lessonList.filter(l => l.category === 'general').length,
        'young-adult': lessonList.filter(l => l.category === 'young-adult').length,
        'older-adult': lessonList.filter(l => l.category === 'older-adult').length
      }
    });

  } catch (error) {
    console.error('Error fetching lessons:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      title, 
      description, 
      youtubeUrl, 
      category = 'general', 
      duration,
      orderIndex,
      tags = [],
      isPublished = true 
    } = body;

    // Validate required fields
    if (!title || !description || !youtubeUrl) {
      return NextResponse.json(
        { success: false, error: 'Title, description, and YouTube URL are required' },
        { status: 400 }
      );
    }

    // Validate YouTube URL
    const youtubeRegex = /^https?:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)/;
    if (!youtubeRegex.test(youtubeUrl)) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid YouTube URL' },
        { status: 400 }
      );
    }

    // Validate category
    if (!['general', 'young-adult', 'older-adult'].includes(category)) {
      return NextResponse.json(
        { success: false, error: 'Category must be general, young-adult, or older-adult' },
        { status: 400 }
      );
    }

    const lessonId = generateId();
    const now = new Date().toISOString();
    
    // Get the highest order index for the category if not provided
    let finalOrderIndex = orderIndex;
    if (finalOrderIndex === undefined) {
      const categoryLessons = Array.from(lessons.values()).filter(l => l.category === category);
      finalOrderIndex = categoryLessons.length;
    }

    const newLesson: Lesson = {
      id: lessonId,
      title: title.trim(),
      description: description.trim(),
      youtubeUrl: youtubeUrl.trim(),
      category,
      duration: duration?.trim(),
      orderIndex: finalOrderIndex,
      active: true,
      isPublished,
      tags: Array.isArray(tags) ? tags.filter(tag => typeof tag === 'string' && tag.trim()) : [],
      createdAt: now,
      updatedAt: now
    };

    lessons.set(lessonId, newLesson);

    return NextResponse.json({
      success: true,
      lesson: newLesson
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating lesson:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}