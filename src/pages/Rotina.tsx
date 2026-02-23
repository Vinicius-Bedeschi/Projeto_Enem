import { useState } from "react";
import { useStudyData } from "@/hooks/useStudyData";
import {
  StudyBlock, DayRoutine, DayOfWeek,
  DAY_NAMES_FULL, SUBJECTS, getSubjectColor, calcDurationHours
} from "@/lib/studyStorage";
import { cn } from "@/lib/utils";
import { Plus, Trash2, Clock, BookOpen, ChevronDown, ChevronUp, X, Check } from "lucide-react";

let blockIdCounter = Date.now();

function generateId() {
  return `block_${++blockIdCounter}`;
}

const DAYS: DayOfWeek[] = [1, 2, 3, 4, 5, 6, 0];

interface BlockFormProps {
  onSave: (block: Omit<StudyBlock, "id">) => void;
  onCancel: () => void;
  existingBlock?: StudyBlock;
  blockIndex: number;
}

function BlockForm({ onSave, onCancel, existingBlock, blockIndex }: BlockFormProps) {
  const [subject, setSubject] = useState(existingBlock?.subject || SUBJECTS[0]);
  const [startTime, setStartTime] = useState(existingBlock?.startTime || "08:00");
  const [endTime, setEndTime] = useState(existingBlock?.endTime || "10:00");

  const color = getSubjectColor(blockIndex);

  return (
    <div className="p-4 rounded-2xl bg-secondary/60 border border-border/50 space-y-3 animate-float-up">
      <div>
        <label className="text-xs text-muted-foreground font-medium mb-1 block">Matéria</label>
        <select
          value={subject}
          onChange={e => setSubject(e.target.value)}
          className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary"
        >
          {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-muted-foreground font-medium mb-1 block">Início</label>
          <input
            type="time"
            value={startTime}
            onChange={e => setStartTime(e.target.value)}
            className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground font-medium mb-1 block">Fim</label>
          <input
            type="time"
            value={endTime}
            onChange={e => setEndTime(e.target.value)}
            className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary"
          />
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onSave({ subject, startTime, endTime, color })}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl gradient-primary text-primary-foreground font-semibold text-sm"
        >
          <Check size={16} /> Salvar
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2.5 rounded-xl bg-secondary text-foreground font-semibold text-sm"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

export default function Rotina() {
  const { data, update } = useStudyData();
  const [expandedDay, setExpandedDay] = useState<DayOfWeek | null>(null);
  const [addingBlock, setAddingBlock] = useState<DayOfWeek | null>(null);

  const getDayRoutine = (day: DayOfWeek): DayRoutine => {
    return data.routine.find(r => r.day === day) || { day, blocks: [] };
  };

  const addBlock = (day: DayOfWeek, block: Omit<StudyBlock, "id">) => {
    update(prev => {
      const existingIdx = prev.routine.findIndex(r => r.day === day);
      const newBlock: StudyBlock = { ...block, id: generateId() };
      if (existingIdx >= 0) {
        const newRoutine = [...prev.routine];
        newRoutine[existingIdx] = {
          ...newRoutine[existingIdx],
          blocks: [...newRoutine[existingIdx].blocks, newBlock],
        };
        return { ...prev, routine: newRoutine };
      } else {
        return { ...prev, routine: [...prev.routine, { day, blocks: [newBlock] }] };
      }
    });
    setAddingBlock(null);
  };

  const removeBlock = (day: DayOfWeek, blockId: string) => {
    update(prev => {
      const newRoutine = prev.routine.map(r =>
        r.day === day ? { ...r, blocks: r.blocks.filter(b => b.id !== blockId) } : r
      ).filter(r => r.blocks.length > 0);
      return { ...prev, routine: newRoutine };
    });
  };

  const totalHoursPerWeek = DAYS.reduce((sum, day) => {
    const r = getDayRoutine(day);
    return sum + r.blocks.reduce((s, b) => s + calcDurationHours(b.startTime, b.endTime), 0);
  }, 0);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="relative overflow-hidden px-5 pt-12 pb-6">
        <div className="absolute inset-0 gradient-hero pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-1">
            <BookOpen size={20} className="text-primary" />
            <h1 className="text-xl font-black text-foreground">Minha Rotina</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            {totalHoursPerWeek.toFixed(1)}h por semana • {data.routine.reduce((s, r) => s + r.blocks.length, 0)} blocos
          </p>
        </div>
      </div>

      <div className="px-4 space-y-3">
        {DAYS.map(day => {
          const routine = getDayRoutine(day);
          const isExpanded = expandedDay === day;
          const dayHours = routine.blocks.reduce((s, b) => s + calcDurationHours(b.startTime, b.endTime), 0);

          return (
            <div key={day} className="glass-card rounded-3xl border border-border/50 overflow-hidden shadow-card">
              <button
                onClick={() => setExpandedDay(isExpanded ? null : day)}
                className="w-full flex items-center justify-between p-4"
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm",
                    routine.blocks.length > 0 ? "gradient-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                  )}>
                    {DAY_NAMES_FULL[day].slice(0, 3)}
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-foreground text-sm">{DAY_NAMES_FULL[day]}</div>
                    <div className="text-xs text-muted-foreground">
                      {routine.blocks.length === 0
                        ? "Sem blocos"
                        : `${routine.blocks.length} bloco${routine.blocks.length > 1 ? "s" : ""} • ${dayHours.toFixed(1)}h`}
                    </div>
                  </div>
                </div>
                {isExpanded ? <ChevronUp size={18} className="text-muted-foreground" /> : <ChevronDown size={18} className="text-muted-foreground" />}
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 space-y-2 animate-float-up">
                  {routine.blocks.map((block, idx) => (
                    <div
                      key={block.id}
                      className="flex items-center gap-3 p-3 rounded-2xl bg-secondary/40"
                      style={{ borderLeft: `3px solid ${block.color}` }}
                    >
                      <div className="flex-1">
                        <div className="font-semibold text-sm text-foreground">{block.subject}</div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                          <Clock size={10} />
                          {block.startTime} – {block.endTime}
                          <span className="ml-1">({calcDurationHours(block.startTime, block.endTime).toFixed(1)}h)</span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeBlock(day, block.id)}
                        className="p-2 rounded-xl hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}

                  {addingBlock === day ? (
                    <BlockForm
                      blockIndex={routine.blocks.length}
                      onSave={(block) => addBlock(day, block)}
                      onCancel={() => setAddingBlock(null)}
                    />
                  ) : (
                    <button
                      onClick={() => setAddingBlock(day)}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-dashed border-primary/30 text-primary text-sm font-semibold hover:bg-primary/5 transition-colors"
                    >
                      <Plus size={16} /> Adicionar bloco
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
