import React from 'react';
import { ActiveTab } from '../types';
import { Language, translations } from '../utils/i18n';
import { 
  Sun, 
  Moon, 
  Volume2, 
  VolumeX, 
  Plus, 
  FileText, 
  CheckCircle2, 
  Grid, 
  BarChart3, 
  Sparkles,
  ListTodo,
  Globe,
  Download,
  Smartphone
} from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  soundEnabled: boolean;
  toggleSound: () => void;
  language: Language;
  toggleLanguage: () => void;
  onOpenNewModal: () => void;
  onOpenSummaryModal: () => void;
  onDownloadHtml: () => void;
  onOpenInstallModal: () => void;
  pendingCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  theme,
  toggleTheme,
  soundEnabled,
  toggleSound,
  language,
  toggleLanguage,
  onOpenNewModal,
  onOpenSummaryModal,
  onDownloadHtml,
  onOpenInstallModal,
  pendingCount,
}) => {
  const t = translations[language];

  const navTabs: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'focus', label: t.navFocus, icon: <CheckCircle2 className="w-4 h-4" />, badge: pendingCount },
    { id: 'all', label: t.navAll, icon: <ListTodo className="w-4 h-4" /> },
    { id: 'habits', label: t.navHabits, icon: <Grid className="w-4 h-4" /> },
    { id: 'analytics', label: t.navAnalytics, icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'summaries', label: t.navSummaries, icon: <FileText className="w-4 h-4" /> },
  ];

  return (
    <>
      <header className={`sticky top-0 z-30 transition-colors duration-200 border-b ${
        theme === 'dark' 
          ? 'bg-slate-950/80 border-slate-800/80 backdrop-blur-xl' 
          : 'bg-white/80 border-slate-200/80 backdrop-blur-xl'
      }`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 gap-2 sm:gap-4">
          
          {/* Zone 1: Brand Wordmark */}
          <div 
            onClick={() => setActiveTab('focus')}
            className="flex items-center gap-2 sm:gap-3 shrink-0 cursor-pointer select-none"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white shrink-0">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <span className={`text-lg sm:text-xl font-bold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                {t.brandName}
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation Links (Desktop / Tablet) */}
          <nav className="hidden md:flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/10 dark:bg-slate-900/60 border border-slate-300/40 dark:border-slate-800/60">
            {navTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 whitespace-nowrap ${
                    isActive
                      ? theme === 'dark'
                        ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30 font-semibold'
                        : 'bg-white text-indigo-700 shadow-sm font-semibold'
                      : theme === 'dark'
                        ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className={`ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] tabular-nums ${
                      isActive
                        ? 'bg-indigo-700/80 text-white'
                        : 'bg-slate-700/50 text-slate-300 dark:bg-slate-800 dark:text-slate-300'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Quick Controls & Primary Action */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Language Switcher Button (TR / EN) */}
            <button
              onClick={toggleLanguage}
              title={t.switchLanguage}
              className={`px-2 sm:px-2.5 py-1.5 rounded-lg border text-[11px] sm:text-xs font-semibold transition-all flex items-center gap-1 sm:gap-1.5 ${
                theme === 'dark'
                  ? 'border-slate-800 bg-slate-900/60 text-slate-300 hover:text-white hover:border-slate-700 hover:bg-slate-800'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-100'
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span className="font-mono font-bold">
                {language === 'tr' ? 'TR' : 'EN'}
              </span>
            </button>

            {/* Sound toggle */}
            <button
              onClick={toggleSound}
              title={soundEnabled ? t.muteSound : t.enableSound}
              className={`p-1.5 sm:p-2 rounded-lg border transition-colors ${
                theme === 'dark'
                  ? 'border-slate-800 bg-slate-900/50 text-slate-300 hover:text-white hover:border-slate-700'
                  : 'border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              title={theme === 'dark' ? t.switchToLight : t.switchToDark}
              className={`p-1.5 sm:p-2 rounded-lg border transition-colors ${
                theme === 'dark'
                  ? 'border-slate-800 bg-slate-900/50 text-amber-400 hover:text-amber-300 hover:border-slate-700'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Daily Summary Button (Tablet & Desktop) */}
            <button
              onClick={onOpenSummaryModal}
              title={t.dailyReportBtn}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap ${
                theme === 'dark'
                  ? 'border-slate-800 bg-slate-900/80 text-slate-200 hover:bg-slate-800 hover:text-white'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-indigo-400" />
              <span>{t.dailyReportBtn}</span>
            </button>

            {/* Install / Download App Button */}
            <button
              onClick={onOpenInstallModal}
              title={language === 'tr' ? 'Uygulamayı Yükle (Telefon & Masaüstü)' : 'Install App (Mobile & Desktop)'}
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap ${
                theme === 'dark'
                  ? 'border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 hover:text-white'
                  : 'border-indigo-300 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 hover:text-indigo-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
              <span>{language === 'tr' ? 'Yükle' : 'Install'}</span>
            </button>

            {/* Download Standalone HTML Button */}
            <button
              onClick={onDownloadHtml}
              title={language === 'tr' ? 'Tek Dosya HTML Olarak İndir (.html)' : 'Download as Standalone Single HTML'}
              className={`hidden lg:flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap ${
                theme === 'dark'
                  ? 'border-slate-800 bg-slate-900/50 text-indigo-300 hover:bg-slate-800 hover:text-white'
                  : 'border-slate-200 bg-slate-50 text-indigo-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>{language === 'tr' ? 'Tek Dosya HTML' : 'Single HTML'}</span>
            </button>

            {/* Primary Action Button */}
            <button
              onClick={onOpenNewModal}
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500 transition-all shadow-md shadow-indigo-600/25 active:scale-95 whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">{t.newItemBtn}</span>
            </button>
          </div>

        </div>
      </div>
    </header>

    {/* Mobile Bottom Navigation Bar (Fixed for quick thumb reach) */}
    <nav 
      aria-label="Mobil Navigasyon" 
      className={`fixed bottom-0 inset-x-0 z-40 md:hidden border-t backdrop-blur-xl transition-colors duration-200 ${
        theme === 'dark' 
          ? 'bg-slate-950/95 border-slate-800/90 text-slate-300' 
          : 'bg-white/95 border-slate-200/90 text-slate-700 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]'
      }`}
      style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 0.35rem)' }}
    >
      <div className="grid grid-cols-5 items-center px-1 pt-1.5">
        {navTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-0.5 rounded-xl transition-all relative ${
                isActive
                  ? theme === 'dark'
                    ? 'text-indigo-400 font-bold'
                    : 'text-indigo-600 font-bold'
                  : theme === 'dark'
                    ? 'text-slate-400 hover:text-slate-200 active:scale-95'
                    : 'text-slate-500 hover:text-slate-800 active:scale-95'
              }`}
            >
              <div className={`p-1 rounded-lg transition-transform ${isActive ? 'scale-110 bg-indigo-500/15' : ''}`}>
                {tab.icon}
              </div>
              <span className="text-[10px] tracking-tight leading-tight mt-0.5 truncate max-w-[64px]">
                {tab.label}
              </span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="absolute top-0.5 right-2 px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-indigo-600 text-white tabular-nums">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  </>
  );
};
