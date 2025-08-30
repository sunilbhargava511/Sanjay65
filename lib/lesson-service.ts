import { Lesson } from '@/app/api/lessons/route';

export interface LessonFilters {
  category?: 'general' | 'young-adult' | 'older-adult';
  activeOnly?: boolean;
  limit?: number;
}

export class LessonService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = '/api/lessons';
  }

  async getLessons(filters: LessonFilters = {}): Promise<{ lessons: Lesson[], count: number, categories: Record<string, number> }> {
    const searchParams = new URLSearchParams();
    
    if (filters.category) {
      searchParams.set('category', filters.category);
    }
    
    if (filters.activeOnly) {
      searchParams.set('activeOnly', 'true');
    }
    
    if (filters.limit) {
      searchParams.set('limit', filters.limit.toString());
    }

    const url = searchParams.toString() ? `${this.baseUrl}?${searchParams}` : this.baseUrl;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch lessons: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch lessons');
    }
    
    return {
      lessons: data.lessons,
      count: data.count,
      categories: data.categories
    };
  }

  async createLesson(lessonData: {
    title: string;
    description: string;
    youtubeUrl: string;
    category?: 'general' | 'young-adult' | 'older-adult';
    duration?: string;
    orderIndex?: number;
    tags?: string[];
    isPublished?: boolean;
  }): Promise<Lesson> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(lessonData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Failed to create lesson: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to create lesson');
    }
    
    return data.lesson;
  }

  extractYouTubeId(url: string): string | null {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }

  getYouTubeEmbedUrl(url: string): string | null {
    const videoId = this.extractYouTubeId(url);
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  }

  getYouTubeThumbnail(url: string): string | null {
    const videoId = this.extractYouTubeId(url);
    return videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : null;
  }

  formatDuration(duration?: string): string {
    if (!duration) return '';
    
    // Assume duration is in "MM:SS" format
    const parts = duration.split(':');
    if (parts.length === 2) {
      const minutes = parseInt(parts[0], 10);
      const seconds = parseInt(parts[1], 10);
      
      if (minutes === 0) {
        return `${seconds}s`;
      } else {
        return `${minutes}m ${seconds}s`;
      }
    }
    
    return duration;
  }

  getCategoryDisplayName(category: string): string {
    switch (category) {
      case 'general':
        return 'General';
      case 'young-adult':
        return 'Young Adult';
      case 'older-adult':
        return 'Older Adult';
      default:
        return category;
    }
  }

  getCategoryDescription(category: string): string {
    switch (category) {
      case 'general':
        return 'Essential financial concepts for everyone';
      case 'young-adult':
        return 'Financial guidance for starting your career';
      case 'older-adult':
        return 'Planning for retirement and later-life finances';
      default:
        return '';
    }
  }
}

export const lessonService = new LessonService();