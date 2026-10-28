export type TaskPriority = 'high' | 'medium' | 'low';

export type TaskType = 'task' | 'habit';

export type RecurrenceCadence = 'daily' | 'weekdays' | 'weekends' | 'weekly' | 'none';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface TaskItem {
  id: string;
  title: string;
  description?: string;
  type: TaskType;
  category: string;
  priority: TaskPriority;
  subtasks: Subtask[];
  estimatedMinutes?: number;
  timeSlot?: string;
  deadline?: string; // YYYY-MM-DD
  recurrence: RecurrenceCadence;
  habitHistory: Record<string, boolean>; // 'YYYY-MM-DD': true
  completed: boolean;
  completedAt?: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  color: string; // Tailwind color token or hex
}

export interface DailySummary {
  id: string;
  date: string; // YYYY-MM-DD
  totalTasks: number;
  completedTasks: number;
  habitsTotal: number;
  habitsCompleted: number;
  productivityScore: number;
  focusMinutes: number;
  highlights: string[];
  motivationalQuote: string;
  aiInsight: string;
  createdAt: string;
}

export type ActiveTab = 'focus' | 'all' | 'habits' | 'analytics' | 'summaries';
