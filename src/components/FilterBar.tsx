import React from 'react';
import { Category, TaskPriority, TaskType } from '../types';
import { Language, translations, formatCategoryName } from '../utils/i18n';
import { Search, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

interface FilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedPriority: 'all' | TaskPriority;
  setSelectedPriority: (priority: 'all' | TaskPriority) => void;
  selectedType: 'all' | TaskType;
  setSelectedType: (type: 'all' | TaskType) => void;
  sortBy: 'time' | 'priority' | 'title' | 'streak';
  setSortBy: (sort: 'time' | 'priority' | 'title' | 'streak') => void;
  categories: Category[];
  theme: 'dark' | 'light';
  countsByCategory: Record<string, number>;
  language: Language;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedPriority,
  setSelectedPriority,
  selectedType,
  setSelectedType,
  sortBy,
  setSortBy,
  categories,
  theme,
  countsByCategory,
  language,
}) => {
  const t = translations[language];

  return (
    <div className={`p-3 sm:p-4 rounded-2xl mb-4 sm:mb-6 transition-colors border ${
      theme === 'dark'
        ? 'bg-slate-900/40 border-slate-800/80 backdrop-blur-md'
        : 'bg-white/70 border-slate-200/80 backdrop-blur-md shadow-sm'
    }`}>
      {/* Search & Main Selectors Row */}
      <div className="flex flex-col md:flex-row gap-2.5 sm:gap-3 items-stretch md:items-center justify-between">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className={`w-full pl-9 pr-9 py-2 rounded-xl text-xs sm:text-sm border transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
              theme === 'dark'
                ? 'bg-slate-950/60 border-slate-800 text-slate-100 placeholder:text-slate-500'
                : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400'
            }`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Controls Row (Horizontal scroll on narrow mobile screens) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
          
          {/* Type Segmented Buttons */}
          <div className={`flex items-center p-1 rounded-xl border ${
            theme === 'dark' ? 'bg-slate-950/50 border-slate-800/80' : 'bg-slate-100 border-slate-200'
          }`}>
            {(['all', 'task', 'habit'] as const).map((type) => {
              const label = type === 'all' ? t.allTypes : type === 'task' ? t.tasksOnly : t.habitsOnly;
              return (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    selectedType === type
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : theme === 'dark'
                        ? 'text-slate-400 hover:text-slate-200'
                        : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Priority Filter */}
          <div className={`flex items-center p-1 rounded-xl border ${
            theme === 'dark' ? 'bg-slate-950/50 border-slate-800/80' : 'bg-slate-100 border-slate-200'
          }`}>
            {(['all', 'high', 'medium', 'low'] as const).map((priority) => {
              const label = priority === 'all' 
                ? t.priority 
                : priority === 'high' ? t.highPriority.split(' ')[0] 
                : priority === 'medium' ? t.mediumPriority.split(' ')[0] 
                : t.lowPriority.split(' ')[0];

              return (
                <button
                  key={priority}
                  onClick={() => setSelectedPriority(priority)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    selectedPriority === priority
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : theme === 'dark'
                        ? 'text-slate-400 hover:text-slate-200'
                        : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Sort Dropdown */}
          <div className="relative flex items-center">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium ${
              theme === 'dark' ? 'bg-slate-950/50 border-slate-800/80 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
            }`}>
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'time' | 'priority' | 'title' | 'streak')}
                className="bg-transparent border-none focus:outline-none cursor-pointer pr-1"
              >
                <option value="time" className="bg-slate-900 text-white">{t.sortSchedule}</option>
                <option value="priority" className="bg-slate-900 text-white">{t.sortPriority}</option>
                <option value="title" className="bg-slate-900 text-white">{t.sortTitle}</option>
                <option value="streak" className="bg-slate-900 text-white">{t.sortStreak}</option>
              </select>
            </div>
          </div>

        </div>

      </div>

      {/* Categories Horizontal Filter Strip */}
      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-800/40 overflow-x-auto text-xs">
        <span className="text-slate-500 font-medium whitespace-nowrap flex items-center gap-1">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          {t.categoriesLabel}
        </span>
        
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-2.5 py-1 rounded-lg font-medium transition-all whitespace-nowrap ${
            selectedCategory === 'all'
              ? 'bg-indigo-600 text-white shadow-sm'
              : theme === 'dark'
                ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          {t.allCategories} ({Object.values(countsByCategory).reduce((a, b) => a + b, 0)})
        </button>

        {categories.map((cat) => {
          const count = countsByCategory[cat.name] || 0;
          const isSelected = selectedCategory.toLowerCase() === cat.name.toLowerCase();
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(isSelected ? 'all' : cat.name)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium transition-all whitespace-nowrap ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : theme === 'dark'
                    ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: cat.color }}
              />
              <span>{formatCategoryName(cat.name, language)}</span>
              <span className={`text-[10px] tabular-nums ${isSelected ? 'text-white/80' : 'text-slate-500'}`}>
                ({count})
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
