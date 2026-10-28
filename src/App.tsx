/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { ActiveTab, Category, DailySummary, TaskItem, TaskPriority, TaskType } from './types';
import { Storage } from './utils/storage';
import { getTodayDateStr, isHabitScheduledForDate, calculateHabitStreaks } from './utils/dateUtils';
import { generateDailySummary } from './utils/analytics';
import { soundManager } from './utils/audio';
import { Language, translations } from './utils/i18n';

import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { TaskCard } from './components/TaskCard';
import { HabitMatrixView } from './components/HabitMatrixView';
import { WeeklyAnalyticsView } from './components/WeeklyAnalyticsView';
import { DailySummaryModal } from './components/DailySummaryModal';
import { DailySummariesListView } from './components/DailySummariesListView';
import { TaskModal } from './components/TaskModal';
import { InstallModal } from './components/InstallModal';

import { 
  Plus, 
  Inbox
} from 'lucide-react';

export default function App() {
  // Persistent State
  const [tasks, setTasks] = useState<TaskItem[]>(() => Storage.loadTasks());
  const [categories, setCategories] = useState<Category[]>(() => Storage.loadCategories());
  const [summaries, setSummaries] = useState<DailySummary[]>(() => Storage.loadSummaries());
  const [theme, setTheme] = useState<'dark' | 'light'>(() => Storage.loadTheme());
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => Storage.loadSoundEnabled());
  const [language, setLanguage] = useState<Language>(() => Storage.loadLanguage());

  // UI State
  const [activeTab, setActiveTab] = useState<ActiveTab>('focus');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<'all' | TaskPriority>('all');
  const [selectedType, setSelectedType] = useState<'all' | TaskType>('all');
  const [sortBy, setSortBy] = useState<'time' | 'priority' | 'title' | 'streak'>('time');

  // Quick Add Input State
  const [quickTitle, setQuickTitle] = useState<string>('');

  // Modals
  const [isTaskModalOpen, setIsTaskModalOpen] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);
  const [taskModalDefaultType, setTaskModalDefaultType] = useState<TaskType>('task');
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState<boolean>(false);
  const [currentSummary, setCurrentSummary] = useState<DailySummary | null>(null);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState<boolean>(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handlePromptInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  const t = translations[language];

  // Sync state to LocalStorage
  useEffect(() => {
    Storage.saveTasks(tasks);
  }, [tasks]);

  useEffect(() => {
    Storage.saveCategories(categories);
  }, [categories]);

  useEffect(() => {
    Storage.saveSummaries(summaries);
  }, [summaries]);

  useEffect(() => {
    Storage.saveTheme(theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    Storage.saveSoundEnabled(soundEnabled);
    soundManager.enabled = soundEnabled;
  }, [soundEnabled]);

  useEffect(() => {
    Storage.saveLanguage(language);
  }, [language]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const toggleSound = () => {
    setSoundEnabled((prev) => !prev);
  };

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'tr' ? 'en' : 'tr'));
  };

  const todayStr = getTodayDateStr();
  const todayDate = new Date();

  // Task & Habit Handlers
  const handleToggleComplete = (task: TaskItem) => {
    if (task.type === 'habit') {
      const isDoneToday = !!task.habitHistory[todayStr];
      const newHistory = { ...task.habitHistory };
      if (isDoneToday) {
        delete newHistory[todayStr];
      } else {
        newHistory[todayStr] = true;
      }

      setTasks((prev) =>
        prev.map((t) =>
          t.id === task.id
            ? {
                ...t,
                habitHistory: newHistory,
                completed: !isDoneToday,
                completedAt: !isDoneToday ? new Date().toISOString() : undefined,
              }
            : t
        )
      );
    } else {
      // Standard Task
      const nextCompleted = !task.completed;
      setTasks((prev) =>
        prev.map((t) =>
          t.id === task.id
            ? {
                ...t,
                completed: nextCompleted,
                completedAt: nextCompleted ? new Date().toISOString() : undefined,
              }
            : t
        )
      );
    }
  };

  const handleToggleHabitDay = (task: TaskItem, dateStr: string) => {
    const isDone = !!task.habitHistory[dateStr];
    const newHistory = { ...task.habitHistory };
    if (isDone) {
      delete newHistory[dateStr];
    } else {
      newHistory[dateStr] = true;
    }

    setTasks((prev) =>
      prev.map((t) =>
        t.id === task.id
          ? {
              ...t,
              habitHistory: newHistory,
              completed: dateStr === todayStr ? !isDone : t.completed,
            }
          : t
      )
    );
  };

  const handleToggleSubtask = (task: TaskItem, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== task.id) return t;
        const newSubtasks = t.subtasks.map((st) =>
          st.id === subtaskId ? { ...st, completed: !st.completed } : st
        );
        return { ...t, subtasks: newSubtasks };
      })
    );
  };

  const handleSaveTask = (savedTask: TaskItem) => {
    setTasks((prev) => {
      const exists = prev.some((t) => t.id === savedTask.id);
      if (exists) {
        return prev.map((t) => (t.id === savedTask.id ? savedTask : t));
      }
      return [savedTask, ...prev];
    });
  };

  const handleDuplicateTask = (task: TaskItem) => {
    const copySuffix = language === 'tr' ? '(Kopya)' : '(Copy)';
    const duplicated: TaskItem = {
      ...task,
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: `${task.title} ${copySuffix}`,
      completed: false,
      completedAt: undefined,
      habitHistory: {},
      createdAt: todayStr,
    };
    setTasks((prev) => [duplicated, ...prev]);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const handleAddCategory = (newCat: Category) => {
    setCategories((prev) => [...prev, newCat]);
  };

  const handleOpenEditModal = (task: TaskItem) => {
    setEditingTask(task);
    setTaskModalDefaultType(task.type);
    setIsTaskModalOpen(true);
  };

  const handleOpenCreateModal = (type: TaskType = 'task') => {
    setEditingTask(null);
    setTaskModalDefaultType(type);
    setIsTaskModalOpen(true);
  };

  const handleOpenSummaryReport = () => {
    const generated = generateDailySummary(tasks);
    setCurrentSummary(generated);
    setIsSummaryModalOpen(true);
  };

  const handleSaveSummaryToHistory = (summary: DailySummary) => {
    setSummaries((prev) => [summary, ...prev.filter((s) => s.id !== summary.id)]);
  };

  const handleDeleteSummary = (summaryId: string) => {
    setSummaries((prev) => prev.filter((s) => s.id !== summaryId));
  };

  const handleDownloadStandalone = async () => {
    try {
      // Use cache-busting query parameter and cache: 'no-store' to ensure we never get a stale cached file
      const res = await fetch(`/index.standalone.html?t=${Date.now()}`, { cache: 'no-store' });
      let text = await res.text();

      // Inject current active session data so the downloaded standalone file starts with all user's latest tasks & habits
      const preloadedPayload = `
  <script>
    window.__PRELOADED_TEMPO_DATA__ = {
      tasks: ${JSON.stringify(tasks)},
      categories: ${JSON.stringify(categories)},
      summaries: ${JSON.stringify(summaries)},
      language: ${JSON.stringify(language)},
      theme: ${JSON.stringify(theme)}
    };
  </script>`;

      if (text.includes('<!-- INJECTED_USER_STATE_START -->')) {
        text = text.replace('<!-- INJECTED_USER_STATE_START -->', preloadedPayload);
      } else {
        text = text.replace('</head>', `${preloadedPayload}\n</head>`);
      }

      const blob = new Blob([text], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'tempo_tracker.html';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Failed to download standalone html', e);
    }
  };

  // Quick Add submission
  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;

    const lower = quickTitle.toLowerCase();
    const isHabitPrompt = lower.includes('habit') || lower.includes('daily') || lower.includes('alışkanlık') || lower.includes('günlük');
    
    const newTask: TaskItem = {
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: quickTitle.trim(),
      type: isHabitPrompt ? 'habit' : 'task',
      category: categories[0]?.name || 'Work',
      priority: 'medium',
      subtasks: [],
      estimatedMinutes: 30,
      deadline: todayStr,
      recurrence: isHabitPrompt ? 'daily' : 'none',
      habitHistory: {},
      completed: false,
      createdAt: todayStr,
    };

    setTasks((prev) => [newTask, ...prev]);
    setQuickTitle('');
  };

  // Pending count for Today's Focus
  const pendingCount = useMemo(() => {
    let count = 0;
    tasks.forEach((t) => {
      if (t.type === 'task') {
        const isToday = !t.deadline || t.deadline === todayStr || t.createdAt === todayStr;
        if (isToday && !t.completed) count++;
      } else {
        if (isHabitScheduledForDate(t.recurrence, todayDate) && !t.habitHistory[todayStr]) {
          count++;
        }
      }
    });
    return count;
  }, [tasks, todayStr, todayDate]);

  // Category counts
  const countsByCategory = useMemo(() => {
    const counts: Record<string, number> = {};
    categories.forEach((c) => {
      counts[c.name] = tasks.filter((t) => t.category.toLowerCase() === c.name.toLowerCase()).length;
    });
    return counts;
  }, [tasks, categories]);

  // Filtered & Sorted Tasks for Main Views
  const displayTasks = useMemo(() => {
    return tasks.filter((t) => {
      // Tab filter
      if (activeTab === 'focus') {
        if (t.type === 'task') {
          const isToday = !t.deadline || t.deadline === todayStr || t.createdAt === todayStr;
          if (!isToday) return false;
        } else {
          // Habit
          if (!isHabitScheduledForDate(t.recurrence, todayDate)) return false;
        }
      }

      // Search
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = t.title.toLowerCase().includes(query);
        const matchesDesc = t.description?.toLowerCase().includes(query) ?? false;
        const matchesSubtask = t.subtasks.some((s) => s.title.toLowerCase().includes(query));
        if (!matchesTitle && !matchesDesc && !matchesSubtask) return false;
      }

      // Category
      if (selectedCategory !== 'all') {
        if (t.category.toLowerCase() !== selectedCategory.toLowerCase()) return false;
      }

      // Priority
      if (selectedPriority !== 'all') {
        if (t.priority !== selectedPriority) return false;
      }

      // Type
      if (selectedType !== 'all') {
        if (t.type !== selectedType) return false;
      }

      return true;
    }).sort((a, b) => {
      // Completed items go down
      const aDone = a.type === 'habit' ? !!a.habitHistory[todayStr] : a.completed;
      const bDone = b.type === 'habit' ? !!b.habitHistory[todayStr] : b.completed;
      if (aDone !== bDone) return aDone ? 1 : -1;

      if (sortBy === 'priority') {
        const weights = { high: 3, medium: 2, low: 1 };
        return weights[b.priority] - weights[a.priority];
      }

      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }

      if (sortBy === 'streak') {
        const aStreak = calculateHabitStreaks(a.habitHistory, a.recurrence).currentStreak;
        const bStreak = calculateHabitStreaks(b.habitHistory, b.recurrence).currentStreak;
        return bStreak - aStreak;
      }

      // Default: schedule / time
      if (a.timeSlot && b.timeSlot) {
        return a.timeSlot.localeCompare(b.timeSlot);
      }
      if (a.deadline && b.deadline) {
        return a.deadline.localeCompare(b.deadline);
      }
      return 0;
    });
  }, [tasks, activeTab, searchQuery, selectedCategory, selectedPriority, selectedType, sortBy, todayStr, todayDate]);

  const habitsOnly = useMemo(() => {
    return tasks.filter((t) => t.type === 'habit');
  }, [tasks]);

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      
      {/* Ambient Glassmorphism Glow Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className={`absolute -top-40 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 ${
          theme === 'dark' ? 'bg-indigo-600' : 'bg-indigo-400'
        }`} />
        <div className={`absolute top-1/2 -right-40 w-96 h-96 rounded-full blur-3xl opacity-15 ${
          theme === 'dark' ? 'bg-violet-600' : 'bg-sky-400'
        }`} />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        
        {/* Top Bar Header with Language Switcher */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          theme={theme}
          toggleTheme={toggleTheme}
          soundEnabled={soundEnabled}
          toggleSound={toggleSound}
          language={language}
          toggleLanguage={toggleLanguage}
          onOpenNewModal={() => handleOpenCreateModal('task')}
          onOpenSummaryModal={handleOpenSummaryReport}
          onDownloadHtml={handleDownloadStandalone}
          onOpenInstallModal={() => setIsInstallModalOpen(true)}
          pendingCount={pendingCount}
        />

        {/* Main Content Viewport */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 pb-28 md:pb-12">
          
          {/* VIEW: Habit Matrix */}
          {activeTab === 'habits' && (
            <HabitMatrixView
              habits={habitsOnly}
              categories={categories}
              theme={theme}
              language={language}
              onToggleHabitDay={handleToggleHabitDay}
              onOpenNewHabitModal={() => handleOpenCreateModal('habit')}
            />
          )}

          {/* VIEW: Weekly Analytics */}
          {activeTab === 'analytics' && (
            <WeeklyAnalyticsView
              tasks={tasks}
              categories={categories}
              theme={theme}
              language={language}
            />
          )}

          {/* VIEW: Daily Summaries Archive */}
          {activeTab === 'summaries' && (
            <DailySummariesListView
              summaries={summaries}
              theme={theme}
              language={language}
              onDeleteSummary={handleDeleteSummary}
              onGenerateNew={handleOpenSummaryReport}
            />
          )}

          {/* VIEW: Today's Focus or All Items */}
          {(activeTab === 'focus' || activeTab === 'all') && (
            <div className="space-y-4 sm:space-y-6">
              
              {/* Header Title & Quick Add Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                    {activeTab === 'focus' ? t.focusTitle : t.allTitle}
                  </h1>
                  <p className="text-xs text-slate-400 mt-0.5 sm:mt-1">
                    {activeTab === 'focus' 
                      ? t.focusSubtitle.replace('{count}', String(pendingCount)).replace('{plural}', pendingCount === 1 ? '' : 's')
                      : t.allSubtitle}
                  </p>
                </div>

                {/* Quick Add Bar */}
                <form onSubmit={handleQuickAdd} className="flex-1 max-w-md w-full">
                  <div className={`flex items-center rounded-xl p-1 border transition-all ${
                    theme === 'dark' 
                      ? 'bg-slate-900/60 border-slate-800 focus-within:border-indigo-500' 
                      : 'bg-white border-slate-200 shadow-sm focus-within:border-indigo-500'
                  }`}>
                    <input
                      type="text"
                      placeholder={t.quickAddPlaceholder}
                      value={quickTitle}
                      onChange={(e) => setQuickTitle(e.target.value)}
                      className="w-full px-3 py-1.5 text-sm sm:text-xs bg-transparent focus:outline-none placeholder:text-slate-500"
                    />
                    <button
                      type="submit"
                      disabled={!quickTitle.trim()}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold disabled:opacity-40 transition-all shrink-0 flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span className="hidden xs:inline">{language === 'tr' ? 'Ekle' : 'Add'}</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Filters & Search Toolbar */}
              <FilterBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedPriority={selectedPriority}
                setSelectedPriority={setSelectedPriority}
                selectedType={selectedType}
                setSelectedType={setSelectedType}
                sortBy={sortBy}
                setSortBy={setSortBy}
                categories={categories}
                theme={theme}
                countsByCategory={countsByCategory}
                language={language}
              />

              {/* Items List */}
              {displayTasks.length === 0 ? (
                <div className={`p-12 text-center rounded-2xl border ${
                  theme === 'dark' ? 'bg-slate-900/30 border-slate-800' : 'bg-white/70 border-slate-200'
                }`}>
                  <Inbox className="w-12 h-12 mx-auto text-slate-500 mb-3" />
                  <h3 className="text-base font-bold">{t.noItemsFound}</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                    {searchQuery || selectedCategory !== 'all' || selectedPriority !== 'all'
                      ? t.noItemsFoundDesc
                      : activeTab === 'focus'
                        ? (language === 'tr' ? 'Bugünün tüm planları tamamlandı! Rahat bir nefes alın veya gün sonu özetinizi oluşturun.' : 'All scheduled items for today have been checked off! Take a breath or generate your daily summary report.')
                        : t.noItemsFoundDesc}
                  </p>
                  <button
                    onClick={() => handleOpenCreateModal('task')}
                    className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md inline-flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{t.createNewItem}</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {displayTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      categories={categories}
                      theme={theme}
                      language={language}
                      onToggleComplete={handleToggleComplete}
                      onToggleHabitDay={handleToggleHabitDay}
                      onToggleSubtask={handleToggleSubtask}
                      onEdit={handleOpenEditModal}
                      onDuplicate={handleDuplicateTask}
                      onDelete={handleDeleteTask}
                    />
                  ))}
                </div>
              )}

            </div>
          )}

        </main>

        {/* Minimal Footer */}
        <footer className={`py-6 border-t mt-auto text-center text-xs ${
          theme === 'dark' ? 'border-slate-800/80 text-slate-500' : 'border-slate-200 text-slate-500'
        }`}>
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>{t.brandName} · {t.tagline}</span>
            <div className="flex items-center gap-4 text-xs">
              <button
                onClick={handleDownloadStandalone}
                className="hover:text-indigo-400 transition-colors font-medium text-indigo-400"
              >
                {language === 'tr' ? '📥 Tek Dosya HTML İndir' : '📥 Download Single HTML'}
              </button>
              <span>·</span>
              <button
                onClick={handleOpenSummaryReport}
                className="hover:text-indigo-400 transition-colors"
              >
                {t.dailyReportBtn}
              </button>
              <span>·</span>
              <button
                onClick={() => setActiveTab('analytics')}
                className="hover:text-indigo-400 transition-colors"
              >
                {t.navAnalytics}
              </button>
              <span>·</span>
              <button
                onClick={toggleLanguage}
                className="hover:text-indigo-400 transition-colors font-mono font-semibold"
              >
                {language === 'tr' ? 'English (EN)' : 'Türkçe (TR)'}
              </button>
            </div>
          </div>
        </footer>

      </div>

      {/* Mobile Floating Action Button (Thumb-reachable quick add) */}
      <button
        onClick={() => handleOpenCreateModal('task')}
        aria-label={t.newItemBtn}
        className="fixed bottom-20 right-4 z-30 md:hidden w-13 h-13 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-xl shadow-indigo-600/40 flex items-center justify-center active:scale-90 transition-transform focus:outline-none border border-indigo-400/30"
      >
        <Plus className="w-6 h-6 stroke-[2.5]" />
      </button>

      {/* Task & Habit Create / Edit Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleSaveTask}
        categories={categories}
        onAddCategory={handleAddCategory}
        initialTask={editingTask}
        defaultType={taskModalDefaultType}
        theme={theme}
        language={language}
      />

      {/* Daily Summary Modal */}
      {currentSummary && (
        <DailySummaryModal
          isOpen={isSummaryModalOpen}
          onClose={() => setIsSummaryModalOpen(false)}
          summary={currentSummary}
          onSaveSummary={handleSaveSummaryToHistory}
          theme={theme}
          language={language}
        />
      )}

      {/* App Installation & Download Guide Modal */}
      <InstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        language={language}
        theme={theme}
        onDownloadHtml={handleDownloadStandalone}
        deferredPrompt={deferredPrompt}
        onPromptInstall={handlePromptInstall}
      />

    </div>
  );
}
