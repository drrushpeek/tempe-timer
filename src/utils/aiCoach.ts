import { Category, TaskItem } from '../types';
import { calculateHabitStreaks, getTodayDateStr } from './dateUtils';
import { formatCategoryName, Language } from './i18n';

export interface StructuredAiAdvice {
  oneThing: {
    taskTitle: string;
    priority: 'high' | 'medium' | 'low';
    category: string;
    advice: string;
    subtaskTip?: string;
  } | null;
  urgency: {
    overdue: string[];
    dueToday: string[];
    triageAdvice: string;
  };
  habits: {
    topStreakHabit: { title: string; streak: number } | null;
    pendingHabitsToday: string[];
    stackingAdvice: string;
  };
  timeBoxing: {
    totalEstimatedMinutes: number;
    formattedTime: string;
    scheduleBlocks: { time: string; activity: string; type: 'focus' | 'break' | 'habit' }[];
  };
  balance: {
    dominantCategory: string;
    harmonyAdvice: string;
  };
  goldenPrinciple: string;
  fullMarkdown: string;
}

export async function generateDeepAiCoachingAdvice(
  tasks: TaskItem[],
  categories: Category[],
  lang: Language = 'tr'
): Promise<string> {
  const isTr = lang === 'tr';
  const todayStr = getTodayDateStr();

  // If no tasks exist at all
  if (tasks.length === 0) {
    if (isTr) {
      return `### 🧭 Akıllı Başlangıç ve Üretkenlik Rehberi

Henüz listenizde kayıtlı bir görev veya alışkanlık bulunmuyor. Maksimum ivme kazanmak için şu 3 pratik adımla başlayabilirsiniz:

1. 🎯 **Günün En Önemli 1 Görevi (The One Thing)**: Bugün bittiğinde sizi en çok rahatlatacak tek bir yüksek öncelikli işi yukarıdaki "+ Yeni Ekle" butonundan ekleyin.
2. ⚡ **1 Temel Alışkanlık (Keystone Habit)**: Güne enerjik başlamak için küçük bir rutin belirleyin (örneğin: 15 dk yürüyüş veya 20 dk kitap okuma).
3. ⏱️ **Zaman Sınırı Koyun**: Eklediğiniz göreve tahmini bir süre (örn. 30 veya 45 dakika) atayarak Parkinson Yasası'nın ve ertelemenin önüne geçin.

*Yeni görevlerinizi ekledikten sonra buraya tıklayarak gerçek görevlerinize dayalı derin yapay zeka analizi ve koçluk alabilirsiniz!*`;
    } else {
      return `### 🧭 Smart Starter & Productivity Guide

You don't have any tasks or habits in your workspace yet. Kickstart momentum with these 3 steps:

1. 🎯 **Identify Your 'One Thing'**: Add one high-priority needle-mover that will give you the highest sense of accomplishment today.
2. ⚡ **Establish One Keystone Habit**: Start small with a 15-minute daily routine (e.g., morning walk or 20m reading).
3. ⏱️ **Set a Time Bound**: Assign an estimated duration (e.g., 30 or 45 mins) to eliminate initiation friction.

*Add your first items and click here again for tailored AI coaching!*`;
    }
  }

  // Gather specific task intelligence
  const standardTasks = tasks.filter((t) => t.type === 'task');
  const habitItems = tasks.filter((t) => t.type === 'habit');

  const pendingTasks = standardTasks.filter((t) => !t.completed);
  const completedTasks = standardTasks.filter((t) => t.completed);

  const highPriorityPending = pendingTasks.filter((t) => t.priority === 'high');
  const mediumPriorityPending = pendingTasks.filter((t) => t.priority === 'medium');
  const lowPriorityPending = pendingTasks.filter((t) => t.priority === 'low');

  const overdueTasks = pendingTasks.filter((t) => t.deadline && t.deadline < todayStr);
  const dueTodayTasks = pendingTasks.filter((t) => t.deadline && t.deadline === todayStr);

  const totalPendingMinutes = pendingTasks.reduce((acc, t) => acc + (t.estimatedMinutes || 30), 0);

  // Habit metrics
  const habitsDoneToday = habitItems.filter((h) => !!h.habitHistory[todayStr]);
  const habitsPendingToday = habitItems.filter((h) => !h.habitHistory[todayStr]);

  const habitStreakDetails = habitItems.map((h) => {
    const { currentStreak, bestStreak } = calculateHabitStreaks(h.habitHistory, h.recurrence);
    return { habit: h, currentStreak, bestStreak };
  }).sort((a, b) => b.currentStreak - a.currentStreak);

  const topStreakHabit = habitStreakDetails[0];

  // Try Gemini AI API (gemini-3.8-flash) if configured
  try {
    const apiKey = typeof process !== 'undefined' ? process.env?.GEMINI_API_KEY : undefined;
    if (apiKey) {
      const { GoogleGenAI } = await import('@google/genai');
      const ai = new GoogleGenAI({ apiKey });

      const promptContext = `
You are an elite, hyper-practical executive productivity coach and behavioral scientist.
Analyze the user's REAL, CURRENT tasks and habits below and provide deeply personalized, actionable, concrete coaching in ${isTr ? 'Turkish' : 'English'}.

CRITICAL INSTRUCTIONS:
- You MUST mention specific tasks and habits by their EXACT names and priorities.
- Give concrete tactical advice (e.g. which task to do first, how to handle deadlines, time blocking, and habit-stacking).
- Keep the tone warm, encouraging, sharp, and structured with clean Markdown and emojis.
- Provide the response in these 6 sections:
  1. 🎯 Günün 1 Numaralı Kritik Görevi ("The One Thing")
  2. ⏰ Teslim Tarihi ve Aciliyet Alarmı (Triage)
  3. ⚡ Alışkanlık Zinciri & Seri Koruma
  4. ⏱️ Akıllı Zaman Bloklama & Günlük Akış Planı (Concrete hour-by-hour or sprint schedule)
  5. ⚖️ Kategori ve Bilişsel Denge (Work-life harmony)
  6. 💡 Bu Hafta İçin Altın Koçluk Prensibi

USER'S REAL DATA:
- Active Standard Tasks (${standardTasks.length} total, ${pendingTasks.length} pending, ${completedTasks.length} completed):
  Pending tasks:
  ${pendingTasks.map((t, idx) => `${idx + 1}. "${t.title}" [Öncelik: ${t.priority}, Kategori: ${t.category}, Süre: ${t.estimatedMinutes || 30} dk, Teslim: ${t.deadline || 'Belirtilmedi'}, Alt Görevler: ${t.subtasks?.filter(s => s.completed).length || 0}/${t.subtasks?.length || 0}]`).join('\n  ') || 'Yok'}
  Completed tasks today:
  ${completedTasks.map(t => `"${t.title}"`).join(', ') || 'Henüz tamamlanan görev yok'}

- Active Habits (${habitItems.length} total):
  ${habitStreakDetails.map(h => `"${h.habit.title}" (Kategori: ${h.habit.category}, Mevcut Seri: ${h.currentStreak} gün, En İyi Seri: ${h.bestStreak} gün, Bugün Yapıldı mı: ${h.habit.habitHistory[todayStr] ? 'Evet' : 'Hayır'})`).join('\n  ') || 'Tanımlı alışkanlık yok'}

- Total Pending Estimated Work Time: ${totalPendingMinutes} minutes
- Overdue Tasks: ${overdueTasks.map(t => `"${t.title}" (${t.deadline})`).join(', ') || 'Yok'}
- Due Today: ${dueTodayTasks.map(t => `"${t.title}"`).join(', ') || 'Yok'}
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: promptContext,
      });

      if (response && response.text) {
        return response.text;
      }
    }
  } catch (err) {
    console.warn('Gemini API call skipped or unavailable, using smart heuristic coaching engine.', err);
  }

  // --- COMPREHENSIVE HEURISTIC COACHING SYNTHESIS ---
  if (isTr) {
    // 1. Critical #1 One Thing
    let oneThingHeader = '';
    let oneThingBody = '';
    const topCandidate = highPriorityPending[0] || overdueTasks[0] || dueTodayTasks[0] || pendingTasks[0];

    if (topCandidate) {
      const catLocalized = formatCategoryName(topCandidate.category, 'tr');
      const estTime = topCandidate.estimatedMinutes || 45;
      const subtaskCount = topCandidate.subtasks?.length || 0;
      const subtaskDone = topCandidate.subtasks?.filter(s => s.completed).length || 0;
      
      oneThingHeader = `**"${topCandidate.title}"** [${catLocalized} · ${topCandidate.priority === 'high' ? 'Yüksek Öncelik' : 'Öncelikli'} · ~${estTime} dk]`;
      
      if (topCandidate.priority === 'high') {
        oneThingBody = `Gününüzün yönünü belirleyecek en kritik kilit taşı bu görevdir. Beyniniz sabah veya dinç olduğunuz ilk saatlerde en yüksek karar verme gücüne sahiptir. E-posta, bildirim veya diğer tali işlere dalmadan önce **${estTime} dakikalık tek bir odak bloğunda** sadece bu işi bitirmeyi hedefleyin.`;
      } else {
        oneThingBody = `Günün ivmesini yakalamak için ilk olarak bu görevi tamamlayın. Başarıyla sonuçlanan ilk iş, zihinde dopamin salgılatarak diğer bekleyen görevlere olan direncinizi kırar.`;
      }

      if (subtaskCount > 0) {
        const remainingSubtasks = topCandidate.subtasks.filter(s => !s.completed);
        const nextSubtaskName = remainingSubtasks.length > 0 ? `"${remainingSubtasks[0].title}"` : 'kalan alt adımı';
        oneThingBody += `\n\n📌 *Alt Adım Stratejisi*: Bu görevde ${subtaskDone}/${subtaskCount} adım tamamlandı. Başlamak için bütün görevi düşünmek yerine yalnızca ilk alt adım olan **${nextSubtaskName}** üzerine 5 dakika odaklanın.`;
      } else {
        oneThingBody += `\n\n📌 *5 Dakika Kuralı*: Başlamakta zorlanıyorsanız "Yalnızca 5 dakika boyunca yapıp bırakacağım" diyerek başlayın. Başlama sürtünmesini aştığınızda iş kendiliğinden akacaktır.`;
      }
    } else {
      oneThingHeader = `Tüm Standart Görevler Tamamlandı! 🎉`;
      oneThingBody = `Harika bir performans! Listenizdeki tüm görevleri bitirdiniz. Şimdi zihninizi yenileyebilir, alışkanlıklarınıza odaklanabilir veya yarın için yeni hedefler belirleyebilirsiniz.`;
    }

    // 2. Deadlines & Triage
    let triageText = '';
    if (overdueTasks.length > 0) {
      const overdueTitles = overdueTasks.map(t => `**"${t.title}"** (Son gün: ${t.deadline})`).join(', ');
      triageText = `⚠️ **Dikkat - Gecikmiş Görevler Var**: ${overdueTitles}. Gecikmiş işler arka planda bilişsel yorgunluk ve stres yaratır. Bunları ertelemek yerine günün ilk yarısında küçük bir hızlandırma (sprint) ile tamamlayın.`;
    } else if (dueTodayTasks.length > 0) {
      const dueTitles = dueTodayTasks.map(t => `**"${t.title}"**`).join(', ');
      triageText = `📅 **Bugün Teslim Edilecekler**: ${dueTitles}. Bu görevlerin son teslim tarihi bugün doluyor. Gün ortası odak seansınızda bunları aradan çıkararak rahat bir nefes alın.`;
    } else {
      triageText = `✅ **Tarih Baskısı Yok**: Tarihi geçmiş veya acil teslim bekleyen bir görev görünmüyor. Sakin ve kontrollü bir tempoda çalışma avantajına sahipsiniz.`;
    }

    // 3. Habit Momentum & Streaks
    let habitText = '';
    if (habitItems.length > 0) {
      if (topStreakHabit && topStreakHabit.currentStreak > 0) {
        habitText = `🔥 **En Güçlü Disiplin Zinciriniz**: **"${topStreakHabit.habit.title}"** şu anda tam **${topStreakHabit.currentStreak} günlük aktif seride** ilerliyor! (En iyi rekorunuz: ${topStreakHabit.bestStreak} gün). Bu seriyi kesinlikle bozmayın; başarı tutarlılıktan doğar.`;
      } else {
        habitText = `🌱 **Seri Başlatma Zamanı**: Listenizde tanımlı ${habitItems.length} alışkanlık bulunuyor. İlk 3 ardışık gün nörolojik olarak en kritik eşiktir. Bugün bu alışkanlığı tamamlayıp işaretleyin.`;
      }

      if (habitsPendingToday.length > 0) {
        const pendingHabitNames = habitsPendingToday.map(h => `**"${h.title}"**`).join(', ');
        habitText += `\n\n⚡ *Bugün Bekleyen Alışkanlıklar*: ${pendingHabitNames}. \n💡 *Alışkanlık İstifleme (Habit-Stacking) İpucu*: Bu alışkanlığı gün içinde zaten yaptığınız sabit bir rutinin hemen peşine ekleyin (Örneğin: "Öğle yemeğini bitirdikten hemen sonra ${habitsPendingToday[0].title} yapacağım").`;
      } else {
        habitText += `\n\n🌟 *Tebrikler*: Bugünün tüm alışkanlık rutinlerini başarıyla tamamladınız!`;
      }
    } else {
      habitText = `Henüz tekrarlayan bir alışkanlık oluşturmadınız. Günlük 15 dakikalık okuma, yürüyüş veya planlama gibi 1 basit rutin eklemek uzun vadeli başarınızı katlar.`;
    }

    // 4. Time Blocking & Focus Schedule
    let timeText = '';
    const hours = Math.floor(totalPendingMinutes / 60);
    const mins = totalPendingMinutes % 60;
    const timeFormatted = hours > 0 ? `${hours} saat ${mins > 0 ? `${mins} dakika` : ''}` : `${mins} dakika`;

    if (totalPendingMinutes > 0) {
      timeText = `Bekleyen görevleriniz toplamda yaklaşık **${timeFormatted}** net odaklanma süresi gerektiriyor. Bu süreyi dağınık geçirmek yerine şu örnek bloklama planını uygulayın:\n\n`;

      let currentMinOffset = 0;
      const primaryTask = pendingTasks[0];
      const secondaryTask = pendingTasks[1];
      const thirdTask = pendingTasks[2];

      timeText += `• **09:30 - 10:15 (45 dk Derin Odak)**: "${primaryTask?.title || 'En Kritik Görev'}" üzerinde kesintisiz çalışma.\n`;
      timeText += `• **10:15 - 10:30 (15 dk Yenilenme)**: Ekranı kapatın, su için, hafif esneme yapın.\n`;
      if (secondaryTask) {
        timeText += `• **10:30 - 11:15 (45 dk İkincil Odak)**: "${secondaryTask.title}" görevinin tamamlanması.\n`;
      }
      if (thirdTask) {
        timeText += `• **14:00 - 14:30 (30 dk İvme)**: "${thirdTask.title}" üzerinde çalışma.\n`;
      }
      if (habitsPendingToday.length > 0) {
        timeText += `• **17:00 - 17:20 (Rutin Kapanışı)**: "${habitsPendingToday[0].title}" alışkanlığının tamamlanıp sisteme işlenmesi.`;
      }
    } else {
      timeText = `Tüm planlanan işler tamamlandığı için bilişsel yükünüz şu an sıfırlandı. Günün geri kalanını yaratıcı projelere, yeni öğrenimlere veya dinlenmeye ayırabilirsiniz.`;
    }

    // 5. Category Balance
    let balanceText = '';
    const categoryCounts: Record<string, number> = {};
    tasks.forEach(t => {
      const cat = formatCategoryName(t.category, 'tr');
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });

    const entries = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]);
    if (entries.length > 0) {
      const topCat = entries[0];
      balanceText = `Listenizde en yoğun kategori **${topCat[0]}** (${topCat[1]} öğe). `;
      if (topCat[0] === 'İş' && entries.length === 1) {
        balanceText += `Listeniz tamamen işle dolu. Bilişsel tükenmişliği önlemek için "Kişisel" veya "Spor" kategorisinde de en az 1 yenilenme aktivitesi eklemenizi öneririz.`;
      } else {
        balanceText += `Farklı yaşam alanlarını dengede tutmak uzun vadeli motivasyonunuzu korur.`;
      }
    } else {
      balanceText = `Henüz kategori verisi bulunmuyor.`;
    }

    // 6. Golden Coaching Principle
    const completedRatio = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;
    let goldenRule = '';
    if (completedRatio >= 70) {
      goldenRule = `*"Mükemmel ivme yakaladınız! Unutmayın: Büyük başarılar mucizelerin değil, her gün sessizce tamamlanan küçük görevlerin birikimidir."*`;
    } else if (overdueTasks.length > 0) {
      goldenRule = `*"Ertelemenin ilacı daha fazla motivasyon değil, eylemin ilk adımını küçültmektir. İlk 2 dakikayı başlatın, gerisi peşinden gelecektir."*`;
    } else {
      goldenRule = `*"Gününüzü planlamazsanız, gününüz sizi yönetir. En önemli 1 işinizi bitirmeden tali detayların dikkatinizi dağıtmasına izin vermeyin."*`;
    }

    return `### 🎯 1. Günün 1 Numaralı Kritik Görevi
${oneThingHeader}
${oneThingBody}

### ⏰ 2. Teslim Tarihi ve Aciliyet Alarmı
${triageText}

### ⚡ 3. Alışkanlık Zinciri & Seri Koruma
${habitText}

### ⏱️ 4. Akıllı Zaman Bloklama & Odak Planı
${timeText}

### ⚖️ 5. Kategori Dengesi ve Zihinsel Enerji
${balanceText}

### 💡 6. Bu Hafta İçin Altın Koçluk Tavsiyesi
${goldenRule}`;
  } else {
    // English Synthesis
    const topCandidate = highPriorityPending[0] || overdueTasks[0] || dueTodayTasks[0] || pendingTasks[0];
    const topHabit = topStreakHabit;
    const estTime = topCandidate?.estimatedMinutes || 45;

    return `### 🎯 1. Critical #1 Priority ("The One Thing")
**"${topCandidate ? topCandidate.title : 'All Standard Tasks Completed'}"** [${topCandidate?.priority || 'high'} priority · ~${estTime} mins]
${topCandidate ? `This is your primary needle-mover today. Tackle this in a protected 45-minute sprint before touching inbox or secondary tasks.` : 'All tasks completed! Take time to recharge.'}

### ⏰ 2. Deadlines & Triage
${overdueTasks.length > 0 ? `⚠️ Overdue tasks detected: ${overdueTasks.map(t => `"${t.title}"`).join(', ')}. Complete these first to clear background cognitive drag.` : '✅ All scheduled dates are on track with zero overdue debt.'}

### ⚡ 3. Habit Momentum & Streaks
${topHabit && topHabit.currentStreak > 0 ? `🔥 Your strongest rhythm is **"${topHabit.habit.title}"** on an active **${topHabit.currentStreak}-day streak**!` : 'Start building a 3-day consecutive groove today.'}
${habitsPendingToday.length > 0 ? `Pending today: ${habitsPendingToday.map(h => `"${h.title}"`).join(', ')}. Use habit-stacking right after lunch.` : 'All habits checked off today!'}

### ⏱️ 4. Time-Boxing Schedule
Total pending focus time: **${totalPendingMinutes} minutes**.
• 09:30 - 10:15: Deep focus sprint on "${topCandidate?.title || 'Top Priority'}"
• 10:15 - 10:30: Break & hydration
• 10:30 - 11:15: Secondary execution block

### ⚖️ 5. Category Balance
Ensure your work commitments are counterbalanced with rest and physical wellness.

### 💡 6. Golden Coaching Principle
*"Small disciplines repeated with consistency every single day lead to monumental long-term results."*`;
  }
}
