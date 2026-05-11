"use client";

import { useState, useEffect } from "react";
import { Lightbulb, RefreshCw } from "lucide-react";

const tips = [
  {
    en: "Keep rodents away from your home by sealing holes and using traps.",
    ru: "Не допускайте появления грызунов в доме: заделывайте отверстия и используйте ловушки."
  },
  {
    en: "Always wet down dusty areas before cleaning to prevent virus-laden dust from becoming airborne.",
    ru: "Всегда смачивайте запыленные места перед уборкой, чтобы вирус не поднялся в воздух с пылью."
  },
  {
    en: "Wear gloves and a mask when cleaning areas where rodents may have been.",
    ru: "При уборке мест, где могли быть грызуны, обязательно надевайте перчатки и маску."
  },
  {
    en: "Store food, including pet food, in rodent-proof containers.",
    ru: "Храните продукты и корм для животных в герметичных контейнерах, недоступных для грызунов."
  },
  {
    en: "Avoid sleeping on the bare ground in endemic areas.",
    ru: "Избегайте сна на голой земле в эндемичных районах."
  }
];

export default function HealthTips({ lang }: { lang: "en" | "ru" }) {
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    setTipIndex(Math.floor(Math.random() * tips.length));
  }, []);

  const nextTip = () => {
    setTipIndex((prev) => (prev + 1) % tips.length);
  };

  return (
    <div className="rounded-3xl border border-black/5 bg-amber-50/50 p-6 dark:border-white/5 dark:bg-amber-900/10 transition-all hover:shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="rounded-xl bg-amber-100 p-2 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
            <Lightbulb className="h-4 w-4" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-amber-700 dark:text-amber-400">
            {lang === "ru" ? "Совет дня" : "Daily Tip"}
          </span>
        </div>
        <button 
          onClick={nextTip}
          className="p-1.5 rounded-full hover:bg-amber-100 dark:hover:bg-amber-900/30 text-amber-600 transition-transform active:rotate-180"
          title={lang === "ru" ? "Следующий совет" : "Next tip"}
        >
          <RefreshCw className="h-3.5 w-3.5" />
        </button>
      </div>
      <p className="text-sm font-medium leading-relaxed text-zinc-700 dark:text-zinc-300">
        {tips[tipIndex][lang]}
      </p>
    </div>
  );
}
