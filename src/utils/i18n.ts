export type Language = 'en' | 'tr';

export const translations = {
  en: {
    // Brand
    brandName: 'Tempo',
    tagline: 'Modern To-Do & Habit Tracking System',

    // Navigation Tabs
    navFocus: "Today's Focus",
    navAll: 'All Items',
    navHabits: 'Habit Matrix',
    navAnalytics: 'Weekly Analytics',
    navSummaries: 'Daily Summaries',

    // Header Actions
    dailyReportBtn: 'Daily Report',
    newItemBtn: 'New Item',
    muteSound: 'Mute sound effects',
    enableSound: 'Enable audio feedback',
    switchToLight: 'Switch to light mode',
    switchToDark: 'Switch to dark mode',
    switchLanguage: 'Dili Değiştir (TR)',

    // Main Headers
    focusTitle: "Today's Focus & Daily Rituals",
    focusSubtitle: '{count} item{plural} remaining for today · Stay in the flow',
    allTitle: 'Master Task & Habit Inventory',
    allSubtitle: 'Organize, schedule, and track all recurring routines and priority tasks',
    quickAddPlaceholder: "Quick add: 'Evening 20m Read' or 'Deploy v2'...",

    // Filter Bar
    searchPlaceholder: 'Search tasks, habits, subtasks...',
    allTypes: 'All Types',
    tasksOnly: 'Tasks',
    habitsOnly: 'Habits',
    priority: 'Priority',
    allPriority: 'All Priorities',
    sortSchedule: 'Sort: Schedule / Due',
    sortPriority: 'Sort: Priority',
    sortTitle: 'Sort: Title',
    sortStreak: 'Sort: Streak',
    categoriesLabel: 'Categories:',
    allCategories: 'All',

    // Priorities
    highPriority: 'High Priority',
    mediumPriority: 'Medium',
    lowPriority: 'Low',

    // Recurrence
    daily: 'Daily',
    weekdays: 'Weekdays',
    weekends: 'Weekends',
    weekly: 'Weekly',
    none: 'None',

    // Card Details
    subtasks: 'subtasks',
    dayStreak: 'day streak',
    best: 'Best',
    est: 'est',
    dueToday: 'Today',
    dueTomorrow: 'Tomorrow',
    dueYesterday: 'Yesterday',
    viewSubtasks: 'View',
    hideSubtasks: 'Hide',
    edit: 'Edit',
    duplicate: 'Duplicate',
    delete: 'Delete',
    markComplete: 'Mark completed',
    markIncomplete: 'Mark incomplete',
    noItemsFound: 'No Items Match Your Filter',
    noItemsFoundDesc: 'Try clearing active filters or create a new task or recurring habit.',
    createNewItem: 'Create New Item',

    // Habit Matrix View
    matrixTitle: 'Habit Consistency Matrix',
    matrixSubtitle: '10-day historical tracking window. Click any cell to log or adjust completions retroactively.',
    logAllDueToday: 'Log All Due Today',
    addHabit: 'Add Habit',
    noHabitsTitle: 'No Habits Configured Yet',
    noHabitsDesc: 'Habits are recurring routines designed to build daily momentum. Create your first habit with cadence options.',
    createFirstHabit: 'Create First Habit',
    habitRoutine: 'Habit Routine',
    cadenceCol: 'Cadence',
    currentCol: 'Current',
    bestCol: 'Best',
    consistencyCol: '10-Day %',

    // Weekly Analytics View
    weeklyCompletionRate: 'Weekly Completion',
    completedActions: 'Completed Actions',
    acrossTasksHabits: 'Across tasks & recurring habits',
    longestStreak: 'Longest Streak',
    noActiveStreaks: 'No active streaks',
    activeCategories: 'Active Categories',
    balancedFocus: 'Balanced focus distribution',
    sevenDayVelocity: '7-Day Activity & Velocity',
    sevenDayVelocityDesc: 'Daily completions separated by standard tasks and recurring habit routines.',
    categoryCompletionRates: 'Category Completion Rates',
    priorityExecutionBreakdown: 'Priority Execution Breakdown',
    aiSuggestionsTitle: 'AI-Driven Suggestions for Next Week',
    aiSuggestionsSubtitle: 'Pattern-matched recommendations derived from your actual completion cadence.',
    deepAiCoaching: 'Deep AI Coaching',
    synthesizing: 'Synthesizing...',
    tailoredCoaching: 'Tailored Productivity Coaching',
    tapToInspectDay: 'Tap any column to inspect day details',
    dayBreakdownTitle: 'Day Breakdown',

    // AI Coaching Sections
    aiCoachHeader: 'Deep Task Intelligence & AI Coaching',
    aiCoachSubtitle: 'Personalized strategic advice formulated directly from your active tasks and habit rhythms.',
    topPriorityTitle: '#1 Critical Needle-Mover',
    deadlinesTitle: 'Deadlines & Urgent Triage',
    habitsTitle: 'Habit Streaks & Keystone Routines',
    timeScheduleTitle: 'Optimal Time-Boxing Schedule',
    balanceTitle: 'Category & Energy Balance',
    goldenTipTitle: 'Weekly Golden Mindset Principle',

    // Daily Summary Modal & Reports
    dailySummaryTitle: 'Daily Summary & Insights',
    generatedForToday: 'Generated for today',
    productivityScore: 'Productivity Velocity Score',
    tasksLabel: 'Tasks',
    habitsLabel: 'Habits',
    focusLabel: 'Focus',
    todaysAccomplishments: "Today's Accomplishments",
    aiInsightTitle: 'AI Motivational Insight',
    copyReport: 'Copy Report',
    copiedReport: 'Copied Markdown',
    saveToHistory: 'Save to History',
    saved: 'Saved!',
    close: 'Close',
    dailySummaryReports: 'Daily Summary Reports',
    historicalArchives: 'Historical performance archives & productivity logs',
    generateNewSummary: 'Generate New Summary',
    noSummariesYet: 'No Daily Summaries Generated Yet',
    noSummariesDesc: 'Generate your end-of-day summary to track productivity scores, accomplishments, and motivational insights over time.',
    generateTodaysSummary: "Generate Today's Summary",

    // Task Modal
    createTitle: 'Create New Item',
    editTitle: 'Edit Item',
    modalSubtitle: 'Configure parameters, cadence, subtasks, and category tags.',
    standardTask: 'Standard Task',
    recurringHabit: 'Recurring Habit',
    titleLabel: 'Title',
    descLabel: 'Description / Notes (Optional)',
    categoryLabel: 'Category',
    newCategory: '+ New Category',
    saveCat: 'Save',
    priorityLabel: 'Priority',
    estimatedTimeLabel: 'Estimated Time (mins)',
    timeSlotLabel: 'Time Slot (Optional)',
    recurrenceLabel: 'Recurrence Cadence',
    deadlineLabel: 'Target Deadline',
    subtasksLabel: 'Subtasks',
    addSubtaskPlaceholder: 'Add subtask and press Enter...',
    addBtn: 'Add',
    cancelBtn: 'Cancel',
    saveItemBtn: 'Save Item',
    createItemBtn: 'Create Item',
    updateItemBtn: 'Update Item',
  },

  tr: {
    // Brand
    brandName: 'Tempo',
    tagline: 'Modern Yapılacaklar ve Alışkanlık Takip Sistemi',

    // Navigation Tabs
    navFocus: 'Bugünün Odakları',
    navAll: 'Tüm Görevler',
    navHabits: 'Alışkanlık Matrisi',
    navAnalytics: 'Haftalık Analiz',
    navSummaries: 'Günlük Raporlar',

    // Header Actions
    dailyReportBtn: 'Günlük Rapor',
    newItemBtn: 'Yeni Ekle',
    muteSound: 'Sesi Kapat',
    enableSound: 'Sesi Aç',
    switchToLight: 'Aydınlık Moda Geç',
    switchToDark: 'Karanlık Moda Geç',
    switchLanguage: 'Switch to English (EN)',

    // Main Headers
    focusTitle: 'Bugünün Odakları ve Günlük Rutinler',
    focusSubtitle: 'Bugün tamamlanacak {count} öğe kaldı · Akışta kalın',
    allTitle: 'Tüm Görev ve Alışkanlık Envanteri',
    allSubtitle: 'Tekrarlayan rutinlerinizi ve öncelikli görevlerinizi organize edin ve takip edin',
    quickAddPlaceholder: "Hızlı ekle: 'Akşam 20 dk Kitap Oku' veya 'v2 Sürümünü Yayınla'...",

    // Filter Bar
    searchPlaceholder: 'Görev, alışkanlık veya alt görevlerde ara...',
    allTypes: 'Tüm Tipler',
    tasksOnly: 'Görevler',
    habitsOnly: 'Alışkanlıklar',
    priority: 'Öncelik',
    allPriority: 'Tüm Öncelikler',
    sortSchedule: 'Sırala: Zaman / Tarih',
    sortPriority: 'Sırala: Öncelik',
    sortTitle: 'Sırala: Başlık',
    sortStreak: 'Sırala: Seri (Streak)',
    categoriesLabel: 'Kategoriler:',
    allCategories: 'Tümü',

    // Priorities
    highPriority: 'Yüksek Öncelik',
    mediumPriority: 'Orta Öncelik',
    lowPriority: 'Düşük Öncelik',

    // Recurrence
    daily: 'Günlük',
    weekdays: 'Hafta İçi',
    weekends: 'Hafta Sonu',
    weekly: 'Haftalık',
    none: 'Tek Seferlik',

    // Card Details
    subtasks: 'alt görev',
    dayStreak: 'günlük seri',
    best: 'En iyi',
    est: 'tahmin',
    dueToday: 'Bugün',
    dueTomorrow: 'Yarın',
    dueYesterday: 'Dün',
    viewSubtasks: 'Göster',
    hideSubtasks: 'Gizle',
    edit: 'Düzenle',
    duplicate: 'Kopyala',
    delete: 'Sil',
    markComplete: 'Tamamlandı işaretle',
    markIncomplete: 'Geri al',
    noItemsFound: 'Filtreye Uygun Öğe Bulunamadı',
    noItemsFoundDesc: 'Aktif filtreleri temizlemeyi deneyin veya yeni bir görev/alışkanlık ekleyin.',
    createNewItem: 'Yeni Öğe Oluştur',

    // Habit Matrix View
    matrixTitle: 'Alışkanlık Devamlılık Matrisi',
    matrixSubtitle: '10 günlük geçmiş takip görünümü. Geçmişi veya bugünü işaretlemek için hücrelere tıklayın.',
    logAllDueToday: 'Bugünküleri Tamamla',
    addHabit: 'Alışkanlık Ekle',
    noHabitsTitle: 'Henüz Alışkanlık Eklenmedi',
    noHabitsDesc: 'Alışkanlıklar günlük ivme kazanmanızı sağlayan rutinlerdir. Günlük veya hafta içi gibi seçeneklerle ilk alışkanlığınızı ekleyin.',
    createFirstHabit: 'İlk Alışkanlığı Oluştur',
    habitRoutine: 'Alışkanlık Rutini',
    cadenceCol: 'Düzen',
    currentCol: 'Mevcut',
    bestCol: 'En İyi',
    consistencyCol: '10 Günlük %',

    // Weekly Analytics View
    weeklyCompletionRate: 'Haftalık Tamamlama Oranı',
    completedActions: 'Tamamlanan Aksiyonlar',
    acrossTasksHabits: 'Görev ve alışkanlıklar toplamı',
    longestStreak: 'En Uzun Seri',
    noActiveStreaks: 'Aktif seri yok',
    activeCategories: 'Aktif Kategoriler',
    balancedFocus: 'Dengeli odak dağılımı',
    sevenDayVelocity: '7 Günlük Aktivite & Hız',
    sevenDayVelocityDesc: 'Standart görevler ve tekrarlayan alışkanlıkların günlere göre dağılımı.',
    categoryCompletionRates: 'Kategori Başarı Oranları',
    priorityExecutionBreakdown: 'Öncelik Seviyesi Dağılımı',
    aiSuggestionsTitle: 'Gelecek Hafta İçin Yapay Zeka Tavsiyeleri',
    aiSuggestionsSubtitle: 'Gerçekleşen tamamlama ritminize göre oluşturulan akıllı öneriler.',
    deepAiCoaching: 'Derin AI Koçluğu',
    synthesizing: 'Görevler İnceleniyor...',
    tailoredCoaching: 'Görevlerinize Özel AI Tavsiyeleri',
    tapToInspectDay: 'Günün detayını görmek için bir sütuna dokunun',
    dayBreakdownTitle: 'Seçili Günün Detayı',

    // AI Coaching Sections
    aiCoachHeader: 'Görevlere Özel Gelişmiş AI Analizi & Koçluk',
    aiCoachSubtitle: 'Mevcut görevlerinizi, önceliklerinizi ve alışkanlık serinizi derinlemesine inceleyen yapay zeka rehberi.',
    topPriorityTitle: '🎯 Günün 1 Numaralı Kritik Görevi',
    deadlinesTitle: '⏰ Teslim Tarihi & Aciliyet Alarmı',
    habitsTitle: '⚡ Alışkanlık Zinciri & Seri Koruma',
    timeScheduleTitle: '⏱️ Akıllı Zaman Bloklama & Odak Planı',
    balanceTitle: '⚖️ Kategori Dengesi & Zihinsel Enerji',
    goldenTipTitle: '💡 Haftalık Altın Koçluk Prensibi',

    // Daily Summary Modal & Reports
    dailySummaryTitle: 'Günlük Özet & İçgörüler',
    generatedForToday: 'Bugün için üretildi',
    productivityScore: 'Üretkenlik Hız Puanı',
    tasksLabel: 'Görevler',
    habitsLabel: 'Alışkanlıklar',
    focusLabel: 'Odak',
    todaysAccomplishments: 'Günün Başarıları',
    aiInsightTitle: 'Yapay Zeka Motivasyon Notu',
    copyReport: 'Raporu Kopyala',
    copiedReport: 'Markdown Kopyalandı',
    saveToHistory: 'Geçmişe Kaydet',
    saved: 'Kaydedildi!',
    close: 'Kapat',
    dailySummaryReports: 'Gün Sonu Özet Raporları',
    historicalArchives: 'Geçmiş performans arşivleri ve günlük loglar',
    generateNewSummary: 'Yeni Özet Oluştur',
    noSummariesYet: 'Henüz Günlük Özet Üretilmedi',
    noSummariesDesc: 'Üretkenlik puanınızı, başarılarınızı ve motivasyonel içgörüleri zaman içinde takip etmek için gün sonu özeti oluşturun.',
    generateTodaysSummary: "Bugünün Özetini Üret",

    // Task Modal
    createTitle: 'Yeni Öğe Ekle',
    editTitle: 'Öğeyi Düzenle',
    modalSubtitle: 'Parametreleri, tekrar düzenini, alt görevleri ve kategoriyi belirleyin.',
    standardTask: 'Standart Görev',
    recurringHabit: 'Tekrarlayan Alışkanlık',
    titleLabel: 'Başlık',
    descLabel: 'Açıklama / Notlar (İsteğe Bağlı)',
    categoryLabel: 'Kategori',
    newCategory: '+ Yeni Kategori',
    saveCat: 'Kaydet',
    priorityLabel: 'Öncelik',
    estimatedTimeLabel: 'Tahmini Süre (dakika)',
    timeSlotLabel: 'Zaman Dilimi (İsteğe Bağlı)',
    recurrenceLabel: 'Tekrarlama Düzeni',
    deadlineLabel: 'Son Teslim Tarihi',
    subtasksLabel: 'Alt Görevler',
    addSubtaskPlaceholder: 'Alt görev yazıp Enter tuşuna basın...',
    addBtn: 'Ekle',
    cancelBtn: 'İptal',
    saveItemBtn: 'Öğeyi Kaydet',
    createItemBtn: 'Yeni Öğe Ekle',
    updateItemBtn: 'Güncelle',
  },
};

