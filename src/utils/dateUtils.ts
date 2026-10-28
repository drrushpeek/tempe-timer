import { RecurrenceCadence } from '../types';

export function getTodayDateStr(): string {
  const d = new Date();
  return d.toISOString().split('T')[0];
}

export function formatDateStr(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function getPastNDays(n: number): { dateStr: string; dayName: string; dayNumber: number; isToday: boolean; isWeekend: boolean }[] {
  const days = [];
  const todayStr = getTodayDateStr();
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = formatDateStr(d);
    const dayOfWeek = d.getDay();

    days.push({
      dateStr,
      dayName: dayNames[dayOfWeek],
      dayNumber: d.getDate(),
      isToday: dateStr === todayStr,
      isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
    });
  }
  return days;
}

export function formatDisplayDate(dateStr?: string): string {
  if (!dateStr) return '';
  const todayStr = getTodayDateStr();
  if (dateStr === todayStr) return 'Today';

  const [y, m, d] = dateStr.split('-').map(Number);
  const target = new Date(y, m - 1, d);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (dateStr === formatDateStr(tomorrow)) return 'Tomorrow';

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  if (dateStr === formatDateStr(yesterday)) return 'Yesterday';

  return target.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function isHabitScheduledForDate(cadence: RecurrenceCadence, date: Date): boolean {
  if (cadence === 'none') return true;
  if (cadence === 'daily') return true;
  const day = date.getDay(); // 0 is Sunday, 6 is Saturday
  const isWeekend = day === 0 || day === 6;

  if (cadence === 'weekdays') return !isWeekend;
  if (cadence === 'weekends') return isWeekend;
  if (cadence === 'weekly') return day === 1; // e.g. Mondays
  return true;
}

export function calculateHabitStreaks(
  habitHistory: Record<string, boolean>,
  cadence: RecurrenceCadence
): { currentStreak: number; bestStreak: number } {
  let currentStreak = 0;
  let bestStreak = 0;
  let runningStreak = 0;

  // Evaluate backwards from today or yesterday
  const today = new Date();
  const todayStr = getTodayDateStr();
  const isTodayDue = isHabitScheduledForDate(cadence, today);
  const doneToday = !!habitHistory[todayStr];

  // Start from today if done, or check yesterday
  let checkDate = new Date();
  if (!doneToday && isTodayDue) {
    // If today is due and not done yet, current streak might still be intact from yesterday
    checkDate.setDate(checkDate.getDate() - 1);
  } else if (doneToday) {
    currentStreak = 1;
    checkDate.setDate(checkDate.getDate() - 1);
  }

  // Count backwards for current streak
  for (let i = 0; i < 365; i++) {
    const isDue = isHabitScheduledForDate(cadence, checkDate);
    if (!isDue) {
      // Not scheduled day; skip without breaking streak
      checkDate.setDate(checkDate.getDate() - 1);
      continue;
    }
    const dStr = formatDateStr(checkDate);
    if (habitHistory[dStr]) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  // Calculate best streak over the past 90 days
  const pastDays = 90;
  for (let i = pastDays; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const isDue = isHabitScheduledForDate(cadence, d);
    if (!isDue) continue;

    const dStr = formatDateStr(d);
    if (habitHistory[dStr]) {
      runningStreak++;
      if (runningStreak > bestStreak) {
        bestStreak = runningStreak;
      }
    } else {
      runningStreak = 0;
    }
  }

  if (currentStreak > bestStreak) {
    bestStreak = currentStreak;
  }

  return { currentStreak, bestStreak };
}
