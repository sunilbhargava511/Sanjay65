// Shared data store for lessons API routes
// In production, this would be replaced with a proper database

export interface Lesson {
  id: number;
  title: string;
  category: string;
  duration: string;
  difficulty: string;
  description: string;
  content: string;
  videoUrl?: string; // YouTube URL
  videoSummary?: string; // Content to display below video
  startMessage?: string; // Text intro message
  orderIndex: number; // For ordering lessons
  icon: string;
  color: string;
  completed: boolean;
  active: boolean; // To enable/disable lessons
}

// Shared lessons Map that all routes can access
export const lessons: Map<number, Lesson> = new Map();

// No default lessons - start with empty data store
// Lessons will be added through the admin interface

// ID generator for new lessons
export let nextId = 1; // Start from 1 since there are no initial lessons

export function generateId(): number {
  return nextId++;
}