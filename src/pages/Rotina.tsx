import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import { supabase } from "@/lib/supabase";
import "@/styles/calendar.css";

const subjectColors: Record<string, string> = {
  Matemática: "bg-blue-500",
  Português: "bg-red-500",
  História: "bg-yellow-500",
  Geografia: "bg-green-500",
  Biologia: "bg-emerald-500",
  Física: "bg-purple-500",
  Química: "bg-pink-500",
};

export default function Rotina() {
  const [plans, setPlans] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [subject, setSubject] = useState("");
  const [time, setTime] = useState("");
  const [openModal, setOpenModal] = useState(false);

  const formattedDate = selectedDate.toISOString().split("T")[0];

  async function fetchPlans() {
    const { data } = await supabase.from("plans").select("*");
    setPlans(data || []);
  }

  async function addPlan() {
    if (!subject || !time) return;

    await supabase.from("plans").insert([
      { date: formattedDate, subject, time },
    ]);

    setSubject("");
    setTime("");
    setOpenModal(false);
    fetchPlans();
  }

  async function deletePlan(id: string) {
    await supabase.from("plans").delete().eq("id", id);
    fetchPlans();
  }

  useEffect(() => {
    fetchPlans();
  }, []);

  const plansDoDia = plans.filter(p => p.date === formattedDate);

  return (
    <div className="min-h-screen bg-background pb-24">

      {/* HEADER */}
      <div className="relative overflow-hidden px-5 pt-12 pb-6">
        <div className="absolute inset-0 gradient-hero pointer-events-none" />
        <div className="relative">
          <h1 className="text-xl font-black text-foreground">Agenda</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Planeje seus estudos com flexibilidade
          </p>
        </div>
      </div>

      <div className="px-4 space-y-4">

        {/* CALENDÁRIO */}
        <div className="glass-card rounded-3xl p-4 border border-border/50 shadow-card">
          <Calendar
            onChange={(date) => {
              setSelectedDate(date as Date);
              setOpenModal(true);
            }}
            value={selectedDate}
            tileContent={({ date, view }) => {
              if (view === "month") {
                const formatted = date.toISOString().split("T")[0];

                const plansDoDia = plans.filter(p => p.date === formatted);

                if (plansDoDia.length > 0) {
                  return (
                    <div className="flex justify-center gap-1 mt-1 flex-wrap">
                      {plansDoDia.slice(0, 3).map((p, i) => (
                        <div
                          key={i}
                          className={`w-1.5 h-1.5 rounded-full ${
                            subjectColors[p.subject] || "bg-gray-500"
                          }`}
                        />
                      ))}
                    </div>
                  );
                }
              }
            }}
          />
        </div>
      </div>

      {/* MODAL */}
{openModal && (
  <div className="fixed inset-0 backdrop-blur-sm bg-black/40 flex items-center justify-center z-50">

    <div className="w-[90%] max-w-md bg-background rounded-3xl p-5 animate-float-up border border-border shadow-xl">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-foreground">
          {formattedDate}
        </h2>
        <button 
          onClick={() => setOpenModal(false)}
          className="text-muted-foreground hover:text-foreground"
        >
          ✖
        </button>
      </div>

      {/* LISTA */}
      <div className="space-y-2 mb-4 max-h-40 overflow-auto">
        {plansDoDia.length === 0 && (
          <p className="text-muted-foreground text-sm">
            Nenhum estudo
          </p>
        )}

        {plansDoDia.map(plan => (
          <div
            key={plan.id}
            className="flex justify-between items-center p-2 bg-secondary/40 rounded-xl"
          >
            <div>
              <div
                className={`text-xs px-2 py-1 rounded-md text-white w-fit ${
                  subjectColors[plan.subject] || "bg-gray-500"
                }`}
              >
                {plan.subject}
              </div>
              <div className="text-xs text-muted-foreground">
                🕒 {plan.time}
              </div>
            </div>

            <button onClick={() => deletePlan(plan.id)}>❌</button>
          </div>
        ))}
      </div>

      {/* FORM */}
      <div className="space-y-2">
        <input
          type="text"
          placeholder="Matéria"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full p-2 rounded-xl bg-secondary border border-border text-foreground"
        />

        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="w-full p-2 rounded-xl bg-secondary border border-border text-foreground"
        />

        <button
          onClick={addPlan}
          className="w-full py-2.5 rounded-xl gradient-primary text-primary-foreground font-semibold"
        >
          Salvar
        </button>
      </div>

    </div>
  </div>
)}
    </div>
  );
}