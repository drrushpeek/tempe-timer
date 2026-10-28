import { Category, DailySummary, TaskItem } from '../types';
import { getPastNDays, getTodayDateStr } from './dateUtils';

const STORAGE_KEYS = {
  TASKS: 'tempo_tasks_v2',
  CATEGORIES: 'tempo_categories_v2',
  SUMMARIES: 'tempo_summaries_v2',
  THEME: 'tempo_theme_mode',
  SOUND: 'tempo_sound_enabled',
  LANGUAGE: 'tempo_language',
};

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat-work', name: 'Work', color: '#6366f1' },       // Indigo
  { id: 'cat-personal', name: 'Personal', color: '#10b981' }, // Emerald
  { id: 'cat-fitness', name: 'Fitness', color: '#f43f5e' },   // Rose
  { id: 'cat-study', name: 'Study', color: '#f59e0b' },       // Amber
];

export function getInitialTasks(): TaskItem[] {
  return [];
}

export function getInitialSummaries(): DailySummary[] {
  return [];
}

export const Storage = {
  loadTasks: (): TaskItem[] => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.TASKS);
      if (raw) {
        const parsed: TaskItem[] = JSON.parse(raw);
        // Filter out old sample demo items if present
        const sampleIds = new Set(['task-1', 'habit-1', 'habit-2', 'habit-3', 'task-2', 'task-3']);
        const cleaned = parsed.filter(t => !sampleIds.has(t.id));
        Storage.saveTasks(cleaned);
        return cleaned;
      }
    } catch {
      // fallback
    }
    return [];
  },

  saveTasks: (tasks: TaskItem[]): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    } catch (e) {
      console.error('Failed to save tasks to localStorage', e);
    }
  },

  loadCategories: (): Category[] => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch {
      // fallback
    }
    Storage.saveCategories(DEFAULT_CATEGORIES);
    return DEFAULT_CATEGORIES;
  },

  saveCategories: (categories: Category[]): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    } catch (e) {
      console.error('Failed to save categories', e);
    }
  },

  loadSummaries: (): DailySummary[] => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.SUMMARIES);
      if (raw) {
        const parsed: DailySummary[] = JSON.parse(raw);
        const cleaned = parsed.filter(s => s.id !== 'sum-1');
        Storage.saveSummaries(cleaned);
        return cleaned;
      }
    } catch {
      // fallback
    }
    return [];
  },

  saveSummaries: (summaries: DailySummary[]): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.SUMMARIES, JSON.stringify(summaries));
    } catch (e) {
      console.error('Failed to save summaries', e);
    }
  },

  loadTheme: (): 'dark' | 'light' => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.THEME);
      if (raw === 'light' || raw === 'dark') return raw;
    } catch {
      // fallback
    }
    return 'dark'; // Clean dark mode theme default as requested
  },

  saveTheme: (theme: 'dark' | 'light'): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
    } catch {
      // fallback
    }
  },

  loadSoundEnabled: (): boolean => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.SOUND);
      if (raw !== null) return raw === 'true';
    } catch {
      // fallback
    }
    return true;
  },

  saveSoundEnabled: (enabled: boolean): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.SOUND, String(enabled));
    } catch {
      // fallback
    }
  },

  loadLanguage: (): 'en' | 'tr' => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
      if (raw === 'en' || raw === 'tr') return raw;
    } catch {
      // fallback
    }
    return 'tr'; // Default to Turkish as requested
  },

  saveLanguage: (lang: 'en' | 'tr'): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
    } catch {
      // fallback
    }
  },
};
