import { useState } from "react";
import { useStudy } from "@/context/StudyContext";
import { StreakDisplay } from "@/components/StreakDisplay";
import { CompletionModal } from "@/components/CompletionModal";
import { BackupSection } from "@/components/BackupSection";
import { ProfileModal } from "@/components/ProfileModal";
import {
  getLevelTitle,
  DAY_NAMES,
  DAY_NAMES_FULL,
} from "@/lib/studyStorage";
import { cn } from "@/lib/utils";
import { ChevronRight, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Index() {
  const { data, markDay, getTodayStatus, newAchievements } = useStudy();
  const [modalOpen, setModalOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  const todayStatus = getTodayStatus();
  const today = new Date();
  const todayDow = today.getDay();
  const todayRoutine = data.routine.find((r) => r.day === todayDow);

  const levelTitle = getLevelTitle(data.level);
  const currentLevelXP = (data.level - 1) * 100;
  const xpInLevel = data.xp - currentLevelXP;
  const xpNeeded = 100;
  const xpProgress = Math.min(100, (xpInLevel / xpNeeded) * 100);

  const userName = data.user?.name || "Estudante";

  const getGreeting = () => {
  const h = today.getHours();
  if (h < 12) return `Bom dia ${userName}! ☀️`;
  if (h < 18) return `Boa tarde ${userName}! 🌤️`;
  return `Boa noite ${userName}! 🌙`;
  };

  const statusColors: Record<string, string> = {
    done: "text-success border-success/30 bg-success/10",
    partial: "text-warning border-warning/30 bg-warning/10",
    missed: "text-destructive border-destructive/10 bg-destructive/5",
  };

  const statusLabel: Record<string, string> = {
    done: "✅ Concluído hoje!",
    partial: "⏳ Parcialmente concluído",
    missed: "❌ Não estudei hoje",
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="relative overflow-hidden px-5 pt-12 pb-6">
        <div className="absolute inset-0 gradient-hero pointer-events-none" />
        <div className="relative flex items-center justify-between">
  <div>
    <p className="text-muted-foreground text-sm font-medium">
      {getGreeting()}
    </p>
    <h1 className="text-2xl font-black text-foreground mt-0.5">
      PROJETO ENEM 2026
    </h1>
  </div>

  {/* Avatar */}
  <div
  onClick={() => setProfileOpen(true)}
  className="w-12 h-12 rounded-full overflow-hidden border border-primary/30 bg-secondary shrink-0 cursor-pointer"
  >
    {data.user?.avatar ? (
      <img
        src={data.user.avatar}
        alt="Avatar"
        className="w-full h-full object-cover"
      />
    ) : (
      <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
        🙂
      </div>
    )}
   </div>
 </div>
</div>

      <div className="px-4 space-y-4">
        {/* New achievements */}
        {newAchievements.map((a) => (
          <div
            key={a.id}
            className="glass-card rounded-2xl p-4 border border-primary/30 animate-bounce-in flex items-center gap-3"
          >
            <span className="text-3xl">{a.icon}</span>
            <div>
              <div className="font-bold text-sm text-primary">
                Conquista desbloqueada!
              </div>
              <div className="text-foreground font-semibold">{a.name}</div>
              <div className="text-xs text-muted-foreground">
                {a.description}
              </div>
            </div>
          </div>
        ))}

        {/* Streak Card */}
        <div className="glass-card rounded-3xl p-6 border border-border/50 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <StreakDisplay
              streak={data.streak}
              recoveryMode={data.recoveryMode}
            />
            <div className="glass-card rounded-2xl px-4 py-3 border border-primary/20 text-right">
              <div className="text-xs text-muted-foreground font-medium">
                Nível {data.level}
              </div>
              <div className="text-sm font-bold text-primary">{levelTitle}</div>
              <div className="mt-2 h-1.5 bg-secondary rounded-full overflow-hidden w-28">
                <div
                  className="h-full gradient-primary rounded-full transition-all duration-700"
                  style={{ width: `${xpProgress}%` }}
                />
              </div>
              <div className="text-[10px] text-muted-foreground mt-1">
                {xpInLevel}/{xpNeeded} XP
              </div>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 bg-secondary/50 rounded-full px-3 py-1.5">
              <Zap size={12} className="text-primary" />
              <span className="text-xs font-semibold">
                {data.totalDays} dias no total
              </span>
            </div>
            <div className="flex items-center gap-1.5 bg-secondary/50 rounded-full px-3 py-1.5">
              <span className="text-xs font-semibold">
                🏆 Recorde: {data.longestStreak} dias
              </span>
            </div>
          </div>
        </div>

        {/* Today */}
        <div className="glass-card rounded-3xl p-5 border border-border/50 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-bold">
                Hoje — {DAY_NAMES_FULL[todayDow]}
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {today.toLocaleDateString("pt-BR", {
                  day: "numeric",
                  month: "long",
                })}
              </p>
            </div>

            {todayStatus && (
              <span
                className={cn(
                  "text-xs font-bold px-3 py-1.5 rounded-full border",
                  statusColors[todayStatus]
                )}
              >
                {statusLabel[todayStatus]}
              </span>
            )}
          </div>

          {todayRoutine && todayRoutine.blocks.length > 0 ? (
            <div className="space-y-2 mb-4">
              {todayRoutine.blocks.map((block) => (
                <div
                  key={block.id}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-secondary/40"
                  style={{ borderLeft: `3px solid ${block.color}` }}
                >
                  <div className="flex-1">
                    <div className="font-semibold text-sm">
                      {block.subject}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {block.startTime} – {block.endTime}
                    </div>
                  </div>
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: block.color }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 mb-4">
              <p className="text-muted-foreground text-sm">
                Sem rotina para hoje
              </p>
              <button
                onClick={() => navigate("/rotina")}
                className="mt-2 text-primary text-sm font-semibold flex items-center gap-1 mx-auto"
              >
                Criar rotina <ChevronRight size={14} />
              </button>
            </div>
          )}

          <button
            onClick={() => setModalOpen(true)}
            className={cn(
              "w-full py-4 rounded-2xl font-bold text-base transition-all active:scale-95",
              todayStatus
                ? "bg-secondary border border-border"
                : "gradient-primary shadow-primary text-primary-foreground"
            )}
          >
            {todayStatus
              ? "Atualizar registro de hoje"
              : "Registrar estudo de hoje 🎯"}
          </button>
        </div>

        {/* Week overview */}
        <div className="glass-card rounded-3xl p-5 border border-border/50 shadow-card">
          <h2 className="font-bold mb-4">Semana atual</h2>
          <div className="grid grid-cols-7 gap-1">
            {DAY_NAMES.map((name, i) => {
              const d = new Date();
              const offset = i - d.getDay();
              const target = new Date(d);
              target.setDate(d.getDate() + offset);
              const key = target.toISOString().split("T")[0];
              const record = data.records[key];
              const isToday = i === d.getDay();

              return (
                <div key={i} className="flex flex-col items-center gap-1">
                  <span
                    className={cn(
                      "text-[10px] font-medium",
                      isToday ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    {name}
                  </span>
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-xs border",
                      isToday && !record
                        ? "border-primary border-2 bg-primary/10"
                        : "border-transparent",
                      record?.status === "done"
                        ? "bg-success/20 border-success/40"
                        : record?.status === "partial"
                        ? "bg-warning/20 border-warning/40"
                        : record?.status === "missed"
                        ? "bg-destructive/10 border-destructive/20"
                        : "bg-secondary/50"
                    )}
                  >
                    {record?.status === "done"
                      ? "✅"
                      : record?.status === "partial"
                      ? "⏳"
                      : record?.status === "missed"
                      ? "❌"
                      : isToday
                      ? "●"
                      : ""}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Backup (discreto) */}
        <BackupSection />
      </div>

      <CompletionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onMark={markDay}
        currentStatus={todayStatus}
        isRecovery={data.recoveryMode}
      />

      <ProfileModal
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
      />

    </div>
  );
}