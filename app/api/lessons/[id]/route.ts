import { NextRequest, NextResponse } from 'next/server';
import { lessonRepository } from '@/lib/repositories/lessons';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idString } = await params;
    const id = parseInt(idString);
    const lesson = lessonRepository.findById(id);
    
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
    const lesson = lessonRepository.findById(id);
    
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
    const updatedLesson = lessonRepository.update(id, {
      title: title?.trim(),
      category,
      duration: duration?.trim(),
      difficulty,
      description: description?.trim(),
      content: content?.trim(),
      videoUrl: videoUrl !== undefined ? videoUrl?.trim() : undefined,
      videoSummary: videoSummary !== undefined ? videoSummary?.trim() : undefined,
      startMessage: startMessage !== undefined ? startMessage?.trim() : undefined,
      orderIndex,
      icon,
      color,
      active
    });

    if (!updatedLesson) {
      return NextResponse.json(
        { error: 'Failed to update lesson' },
        { status: 500 }
      );
    }

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
    const lesson = lessonRepository.findById(id);
    
    if (!lesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      );
    }

    const deleted = lessonRepository.delete(id);
    
    if (!deleted) {
      return NextResponse.json(
        { error: 'Failed to delete lesson' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'Lesson deleted successfully' });
  } catch (error) {
    console.error('Error deleting lesson:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}