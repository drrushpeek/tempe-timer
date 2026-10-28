import React, { useState } from 'react';
import { DailySummary } from '../types';
import { Language, translations } from '../utils/i18n';
import { 
  X, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Quote, 
  Copy, 
  Check, 
  BookmarkCheck
} from 'lucide-react';

interface DailySummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  summary: DailySummary;
  onSaveSummary: (summary: DailySummary) => void;
  theme: 'dark' | 'light';
  language: Language;
}

export const DailySummaryModal: React.FC<DailySummaryModalProps> = ({
  isOpen,
  onClose,
  summary,
  onSaveSummary,
  theme,
  language,
}) => {
  const t = translations[language];
  const [copied, setCopied] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleCopyMarkdown = () => {
    const text = `# ${t.dailySummaryTitle} — ${summary.date}
**${t.productivityScore}**: ${summary.productivityScore}%
**${t.tasksLabel}**: ${summary.completedTasks} / ${summary.totalTasks}
**${t.habitsLabel}**: ${summary.habitsCompleted} / ${summary.habitsTotal}
**${t.focusLabel}**: ${summary.focusMinutes} ${language === 'tr' ? 'dakika' : 'minutes'}

### ${t.todaysAccomplishments}
${summary.highlights.map((h) => `- ${h}`).join('\n')}

### ${t.aiInsightTitle}
${summary.aiInsight}

> ${summary.motivationalQuote}
`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    onSaveSummary(summary);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className={`relative w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-2xl sm:rounded-3xl border shadow-2xl p-4 sm:p-7 transition-all z-10 ${
        theme === 'dark'
          ? 'bg-slate-900/90 border-slate-700 text-slate-100'
          : 'bg-white/95 border-slate-200 text-slate-900'
      }`}>
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold">{t.dailySummaryTitle}</h2>
              <p className="text-xs text-slate-400">{t.generatedForToday}, {summary.date}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Core Productivity Gauge Strip */}
        <div className="mt-5 p-4 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
              {t.productivityScore}
            </span>
            <div className="text-3xl font-extrabold font-mono tabular-nums text-white dark:text-slate-100 flex items-baseline gap-1">
              <span>{summary.productivityScore}</span>
              <span className="text-lg text-indigo-400">%</span>
            </div>
          </div>

          {/* Mini Stats Grid */}
          <div className="flex items-center gap-4 text-xs font-mono tabular-nums">
            <div className="text-right">
              <div className="text-slate-400 text-[10px] uppercase">{t.tasksLabel}</div>
              <div className="font-semibold text-slate-200">
                {summary.completedTasks}/{summary.totalTasks}
              </div>
            </div>

            <div className="h-6 w-px bg-slate-700/50" />

            <div className="text-right">
              <div className="text-slate-400 text-[10px] uppercase">{t.habitsLabel}</div>
              <div className="font-semibold text-slate-200">
                {summary.habitsCompleted}/{summary.habitsTotal}
              </div>
            </div>

            <div className="h-6 w-px bg-slate-700/50" />

            <div className="text-right">
              <div className="text-slate-400 text-[10px] uppercase">{t.focusLabel}</div>
              <div className="font-semibold text-slate-200">
                {summary.focusMinutes}m
              </div>
            </div>
          </div>
        </div>

        {/* Highlights List */}
        <div className="mt-5 space-y-2">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {t.todaysAccomplishments}
          </h4>
          <div className="space-y-1.5">
            {summary.highlights.map((highlight, idx) => (
              <div
                key={idx}
                className={`p-2.5 rounded-xl border text-xs flex items-center gap-2.5 ${
                  theme === 'dark' ? 'bg-slate-950/40 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{highlight}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Insight Box */}
        <div className={`mt-4 p-3.5 rounded-xl border text-xs leading-relaxed ${
          theme === 'dark' ? 'bg-slate-950/50 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
        }`}>
          <div className="font-semibold text-indigo-400 mb-1 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.aiInsightTitle}</span>
          </div>
          <p>{summary.aiInsight}</p>
        </div>

        {/* Motivational Quote */}
        {summary.motivationalQuote && (
          <div className={`mt-3 p-3 rounded-xl border text-xs italic ${
            theme === 'dark' ? 'bg-slate-950/20 border-slate-800/60 text-slate-400' : 'bg-slate-100/50 border-slate-200 text-slate-600'
          }`}>
            <Quote className="w-3.5 h-3.5 text-slate-500 mb-1 inline mr-1" />
            {summary.motivationalQuote}
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-slate-800/40 flex items-center justify-between gap-3">
          <button
            onClick={handleCopyMarkdown}
            className={`px-3 py-2 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-colors ${
              copied
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10'
                : theme === 'dark'
                  ? 'border-slate-800 text-slate-300 hover:bg-slate-800'
                  : 'border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? t.copiedReport : t.copyReport}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-colors ${
                theme === 'dark' ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.close}
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all flex items-center gap-1.5"
            >
              <BookmarkCheck className="w-3.5 h-3.5" />
              <span>{saved ? t.saved : t.saveToHistory}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
