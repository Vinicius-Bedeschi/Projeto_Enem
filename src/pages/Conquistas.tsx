import { useStudyData } from "@/hooks/useStudyData";
import { ACHIEVEMENTS_LIST } from "@/lib/studyStorage";
import { cn } from "@/lib/utils";
import { Trophy, Lock } from "lucide-react";

export default function Conquistas() {
  const { data } = useStudyData();

  const unlockedIds = new Set(data.achievements.map(a => a.id));

  const unlocked = ACHIEVEMENTS_LIST.filter(a => unlockedIds.has(a.id));
  const locked = ACHIEVEMENTS_LIST.filter(a => !unlockedIds.has(a.id));

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="relative overflow-hidden px-5 pt-12 pb-6">
        <div className="absolute inset-0 gradient-hero pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-1">
            <Trophy size={20} className="text-primary" />
            <h1 className="text-xl font-black text-foreground">Conquistas</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            {unlocked.length}/{ACHIEVEMENTS_LIST.length} desbloqueadas
          </p>
        </div>
      </div>

      <div className="px-4 space-y-4">
        {/* Progress bar */}
        <div className="glass-card rounded-2xl p-4 border border-border/50">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-foreground font-semibold">Progresso geral</span>
            <span className="text-primary font-bold">{Math.round((unlocked.length / ACHIEVEMENTS_LIST.length) * 100)}%</span>
          </div>
          <div className="h-2.5 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full gradient-primary rounded-full transition-all duration-700"
              style={{ width: `${(unlocked.length / ACHIEVEMENTS_LIST.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Unlocked */}
        {unlocked.length > 0 && (
          <div>
            <h2 className="font-bold text-foreground text-sm mb-3 px-1">✨ Desbloqueadas</h2>
            <div className="space-y-3">
              {unlocked.map(achievement => {
                const userAchievement = data.achievements.find(a => a.id === achievement.id);
                const unlockedDate = userAchievement?.unlockedAt
                  ? new Date(userAchievement.unlockedAt).toLocaleDateString("pt-BR")
                  : "";

                return (
                  <div
                    key={achievement.id}
                    className="glass-card rounded-2xl p-4 border border-primary/20 shadow-card flex items-center gap-4 animate-float-up"
                  >
                    <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center text-3xl shadow-primary flex-shrink-0">
                      {achievement.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-foreground">{achievement.name}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{achievement.description}</div>
                      {unlockedDate && (
                        <div className="text-[10px] text-primary font-semibold mt-1">🗓️ {unlockedDate}</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Locked */}
        {locked.length > 0 && (
          <div>
            <h2 className="font-bold text-muted-foreground text-sm mb-3 px-1">🔒 Bloqueadas</h2>
            <div className="space-y-3">
              {locked.map(achievement => (
                <div
                  key={achievement.id}
                  className="glass-card rounded-2xl p-4 border border-border/30 flex items-center gap-4 opacity-60"
                >
                  <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center text-3xl flex-shrink-0 grayscale">
                    {achievement.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-muted-foreground flex items-center gap-2">
                      {achievement.name}
                      <Lock size={12} />
                    </div>
                    <div className="text-xs text-muted-foreground/70 mt-0.5">{achievement.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {unlocked.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏆</div>
            <h3 className="font-bold text-foreground text-lg mb-2">Comece sua jornada!</h3>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto">
              Complete dias de estudo para desbloquear conquistas e mostrar sua dedicação.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
