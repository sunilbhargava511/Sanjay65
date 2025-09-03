import { NextRequest, NextResponse } from 'next/server';
import { lessonRepository } from '@/lib/repositories/lessons';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    let lessonList = category && category !== 'all' 
      ? lessonRepository.findByCategory(category)
      : lessonRepository.findActive();

    return NextResponse.json(lessonList);

  } catch (error) {
    console.error('Error fetching lessons:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      title, 
      category = 'basics', 
      duration,
      difficulty = 'Beginner',
      description,
      content,
      videoUrl,
      videoSummary,
      startMessage,
      orderIndex,
      icon = 'BookOpen',
      color = 'bg-blue-500',
      active = true
    } = body;

    // Validate required fields
    if (!title || !description || !content) {
      return NextResponse.json(
        { error: 'Title, description, and content are required' },
        { status: 400 }
      );
    }
    
    // Get the highest order index if not provided
    let finalOrderIndex = orderIndex;
    if (finalOrderIndex === undefined) {
      const existingLessons = lessonRepository.findAll();
      finalOrderIndex = existingLessons.length;
    }
    
    const newLesson = lessonRepository.create({
      title: title.trim(),
      category,
      duration: duration?.trim() || '5 min read',
      difficulty,
      description: description.trim(),
      content: content.trim(),
      videoUrl: videoUrl?.trim(),
      videoSummary: videoSummary?.trim(),
      startMessage: startMessage?.trim(),
      orderIndex: finalOrderIndex,
      icon,
      color,
      active,
      completed: false
    });

    return NextResponse.json(newLesson, { status: 201 });

  } catch (error) {
    console.error('Error creating lesson:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}