// Comprehensive bidirectional category translations & normalizer
export const CATEGORY_TRANSLATIONS: Record<string, { en: string; tr: string }> = {
  // Work
  work: { en: 'Work', tr: 'İş' },
  iş: { en: 'Work', tr: 'İş' },
  is: { en: 'Work', tr: 'İş' },

  // Personal
  personal: { en: 'Personal', tr: 'Kişisel' },
  kişisel: { en: 'Personal', tr: 'Kişisel' },
  kisisel: { en: 'Personal', tr: 'Kişisel' },

  // Fitness / Sport
  fitness: { en: 'Fitness', tr: 'Spor' },
  spor: { en: 'Fitness', tr: 'Spor' },
  sport: { en: 'Fitness', tr: 'Spor' },

  // Study / Education / Course
  study: { en: 'Study', tr: 'Eğitim' },
  eğitim: { en: 'Study', tr: 'Eğitim' },
  egitim: { en: 'Study', tr: 'Eğitim' },
  ders: { en: 'Study', tr: 'Ders' },
  kurs: { en: 'Course', tr: 'Kurs' },

  // Health
  health: { en: 'Health', tr: 'Sağlık' },
  sağlık: { en: 'Health', tr: 'Sağlık' },
  saglik: { en: 'Health', tr: 'Sağlık' },

  // Finance
  finance: { en: 'Finance', tr: 'Finans' },
  finans: { en: 'Finance', tr: 'Finans' },

  // Home
  home: { en: 'Home', tr: 'Ev' },
  ev: { en: 'Home', tr: 'Ev' },

  // Code / Software
  code: { en: 'Code', tr: 'Yazılım' },
  yazılım: { en: 'Code', tr: 'Yazılım' },
  yazilim: { en: 'Code', tr: 'Yazılım' },

  // Books / Reading
  reading: { en: 'Reading', tr: 'Okuma' },
  okuma: { en: 'Reading', tr: 'Okuma' },
  kitap: { en: 'Books', tr: 'Kitap' },

  // Project
  project: { en: 'Project', tr: 'Proje' },
  proje: { en: 'Project', tr: 'Proje' },
};

