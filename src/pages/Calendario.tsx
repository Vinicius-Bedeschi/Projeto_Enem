import { useState } from "react";
import { useStudyData } from "@/hooks/useStudyData";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

const MONTH_NAMES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const DAY_HEADERS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export default function Calendario() {
  const { getMonthRecords, data } = useStudyData();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  const records = getMonthRecords(year, month);

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  const isToday = (day: number) =>
    day === now.getDate() && month === now.getMonth() && year === now.getFullYear();

  const statusIcon: Record<string, string> = {
    done: "✅",
    partial: "⏳",
    missed: "❌",
  };

  const statusClass: Record<string, string> = {
    done: "bg-success/20 border-success/40 text-success",
    partial: "bg-warning/20 border-warning/40 text-warning",
    missed: "bg-destructive/10 border-destructive/20 text-destructive",
  };

  // Count stats
  const doneCount = Object.values(records).filter(s => s === "done").length;
  const partialCount = Object.values(records).filter(s => s === "partial").length;
  const missedCount = Object.values(records).filter(s => s === "missed").length;

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="relative overflow-hidden px-5 pt-12 pb-6">
        <div className="absolute inset-0 gradient-hero pointer-events-none" />
        <div className="relative">
          <h1 className="text-xl font-black text-foreground">Calendário</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Sua jornada de estudos</p>
        </div>
      </div>

      <div className="px-4 space-y-4">
        {/* Month Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Concluídos", count: doneCount, icon: "✅", cls: "text-success" },
            { label: "Parciais", count: partialCount, icon: "⏳", cls: "text-warning" },
            { label: "Perdidos", count: missedCount, icon: "❌", cls: "text-destructive" },
          ].map(({ label, count, icon, cls }) => (
            <div key={label} className="glass-card rounded-2xl p-3 border border-border/50 text-center">
              <div className="text-xl">{icon}</div>
              <div className={cn("text-2xl font-black mt-1", cls)}>{count}</div>
              <div className="text-[10px] text-muted-foreground font-medium">{label}</div>
            </div>
          ))}
        </div>

        {/* Calendar */}
        <div className="glass-card rounded-3xl p-5 border border-border/50 shadow-card">
          {/* Month nav */}
          <div className="flex items-center justify-between mb-5">
            <button onClick={prevMonth} className="p-2 rounded-xl hover:bg-secondary transition-colors">
              <ChevronLeft size={20} className="text-foreground" />
            </button>
            <h2 className="font-bold text-foreground">
              {MONTH_NAMES[month]} {year}
            </h2>
            <button onClick={nextMonth} className="p-2 rounded-xl hover:bg-secondary transition-colors">
              <ChevronRight size={20} className="text-foreground" />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-2">
            {DAY_HEADERS.map(d => (
              <div key={d} className="text-center text-[10px] font-bold text-muted-foreground py-1">{d}</div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-1">
            {cells.map((day, idx) => {
              if (!day) return <div key={`empty-${idx}`} />;
              const status = records[day];
              const today = isToday(day);

              return (
                <div
                  key={day}
                  className={cn(
                    "aspect-square rounded-xl border flex flex-col items-center justify-center text-xs font-bold transition-all",
                    status ? statusClass[status] : "border-transparent",
                    today && !status ? "border-2 border-primary text-primary bg-primary/10" : "",
                    !status && !today ? "text-muted-foreground" : ""
                  )}
                >
                  {status ? (
                    <>
                      <span className="text-base leading-none">{statusIcon[status]}</span>
                      <span className="text-[9px] mt-0.5 opacity-70">{day}</span>
                    </>
                  ) : (
                    <span>{day}</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-border/30">
            {[
              { icon: "✅", label: "Concluído" },
              { icon: "⏳", label: "Parcial" },
              { icon: "❌", label: "Perdido" },
            ].map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <span>{icon}</span> {label}
              </div>
            ))}
          </div>
        </div>

        {/* Streak info */}
        {data.streak > 0 && (
          <div className="glass-card rounded-3xl p-5 border border-accent/20 shadow-card">
            <div className="flex items-center gap-3">
              <span className="text-4xl animate-fire">🔥</span>
              <div>
                <div className="font-bold text-foreground">Sequência atual: {data.streak} dias!</div>
                <div className="text-sm text-muted-foreground">
                  Recorde: {data.longestStreak} dias • Continue assim!
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
