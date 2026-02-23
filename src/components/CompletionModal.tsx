import { useState } from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2, Clock, XCircle, X, Flame } from "lucide-react";
import { MOTIVATIONAL_MESSAGES, PARTIAL_MESSAGES, RECOVERY_MESSAGES } from "@/lib/studyStorage";

interface CompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMark: (status: "done" | "partial" | "missed") => void;
  currentStatus: "done" | "partial" | "missed" | "recovery" | null;
  isRecovery: boolean;
}

export function CompletionModal({ isOpen, onClose, onMark, currentStatus, isRecovery }: CompletionModalProps) {
  const [selected, setSelected] = useState<"done" | "partial" | "missed" | null>(
    currentStatus === "recovery" ? null : currentStatus
  );
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState("");

  if (!isOpen) return null;

  const handleMark = (status: "done" | "partial" | "missed") => {
    setSelected(status);
    onMark(status);

    if (status === "missed") {
      onClose();
      return;
    }

    let msg = "";
    if (isRecovery && status === "done") {
      msg = RECOVERY_MESSAGES[Math.floor(Math.random() * RECOVERY_MESSAGES.length)];
    } else if (status === "partial") {
      msg = PARTIAL_MESSAGES[Math.floor(Math.random() * PARTIAL_MESSAGES.length)];
    } else {
      msg = MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)];
    }
    setMessage(msg);
    setShowMessage(true);

    setTimeout(() => {
      setShowMessage(false);
      onClose();
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className={cn(
        "relative w-full max-w-lg glass-card rounded-3xl p-6 shadow-card",
        "max-h-[90vh] overflow-y-auto transition-all duration-200"
      )}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground p-1"
        >
          <X size={20} />
        </button>

        {showMessage ? (
          <div className="text-center py-6 animate-bounce-in">
            <div className="text-5xl mb-4">
              {selected === "done" ? "🔥" : selected === "partial" ? "💪" : ""}
            </div>
            <p className="text-foreground font-semibold text-lg leading-relaxed">{message}</p>
          </div>
        ) : (
          <>
            <h2 className="text-lg font-bold text-foreground mb-1">Como foi hoje?</h2>
            <p className="text-muted-foreground text-sm mb-6">
              {isRecovery ? "🔄 Modo recuperação ativo — conclua hoje e salve seu streak!" : "Registre seu progresso de hoje"}
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => handleMark("done")}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200",
                  selected === "done"
                    ? "gradient-success border-transparent shadow-primary text-primary-foreground"
                    : "border-border hover:border-success/50 hover:bg-secondary/50"
                )}
              >
                <CheckCircle2 size={24} className={selected === "done" ? "text-primary-foreground" : "text-success"} />
                <div className="text-left">
                  <div className="font-bold text-sm">Estudo concluído! 🎉</div>
                  <div className={cn("text-xs mt-0.5", selected === "done" ? "text-primary-foreground/80" : "text-muted-foreground")}>
                    +50 XP • Streak mantido
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleMark("partial")}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200",
                  selected === "partial"
                    ? "bg-warning/20 border-warning/50"
                    : "border-border hover:border-warning/30 hover:bg-secondary/50"
                )}
              >
                <Clock size={24} className="text-warning" />
                <div className="text-left">
                  <div className="font-bold text-sm text-foreground">Concluí parcialmente</div>
                  <div className="text-xs text-muted-foreground mt-0.5">+20 XP • Streak mantido sem bônus</div>
                </div>
              </button>

              <button
                onClick={() => handleMark("missed")}
                className="flex items-center gap-4 p-4 rounded-2xl border border-border hover:border-destructive/30 hover:bg-secondary/50 transition-all duration-200"
              >
                <XCircle size={24} className="text-muted-foreground" />
                <div className="text-left">
                  <div className="font-bold text-sm text-foreground">Não consegui estudar hoje</div>
                  <div className="text-xs text-muted-foreground mt-0.5">Modo recuperação ativado amanhã</div>
                </div>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
