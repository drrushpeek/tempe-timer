import React, { useState } from 'react';
import { Category, TaskItem } from '../types';
import { Language, translations, formatCategoryName } from '../utils/i18n';
import { calculateHabitStreaks, getPastNDays, getTodayDateStr } from '../utils/dateUtils';
import { soundManager, triggerConfetti } from '../utils/audio';
import { 
  Check, 
  Clock, 
  Calendar, 
  Flame, 
  ChevronDown, 
  ChevronUp, 
  MoreVertical, 
  Pencil, 
  Copy, 
  Trash2, 
  Repeat, 
  ListChecks
} from 'lucide-react';

interface TaskCardProps {
  task: TaskItem;
  categories: Category[];
  theme: 'dark' | 'light';
  language: Language;
  onToggleComplete: (task: TaskItem, e: React.MouseEvent) => void;
  onToggleHabitDay: (task: TaskItem, dateStr: string, e: React.MouseEvent) => void;
  onToggleSubtask: (task: TaskItem, subtaskId: string) => void;
  onEdit: (task: TaskItem) => void;
  onDuplicate: (task: TaskItem) => void;
  onDelete: (taskId: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  categories,
  theme,
  language,
  onToggleComplete,
  onToggleHabitDay,
  onToggleSubtask,
  onEdit,
  onDuplicate,
  onDelete,
}) => {
  const t = translations[language];
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [showMenu, setShowMenu] = useState<boolean>(false);

  const todayStr = getTodayDateStr();
  const isHabit = task.type === 'habit';
  const isHabitDoneToday = isHabit && !!task.habitHistory[todayStr];
  const isCompleted = isHabit ? isHabitDoneToday : task.completed;

  const categoryObj = categories.find((c) => c.name.toLowerCase() === task.category.toLowerCase());
  const categoryColor = categoryObj ? categoryObj.color : '#6366f1';

  // Subtasks calculation
  const totalSubtasks = task.subtasks?.length || 0;
  const completedSubtasks = task.subtasks?.filter((s) => s.completed).length || 0;
  const subtaskProgress = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

  // Streak calculation
  const { currentStreak, bestStreak } = calculateHabitStreaks(task.habitHistory, task.recurrence);

  // Past 7 days for habit strip
  const past7Days = getPastNDays(7);

  // Priority indicator styles & labels
  const priorityConfig = {
    high: {
      label: t.highPriority,
      badgeClass: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
      dotClass: 'bg-rose-500',
    },
    medium: {
      label: t.mediumPriority,
      badgeClass: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      dotClass: 'bg-amber-500',
    },
    low: {
      label: t.lowPriority,
      badgeClass: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      dotClass: 'bg-emerald-500',
    },
  }[task.priority];

  // Recurrence label
  const recurrenceLabel = task.recurrence === 'daily' 
    ? t.daily 
    : task.recurrence === 'weekdays' 
      ? t.weekdays 
      : task.recurrence === 'weekends' 
        ? t.weekends 
        : task.recurrence === 'weekly' 
          ? t.weekly 
          : t.none;

  // Date formatting with translation
  const formatDeadline = (dateStr?: string) => {
    if (!dateStr) return '';
    if (dateStr === todayStr) return t.dueToday;

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (dateStr === tomorrow.toISOString().split('T')[0]) return t.dueTomorrow;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (dateStr === yesterday.toISOString().split('T')[0]) return t.dueYesterday;

    const [y, m, d] = dateStr.split('-').map(Number);
    const target = new Date(y, m - 1, d);
    return target.toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US', { month: 'short', day: 'numeric' });
  };

  const handleMainCheckbox = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundManager.playCheckSound();
    if (!isCompleted) {
      triggerConfetti(e.clientX, e.clientY);
    }
    onToggleComplete(task, e);
  };

  const handleDayClick = (dateStr: string, e: React.MouseEvent) => {
    e.stopPropagation();
    soundManager.playCheckSound();
    const wasDone = !!task.habitHistory[dateStr];
    if (!wasDone) {
      triggerConfetti(e.clientX, e.clientY);
    }
    onToggleHabitDay(task, dateStr, e);
  };

  return (
    <div
      className={`group relative rounded-2xl p-4 sm:p-5 transition-all duration-200 border ${
        theme === 'dark'
          ? isCompleted
            ? 'bg-slate-900/30 border-slate-800/50 opacity-75'
            : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/80'
          : isCompleted
            ? 'bg-slate-50/70 border-slate-200/50 opacity-75'
            : 'bg-white/80 border-slate-200/80 hover:border-slate-300 hover:shadow-md'
      } backdrop-blur-md`}
    >
      <div className="flex items-start gap-3 sm:gap-4">
        {/* Checkbox Tick Container */}
        <button
          type="button"
          onClick={handleMainCheckbox}
          title={isCompleted ? t.markIncomplete : t.markComplete}
          className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border transition-all duration-200 ${
            isCompleted
              ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm shadow-indigo-600/30 scale-105'
              : theme === 'dark'
                ? 'border-slate-700 bg-slate-800/40 hover:border-indigo-400 text-transparent hover:text-indigo-400/50'
                : 'border-slate-300 bg-white hover:border-indigo-500 text-transparent hover:text-indigo-400/50'
          }`}
        >
          <Check className={`w-3.5 h-3.5 stroke-[3] transition-transform ${isCompleted ? 'scale-100' : 'scale-50 opacity-0'}`} />
        </button>

        {/* Content Body */}
        <div className="flex-1 min-w-0">
          
          {/* Unboxed Metadata Line */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-1.5">
            {/* Category tag */}
            <span className="flex items-center gap-1.5 font-medium" style={{ color: categoryColor }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: categoryColor }} />
              {formatCategoryName(task.category, language)}
            </span>

            <span aria-hidden="true" className="text-slate-600">·</span>

            {/* Priority Indicator */}
            <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-medium border ${priorityConfig.badgeClass}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${priorityConfig.dotClass}`} />
              {priorityConfig.label}
            </span>

            {/* Recurrence Cadence for habits */}
            {isHabit && (
              <>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="inline-flex items-center gap-1 text-slate-400">
                  <Repeat className="w-3 h-3 text-indigo-400" />
                  {recurrenceLabel}
                </span>
              </>
            )}

            {/* Time Slot or Estimated time */}
            {task.timeSlot && (
              <>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="inline-flex items-center gap-1 text-slate-400">
                  <Clock className="w-3 h-3" />
                  {task.timeSlot}
                </span>
              </>
            )}

            {!task.timeSlot && task.estimatedMinutes && (
              <>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="inline-flex items-center gap-1 text-slate-400">
                  <Clock className="w-3 h-3" />
                  {task.estimatedMinutes}m {t.est}
                </span>
              </>
            )}

            {/* Deadline for tasks */}
            {!isHabit && task.deadline && (
              <>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className={`inline-flex items-center gap-1 ${
                  task.deadline < todayStr && !isCompleted
                    ? 'text-rose-400 font-medium'
                    : task.deadline === todayStr
                      ? 'text-amber-400 font-medium'
                      : 'text-slate-400'
                }`}>
                  <Calendar className="w-3 h-3" />
                  {formatDeadline(task.deadline)}
                </span>
              </>
            )}
          </div>

          {/* Title */}
          <h3 className={`text-sm sm:text-base font-semibold leading-snug transition-colors ${
            isCompleted
              ? theme === 'dark'
                ? 'line-through text-slate-500'
                : 'line-through text-slate-400'
              : theme === 'dark'
                ? 'text-slate-100'
                : 'text-slate-900'
          }`}>
            {task.title}
          </h3>

          {/* Description */}
          {task.description && (
            <p className={`mt-1 text-xs line-clamp-2 ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
            }`}>
              {task.description}
            </p>
          )}

          {/* Habit Streak & 7-Day Completion Strip */}
          {isHabit && (
            <div className="mt-3.5 pt-3 border-t border-slate-800/40">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                
                {/* Streak Badge */}
                <div className="flex items-center gap-2 text-xs">
                  <span className={`flex items-center gap-1 font-semibold ${
                    currentStreak > 0 ? 'text-amber-400' : 'text-slate-500'
                  }`}>
                    <Flame className={`w-3.5 h-3.5 ${currentStreak > 0 ? 'fill-amber-400' : ''}`} />
                    <span className="tabular-nums">{currentStreak} {t.dayStreak}</span>
                  </span>
                  {bestStreak > currentStreak && (
                    <span className="text-[11px] text-slate-500">
                      ({t.best}: {bestStreak}d)
                    </span>
                  )}
                </div>

                {/* 7-Day Interactive Bubbles */}
                <div className="flex items-center gap-1.5">
                  {past7Days.map((day) => {
                    const isDayDone = !!task.habitHistory[day.dateStr];
                    return (
                      <button
                        key={day.dateStr}
                        onClick={(e) => handleDayClick(day.dateStr, e)}
                        title={`${day.dayName} ${day.dayNumber} (${isDayDone ? 'Completed' : 'Click to log'})`}
                        className={`flex flex-col items-center justify-center w-7 h-8 rounded-lg text-[10px] font-medium transition-all ${
                          isDayDone
                            ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                            : day.isToday
                              ? theme === 'dark'
                                ? 'bg-slate-800 text-slate-300 border border-indigo-500/50 hover:bg-slate-700'
                                : 'bg-slate-100 text-slate-700 border border-indigo-400 hover:bg-slate-200'
                              : theme === 'dark'
                                ? 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                                : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800'
                        }`}
                      >
                        <span className="text-[9px] uppercase tracking-wider">{day.dayName[0]}</span>
                        <span className="text-[10px] tabular-nums font-semibold">{day.dayNumber}</span>
                      </button>
                    );
                  })}
                </div>

              </div>
            </div>
          )}

          {/* Subtasks Progress & Expand Toggle */}
          {totalSubtasks > 0 && (
            <div className="mt-3 pt-2.5 border-t border-slate-800/30">
              <div className="flex items-center justify-between gap-3">
                
                {/* Progress bar and counter */}
                <div className="flex items-center gap-2 flex-1 max-w-xs">
                  <div className={`h-1.5 flex-1 rounded-full overflow-hidden ${
                    theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'
                  }`}>
                    <div
                      className="h-full bg-indigo-500 transition-all duration-300 rounded-full"
                      style={{ width: `${subtaskProgress}%` }}
                    />
                  </div>
                  <span className="text-[11px] tabular-nums text-slate-400 whitespace-nowrap">
                    {completedSubtasks}/{totalSubtasks} {t.subtasks}
                  </span>
                </div>

                {/* Expand / Collapse Button */}
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded transition-colors ${
                    theme === 'dark'
                      ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <ListChecks className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{isExpanded ? t.hideSubtasks : t.viewSubtasks}</span>
                  {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>

              </div>

              {/* Subtasks Expanded List */}
              {isExpanded && (
                <div className={`mt-2.5 space-y-1.5 pl-2 py-1.5 border-l-2 border-indigo-500/30 rounded-r-lg ${
                  theme === 'dark' ? 'bg-slate-950/40' : 'bg-slate-50/80'
                }`}>
                  {task.subtasks.map((sub) => (
                    <div
                      key={sub.id}
                      onClick={() => onToggleSubtask(task, sub.id)}
                      className={`flex items-center gap-2.5 px-2 py-1 rounded cursor-pointer transition-colors ${
                        theme === 'dark' ? 'hover:bg-slate-800/50' : 'hover:bg-slate-200/50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={sub.completed}
                        onChange={() => {}} // handled by row click
                        className="rounded border-slate-600 text-indigo-600 focus:ring-0 cursor-pointer w-3.5 h-3.5"
                      />
                      <span className={`text-xs ${
                        sub.completed
                          ? theme === 'dark' ? 'line-through text-slate-500' : 'line-through text-slate-400'
                          : theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                      }`}>
                        {sub.title}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Card Actions Menu */}
        <div className="relative shrink-0">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className={`p-1.5 rounded-lg text-slate-400 hover:text-slate-200 transition-colors ${
              theme === 'dark' ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
            }`}
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-20"
                onClick={() => setShowMenu(false)}
              />
              <div className={`absolute right-0 top-8 z-30 w-36 py-1 rounded-xl shadow-xl border text-xs ${
                theme === 'dark'
                  ? 'bg-slate-900 border-slate-800 text-slate-200 shadow-black/50'
                  : 'bg-white border-slate-200 text-slate-700 shadow-slate-300/50'
              }`}>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onEdit(task);
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-1.5 text-left transition-colors ${
                    theme === 'dark' ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
                  }`}
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>{t.edit}</span>
                </button>

                <button
                  onClick={() => {
                    setShowMenu(false);
                    onDuplicate(task);
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-1.5 text-left transition-colors ${
                    theme === 'dark' ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
                  }`}
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{t.duplicate}</span>
                </button>

                <div className="my-1 border-t border-slate-800/40" />

                <button
                  onClick={() => {
                    setShowMenu(false);
                    onDelete(task.id);
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-1.5 text-left text-rose-400 hover:text-rose-300 transition-colors ${
                    theme === 'dark' ? 'hover:bg-rose-500/10' : 'hover:bg-rose-50'
                  }`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{t.delete}</span>
                </button>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
};
