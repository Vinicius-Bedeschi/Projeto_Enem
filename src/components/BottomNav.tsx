import { useLocation, useNavigate } from "react-router-dom";
import { Home, Calendar, BarChart2, Trophy, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { path: "/", icon: Home, label: "Início" },
  { path: "/rotina", icon: BookOpen, label: "Rotina" },
  { path: "/calendario", icon: Calendar, label: "Calendário" },
  { path: "/stats", icon: BarChart2, label: "Stats" },
  { path: "/conquistas", icon: Trophy, label: "Conquistas" },
];

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 max-w-lg mx-auto">
      <div className="glass-card border-t border-border/50 px-2 pb-safe">
        <div className="flex items-center justify-around py-2">
          {tabs.map(({ path, icon: Icon, label }) => {
            const active = location.pathname === path;
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200",
                  active
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <div className={cn(
                  "relative p-1.5 rounded-xl transition-all duration-200",
                  active && "gradient-primary shadow-primary"
                )}>
                  <Icon size={20} className={active ? "text-primary-foreground" : ""} />
                </div>
                <span className={cn("text-[10px] font-semibold", active ? "text-primary" : "text-muted-foreground")}>
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
