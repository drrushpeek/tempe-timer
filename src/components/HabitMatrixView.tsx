import React from 'react';
import { Category, TaskItem } from '../types';
import { Language, translations, formatCategoryName, formatDayName } from '../utils/i18n';
import { calculateHabitStreaks, getPastNDays, getTodayDateStr, isHabitScheduledForDate } from '../utils/dateUtils';
import { soundManager, triggerConfetti } from '../utils/audio';
import { Flame, Check, Plus, Sparkles, Trophy, CalendarCheck } from 'lucide-react';

interface HabitMatrixViewProps {
  habits: TaskItem[];
  categories: Category[];
  theme: 'dark' | 'light';
  language: Language;
  onToggleHabitDay: (task: TaskItem, dateStr: string, e: React.MouseEvent) => void;
  onOpenNewHabitModal: () => void;
}

export const HabitMatrixView: React.FC<HabitMatrixViewProps> = ({
  habits,
  categories,
  theme,
  language,
  onToggleHabitDay,
  onOpenNewHabitModal,
}) => {
  const t = translations[language];
  const days = getPastNDays(10);
  const todayStr = getTodayDateStr();

  // Turkish / English Day Names Mapping
  const trDaysMap: Record<string, string> = {
    Sun: 'Paz',
    Mon: 'Pzt',
    Tue: 'Sal',
    Wed: 'Çar',
    Thu: 'Per',
    Fri: 'Cum',
    Sat: 'Cmt',
  };

  const handleCellClick = (habit: TaskItem, dateStr: string, e: React.MouseEvent) => {
    soundManager.playCheckSound();
    const wasDone = !!habit.habitHistory[dateStr];
    if (!wasDone) {
      triggerConfetti(e.clientX, e.clientY);
    }
    onToggleHabitDay(habit, dateStr, e);
  };

  const handleLogAllToday = (e: React.MouseEvent) => {
    soundManager.playStreakSound();
    triggerConfetti(e.clientX, e.clientY);
    habits.forEach((h) => {
      const todayDate = new Date();
      if (isHabitScheduledForDate(h.recurrence, todayDate) && !h.habitHistory[todayStr]) {
        onToggleHabitDay(h, todayStr, e);
      }
    });
  };

  if (habits.length === 0) {
    return (
      <div className={`p-12 text-center rounded-2xl border ${
        theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white/80 border-slate-200'
      }`}>
        <CalendarCheck className="w-12 h-12 mx-auto text-slate-500 mb-3" />
        <h3 className="text-lg font-bold">{t.noHabitsTitle}</h3>
        <p className="text-sm text-slate-400 mt-1 max-w-md mx-auto">
          {t.noHabitsDesc}
        </p>
        <button
          onClick={onOpenNewHabitModal}
          className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md transition-all inline-flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>{t.createFirstHabit}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Top Banner Actions */}
      <div className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
        theme === 'dark' ? 'bg-slate-900/50 border-slate-800' : 'bg-white/80 border-slate-200'
      }`}>
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <span>{t.matrixTitle}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {t.matrixSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleLogAllToday}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors flex items-center gap-1.5 ${
              theme === 'dark'
                ? 'border-indigo-500/40 bg-indigo-600/10 text-indigo-300 hover:bg-indigo-600/20'
                : 'border-indigo-300 bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
            }`}
          >
            <Check className="w-3.5 h-3.5" />
            <span>{t.logAllDueToday}</span>
          </button>

          <button
            onClick={onOpenNewHabitModal}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t.addHabit}</span>
          </button>
        </div>
      </div>

      {/* Habit Matrix Table Container */}
      <div className={`rounded-2xl border overflow-hidden backdrop-blur-md ${
        theme === 'dark' ? 'bg-slate-900/60 border-slate-800/80' : 'bg-white/90 border-slate-200'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className={`border-b ${theme === 'dark' ? 'border-slate-800 bg-slate-950/60' : 'border-slate-200 bg-slate-50'}`}>
                <th className={`py-3.5 px-3 sm:px-4 font-semibold text-slate-400 uppercase tracking-wider text-[11px] min-w-[180px] sm:min-w-[200px] sticky left-0 z-20 backdrop-blur-md border-r ${
                  theme === 'dark' ? 'bg-slate-950/95 border-slate-800' : 'bg-slate-50/95 border-slate-200'
                }`}>
                  {t.habitRoutine}
                </th>
                <th className="py-3.5 px-3 font-semibold text-slate-400 uppercase tracking-wider text-[11px] text-center whitespace-nowrap">
                  {t.cadenceCol}
                </th>
                <th className="py-3.5 px-3 font-semibold text-slate-400 uppercase tracking-wider text-[11px] text-center whitespace-nowrap">
                  {t.currentCol}
                </th>
                <th className="py-3.5 px-3 font-semibold text-slate-400 uppercase tracking-wider text-[11px] text-center whitespace-nowrap">
                  {t.bestCol}
                </th>

                {/* Day Columns */}
                {days.map((day) => {
                  const displayDayName = language === 'tr' ? (trDaysMap[day.dayName] || day.dayName) : day.dayName;
                  return (
                    <th
                      key={day.dateStr}
                      className={`py-3.5 px-2 text-center min-w-[42px] ${
                        day.isToday
                          ? theme === 'dark' ? 'bg-indigo-950/40 font-bold text-indigo-300' : 'bg-indigo-50 font-bold text-indigo-700'
                          : 'text-slate-400'
                      }`}
                    >
                      <div className="text-[10px] uppercase font-mono">{displayDayName}</div>
                      <div className="text-[12px] tabular-nums font-semibold mt-0.5">{day.dayNumber}</div>
                    </th>
                  );
                })}

                <th className="py-3.5 px-4 font-semibold text-slate-400 uppercase tracking-wider text-[11px] text-right min-w-[90px]">
                  {t.consistencyCol}
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/30">
              {habits.map((habit) => {
                const categoryObj = categories.find((c) => c.name.toLowerCase() === habit.category.toLowerCase());
                const categoryColor = categoryObj ? categoryObj.color : '#6366f1';
                const { currentStreak, bestStreak } = calculateHabitStreaks(habit.habitHistory, habit.recurrence);

                // Calculate 10-day consistency
                let scheduledCount = 0;
                let completedCount = 0;
                days.forEach((day) => {
                  const [y, m, d] = day.dateStr.split('-').map(Number);
                  const dateObj = new Date(y, m - 1, d);
                  if (isHabitScheduledForDate(habit.recurrence, dateObj)) {
                    scheduledCount++;
                    if (habit.habitHistory[day.dateStr]) {
                      completedCount++;
                    }
                  }
                });

                const consistency = scheduledCount > 0 ? Math.round((completedCount / scheduledCount) * 100) : 0;

                const cadenceLabel = habit.recurrence === 'daily' 
                  ? t.daily 
                  : habit.recurrence === 'weekdays' 
                    ? t.weekdays 
                    : habit.recurrence === 'weekends' 
                      ? t.weekends 
                      : habit.recurrence === 'weekly' 
                        ? t.weekly 
                        : t.none;

                return (
                  <tr
                    key={habit.id}
                    className={`transition-colors ${
                      theme === 'dark' ? 'hover:bg-slate-800/30' : 'hover:bg-slate-100/60'
                    }`}
                  >
                    {/* Habit Title & Category - Sticky on mobile */}
                    <td className={`py-3 px-3 sm:px-4 sticky left-0 z-10 backdrop-blur-md border-r ${
                      theme === 'dark' ? 'bg-slate-900/90 border-slate-800/80' : 'bg-white/95 border-slate-200/80'
                    }`}>
                      <div className="font-semibold text-slate-200 dark:text-slate-100 line-clamp-1 text-xs sm:text-sm">
                        {habit.title}
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5 text-[11px]">
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: categoryColor }} />
                        <span className="text-slate-400">{formatCategoryName(habit.category, language)}</span>
                        {habit.estimatedMinutes && (
                          <>
                            <span className="text-slate-600">·</span>
                            <span className="text-slate-500">{habit.estimatedMinutes}m</span>
                          </>
                        )}
                      </div>
                    </td>

                    {/* Cadence */}
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <span className="text-slate-400 font-medium text-[11px]">
                        {cadenceLabel}
                      </span>
                    </td>

                    {/* Current Streak */}
                    <td className="py-3 px-3 text-center whitespace-nowrap font-mono tabular-nums">
                      <span className={`inline-flex items-center gap-1 font-semibold ${
                        currentStreak > 0 ? 'text-amber-400' : 'text-slate-500'
                      }`}>
                        <Flame className={`w-3.5 h-3.5 ${currentStreak > 0 ? 'fill-amber-400' : ''}`} />
                        {currentStreak}d
                      </span>
                    </td>

                    {/* Best Streak */}
                    <td className="py-3 px-3 text-center whitespace-nowrap font-mono tabular-nums text-slate-400">
                      <span className="inline-flex items-center gap-1">
                        <Trophy className="w-3 h-3 text-slate-500" />
                        {bestStreak}d
                      </span>
                    </td>

                    {/* Matrix Day Cells */}
                    {days.map((day) => {
                      const [y, m, d] = day.dateStr.split('-').map(Number);
                      const dateObj = new Date(y, m - 1, d);
                      const isScheduled = isHabitScheduledForDate(habit.recurrence, dateObj);
                      const isCompleted = !!habit.habitHistory[day.dateStr];

                      return (
                        <td
                          key={day.dateStr}
                          className={`py-2 px-1.5 text-center ${
                            day.isToday
                              ? theme === 'dark' ? 'bg-indigo-950/20' : 'bg-indigo-50/50'
                              : ''
                          }`}
                        >
                          {isScheduled ? (
                            <button
                              type="button"
                              onClick={(e) => handleCellClick(habit, day.dateStr, e)}
                              title={`${habit.title} (${isCompleted ? t.markIncomplete : t.markComplete})`}
                              className={`w-7 h-7 mx-auto rounded-lg flex items-center justify-center transition-all ${
                                isCompleted
                                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30 scale-100 hover:bg-indigo-500'
                                  : theme === 'dark'
                                    ? 'bg-slate-800/50 text-slate-600 border border-slate-700/60 hover:border-slate-500 hover:text-slate-400'
                                    : 'bg-slate-100 text-slate-400 border border-slate-200 hover:border-slate-400 hover:text-slate-600'
                              }`}
                            >
                              <Check className={`w-3.5 h-3.5 stroke-[3] ${isCompleted ? 'opacity-100' : 'opacity-0'}`} />
                            </button>
                          ) : (
                            <span className="inline-block w-2 h-2 rounded-full bg-slate-700/30 mx-auto" />
                          )}
                        </td>
                      );
                    })}

                    {/* Consistency Percentage */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <span className={`font-mono tabular-nums font-semibold ${
                        consistency >= 80 ? 'text-emerald-400' : consistency >= 50 ? 'text-amber-400' : 'text-slate-400'
                      }`}>
                        {consistency}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
