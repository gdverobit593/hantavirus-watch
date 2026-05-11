"use client";

import { useEffect, useState } from "react";

export function useLiveSignals(lang: "en" | "ru") {
  const [liveSignals, setLiveSignals] = useState<Record<string, { count: number; headlines: string[] }>>({});
  const [totalSignals, setTotalSignals] = useState(0);

  useEffect(() => {
    async function fetchSignals() {
      try {
        const res = await fetch(`/api/map-signals?lang=${lang}&t=${Date.now()}`);
        const json = await res.json();
        if (json.success) {
          setLiveSignals(json.signals);
          const total = Object.values(json.signals).reduce((sum: number, s: any) => {
            const count = parseInt(String(s.count), 10);
            return sum + (isNaN(count) ? 0 : count);
          }, 0);
          console.log("Live signals total calculated:", total);
          setTotalSignals(total);
        }
      } catch (e) {
        console.error("Failed to fetch live signals", e);
      }
    }

    fetchSignals();
    const interval = setInterval(fetchSignals, 60000); // 60s
    return () => clearInterval(interval);
  }, [lang]);

  return { liveSignals, totalSignals };
}
