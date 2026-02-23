import { useState, useCallback } from "react";
import {
  AppData,
  loadData,
  saveData,
  getTodayKey,
  calculateLevel,
  checkAchievements,
  Achievement,
  calcDurationHours,
  getTodayDayOfWeek,
} from "@/lib/studyStorage";

export function useStudyData() {
  const [data, setData] = useState<AppData>(() => {
    const loaded = loadData();
    return normalizeStreak(loaded);
  });
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);

  function normalizeStreak(d: AppData): AppData {
    const today = getTodayKey();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = yesterday.toISOString().split("T")[0];

    // If last active date is neither today nor yesterday, reset streak (unless recovery)
    if (d.lastActiveDate && d.lastActiveDate !== today && d.lastActiveDate !== yesterdayKey) {
      // Check if it's been more than 2 days (recovery expired)
      const lastDate = new Date(d.lastActiveDate);
      const diffDays = Math.floor((new Date().getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays > 1 && !d.recoveryMode) {
        return { ...d, streak: 0, recoveryMode: false };
      }
      if (diffDays > 2) {
        return { ...d, streak: 0, recoveryMode: false };
      }
    }
    return d;
  }

  const update = useCallback((updater: (prev: AppData) => AppData) => {
    setData(prev => {
      const next = updater(prev);
      saveData(next);
      return next;
    });
  }, []);

  const markDay = useCallback((status: "done" | "partial" | "missed") => {
    const today = getTodayKey();

    setData(prev => {
      let next = { ...prev };
      const existingRecord = prev.records[today];

      // Calculate hours studied from today's routine
      const todayDow = getTodayDayOfWeek();
      const todayRoutine = prev.routine.find(r => r.day === todayDow);
      const hoursStudied = todayRoutine
        ? todayRoutine.blocks.reduce((sum, b) => sum + calcDurationHours(b.startTime, b.endTime), 0)
        : 1;

      const record = {
        date: today,
        status,
        hoursStudied: status === "partial" ? hoursStudied * 0.5 : status === "done" ? hoursStudied : 0,
      };

      next.records = { ...prev.records, [today]: record };
      next.lastActiveDate = today;

      if (status === "done" || status === "partial") {
        if (!existingRecord || existingRecord.status === "missed") {
          // First completion today
          if (status === "done") {
            if (prev.recoveryMode) {
              // Streak saved via recovery
              next.streak = prev.streak;
              next.recoveryMode = false;
            } else {
              next.streak = prev.streak + 1;
            }
            next.longestStreak = Math.max(next.streak, prev.longestStreak);
            next.totalDays = prev.totalDays + 1;
            next.xp = prev.xp + 50;
          } else {
            // partial — keep streak but no bonus
            next.totalDays = prev.totalDays + 1;
            next.xp = prev.xp + 20;
          }
        }
      } else if (status === "missed") {
        if (!existingRecord) {
          next.recoveryMode = true;
        }
      }

      next.level = calculateLevel(next.xp);

      // Check achievements
      const unlocked = checkAchievements(next);
      if (unlocked.length > 0) {
        next.achievements = [...prev.achievements, ...unlocked];
        setNewAchievements(unlocked);
        setTimeout(() => setNewAchievements([]), 5000);
      }

      saveData(next);
      return next;
    });
  }, []);

  const getTodayStatus = useCallback(() => {
    return data.records[getTodayKey()]?.status ?? null;
  }, [data.records]);

  const getMonthRecords = useCallback((year: number, month: number) => {
    const result: Record<number, string> = {};
    Object.values(data.records).forEach(r => {
      const d = new Date(r.date + "T12:00:00");
      if (d.getFullYear() === year && d.getMonth() === month) {
        result[d.getDate()] = r.status;
      }
    });
    return result;
  }, [data.records]);

  const getWeeklyHours = useCallback(() => {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);

    return Object.values(data.records)
      .filter(r => {
        const d = new Date(r.date + "T12:00:00");
        return d >= weekStart && r.hoursStudied;
      })
      .reduce((sum, r) => sum + (r.hoursStudied || 0), 0);
  }, [data.records]);

  const getSubjectStats = useCallback(() => {
    const stats: Record<string, number> = {};
    const todayDow = getTodayDayOfWeek();

    // Count hours per subject from all completed records
    Object.values(data.records).forEach(record => {
      if (record.status === "missed") return;
      const d = new Date(record.date + "T12:00:00");
      const dow = d.getDay();
      const routine = data.routine.find(r => r.day === dow);
      if (routine) {
        routine.blocks.forEach(block => {
          const h = calcDurationHours(block.startTime, block.endTime);
          const hours = record.status === "partial" ? h * 0.5 : h;
          stats[block.subject] = (stats[block.subject] || 0) + hours;
        });
      }
    });

    return Object.entries(stats)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [data]);

  return {
    data,
    setData,
    update,
    markDay,
    getTodayStatus,
    getMonthRecords,
    getWeeklyHours,
    getSubjectStats,
    newAchievements,
  };
}
