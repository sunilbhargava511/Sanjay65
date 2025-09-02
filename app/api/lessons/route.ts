import { NextRequest, NextResponse } from 'next/server';
import { lessons, Lesson, generateId } from './data';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    let lessonList = Array.from(lessons.values());
    
    if (category && category !== 'all') {
      lessonList = lessonList.filter(lesson => lesson.category === category);
    }
    
    // Sort by id for consistent ordering
    lessonList.sort((a, b) => a.id - b.id);

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
      icon = 'BookOpen',
      color = 'bg-blue-500'
    } = body;

    // Validate required fields
    if (!title || !description || !content) {
      return NextResponse.json(
        { error: 'Title, description, and content are required' },
        { status: 400 }
      );
    }

    const lessonId = generateId();
    
    const newLesson: Lesson = {
      id: lessonId,
      title: title.trim(),
      category,
      duration: duration?.trim() || '5 min read',
      difficulty,
      description: description.trim(),
      content: content.trim(),
      icon,
      color,
      completed: false
    };

    lessons.set(lessonId, newLesson);

    return NextResponse.json(newLesson, { status: 201 });

  } catch (error) {
    console.error('Error creating lesson:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}