function normalizeCatKey(name: string): string {
  return name.trim().toLowerCase().replace(/ı/g, 'i').replace(/İ/g, 'i').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ö/g, 'o').replace(/ç/g, 'c');
}

export function formatCategoryName(name: string, lang: Language): string {
  if (!name) return '';
  const lower = name.trim().toLowerCase();
  if (CATEGORY_TRANSLATIONS[lower]) {
    return CATEGORY_TRANSLATIONS[lower][lang];
  }
  const normalized = normalizeCatKey(name);
  if (CATEGORY_TRANSLATIONS[normalized]) {
    return CATEGORY_TRANSLATIONS[normalized][lang];
  }
  return name;
}

export function areCategoriesEqual(catA: string, catB: string): boolean {
  if (!catA || !catB) return false;
  if (catA.toLowerCase().trim() === catB.toLowerCase().trim()) return true;
  
  const normA = normalizeCatKey(catA);
  const normB = normalizeCatKey(catB);
  if (normA === normB) return true;

  const transA = CATEGORY_TRANSLATIONS[catA.toLowerCase().trim()] || CATEGORY_TRANSLATIONS[normA];
  const transB = CATEGORY_TRANSLATIONS[catB.toLowerCase().trim()] || CATEGORY_TRANSLATIONS[normB];

  if (transA && transB && transA.en.toLowerCase() === transB.en.toLowerCase()) {
    return true;
  }
  return false;
}

