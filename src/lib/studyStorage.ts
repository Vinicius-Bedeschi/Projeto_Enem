// =====================
// Types
// =====================

export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0=Sun, 1=Mon...

export interface StudyBlock {
  id: string;
  subject: string;
  startTime: string; // "14:00"
  endTime: string;   // "16:00"
  color: string;
}

export interface DayRoutine {
  day: DayOfWeek;
  blocks: StudyBlock[];
}

export interface DayRecord {
  date: string; // "YYYY-MM-DD"
  status: "done" | "partial" | "missed" | "recovery";
  hoursStudied?: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

export interface AppData {

  user?: {
    name: string;
    avatar?: string;
  };

  streak: number;
  longestStreak: number;
  totalDays: number;
  level: number;
  xp: number;
  routine: DayRoutine[];
  records: Record<string, DayRecord>;
  achievements: Achievement[];
  lastActiveDate: string;
  recoveryMode: boolean;
}

/** Backup */
export interface BackupFile {
  version: number;
  exportedAt: string;
  data: AppData;
}

// =====================
// Constants
// =====================

const STORAGE_KEY = "enem_focus_data";

const SUBJECT_COLORS = [
  "#6c63ff", "#ff6b6b", "#4ecdc4", "#45b7d1",
  "#f7dc6f", "#a29bfe", "#fd79a8", "#55efc4",
];

export const SUBJECTS = [
  "Matemática", "Linguagens", "Simulado", "Exercícios",
  "Redação", "Física", "Química", "Biologia", "História", "Geografia",
  "Literatura", "Português", "Filosofia", "Sociologia", "Anki",
];

export const DAY_NAMES = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
export const DAY_NAMES_FULL = [
  "Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado",
];

export const ACHIEVEMENTS_LIST: Achievement[] = [
{ id: "recovery_1", name: "Volta por Cima", description: "Usou o modo recuperação e voltou", icon: "🔄" },
{ id: "streak_1", name: "Começou 🔥", description: "Primeiro dia seguido", icon: "🌱" },
{ id: "streak_3", name: "3 Dias de Fogo", description: "3 dias seguidos de estudos", icon: "🔥" },
{ id: "streak_5", name: "Pegando Ritmo", description: "5 dias seguidos de estudos", icon: "⚡" },
{ id: "streak_7", name: "Uma Semana Incrível", description: "7 dias seguidos de estudos", icon: "🚀" },
{ id: "streak_14", name: "Consistência Real", description: "14 dias seguidos de estudos", icon: "💎" },
{ id: "streak_30", name: "Foco Total no ENEM", description: "30 dias seguidos de estudos", icon: "🏆" },
{ id: "streak_60", name: "Inabalável", description: "60 dias seguidos de estudos", icon: "🔥" },
{ id: "total_5", name: "Primeiros Passos", description: "5 dias estudados no total", icon: "👣" },
{ id: "total_10", name: "10 Dias Estudando", description: "10 dias no total", icon: "📚" },
{ id: "total_25", name: "Hábito Criado", description: "25 dias estudados", icon: "🧠" },
{ id: "total_50", name: "50 Dias de Dedicação", description: "50 dias estudados", icon: "🌟" },
{ id: "total_100", name: "Centenário", description: "100 dias estudando", icon: "💯" },
{ id: "level_5", name: "Ritmo Consistente", description: "Alcançou o nível 5", icon: "⭐" },
{ id: "level_10", name: "Estudante de Elite", description: "Alcançou o nível 10", icon: "🎓" },
{ id: "level_20", name: "Elite do ENEM", description: "Alcançou o nível 20", icon: "🏅" },
{ id: "level_25", name: "Disciplina Absoluta", description: "Alcançou o nível 25", icon: "🛡️" },
{ id: "level_30", name: "Candidato Forte", description: "Alcançou o nível 30", icon: "💪" },
{ id: "level_40", name: "Mentalidade de Aprovado", description: "Alcançou o nível 40", icon: "🧠" },
{ id: "level_50", name: "Lenda do ENEM", description: "Alcançou o nível 50", icon: "👑" },
];

// =====================
// Base Data
// =====================

export function getDefaultData(): AppData {
  return {
    user: {
      name: "Estudante",
      avatar: undefined,
    },

    streak: 0,
    longestStreak: 0,
    totalDays: 0,
    level: 1,
    xp: 0,
    routine: [],
    records: {},
    achievements: [],
    lastActiveDate: "",
    recoveryMode: false,
  };
}

// =====================
// Storage
// =====================

export function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultData();

    const parsed = JSON.parse(raw);

