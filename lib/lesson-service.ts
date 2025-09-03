// Only import repository on server side
let lessonRepository: any = null;
let Lesson: any = null;

if (typeof window === 'undefined') {
  // Server side import
  const { lessonRepository: repo, Lesson: lesson } = require('@/lib/repositories/lessons');
  lessonRepository = repo;
  Lesson = lesson;
}

export type Lesson = any;

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
    
    // Get the highest order index if not provided
    let orderIndex = lessonData.orderIndex;
    if (orderIndex === undefined) {
      const existingLessons = lessonRepository.findAll();
      orderIndex = existingLessons.length;
    }
    
    const newLesson = lessonRepository.create({
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
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    return newLesson;
  }

  async getLesson(lessonId: number): Promise<Lesson | null> {
    return lessonRepository.findById(lessonId);
  }

  async getAllLessons(activeOnly: boolean = false): Promise<Lesson[]> {
    // Check if we're running on the server side
    if (typeof window === 'undefined' && lessonRepository) {
      // Server side: use repository directly
      return activeOnly 
        ? lessonRepository.findActive()
        : lessonRepository.findAll();
    } else {
      // Client side: fetch from API
      try {
        const response = await fetch('/api/lessons', {
          method: 'GET',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch lessons: ${response.status} ${response.statusText}`);
        }
        
        const allLessons: Lesson[] = await response.json();
        
        if (activeOnly) {
          return allLessons
            .filter(lesson => lesson.active)
            .sort((a, b) => a.orderIndex - b.orderIndex);
        }
        
        return allLessons.sort((a, b) => a.orderIndex - b.orderIndex);
      } catch (error) {
        console.error('Error fetching lessons from API:', error);
        return [];
      }
    }
  }

  // Alias method for backward compatibility
  async getLessons(options: { activeOnly?: boolean } = {}): Promise<Lesson[]> {
    return this.getAllLessons(options.activeOnly || false);
  }

  async updateLesson(lessonId: number, updates: Partial<Lesson>): Promise<void> {
    const updatedLesson = lessonRepository.update(lessonId, updates);
    if (!updatedLesson) {
      throw new Error('Lesson not found');
    }
  }

  async deleteLesson(lessonId: number): Promise<void> {
    const deleted = lessonRepository.delete(lessonId);
    if (!deleted) {
      throw new Error('Lesson not found');
    }
  }

  async reorderLessons(lessonIds: number[]): Promise<void> {
    // Update order index for each lesson
    for (let i = 0; i < lessonIds.length; i++) {
      lessonRepository.update(lessonIds[i], { orderIndex: i });
    }
  }

  // Session Management
  async markLessonCompleted(lessonId: number): Promise<void> {
    lessonRepository.update(lessonId, { completed: true });
  }

  async markLessonIncomplete(lessonId: number): Promise<void> {
    lessonRepository.update(lessonId, { completed: false });
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

  // Category display name helper
  getCategoryDisplayName(category: string): string {
    const categoryMap: Record<string, string> = {
      'basics': 'Basics',
      'savings': 'Savings',
      'debt': 'Debt Management',
      'investing': 'Investing',
      'planning': 'Financial Planning',
      'general': 'General',
      'young-adult': 'Young Adult',
      'older-adult': 'Older Adult'
    };
    return categoryMap[category] || category.charAt(0).toUpperCase() + category.slice(1);
  }

  // Duration formatter helper
  formatDuration(duration: string): string {
    // If duration is already formatted (e.g., "5 min read"), return as-is
    if (duration.includes('min') || duration.includes('hour') || duration.includes('sec')) {
      return duration;
    }
    
    // Try to parse as number (minutes)
    const minutes = parseInt(duration);
    if (!isNaN(minutes)) {
      if (minutes < 60) {
        return `${minutes} min read`;
      } else {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return remainingMinutes > 0 
          ? `${hours}h ${remainingMinutes}m read`
          : `${hours}h read`;
      }
    }
    
    // Return original string if can't parse
    return duration;
  }
}

// Export singleton instance
export const lessonService = new LessonService();