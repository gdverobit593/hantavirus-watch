"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Activity, Zap } from "lucide-react";

type Signal = {
  country: string;
  iso3: string;
  count: number;
  headline?: string;
};

export default function LiveSignalTicker({ lang }: { lang: "en" | "ru" }) {
  const [signals, setSignals] = useState<Signal[]>([]);

  useEffect(() => {
    async function fetchSignals() {
      try {
        const res = await fetch(`/api/map-signals?lang=${lang}&t=${Date.now()}`);
        const json = await res.json();
        if (json.success) {
          const list: Signal[] = Object.entries(json.signals).map(([iso3, data]: [string, any]) => ({
            iso3,
            country: data.country || iso3,
            count: data.count,
            headline: data.headlines?.[0],
          })).filter(s => s.count > 0);
          setSignals(list);
        }
      } catch (e) {
        console.error("Ticker fetch failed", e);
      }
    }
    fetchSignals();
    const interval = setInterval(fetchSignals, 60000);
    return () => clearInterval(interval);
  }, [lang]);

  if (signals.length === 0) return null;

  // Repeat items for a continuous loop effect
  const displaySignals = [...signals, ...signals, ...signals];

  return (
    <div className="w-full bg-zinc-950 py-2 overflow-hidden border-b border-white/10 select-none">
      <div className="flex whitespace-nowrap animate-ticker items-center gap-12 px-4">
        {displaySignals.map((s, i) => (
          <Link 
            key={`${s.iso3}-${i}`} 
            href={`/${lang}/map?country=${s.iso3}`}
            className="group flex items-center gap-3 transition-opacity hover:opacity-80"
          >
            <div className="relative flex items-center justify-center">
              <Activity className="h-3.5 w-3.5 text-red-500" />
              <span className="absolute inset-0 animate-ping rounded-full bg-red-500/20" />
            </div>
            
            <div className="flex flex-col leading-none">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-zinc-50 uppercase tracking-widest">{s.country}</span>
                <span className="flex items-center gap-1 rounded bg-red-500 px-1.5 py-0.5 text-[9px] font-black text-white">
                  <Zap className="h-2 w-2 fill-current" />
                  {s.count} {lang === "ru" ? "СИГНАЛА" : "SIGNALS"}
                </span>
              </div>
              {s.headline && (
                <div className="mt-1 max-w-[200px] overflow-hidden text-ellipsis text-[9px] font-medium text-zinc-500 group-hover:text-zinc-400">
                  {s.headline}
                </div>
              )}
            </div>
            <div className="h-4 w-px bg-zinc-800 ml-4" />
          </Link>
        ))}
      </div>
      <style jsx>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-ticker {
          display: inline-flex;
          animation: ticker 40s linear infinite;
        }
        .animate-ticker:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