export const DAY_TRANSLATIONS: Record<string, { en: string; tr: string; fullEn: string; fullTr: string }> = {
  Sun: { en: 'Sun', tr: 'Paz', fullEn: 'Sunday', fullTr: 'Pazar' },
  Mon: { en: 'Mon', tr: 'Pzt', fullEn: 'Monday', fullTr: 'Pazartesi' },
  Tue: { en: 'Tue', tr: 'Sal', fullEn: 'Tuesday', fullTr: 'Salı' },
  Wed: { en: 'Wed', tr: 'Çar', fullEn: 'Wednesday', fullTr: 'Çarşamba' },
  Thu: { en: 'Thu', tr: 'Per', fullEn: 'Thursday', fullTr: 'Perşembe' },
  Fri: { en: 'Fri', tr: 'Cum', fullEn: 'Friday', fullTr: 'Cuma' },
  Sat: { en: 'Sat', tr: 'Cmt', fullEn: 'Saturday', fullTr: 'Cumartesi' },
};

export function formatDayName(dayShort: string, lang: Language, full: boolean = false): string {
  const match = DAY_TRANSLATIONS[dayShort];
  if (match) {
    return full ? (lang === 'tr' ? match.fullTr : match.fullEn) : match[lang];
  }
  return dayShort;
}

const TR_MONTHS = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
const EN_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function formatDateLocale(dateStr: string, lang: Language): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length < 3) return dateStr;
  const monthIdx = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  if (lang === 'tr') {
    return `${day} ${TR_MONTHS[monthIdx] || parts[1]}`;
  }
  return `${EN_MONTHS[monthIdx] || parts[1]} ${day}`;
}
