"use client";

import { useEffect, useState, useCallback } from "react";
import { Trophy, Star, Zap, ShieldCheck } from "lucide-react";

const XP_MAP_ACTION = 10;
const XP_QUIZ_ACTION = 50;
const XP_REPORT_DOWNLOAD = 30;
const XP_PER_LEVEL = 100;

export type VigilanceLevel = {
  xp: number;
  level: number;
  streak: number;
  lastVisit: string;
};

export function useVigilance() {
  const [stats, setStats] = useState<VigilanceLevel>({
    xp: 0,
    level: 1,
    streak: 0,
    lastVisit: new Date().toISOString(),
  });

  useEffect(() => {
    const saved = localStorage.getItem("vigilance_stats");
    if (saved) {
      const parsed = JSON.parse(saved);
      // Check streak
      const last = new Date(parsed.lastVisit);
      const now = new Date();
      const diffDays = Math.floor((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
      
      let nextStreak = parsed.streak;
      if (diffDays === 1) {
        nextStreak += 1;
      } else if (diffDays > 1) {
        nextStreak = 0;
      }

      const nextStats = { ...parsed, streak: nextStreak, lastVisit: now.toISOString() };
      setStats(nextStats);
      localStorage.setItem("vigilance_stats", JSON.stringify(nextStats));
    }
  }, []);

  const addXp = useCallback((amount: number) => {
    setStats((prev) => {
      const nextXp = prev.xp + amount;
      const nextLevel = Math.floor(nextXp / XP_PER_LEVEL) + 1;
      const nextStats = { ...prev, xp: nextXp, level: nextLevel };
      localStorage.setItem("vigilance_stats", JSON.stringify(nextStats));
      return nextStats;
    });
  }, []);

  return { stats, addXp };
}

export default function VigilanceDashboard({ lang }: { lang: "en" | "ru" }) {
  const { stats } = useVigilance();
  const progress = (stats.xp % XP_PER_LEVEL);
  
  const getLevelName = (lvl: number) => {
    if (lang === "ru") {
      if (lvl < 3) return "Наблюдатель";
      if (lvl < 6) return "Аналитик";
      if (lvl < 10) return "Страж";
      return "Эксперт биобезопасности";
    }
    if (lvl < 3) return "Observer";
    if (lvl < 6) return "Analyst";
    if (lvl < 10) return "Sentinel";
    return "Bio-Safety Expert";
  };

  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-black/5 bg-white/50 p-6 backdrop-blur-xl dark:border-white/5 dark:bg-zinc-900/50 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/20">
            <Trophy className="h-6 w-6" />
          </div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
              {lang === "ru" ? "Уровень бдительности" : "Vigilance Level"}
            </div>
            <div className="text-lg font-black text-zinc-950 dark:text-zinc-50">
              Lvl {stats.level} • {getLevelName(stats.level)}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1 text-amber-500">
            <Zap className="h-4 w-4 fill-current" />
            <span className="text-sm font-black">{stats.streak} {lang === "ru" ? "дня" : "days"}</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-zinc-400">
          <span>{stats.xp} XP</span>
          <span>{XP_PER_LEVEL} XP to Lvl {stats.level + 1}</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
          <div 
            className="h-full bg-blue-600 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(37,99,235,0.5)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-2">
        <div className="flex items-center gap-2 rounded-xl bg-black/5 p-3 dark:bg-white/5">
          <Star className="h-4 w-4 text-amber-500" />
          <div className="text-[10px] font-bold leading-tight">
            <div className="text-zinc-400">{lang === "ru" ? "Всего XP" : "Total XP"}</div>
            <div className="text-zinc-950 dark:text-zinc-50">{stats.xp}</div>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-black/5 p-3 dark:bg-white/5">
          <ShieldCheck className="h-4 w-4 text-emerald-500" />
          <div className="text-[10px] font-bold leading-tight">
            <div className="text-zinc-400">{lang === "ru" ? "Статус" : "Status"}</div>
            <div className="text-zinc-950 dark:text-zinc-50">{lang === "ru" ? "Активен" : "Active"}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { XP_MAP_ACTION, XP_QUIZ_ACTION, XP_REPORT_DOWNLOAD };
