"use client";

import { useState, useEffect } from "react";
import { useLiveSignals } from "@/lib/hooks/useLiveSignals";
import { Dictionary } from "@/lib/dict";
import { Locale } from "@/lib/i18n";

export default function GlobalStats({ 
  dict, 
  lang, 
  baseCountryCount, 
  baseHighRiskCount,
  baseTotalSignals 
}: { 
  dict: Dictionary; 
  lang: Locale;
  baseCountryCount: number;
  baseHighRiskCount: number;
  baseTotalSignals: number;
}) {
  const { totalSignals } = useLiveSignals(lang);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Total is the sum of live signals PLUS the base static totals
  const displayTotal = mounted ? (baseTotalSignals + totalSignals) : baseTotalSignals;

  return (
    <section className="mt-16 grid gap-4 sm:grid-cols-3">
      <div className="rounded-2xl border border-black/5 bg-white p-6 dark:border-white/5 dark:bg-zinc-900/50">
        <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
          {lang === "ru" ? "Стран на мониторинге" : "Countries monitored"}
        </div>
        <div className="mt-2 text-3xl font-black text-zinc-950 dark:text-zinc-50">
          {baseCountryCount}
        </div>
      </div>
      <div className="rounded-2xl border border-black/5 bg-white p-6 dark:border-white/5 dark:bg-zinc-900/50">
        <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
          {lang === "ru" ? "Всего сигналов" : "Total signals"}
        </div>
        <div className="mt-2 text-3xl font-black text-zinc-950 dark:text-zinc-50 animate-pulse-subtle">
          {displayTotal}
        </div>
      </div>
      <div className="rounded-2xl border border-black/5 bg-white p-6 dark:border-white/5 dark:bg-zinc-900/50">
        <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
          {lang === "ru" ? "Высокий риск" : "High risk"}
        </div>
        <div className="mt-2 text-3xl font-black text-red-600 dark:text-red-400">
          {baseHighRiskCount}
        </div>
      </div>
    </section>
  );
}
