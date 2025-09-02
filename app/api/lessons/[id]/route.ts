import { NextRequest, NextResponse } from 'next/server';
import { lessons, Lesson } from '../data';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idString } = await params;
    const id = parseInt(idString);
    const lesson = lessons.get(id);
    
    if (!lesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(lesson);
  } catch (error) {
    console.error('Error fetching lesson:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idString } = await params;
    const id = parseInt(idString);
    const lesson = lessons.get(id);
    
    if (!lesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { 
      title, 
      category, 
      duration,
      difficulty,
      description,
      content,
      videoUrl,
      videoSummary,
      startMessage,
      orderIndex,
      icon,
      color,
      active
    } = body;

    // Update lesson with new data
    const updatedLesson: Lesson = {
      ...lesson,
      title: title?.trim() || lesson.title,
      category: category || lesson.category,
      duration: duration?.trim() || lesson.duration,
      difficulty: difficulty || lesson.difficulty,
      description: description?.trim() || lesson.description,
      content: content?.trim() || lesson.content,
      videoUrl: videoUrl !== undefined ? videoUrl?.trim() : lesson.videoUrl,
      videoSummary: videoSummary !== undefined ? videoSummary?.trim() : lesson.videoSummary,
      startMessage: startMessage !== undefined ? startMessage?.trim() : lesson.startMessage,
      orderIndex: orderIndex !== undefined ? orderIndex : lesson.orderIndex,
      icon: icon || lesson.icon,
      color: color || lesson.color,
      active: active !== undefined ? active : lesson.active
    };

    lessons.set(id, updatedLesson);

    return NextResponse.json(updatedLesson);
  } catch (error) {
    console.error('Error updating lesson:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idString } = await params;
    const id = parseInt(idString);
    const lesson = lessons.get(id);
    
    if (!lesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      );
    }

    lessons.delete(id);

    return NextResponse.json({ message: 'Lesson deleted successfully' });
  } catch (error) {
    console.error('Error deleting lesson:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}