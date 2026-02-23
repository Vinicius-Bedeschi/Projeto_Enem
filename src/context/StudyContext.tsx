import { createContext, useContext } from "react";
import { useStudyData } from "@/hooks/useStudyData";

const StudyContext = createContext<ReturnType<typeof useStudyData> | null>(null);

export function StudyProvider({ children }: { children: React.ReactNode }) {
  const study = useStudyData();
  return (
    <StudyContext.Provider value={study}>
      {children}
    </StudyContext.Provider>
  );
}

export function useStudy() {
  const ctx = useContext(StudyContext);
  if (!ctx) throw new Error("useStudy must be used inside StudyProvider");
  return ctx;
}