import { useStudyData } from "@/hooks/useStudyData";
import { getLevelTitle, xpForNextLevel } from "@/lib/studyStorage";
import { cn } from "@/lib/utils";
import { BarChart2, Clock, TrendingUp, Target } from "lucide-react";

const DAY_NAMES_SHORT = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export default function Stats() {
  const { data, getWeeklyHours, getSubjectStats } = useStudyData();

  const weeklyHours = getWeeklyHours();
  const subjectStats = getSubjectStats();
  const maxSubjectHours = subjectStats[0]?.[1] || 1;

  const levelTitle = getLevelTitle(data.level);
  const currentLevelXP = (data.level - 1) * 100;
  const xpInLevel = data.xp - currentLevelXP;
  const xpProgress = Math.min(100, (xpInLevel / 100) * 100);

  // Last 7 days activity
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const key = d.toISOString().split("T")[0];
    const record = data.records[key];
    return {
      day: DAY_NAMES_SHORT[d.getDay()],
      status: record?.status || null,
      hours: record?.hoursStudied || 0,
      isToday: i === 6,
    };
  });

  const maxDayHours = Math.max(...last7Days.map(d => d.hours), 1);

  const statsCards = [
    { icon: "🔥", label: "Streak atual", value: `${data.streak} dias`, sub: `Recorde: ${data.longestStreak}` },
    { icon: "📅", label: "Total de dias", value: `${data.totalDays}`, sub: "dias estudados" },
    { icon: "⏱️", label: "Esta semana", value: `${weeklyHours.toFixed(1)}h`, sub: "horas estudadas" },
    { icon: "⭐", label: "Nível atual", value: `Nível ${data.level}`, sub: levelTitle },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="relative overflow-hidden px-5 pt-12 pb-6">
        <div className="absolute inset-0 gradient-hero pointer-events-none" />
        <div className="relative flex items-center gap-2">
          <BarChart2 size={20} className="text-primary" />
          <h1 className="text-xl font-black text-foreground">Estatísticas</h1>
        </div>
      </div>

      <div className="px-4 space-y-4">
        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3">
          {statsCards.map(({ icon, label, value, sub }) => (
            <div key={label} className="glass-card rounded-2xl p-4 border border-border/50 shadow-card">
              <div className="text-2xl mb-2">{icon}</div>
              <div className="font-black text-foreground text-lg leading-tight">{value}</div>
              <div className="text-[10px] text-muted-foreground font-medium mt-0.5">{label}</div>
              <div className="text-[10px] text-primary font-semibold mt-1">{sub}</div>
            </div>
          ))}
        </div>

        {/* XP Progress */}
        <div className="glass-card rounded-3xl p-5 border border-border/50 shadow-card">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="font-bold text-foreground">Nível {data.level} — {levelTitle}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{xpInLevel}/100 XP para o próximo nível</div>
            </div>
            <div className="text-2xl">⭐</div>
          </div>
          <div className="h-3 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full gradient-primary rounded-full transition-all duration-700"
              style={{ width: `${xpProgress}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground mt-1.5">
            <span>Nível {data.level}</span>
            <span>{data.xp} XP total</span>
            <span>Nível {data.level + 1}</span>
          </div>
        </div>

        {/* Last 7 days chart */}
        <div className="glass-card rounded-3xl p-5 border border-border/50 shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} className="text-primary" />
            <h2 className="font-bold text-foreground">Últimos 7 dias</h2>
          </div>
          <div className="flex items-end gap-2 h-28">
            {last7Days.map(({ day, status, hours, isToday }, i) => {
              const heightPct = status ? Math.max(15, (hours / maxDayHours) * 100) : 8;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                  <div className="flex-1 w-full flex items-end">
                    <div
                      className={cn(
                        "w-full rounded-t-lg transition-all duration-500",
                        status === "done" ? "bg-success/70" :
                        status === "partial" ? "bg-warning/60" :
                        status === "missed" ? "bg-destructive/30" :
                        "bg-secondary/50"
                      )}
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span className={cn("text-[10px] font-bold", isToday ? "text-primary" : "text-muted-foreground")}>
                    {day}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border/30">
            {[
              { cls: "bg-success/70", label: "Concluído" },
              { cls: "bg-warning/60", label: "Parcial" },
              { cls: "bg-destructive/30", label: "Perdido" },
            ].map(({ cls, label }) => (
              <div key={label} className="flex items-center gap-1">
                <div className={cn("w-2.5 h-2.5 rounded-sm", cls)} />
                <span className="text-[10px] text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Subject stats */}
        {subjectStats.length > 0 && (
          <div className="glass-card rounded-3xl p-5 border border-border/50 shadow-card">
            <div className="flex items-center gap-2 mb-4">
              <Target size={16} className="text-primary" />
              <h2 className="font-bold text-foreground">Matérias mais estudadas</h2>
            </div>
            <div className="space-y-3">
              {subjectStats.map(([subject, hours], i) => (
                <div key={subject}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-semibold text-foreground">{subject}</span>
                    <span className="text-muted-foreground font-medium">{hours.toFixed(1)}h</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${(hours / maxSubjectHours) * 100}%`,
                        background: `hsl(${248 - i * 20} 75% 60%)`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
