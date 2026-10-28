import { Category, DailySummary, TaskItem } from '../types';
import { calculateHabitStreaks, getPastNDays, getTodayDateStr, isHabitScheduledForDate } from './dateUtils';
import { areCategoriesEqual } from './i18n';

export interface WeeklyStats {
  dailyActivity: {
    dateStr: string;
    dayName: string;
    dayNumber: number;
    tasksCompleted: number;
    habitsCompleted: number;
    totalCompleted: number;
    isToday: boolean;
  }[];
  overallCompletionRate: number;
  totalCompletedThisWeek: number;
  totalPlannedThisWeek: number;
  longestStreakHabit: { name: string; streak: number } | null;
  categoryStats: {
    name: string;
    color: string;
    total: number;
    completed: number;
    rate: number;
  }[];
  priorityStats: {
    priority: 'high' | 'medium' | 'low';
    total: number;
    completed: number;
    rate: number;
  }[];
  aiWeeklySuggestions: string[];
}

export function computeWeeklyAnalytics(tasks: TaskItem[], categories: Category[], lang: 'en' | 'tr' = 'tr'): WeeklyStats {
  const isTr = lang === 'tr';
  const past7Days = getPastNDays(7);
  let totalCompletedThisWeek = 0;
  let totalPlannedThisWeek = 0;

  const dailyActivity = past7Days.map((day) => {
    let tasksCompleted = 0;
    let habitsCompleted = 0;
    let totalScheduledForDay = 0;

    tasks.forEach((t) => {
      if (t.type === 'task') {
        // If task was completed on this date or created/due on this date
        if (t.completed && t.completedAt?.startsWith(day.dateStr)) {
          tasksCompleted++;
          totalCompletedThisWeek++;
        }
        if (t.deadline === day.dateStr || t.createdAt === day.dateStr) {
          totalScheduledForDay++;
        }
      } else {
        // Habit
        const [y, m, d] = day.dateStr.split('-').map(Number);
        const dayDate = new Date(y, m - 1, d);
        if (isHabitScheduledForDate(t.recurrence, dayDate)) {
          totalScheduledForDay++;
          if (t.habitHistory[day.dateStr]) {
            habitsCompleted++;
            totalCompletedThisWeek++;
          }
        }
      }
    });

    totalPlannedThisWeek += Math.max(totalScheduledForDay, tasksCompleted + habitsCompleted);

    return {
      dateStr: day.dateStr,
      dayName: day.dayName,
      dayNumber: day.dayNumber,
      tasksCompleted,
      habitsCompleted,
      totalCompleted: tasksCompleted + habitsCompleted,
      isToday: day.isToday,
    };
  });

  const overallCompletionRate = totalPlannedThisWeek > 0
    ? Math.min(100, Math.round((totalCompletedThisWeek / totalPlannedThisWeek) * 100))
    : 100;

  // Find longest streak habit
  let longestStreakHabit: { name: string; streak: number } | null = null;
  tasks.filter((t) => t.type === 'habit').forEach((h) => {
    const { currentStreak } = calculateHabitStreaks(h.habitHistory, h.recurrence);
    if (!longestStreakHabit || currentStreak > longestStreakHabit.streak) {
      longestStreakHabit = { name: h.title, streak: currentStreak };
    }
  });

  // Category stats
  const categoryStats = categories.map((cat) => {
    const catTasks = tasks.filter((t) => areCategoriesEqual(t.category, cat.name));
    let completed = 0;
    let total = catTasks.length;

    catTasks.forEach((t) => {
      if (t.type === 'task') {
        if (t.completed) completed++;
      } else {
        const todayStr = getTodayDateStr();
        if (t.habitHistory[todayStr]) completed++;
      }
    });

    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
    return {
      name: cat.name,
      color: cat.color,
      total,
      completed,
      rate,
    };
  }).filter((c) => c.total > 0);

  // Priority stats
  const priorities: ('high' | 'medium' | 'low')[] = ['high', 'medium', 'low'];
  const priorityStats = priorities.map((p) => {
    const pTasks = tasks.filter((t) => t.priority === p);
    let completed = 0;
    pTasks.forEach((t) => {
      if (t.type === 'task' && t.completed) completed++;
      if (t.type === 'habit' && t.habitHistory[getTodayDateStr()]) completed++;
    });
    const total = pTasks.length;
    return {
      priority: p,
      total,
      completed,
      rate: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  });

  // AI-driven suggestions for improvement next week
  const aiWeeklySuggestions: string[] = [];

  if (tasks.length === 0) {
    if (isTr) {
      aiWeeklySuggestions.push('İlk yüksek öncelikli görevinizi ekleyin; sistem bunu günün en verimli saatine planlamanızı önerecektir.');
      aiWeeklySuggestions.push('Rutin oluşturmak için sabah veya akşam 1 adet tekrarlayan alışkanlık ekleyin.');
    } else {
      aiWeeklySuggestions.push('Add your first high-priority task to receive personalized scheduling recommendations.');
      aiWeeklySuggestions.push('Establish a single recurring habit to start tracking daily consistency.');
    }
  } else {
    const highPriorityRate = priorityStats.find((p) => p.priority === 'high')?.rate ?? 100;
    if (highPriorityRate < 75) {
      aiWeeklySuggestions.push(
        isTr
          ? 'Yüksek öncelikli görevleriniz için her sabah e-postaları kontrol etmeden önce 60-90 dakikalık kesintisiz odak bloğu ayırın.'
          : 'Block 90 minutes of sacred calendar time each morning specifically for high-priority tasks before responding to messages.'
      );
    } else {
      aiWeeklySuggestions.push(
        isTr
          ? 'Yüksek öncelikli görevleri tamamlama oranınız oldukça güçlü! Bu ivmeyi günün ilk saatlerinde korumaya devam edin.'
          : 'Strong high-priority follow-through! Keep scheduling your primary needle-movers during your peak morning energy window.'
      );
    }

    const weekendDrops = dailyActivity.filter(d => (d.dayName === 'Sat' || d.dayName === 'Sun') && d.totalCompleted === 0);
    if (weekendDrops.length > 0) {
      aiWeeklySuggestions.push(
        isTr
          ? 'Hafta sonları alışkanlık devamlılığında düşüş görülüyor. Hafta sonu rutinlerini kahvaltı veya yürüyüş gibi keyifli anlara bağlayın.'
          : 'Habit consistency dips on weekends. Consider pairing weekend habits with morning rituals (like fresh brew coffee or post-breakfast walks).'
      );
    } else {
      aiWeeklySuggestions.push(
        isTr
          ? 'Hafta içi ve hafta sonu arasındaki istikrarınız takdire şayan. Rutinleriniz otomatikleşiyor.'
          : 'Remarkable 7-day consistency across both weekdays and weekends. Your automated rhythm is stabilizing.'
      );
    }

    const workCat = categoryStats.find((c) => areCategoriesEqual(c.name, 'work'));
    const fitnessCat = categoryStats.find((c) => areCategoriesEqual(c.name, 'fitness'));
    if (workCat && fitnessCat && workCat.completed > fitnessCat.completed * 3) {
      aiWeeklySuggestions.push(
        isTr
          ? 'İş görevleri spor ve yenilenme aktivitelerini 3 kat aştı. Öğleden sonralara 15 dakikalık hareket molası ekleyin.'
          : 'Work tasks outpaced recovery and fitness activities by 3:1. Introduce an afternoon mobility checkpoint next week.'
      );
    } else {
      aiWeeklySuggestions.push(
        isTr
          ? 'Kategoriler arasında dengeli bir dağılım var: çalışma, kişisel gelişim ve sağlık birbirini destekliyor.'
          : 'Balanced multi-category execution: work, learning, and self-care routines are supporting each other well.'
      );
    }

    aiWeeklySuggestions.push(
      isTr
        ? 'Temposu yüksek görevler için: 45 dakikayı aşan işleri en az 2 küçük alt göreve (subtask) bölerek zihinsel direnci kırın.'
        : 'Pacing tip: Break tasks longer than 60 minutes into 2 bite-sized subtasks with distinct milestone checkpoints.'
    );
  }

  return {
    dailyActivity,
    overallCompletionRate,
    totalCompletedThisWeek,
    totalPlannedThisWeek,
    longestStreakHabit,
    categoryStats,
    priorityStats,
    aiWeeklySuggestions,
  };
}

export function generateDailySummary(tasks: TaskItem[]): DailySummary {
  const todayStr = getTodayDateStr();
  const todayDate = new Date();

  const standardTasks = tasks.filter((t) => t.type === 'task');
  const habitItems = tasks.filter((t) => t.type === 'habit');

  const todayTasks = standardTasks.filter((t) => !t.deadline || t.deadline === todayStr || t.createdAt === todayStr);
  const completedTasks = todayTasks.filter((t) => t.completed).length;
  const totalTasks = Math.max(todayTasks.length, 1);

  const activeHabitsToday = habitItems.filter((h) => isHabitScheduledForDate(h.recurrence, todayDate));
  const habitsCompleted = activeHabitsToday.filter((h) => !!h.habitHistory[todayStr]).length;
  const habitsTotal = Math.max(activeHabitsToday.length, 1);

  // Focus minutes calculation
  let focusMinutes = 0;
  tasks.forEach((t) => {
    if (t.type === 'task' && t.completed && t.estimatedMinutes) {
      focusMinutes += t.estimatedMinutes;
    }
    if (t.type === 'habit' && t.habitHistory[todayStr] && t.estimatedMinutes) {
      focusMinutes += t.estimatedMinutes;
    }
  });

  // Productivity score calculation
  const taskWeight = 0.55;
  const habitWeight = 0.45;
  const taskScore = (completedTasks / totalTasks) * 100;
  const habitScore = (habitsCompleted / habitsTotal) * 100;
  const productivityScore = Math.min(100, Math.round(taskScore * taskWeight + habitScore * habitWeight));

  // Highlights
  const highlights: string[] = [];
  const completedNames = tasks
    .filter((t) => (t.type === 'task' && t.completed) || (t.type === 'habit' && t.habitHistory[todayStr]))
    .map((t) => t.title);

  if (completedNames.length > 0) {
    highlights.push(`Completed ${completedNames.length} essential items including "${completedNames[0]}"`);
  }
  if (focusMinutes > 0) {
    highlights.push(`Invested ${focusMinutes} minutes of focused cognitive effort today`);
  }
  if (habitsCompleted === habitsTotal && habitsTotal > 0) {
    highlights.push('Achieved 100% habit compliance across all scheduled daily rituals');
  } else {
    highlights.push(`${habitsCompleted} of ${habitsTotal} recurring habits logged`);
  }

  // Quotes
  const quotes = [
    '"We are what we repeatedly do. Excellence, then, is not an act, but a habit." — Will Durant',
    '"Small disciplines repeated with consistency every day lead to great achievements." — John C. Maxwell',
    '"Focus is a muscle. The more you protect your peak energy windows, the easier flow becomes." — Cal Newport',
    '"Action is the foundational key to all success." — Pablo Picasso',
    '"You do not rise to the level of your goals. You fall to the level of your systems." — James Clear',
  ];
  const motivationalQuote = quotes[Math.floor(Math.random() * quotes.length)];

  let aiInsight = '';
  if (productivityScore >= 80) {
    aiInsight = 'Outstanding execution day! You crushed high-leverage priorities with exceptional momentum. Carry this cadence into tomorrow morning.';
  } else if (productivityScore >= 50) {
    aiInsight = 'Solid progress made today. For uncompleted items, consider scheduling them directly into tomorrow morning’s primary calendar block.';
  } else {
    aiInsight = 'A lighter output day is often natural during high cognitive consolidation phases. Focus on getting restful sleep tonight and kickstart tomorrow with a 15-minute quick win.';
  }

  return {
    id: `summary-${todayStr}-${Date.now()}`,
    date: todayStr,
    totalTasks,
    completedTasks,
    habitsTotal,
    habitsCompleted,
    productivityScore,
    focusMinutes,
    highlights,
    motivationalQuote,
    aiInsight,
    createdAt: new Date().toISOString(),
  };
}
