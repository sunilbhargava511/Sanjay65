import { Lesson, lessons, generateId } from '@/app/api/lessons/data';

export class LessonService {
  
  // Lesson Management
  async createLesson(lessonData: {
    title: string;
    category: string;
    duration: string;
    difficulty: string;
    description: string;
    content: string;
    videoUrl?: string;
    videoSummary?: string;
    startMessage?: string;
    orderIndex?: number;
    icon?: string;
    color?: string;
    active?: boolean;
  }): Promise<Lesson> {
    const lessonId = generateId();
    
    // Get the highest order index if not provided
    let orderIndex = lessonData.orderIndex;
    if (orderIndex === undefined) {
      const existingLessons = await this.getAllLessons();
      orderIndex = existingLessons.length;
    }
    
    const newLesson: Lesson = {
      id: lessonId,
      title: lessonData.title,
      category: lessonData.category,
      duration: lessonData.duration,
      difficulty: lessonData.difficulty,
      description: lessonData.description,
      content: lessonData.content,
      videoUrl: lessonData.videoUrl,
      videoSummary: lessonData.videoSummary,
      startMessage: lessonData.startMessage,
      orderIndex,
      icon: lessonData.icon || 'BookOpen',
      color: lessonData.color || 'bg-blue-500',
      active: lessonData.active ?? true,
      completed: false
    };

    lessons.set(lessonId, newLesson);
    return newLesson;
  }

  async getLesson(lessonId: number): Promise<Lesson | null> {
    return lessons.get(lessonId) || null;
  }

  async getAllLessons(activeOnly: boolean = false): Promise<Lesson[]> {
    const allLessons = Array.from(lessons.values());
    
    if (activeOnly) {
      return allLessons
        .filter(lesson => lesson.active)
        .sort((a, b) => a.orderIndex - b.orderIndex);
    }
    
    return allLessons.sort((a, b) => a.orderIndex - b.orderIndex);
  }

  // Alias method for backward compatibility
  async getLessons(options: { activeOnly?: boolean } = {}): Promise<Lesson[]> {
    return this.getAllLessons(options.activeOnly || false);
  }

  async updateLesson(lessonId: number, updates: Partial<Lesson>): Promise<void> {
    const lesson = lessons.get(lessonId);
    if (!lesson) {
      throw new Error('Lesson not found');
    }

    const updatedLesson = {
      ...lesson,
      ...updates,
      id: lessonId // Ensure ID doesn't change
    };

    lessons.set(lessonId, updatedLesson);
  }

  async deleteLesson(lessonId: number): Promise<void> {
    if (!lessons.has(lessonId)) {
      throw new Error('Lesson not found');
    }
    lessons.delete(lessonId);
  }

  async reorderLessons(lessonIds: number[]): Promise<void> {
    // Update order index for each lesson
    for (let i = 0; i < lessonIds.length; i++) {
      const lesson = lessons.get(lessonIds[i]);
      if (lesson) {
        lesson.orderIndex = i;
        lessons.set(lessonIds[i], lesson);
      }
    }
  }

  // Session Management
  async markLessonCompleted(lessonId: number): Promise<void> {
    const lesson = lessons.get(lessonId);
    if (lesson) {
      lesson.completed = true;
      lessons.set(lessonId, lesson);
    }
  }

  async markLessonIncomplete(lessonId: number): Promise<void> {
    const lesson = lessons.get(lessonId);
    if (lesson) {
      lesson.completed = false;
      lessons.set(lessonId, lesson);
    }
  }

  async getProgress(): Promise<{
    totalLessons: number;
    completedLessons: number;
    percentComplete: number;
  }> {
    const allLessons = await this.getAllLessons(true);
    const completedLessons = allLessons.filter(lesson => lesson.completed);
    
    return {
      totalLessons: allLessons.length,
      completedLessons: completedLessons.length,
      percentComplete: allLessons.length > 0 
        ? Math.round((completedLessons.length / allLessons.length) * 100)
        : 0
    };
  }

  // YouTube URL Validation
  validateYouTubeUrl(url: string): boolean {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/)|youtu\.be\/)[\w-]+/;
    return youtubeRegex.test(url);
  }

  extractYouTubeVideoId(url: string): string | null {
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : null;
  }

  getYouTubeEmbedUrl(videoId: string): string {
    return `https://www.youtube.com/embed/${videoId}`;
  }

  getYouTubeThumbnail(videoId: string): string {
    return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
  }
}

// Export singleton instance
export const lessonService = new LessonService();