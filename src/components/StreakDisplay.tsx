import { cn } from "@/lib/utils";

interface StreakDisplayProps {
  streak: number;
  recoveryMode: boolean;
}

export function StreakDisplay({ streak, recoveryMode }: StreakDisplayProps) {
  return (
    <div className="flex flex-col items-center">
      <div className={cn(
        "relative flex items-center justify-center",
        streak > 0 ? "animate-streak" : ""
      )}>
        <div className={cn(
          "text-7xl leading-none select-none animate-fire",
          streak === 0 && "opacity-30 grayscale"
        )}>
          🔥
        </div>
        {recoveryMode && (
          <div className="absolute -top-1 -right-1 bg-warning rounded-full w-5 h-5 flex items-center justify-center text-xs">
            ⚡
          </div>
        )}
      </div>
      <div className={cn(
        "mt-2 text-4xl font-black tabular-nums",
        streak > 0 ? "text-streak" : "text-muted-foreground"
      )}>
        {streak}
      </div>
      <div className="text-xs text-muted-foreground font-medium mt-0.5">
        {recoveryMode ? "⚡ Modo recuperação" : streak === 1 ? "dia seguido" : "dias seguidos"}
      </div>
    </div>
  );
}
