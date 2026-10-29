import React, { useState, useEffect } from 'react';
import { Category, RecurrenceCadence, Subtask, TaskItem, TaskPriority, TaskType } from '../types';
import { Language, translations } from '../utils/i18n';
import { getTodayDateStr } from '../utils/dateUtils';
import { 
  X, 
  Trash2, 
  Repeat, 
  ListTodo,
  Plus,
  Check
} from 'lucide-react';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: TaskItem) => void;
  categories: Category[];
  onAddCategory: (category: Category) => void;
  initialTask?: TaskItem | null;
  defaultType?: TaskType;
  theme: 'dark' | 'light';
  language: Language;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  categories,
  onAddCategory,
  initialTask,
  defaultType = 'task',
  theme,
  language,
}) => {
  const t = translations[language];
  const [type, setType] = useState<TaskType>(defaultType);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [category, setCategory] = useState<string>('Work');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [estimatedMinutes, setEstimatedMinutes] = useState<number>(30);
  const [timeSlot, setTimeSlot] = useState<string>('');
  const [deadline, setDeadline] = useState<string>(getTodayDateStr());
  const [recurrence, setRecurrence] = useState<RecurrenceCadence>('daily');
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState<string>('');

  // Custom Category Creation State
  const [isAddingCategory, setIsAddingCategory] = useState<boolean>(false);
  const [newCategoryName, setNewCategoryName] = useState<string>('');
  const [newCategoryColor, setNewCategoryColor] = useState<string>('#8b5cf6');

  useEffect(() => {
    if (initialTask) {
      setType(initialTask.type);
      setTitle(initialTask.title);
      setDescription(initialTask.description || '');
      setCategory(initialTask.category);
      setPriority(initialTask.priority);
      setEstimatedMinutes(initialTask.estimatedMinutes || 30);
      setTimeSlot(initialTask.timeSlot || '');
      setDeadline(initialTask.deadline || getTodayDateStr());
      setRecurrence(initialTask.recurrence || 'daily');
      setSubtasks(initialTask.subtasks || []);
    } else {
      setType(defaultType);
      setTitle('');
      setDescription('');
      setCategory(categories[0]?.name || 'Work');
      setPriority('medium');
      setEstimatedMinutes(30);
      setTimeSlot('');
      setDeadline(getTodayDateStr());
      setRecurrence(defaultType === 'habit' ? 'daily' : 'none');
      setSubtasks([]);
    }
  }, [initialTask, defaultType, categories, isOpen]);

  if (!isOpen) return null;

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    setSubtasks([
      ...subtasks,
      {
        id: `sub-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        title: newSubtaskTitle.trim(),
        completed: false,
      },
    ]);
    setNewSubtaskTitle('');
  };

  const handleRemoveSubtask = (id: string) => {
    setSubtasks(subtasks.filter((s) => s.id !== id));
  };

  const handleCreateCategory = () => {
    if (!newCategoryName.trim()) return;
    const newCat: Category = {
      id: `cat-${Date.now()}`,
      name: newCategoryName.trim(),
      color: newCategoryColor,
    };
    onAddCategory(newCat);
    setCategory(newCat.name);
    setNewCategoryName('');
    setIsAddingCategory(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const taskItem: TaskItem = {
      id: initialTask?.id || `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: title.trim(),
      description: description.trim() || undefined,
      type,
      category,
      priority,
      subtasks,
      estimatedMinutes: Number(estimatedMinutes) || 0,
      timeSlot: timeSlot.trim() || undefined,
      deadline: type === 'task' ? deadline : undefined,
      recurrence: type === 'habit' ? recurrence : 'none',
      habitHistory: initialTask?.habitHistory || {},
      completed: initialTask?.completed || false,
      completedAt: initialTask?.completedAt,
      createdAt: initialTask?.createdAt || getTodayDateStr(),
    };

    onSave(taskItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className={`relative w-full max-w-lg max-h-[90vh] flex flex-col rounded-2xl sm:rounded-3xl border shadow-2xl overflow-hidden z-10 ${
        theme === 'dark'
          ? 'bg-slate-900 border-slate-700/80 text-slate-100'
          : 'bg-white border-slate-200 text-slate-900'
      }`}>
        
        {/* Modal Header (Fixed at top) */}
        <div className={`flex items-center justify-between p-4 sm:p-5 border-b shrink-0 ${
          theme === 'dark' ? 'border-slate-800/80 bg-slate-900' : 'border-slate-200/80 bg-white'
        }`}>
          <div>
            <h2 className="text-base sm:text-lg font-bold">
              {initialTask ? t.editTitle : (language === 'tr' ? 'Yeni Öğe Ekle' : t.createTitle)}
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
              {t.modalSubtitle}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body & Form */}
        <form id="task-form" onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          
          {/* Type Selector (Task vs Habit) */}
          <div className="flex items-center p-1 rounded-xl bg-slate-950/40 border border-slate-800/80">
            <button
              type="button"
              onClick={() => {
                setType('task');
                setRecurrence('none');
              }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                type === 'task'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ListTodo className="w-3.5 h-3.5" />
              <span>{t.standardTask}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setType('habit');
                setRecurrence('daily');
              }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                type === 'habit'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Repeat className="w-3.5 h-3.5" />
              <span>{t.recurringHabit}</span>
            </button>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              {t.titleLabel} <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={type === 'habit' ? (language === 'tr' ? 'Örn: Sabah 20 dk Koşu veya Kitap Okuma' : 'e.g., Morning 20-min Cold Shower or Run') : (language === 'tr' ? 'Örn: v2 sürüm mimarisini tamamla' : 'e.g., Ship production v2 release')}
              className={`w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm border transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
                theme === 'dark'
                  ? 'bg-slate-950/60 border-slate-800 text-slate-100 placeholder:text-slate-600'
                  : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400'
              }`}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              {t.descLabel}
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={language === 'tr' ? 'Detaylar, notlar veya hedefler...' : 'Context, requirements, links or mental prompts...'}
              className={`w-full px-3.5 py-2 rounded-xl text-xs border transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none ${
                theme === 'dark'
                  ? 'bg-slate-950/60 border-slate-800 text-slate-100 placeholder:text-slate-600'
                  : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400'
              }`}
            />
          </div>

          {/* Category Selection + Inline Category Creator */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-400">{t.categoryLabel}</label>
              <button
                type="button"
                onClick={() => setIsAddingCategory(!isAddingCategory)}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium"
              >
                {isAddingCategory ? t.cancelBtn : t.newCategory}
              </button>
            </div>

            {isAddingCategory && (
              <div className="p-3 mb-2.5 rounded-xl border border-indigo-500/30 bg-indigo-950/20 flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  placeholder={language === 'tr' ? 'Kategori Adı' : 'Category Name'}
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="px-2.5 py-1 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white flex-1 min-w-[120px]"
                />
                <input
                  type="color"
                  value={newCategoryColor}
                  onChange={(e) => setNewCategoryColor(e.target.value)}
                  className="w-7 h-7 rounded border-none cursor-pointer bg-transparent"
                />
                <button
                  type="button"
                  onClick={handleCreateCategory}
                  className="px-2.5 py-1 bg-indigo-600 text-white text-xs font-medium rounded-lg"
                >
                  {t.saveCat}
                </button>
              </div>
            )}

            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => {
                const isSelected = category.toLowerCase() === cat.name.toLowerCase();
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.name)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-600/20 text-indigo-300 font-semibold'
                        : theme === 'dark'
                          ? 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span>{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Priority Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">{t.priorityLabel}</label>
            <div className="grid grid-cols-3 gap-2">
              {(['high', 'medium', 'low'] as const).map((p) => {
                const isSelected = priority === p;
                const label = p === 'high' ? t.highPriority : p === 'medium' ? t.mediumPriority : t.lowPriority;
                const colors = {
                  high: isSelected ? 'bg-rose-500/20 border-rose-500 text-rose-300' : 'text-slate-400 border-slate-800 hover:border-slate-700',
                  medium: isSelected ? 'bg-amber-500/20 border-amber-500 text-amber-300' : 'text-slate-400 border-slate-800 hover:border-slate-700',
                  low: isSelected ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' : 'text-slate-400 border-slate-800 hover:border-slate-700',
                }[p];

                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`py-1.5 px-2 rounded-xl text-xs font-semibold capitalize border transition-all text-center ${colors}`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time & Schedule Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            
            {/* Estimated Minutes */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                {t.estimatedTimeLabel}
              </label>
              <div className="flex items-center gap-1.5">
                {[15, 30, 45, 60].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setEstimatedMinutes(mins)}
                    className={`px-2 py-1 rounded-lg text-xs font-mono tabular-nums border transition-all ${
                      estimatedMinutes === mins
                        ? 'bg-indigo-600 text-white border-indigo-500'
                        : theme === 'dark' ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>
            </div>

            {/* Time Slot */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                {t.timeSlotLabel}
              </label>
              <input
                type="text"
                placeholder="e.g. 09:00 - 10:00"
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className={`w-full px-3 py-1.5 rounded-xl text-xs border focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                  theme === 'dark' ? 'bg-slate-950/60 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
                }`}
              />
            </div>

            {/* Recurrence (for habits) */}
            {type === 'habit' && (
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  {t.recurrenceLabel}
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['daily', 'weekdays', 'weekends', 'weekly'] as const).map((cadence) => {
                    const label = cadence === 'daily' 
                      ? t.daily 
                      : cadence === 'weekdays' 
                        ? t.weekdays 
                        : cadence === 'weekends' 
                          ? t.weekends 
                          : t.weekly;
                    return (
                      <button
                        key={cadence}
                        type="button"
                        onClick={() => setRecurrence(cadence)}
                        className={`py-1.5 px-2 rounded-lg text-xs font-medium capitalize border transition-all ${
                          recurrence === cadence
                            ? 'bg-indigo-600 text-white border-indigo-500 font-semibold'
                            : theme === 'dark' ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-600'
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Deadline (for standard tasks) */}
            {type === 'task' && (
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  {t.deadlineLabel}
                </label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className={`w-full px-3 py-1.5 rounded-xl text-xs border focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                    theme === 'dark' ? 'bg-slate-950/60 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
                  }`}
                />
              </div>
            )}

          </div>

          {/* Subtasks Builder */}
          <div className="pt-2 border-t border-slate-800/40">
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              {t.subtasksLabel} ({subtasks.length})
            </label>

            {/* Subtask input bar */}
            <div className="flex items-center gap-2 mb-2">
              <input
                type="text"
                placeholder={t.addSubtaskPlaceholder}
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubtask();
                  }
                }}
                className={`flex-1 px-3 py-1.5 rounded-xl text-xs border focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                  theme === 'dark' ? 'bg-slate-950/60 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
                }`}
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                className="px-3 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-500 transition-colors shrink-0"
              >
                {t.addBtn}
              </button>
            </div>

            {/* Subtask Items */}
            {subtasks.length > 0 && (
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {subtasks.map((sub) => (
                  <div
                    key={sub.id}
                    className={`flex items-center justify-between gap-2 p-2 rounded-lg border text-xs ${
                      theme === 'dark' ? 'bg-slate-950/40 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <span className="truncate">{sub.title}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubtask(sub.id)}
                      className="text-slate-500 hover:text-rose-400 transition-colors p-0.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          </div>

          {/* Form Actions (Sticky Footer - Always Visible at the bottom) */}
          <div className={`p-3.5 sm:p-4 px-4 sm:px-6 border-t shrink-0 flex items-center justify-between sm:justify-end gap-3 ${
            theme === 'dark' ? 'bg-slate-900 border-slate-800/80' : 'bg-slate-50 border-slate-200/80'
          }`}>
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                theme === 'dark' ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              {t.cancelBtn}
            </button>
            <button
              type="submit"
              className="flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
            >
              {initialTask ? (
                <>
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>{t.updateItemBtn}</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>{language === 'tr' ? 'Yeni Öğe Ekle' : t.createItemBtn}</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
