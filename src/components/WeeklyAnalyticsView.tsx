import React, { useState } from 'react';
import { Category, TaskItem } from '../types';
import { 
  Language, 
  translations, 
  formatCategoryName, 
  formatDayName, 
  formatDateLocale 
} from '../utils/i18n';
import { computeWeeklyAnalytics } from '../utils/analytics';
import { generateDeepAiCoachingAdvice } from '../utils/aiCoach';
import { 
  TrendingUp, 
  Flame, 
  CheckCircle, 
  Lightbulb, 
  Sparkles, 
  BrainCircuit, 
  ArrowUpRight,
  Target,
  Copy,
  Check,
  Calendar,
  Layers,
  Clock,
  ShieldAlert,
  Repeat
} from 'lucide-react';

interface WeeklyAnalyticsViewProps {
  tasks: TaskItem[];
  categories: Category[];
  theme: 'dark' | 'light';
  language: Language;
}

export const WeeklyAnalyticsView: React.FC<WeeklyAnalyticsViewProps> = ({
  tasks,
  categories,
  theme,
  language,
}) => {
  const t = translations[language];
  const isTr = language === 'tr';
  const stats = computeWeeklyAnalytics(tasks, categories, language);
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);
  const [selectedDayMobile, setSelectedDayMobile] = useState<number | null>(() => {
    // Default select today
    const todayIndex = stats.dailyActivity.findIndex((d) => d.isToday);
    return todayIndex !== -1 ? todayIndex : stats.dailyActivity.length - 1;
  });
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);
  const [customAiCoachReport, setCustomAiCoachReport] = useState<string | null>(null);
  const [copiedCoach, setCopiedCoach] = useState<boolean>(false);

  const maxDayTotal = Math.max(...stats.dailyActivity.map((d) => d.totalCompleted), 4);

  // Deep AI coaching generator based on ACTUAL tasks & habits
  const handleGenerateAiCoaching = async () => {
    setIsGeneratingAi(true);
    try {
      const advice = await generateDeepAiCoachingAdvice(tasks, categories, language);
      setCustomAiCoachReport(advice);
    } catch {
      setCustomAiCoachReport(
        isTr
          ? 'Analiz tamamlanırken bir hata oluştu, lütfen tekrar deneyin.'
          : 'An error occurred while generating analysis, please try again.'
      );
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleCopyCoach = () => {
    if (!customAiCoachReport) return;
    navigator.clipboard.writeText(customAiCoachReport);
    setCopiedCoach(true);
    setTimeout(() => setCopiedCoach(false), 2000);
  };

  const activeDayIndex = hoveredDay !== null ? hoveredDay : selectedDayMobile;
  const activeDayData = activeDayIndex !== null ? stats.dailyActivity[activeDayIndex] : null;

  return (
    <div className="space-y-4 sm:space-y-6">
      
      {/* KPI Overview Cards - Mobile 2x2 Grid, Desktop 4 Cols */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        
        {/* Completion Rate */}
        <div className={`p-3.5 sm:p-5 rounded-2xl border backdrop-blur-md transition-all ${
          theme === 'dark' ? 'bg-slate-900/60 border-slate-800' : 'bg-white/80 border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1 sm:mb-2">
            <span className="truncate">{t.weeklyCompletionRate}</span>
            <Target className="w-4 h-4 text-indigo-400 shrink-0" />
          </div>
          <div className="text-xl sm:text-3xl font-bold font-mono tabular-nums text-slate-100 dark:text-white">
            {stats.overallCompletionRate}%
          </div>
          <div className="mt-2 h-1.5 w-full bg-slate-800/60 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${stats.overallCompletionRate}%` }}
            />
          </div>
        </div>

        {/* Total Completed */}
        <div className={`p-3.5 sm:p-5 rounded-2xl border backdrop-blur-md transition-all ${
          theme === 'dark' ? 'bg-slate-900/60 border-slate-800' : 'bg-white/80 border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1 sm:mb-2">
            <span className="truncate">{t.completedActions}</span>
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          </div>
          <div className="text-xl sm:text-3xl font-bold font-mono tabular-nums text-slate-100 dark:text-white">
            {stats.totalCompletedThisWeek}
          </div>
          <p className="text-[10px] sm:text-[11px] text-slate-400 mt-1 truncate">
            {t.acrossTasksHabits}
          </p>
        </div>

        {/* Top Streak */}
        <div className={`p-3.5 sm:p-5 rounded-2xl border backdrop-blur-md transition-all ${
          theme === 'dark' ? 'bg-slate-900/60 border-slate-800' : 'bg-white/80 border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1 sm:mb-2">
            <span className="truncate">{t.longestStreak}</span>
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400 shrink-0" />
          </div>
          <div className="text-xl sm:text-3xl font-bold font-mono tabular-nums text-amber-400">
            {stats.longestStreakHabit ? `${stats.longestStreakHabit.streak} ${isTr ? 'gün' : 'days'}` : `0 ${isTr ? 'gün' : 'days'}`}
          </div>
          <p className="text-[10px] sm:text-[11px] text-slate-400 mt-1 truncate">
            {stats.longestStreakHabit ? stats.longestStreakHabit.name : t.noActiveStreaks}
          </p>
        </div>

        {/* Active Focus Areas */}
        <div className={`p-3.5 sm:p-5 rounded-2xl border backdrop-blur-md transition-all ${
          theme === 'dark' ? 'bg-slate-900/60 border-slate-800' : 'bg-white/80 border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1 sm:mb-2">
            <span className="truncate">{t.activeCategories}</span>
            <TrendingUp className="w-4 h-4 text-sky-400 shrink-0" />
          </div>
          <div className="text-xl sm:text-3xl font-bold font-mono tabular-nums text-slate-100 dark:text-white">
            {stats.categoryStats.length}
          </div>
          <p className="text-[10px] sm:text-[11px] text-slate-400 mt-1 truncate">
            {t.balancedFocus}
          </p>
        </div>

      </div>

      {/* Interactive 7-Day Completion Velocity Chart - Mobile Optimized */}
      <div className={`p-3.5 sm:p-6 rounded-2xl border backdrop-blur-md ${
        theme === 'dark' ? 'bg-slate-900/60 border-slate-800' : 'bg-white/80 border-slate-200 shadow-sm'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 sm:mb-6">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-100 dark:text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-400" />
              <span>{t.sevenDayVelocity}</span>
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
              {t.sevenDayVelocityDesc}
            </p>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-3 sm:gap-4 text-[11px] sm:text-xs">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-sm bg-indigo-500" />
              {t.habitsOnly}
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-sm bg-violet-400" />
              {t.tasksOnly}
            </span>
          </div>
        </div>

        {/* Chart Bars - Mobile friendly touch container */}
        <div className="overflow-x-auto pb-1 scrollbar-none">
          <div className="min-w-[280px] sm:min-w-full h-44 sm:h-60 flex items-end justify-between gap-1.5 sm:gap-6 pt-6 pb-2 border-b border-slate-800/50 px-1 sm:px-4">
            {stats.dailyActivity.map((day, idx) => {
              const heightPercent = maxDayTotal > 0 ? (day.totalCompleted / maxDayTotal) * 100 : 0;
              const habitHeight = day.totalCompleted > 0 ? (day.habitsCompleted / day.totalCompleted) * 100 : 0;
              const taskHeight = 100 - habitHeight;
              const isSelected = activeDayIndex === idx;
              const displayDayShort = formatDayName(day.dayName, language, false);

              return (
                <div
                  key={day.dateStr}
                  className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative select-none"
                  onMouseEnter={() => setHoveredDay(idx)}
                  onMouseLeave={() => setHoveredDay(null)}
                  onClick={() => setSelectedDayMobile(idx)}
                  role="button"
                  tabIndex={0}
                  aria-label={`${displayDayShort} ${day.dateStr}`}
                >
                  {/* Tooltip on Desktop hover */}
                  {hoveredDay === idx && (
                    <div className={`hidden sm:block absolute -top-14 z-20 px-2.5 py-1.5 rounded-xl border text-[11px] shadow-lg whitespace-nowrap pointer-events-none transition-all ${
                      theme === 'dark'
                        ? 'bg-slate-950 border-slate-700 text-slate-100 shadow-black/80'
                        : 'bg-white border-slate-300 text-slate-900 shadow-slate-300'
                    }`}>
                      <div className="font-semibold">{formatDayName(day.dayName, language, true)}, {formatDateLocale(day.dateStr, language)}</div>
                      <div className="text-slate-400 text-[10px] tabular-nums mt-0.5">
                        {day.tasksCompleted} {isTr ? 'görev' : 'tasks'} · {day.habitsCompleted} {isTr ? 'alışkanlık' : 'habits'}
                      </div>
                    </div>
                  )}

                  {/* Number above bar */}
                  <span className={`text-[10px] sm:text-[11px] font-mono tabular-nums mb-1 font-semibold transition-opacity ${
                    day.totalCompleted > 0 ? 'text-indigo-300' : 'text-slate-600'
                  }`}>
                    {day.totalCompleted}
                  </span>

                  {/* Stacked Bar Container */}
                  <div
                    className={`w-full max-w-[32px] sm:max-w-[46px] rounded-t-xl overflow-hidden transition-all duration-200 flex flex-col justify-end ${
                      day.isToday ? 'ring-2 ring-indigo-400 shadow-md shadow-indigo-500/20' : ''
                    } ${isSelected ? 'ring-2 ring-indigo-500 scale-y-105 origin-bottom brightness-110' : ''}`}
                    style={{ height: `${Math.max(heightPercent, 8)}%` }}
                  >
                    {/* Tasks portion */}
                    {day.tasksCompleted > 0 && (
                      <div
                        className="w-full bg-violet-400 transition-all hover:brightness-110"
                        style={{ height: `${taskHeight}%` }}
                        title={`${day.tasksCompleted} ${isTr ? 'görev' : 'tasks'}`}
                      />
                    )}
                    {/* Habits portion */}
                    {day.habitsCompleted > 0 && (
                      <div
                        className="w-full bg-indigo-600 transition-all hover:brightness-110"
                        style={{ height: `${habitHeight}%` }}
                        title={`${day.habitsCompleted} ${isTr ? 'alışkanlık' : 'habits'}`}
                      />
                    )}
                    {/* Empty placeholder */}
                    {day.totalCompleted === 0 && (
                      <div className="w-full h-full bg-slate-800/25 rounded-t-xl" />
                    )}
                  </div>

                  {/* Day Label in Turkish: Pzt, Sal, Çar, Per, Cum, Cmt, Paz */}
                  <div className={`mt-2 text-center text-[10px] sm:text-xs font-mono uppercase ${
                    day.isToday ? 'text-indigo-400 font-bold' : isSelected ? 'text-slate-100 font-semibold' : 'text-slate-400'
                  }`}>
                    <span>{displayDayShort}</span>
                    <span className="block text-[9px] sm:text-[10px] font-sans opacity-70 mt-0.5 tabular-nums">
                      {day.dayNumber}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile / Tap Day Inspector Card */}
        {activeDayData && (
          <div className={`mt-3 p-2.5 sm:p-3 rounded-xl border text-xs flex flex-wrap items-center justify-between gap-2 transition-all ${
            theme === 'dark' ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              <span className="font-semibold text-slate-200 dark:text-white">
                {formatDayName(activeDayData.dayName, language, true)}, {formatDateLocale(activeDayData.dateStr, language)}:
              </span>
              <span className="text-slate-400">
                {activeDayData.isToday ? `(${isTr ? 'Bugün' : 'Today'})` : ''}
              </span>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-mono tabular-nums">
              <span className="text-violet-400">
                {activeDayData.tasksCompleted} {isTr ? 'Görev' : 'Tasks'}
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-indigo-400">
                {activeDayData.habitsCompleted} {isTr ? 'Alışkanlık' : 'Habits'}
              </span>
              <span className="text-slate-600">·</span>
              <span className="font-bold text-emerald-400">
                {isTr ? 'Toplam:' : 'Total:'} {activeDayData.totalCompleted}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Two Column Grid: Categories Breakdown (Turkish) & Priority Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Category Breakdown (With Turkish Category Names) */}
        <div className={`p-4 sm:p-5 rounded-2xl border backdrop-blur-md ${
          theme === 'dark' ? 'bg-slate-900/60 border-slate-800' : 'bg-white/80 border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h4 className="text-sm font-bold text-slate-100 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>{t.categoryCompletionRates}</span>
            </h4>
            <span className="text-[11px] text-slate-400 font-mono">
              {stats.categoryStats.length} {isTr ? 'kategori' : 'categories'}
            </span>
          </div>

          {stats.categoryStats.length === 0 ? (
            <p className="text-xs text-slate-400 py-4 text-center">
              {isTr ? 'Henüz kategori verisi bulunmuyor. Görev ekleyerek başlatın.' : 'No category activity recorded yet.'}
            </p>
          ) : (
            <div className="space-y-3">
              {stats.categoryStats.map((cat) => {
                const localizedName = formatCategoryName(cat.name, language);
                return (
                  <div key={cat.name} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-2 font-medium text-slate-200">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                        <span className="font-semibold">{localizedName}</span>
                      </span>
                      <span className="text-slate-400 font-mono tabular-nums text-[11px]">
                        {cat.completed}/{cat.total} ({cat.rate}%)
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800/60 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${cat.rate}%`,
                          backgroundColor: cat.color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Priority Execution Breakdown */}
        <div className={`p-4 sm:p-5 rounded-2xl border backdrop-blur-md ${
          theme === 'dark' ? 'bg-slate-900/60 border-slate-800' : 'bg-white/80 border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h4 className="text-sm font-bold text-slate-100 dark:text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-indigo-400" />
              <span>{t.priorityExecutionBreakdown}</span>
            </h4>
          </div>

          <div className="space-y-3">
            {stats.priorityStats.map((p) => {
              const color = p.priority === 'high' ? '#f43f5e' : p.priority === 'medium' ? '#f59e0b' : '#10b981';
              const pLabel = p.priority === 'high' ? t.highPriority : p.priority === 'medium' ? t.mediumPriority : t.lowPriority;
              return (
                <div key={p.priority} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2 font-medium text-slate-200">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
                      <span>{pLabel}</span>
                    </span>
                    <span className="text-slate-400 font-mono tabular-nums text-[11px]">
                      {p.completed}/{p.total} ({p.rate}%)
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800/60 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${p.rate}%`,
                        backgroundColor: color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Advanced AI Coaching & Deep Task Suggestions */}
      <div className={`p-4 sm:p-6 rounded-2xl border backdrop-blur-md ${
        theme === 'dark' ? 'bg-slate-900/60 border-slate-800' : 'bg-white/80 border-slate-200 shadow-sm'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-indigo-600/30 to-violet-500/20 text-indigo-400 shrink-0 border border-indigo-500/30">
              <BrainCircuit className="w-5 h-5 text-indigo-300" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-slate-100 dark:text-white">
                {isTr ? 'Görevlerinize Özel Gelişmiş AI Analizi & Koçluk' : t.aiSuggestionsTitle}
              </h4>
              <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
                {isTr 
                  ? 'Kayıtlı görevlerinizi, aciliyetleri, süreleri ve alışkanlık serinizi derinlemesine inceleyen akıllı tavsiyeler.' 
                  : 'Deep synthesis analyzing your active tasks, deadlines, priorities, and habit streaks.'}
              </p>
            </div>
          </div>

          <button
            onClick={handleGenerateAiCoaching}
            disabled={isGeneratingAi}
            className={`min-h-[44px] px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 shrink-0 ${
              isGeneratingAi
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/25'
            }`}
          >
            <Sparkles className={`w-4 h-4 ${isGeneratingAi ? 'animate-spin' : ''}`} />
            <span>
              {isGeneratingAi 
                ? (isTr ? 'Görevleriniz İnceleniyor...' : t.synthesizing) 
                : customAiCoachReport 
                  ? (isTr ? 'Analizi Yeniden Yap' : 'Refresh AI Analysis')
                  : (isTr ? 'Görevlerime Göre AI Koçluğu Al' : t.deepAiCoaching)}
            </span>
          </button>
        </div>

        {/* Quick Heuristic Bullets */}
        <div className="space-y-2 mb-4">
          {stats.aiWeeklySuggestions.map((suggestion, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl border text-xs leading-relaxed flex items-start gap-2.5 ${
                theme === 'dark' ? 'bg-slate-950/40 border-slate-800/60 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <ArrowUpRight className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <span>{suggestion}</span>
            </div>
          ))}
        </div>

        {/* Expanded Deep AI Coaching Synthesis Box */}
        {customAiCoachReport ? (
          <div className={`mt-4 p-4 sm:p-5 rounded-2xl border text-xs sm:text-sm leading-relaxed space-y-4 animate-in fade-in-50 duration-300 ${
            theme === 'dark'
              ? 'bg-indigo-950/25 border-indigo-500/40 text-slate-200'
              : 'bg-indigo-50/90 border-indigo-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-indigo-500/20">
              <div className="flex items-center gap-2 font-bold text-sm text-indigo-300">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>{isTr ? 'Görevlerinize Özel Detaylı Eylem Planı' : t.tailoredCoaching}</span>
              </div>
              <button
                onClick={handleCopyCoach}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-indigo-500/30 text-xs font-semibold hover:bg-indigo-500/20 transition-colors"
                title="Tavsiyeleri Kopyala"
              >
                {copiedCoach ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCoach ? (isTr ? 'Kopyalandı' : 'Copied') : (isTr ? 'Tavsiyeyi Kopyala' : 'Copy')}</span>
              </button>
            </div>
            
            <div className="whitespace-pre-line text-xs sm:text-sm font-sans leading-relaxed space-y-3">
              {customAiCoachReport}
            </div>
          </div>
        ) : (
          <div className={`mt-3 p-4 rounded-xl border border-dashed text-center text-xs ${
            theme === 'dark' ? 'border-slate-800 text-slate-400' : 'border-slate-300 text-slate-500'
          }`}>
            <p>
              {isTr 
                ? '👆 Yukarıdaki "Görevlerime Göre AI Koçluğu Al" butonuna basarak, eklediğiniz tüm görevlere, önceliklere ve serilerinize özel stratejik tavsiyeleri görüntüleyebilirsiniz.'
                : '👆 Click "Deep AI Coaching" above to generate tailored guidance examining your real tasks, deadlines, and habit rhythms.'}
            </p>
          </div>
        )}
      </div>

    </div>
  );
};
