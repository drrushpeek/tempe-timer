import React from 'react';
import { DailySummary } from '../types';
import { Language, translations } from '../utils/i18n';
import { FileText, Calendar, CheckCircle2, Trash2, Sparkles, Copy, Check } from 'lucide-react';

interface DailySummariesListViewProps {
  summaries: DailySummary[];
  theme: 'dark' | 'light';
  language: Language;
  onDeleteSummary: (id: string) => void;
  onGenerateNew: () => void;
}

export const DailySummariesListView: React.FC<DailySummariesListViewProps> = ({
  summaries,
  theme,
  language,
  onDeleteSummary,
  onGenerateNew,
}) => {
  const t = translations[language];
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const handleCopy = (sum: DailySummary) => {
    const text = `# ${t.dailySummaryTitle} — ${sum.date}
${t.productivityScore}: ${sum.productivityScore}%
${t.tasksLabel}: ${sum.completedTasks}/${sum.totalTasks} | ${t.habitsLabel}: ${sum.habitsCompleted}/${sum.habitsTotal}
${t.focusLabel}: ${sum.focusMinutes}m
${t.todaysAccomplishments}:
${sum.highlights.map(h => `- ${h}`).join('\n')}
${t.aiInsightTitle}: ${sum.aiInsight}
${sum.motivationalQuote}
`;
    navigator.clipboard.writeText(text);
    setCopiedId(sum.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (summaries.length === 0) {
    return (
      <div className={`p-12 text-center rounded-2xl border ${
        theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white/80 border-slate-200'
      }`}>
        <FileText className="w-12 h-12 mx-auto text-slate-500 mb-3" />
        <h3 className="text-lg font-bold">{t.noSummariesYet}</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
          {t.noSummariesDesc}
        </p>
        <button
          onClick={onGenerateNew}
          className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md inline-flex items-center gap-1.5"
        >
          <Sparkles className="w-4 h-4" />
          <span>{t.generateTodaysSummary}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-100 dark:text-white">{t.dailySummaryReports}</h2>
          <p className="text-xs text-slate-400">{t.historicalArchives}</p>
        </div>
        <button
          onClick={onGenerateNew}
          className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-sm flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t.generateNewSummary}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {summaries.map((sum) => (
          <div
            key={sum.id}
            className={`p-5 rounded-2xl border transition-all duration-200 backdrop-blur-md ${
              theme === 'dark'
                ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                : 'bg-white/90 border-slate-200 hover:border-slate-300 shadow-sm'
            }`}
          >
            {/* Top row */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <span className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400">
                  <Calendar className="w-3.5 h-3.5" />
                  {sum.date}
                </span>
                <div className="text-2xl font-bold font-mono tabular-nums text-slate-100 dark:text-white mt-0.5">
                  {sum.productivityScore}% <span className="text-xs text-slate-400 font-sans font-normal">{language === 'tr' ? 'puan' : 'score'}</span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleCopy(sum)}
                  title={t.copyReport}
                  className={`p-1.5 rounded-lg border text-xs transition-colors ${
                    copiedId === sum.id
                      ? 'border-emerald-500 text-emerald-400'
                      : theme === 'dark'
                        ? 'border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {copiedId === sum.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => onDeleteSummary(sum.id)}
                  title={t.delete}
                  className={`p-1.5 rounded-lg border text-xs text-rose-400 transition-colors ${
                    theme === 'dark' ? 'border-slate-800 hover:bg-rose-500/10' : 'border-slate-200 hover:bg-rose-50'
                  }`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Metrics */}
            <div className={`p-2.5 rounded-xl border text-xs font-mono tabular-nums flex items-center justify-around ${
              theme === 'dark' ? 'bg-slate-950/40 border-slate-800/80 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}>
              <div>{t.tasksLabel}: <span className="font-semibold">{sum.completedTasks}/{sum.totalTasks}</span></div>
              <div className="h-4 w-px bg-slate-700/40" />
              <div>{t.habitsLabel}: <span className="font-semibold">{sum.habitsCompleted}/{sum.habitsTotal}</span></div>
              <div className="h-4 w-px bg-slate-700/40" />
              <div>{t.focusLabel}: <span className="font-semibold">{sum.focusMinutes}m</span></div>
            </div>

            {/* Highlights */}
            {sum.highlights.length > 0 && (
              <div className="mt-3 space-y-1">
                {sum.highlights.slice(0, 2).map((h, i) => (
                  <div key={i} className="text-xs text-slate-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span className="truncate">{h}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Quote snippet */}
            {sum.motivationalQuote && (
              <p className="mt-3 text-[11px] italic text-slate-500 line-clamp-2">
                {sum.motivationalQuote}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