    return {
      ...getDefaultData(),
      ...parsed,
      user: {
        ...getDefaultData().user,
        ...parsed.user,
      },
    };
  } catch {
    return getDefaultData();
  }
}

export function saveData(data: AppData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// =====================
// Dates & Helpers
// =====================

export function getTodayKey(): string {
  return new Date().toISOString().split("T")[0];
}

export function getDateKey(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function getTodayDayOfWeek(): DayOfWeek {
  return new Date().getDay() as DayOfWeek;
}

// =====================
// Level & XP
// =====================

export function calculateLevel(xp: number): number {
  return Math.floor(xp / 100) + 1;
}

export function xpForNextLevel(level: number): number {
  return level * 100;
}

export function getLevelTitle(level: number): string {
  if (level >= 50) return "Lenda do ENEM 🏆";
  if (level >= 45) return "Nível Olímpico 🥇";
  if (level >= 40) return "Mentalidade de Aprovado 🧠";
  if (level >= 35) return "Pronto para a Prova 📝";
  if (level >= 30) return "Candidato Forte 💪";
  if (level >= 25) return "Disciplina Absoluta 🛡️";
  if (level >= 22) return "Máquina de Estudo ⚙️";
  if (level >= 20) return "Elite do ENEM 🔥";
  if (level >= 18) return "Consistência Inabalável 💎";
  if (level >= 15) return "Mestre dos Estudos 🎓";
  if (level >= 12) return "Rotina de Ferro ⏱️";
  if (level >= 10) return "Foco Total no ENEM 🎯";
  if (level >= 7) return "Estudante Focado 📘";
  if (level >= 5) return "Ritmo Consistente ⭐";
  if (level >= 3) return "Construindo o Hábito 🌱";
  if (level >= 2) return "Dando os Primeiros Passos 👣";
  return "Começando a Jornada ✨";
}

// =====================
// Achievements
// =====================

export function checkAchievements(data: AppData): Achievement[] {
  const newAchievements: Achievement[] = [];
  const now = new Date().toISOString();

  const check = (id: string) => {
    if (!data.achievements.find(a => a.id === id)) {
      const achievement = ACHIEVEMENTS_LIST.find(a => a.id === id);
      if (achievement) {
        newAchievements.push({ ...achievement, unlockedAt: now });
      }
    }
  };

  // 🔥 Streak
  if (data.streak >= 1) check("streak_1");
  if (data.streak >= 3) check("streak_3");
  if (data.streak >= 5) check("streak_5");
  if (data.streak >= 7) check("streak_7");
  if (data.streak >= 14) check("streak_14");
  if (data.streak >= 30) check("streak_30");
  if (data.streak >= 60) check("streak_60");

  // 📆 Total days
  if (data.totalDays >= 5) check("total_5");
  if (data.totalDays >= 10) check("total_10");
  if (data.totalDays >= 25) check("total_25");
  if (data.totalDays >= 50) check("total_50");
  if (data.totalDays >= 100) check("total_100");

  // ⭐ Level
  if (data.level >= 5) check("level_5");
  if (data.level >= 10) check("level_10");
  if (data.level >= 20) check("level_20");
  if (data.level >= 25) check("level_25");
  if (data.level >= 30) check("level_30");
  if (data.level >= 40) check("level_40");
  if (data.level >= 50) check("level_50");

  // 🔄 Recovery
  if (data.recoveryMode) check("recovery_1");

  return newAchievements;
}

// =====================
// Utils
// =====================

export function getSubjectColor(index: number): string {
  return SUBJECT_COLORS[index % SUBJECT_COLORS.length];
}

export function calcDurationHours(startTime: string, endTime: string): number {
  const [sh, sm] = startTime.split(":").map(Number);
  const [eh, em] = endTime.split(":").map(Number);
  return Math.max(0, (eh * 60 + em - (sh * 60 + sm)) / 60);
}

// =====================
// Messages
// =====================

export const MOTIVATIONAL_MESSAGES = [
  "Orgulho de você. Um passo mais perto da aprovação. 💙",
  "Sua versão futura já está te agradecendo por isso.",
  "Mesmo nos dias difíceis, você continuou. Isso é o que importa.",
  "Cada hora de estudo é um tijolo no caminho da aprovação.",
  "Você não está só nessa jornada. Continue assim! 🔥",
  "Disciplina hoje, liberdade amanhã.",
  "A aprovação é construída um dia de cada vez, como hoje.",
  "Quem estuda com consistência chega lá. E você está provando isso.",
  "Isso não foi fácil, mas você fez. Isso faz toda a diferença.",
  "O ENEM vai te ver chegando com tudo. Parabéns pelo dia! ⭐",
  "Nós somos aquilo que fazemos repetidamente. A excelência é um hábito - Aristóteles",
  "A persistência realiza o impossível - Provérbio chinês",
  "Dificuldades fortalecem a mente, como o trabalho fortalece o corpo - Sêneca",
  "Primeiro diga a si mesmo quem você quer ser, depois faça o que precisa ser feito - Epicteto",
  "A felicidade depende de nós mesmos - Aristóteles",
  "Quem tem um porquê enfrenta qualquer como - Friedrich Nietzsche",
  "Não é a força, mas sim a constância dos bons resultados que conduz os homens à felicidade - Friedrich Nietzsche",
  "A disciplina é a ponte entre metas e realizações - Jim Rohn",
  "O sucesso é a soma de pequenos esforços repetidos dia após dia - Robert Collier",
  "A sorte favorece a mente preparada - Louis Pasteur",
  "Não explique sua filosofia. Incorpore-a - Epicteto",
  "O começo é a parte mais importante do trabalho - Platão",
  "A mente que se abre a uma nova ideia jamais volta ao tamanho original - Albert Einstein",
  "Coragem não é ausência de medo, é continuar apesar dele - Mark Twain",
  "Pequenos progressos diários levam a resultados extraordinários - Provérbio japonês",
];

export const PARTIAL_MESSAGES = [
  "Um pouco é muito melhor do que nada. Você manteve o hábito! 💪",
  "Dias parciais também contam, o importante é não parar.",
  "Nem sempre tudo sai como planejado, e tudo bem. Você ainda foi lá.",
  "Consistência com flexibilidade. É assim que se cria um hábito de verdade.",
  "Hoje não foi 100%, mas foi comprometido. E isso importa.",
  "Mesmo reduzido, o esforço de hoje protege seu sonho.",
  "Você não quebrou o ritmo, você adaptou. Isso é maturidade.",
  "Parcial não é fracasso. É continuidade.",
  "Fazer algo em um dia difícil é um ato de coragem.",
  "Você escolheu continuar. Isso já te coloca à frente.",
  "Nem todo dia é perfeito, mas todo dia pode ter progresso.",
  "O hábito se constrói nos dias imperfeitos.",
  "Não foi o máximo, mas foi sincero. E isso conta.",
  "Constância não é rigidez. É voltar todos os dias.",
  "Você não desistiu, você ajustou. E isso é força.",
  "Pequenos passos ainda te levam para frente.",
  "Seu compromisso é maior que o seu cansaço.",
  "Hoje você fez o possível. Amanhã você faz mais.",
  "A disciplina também vive nos dias medianos.",
  "Manter o movimento é o que mantém o sonho vivo."
];

export const RECOVERY_MESSAGES = [
  "Você voltou! Isso é tudo que importava. O foguinho está salvo. 🔥",
  "A recuperação faz parte. Você não desistiu e isso diz muito.",
  "Volta por cima! O streak está de pé. Continue assim.",
  "Voltou ao ritmo. É isso que mantém o projeto vivo.",
  "Um dia fora não muda quase nada. Continuar muda tudo.",
  "Você interrompeu. Agora retomou. Simples assim.",
  "O importante é não deixar um dia virar padrão.",
  "Você voltou antes que virasse desculpa. Bom sinal.",
  "Constância não é nunca falhar. É não se afastar por muito tempo.",
  "Nada precisa ser dramático. Você só seguiu.",
  "O plano continua. E você também.",
  "Você não tentou compensar. Só retomou. Isso é equilíbrio.",
  "Um retorno tranquilo vale mais que promessas grandiosas."
];

// =====================
// Backup / Restore
// =====================

export function exportBackup(): void {
  const data = loadData();

  const backup: BackupFile = {
    version: 1,
    exportedAt: new Date().toISOString(),
    data,
  };

  const blob = new Blob(
    [JSON.stringify(backup, null, 2)],
    { type: "application/json" }
  );

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = `enem-focus-backup-${getTodayKey()}.json`;
  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function importBackup(file: File): Promise<boolean> {
  try {
    const text = await file.text();
    const parsed = JSON.parse(text) as BackupFile;

    if (
      !parsed ||
      typeof parsed !== "object" ||
      typeof parsed.version !== "number" ||
      !parsed.data
    ) {
      throw new Error("Arquivo inválido");
    }

    saveData(parsed.data);
    return true;
  } catch (err) {
    console.error("Erro ao importar backup:", err);
    return false;
  }
  
}

