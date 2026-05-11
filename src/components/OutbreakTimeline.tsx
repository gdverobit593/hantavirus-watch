"use client";

import { useState } from "react";
import { Calendar, ChevronLeft, ChevronRight, Info } from "lucide-react";

type OutbreakEvent = {
  year: string;
  title: { en: string; ru: string };
  location: { en: string; ru: string };
  description: { en: string; ru: string };
};

const outbreaks: OutbreakEvent[] = [
  {
    year: "1951",
    title: { en: "Korean War Outbreak", ru: "Корейская война" },
    location: { en: "Hantan River, Korea", ru: "Река Хантань, Корея" },
    description: { 
      en: "Over 3,000 soldiers affected by a mysterious hemorrhagic fever. Later identified as Hantaan virus.",
      ru: "Более 3000 солдат пострадали от загадочной геморрагической лихорадки. Позже вирус был идентифицирован как Хантаан."
    }
  },
  {
    year: "1976",
    title: { en: "Identification of Hantaan Virus", ru: "Идентификация вируса Хантаан" },
    location: { en: "South Korea", ru: "Южная Корея" },
    description: { 
      en: "Dr. Ho Wang Lee isolates the Hantaan virus, the cause of Korean hemorrhagic fever, from a striped field mouse.",
      ru: "Доктор Хо Ван Ли выделяет вирус Хантаан, причину корейской геморрагической лихорадки, из полевой мыши."
    }
  },
  {
    year: "1993",
    title: { en: "Four Corners Outbreak", ru: "Вспышка 'Четыре угла'" },
    location: { en: "Southwestern USA", ru: "Юго-запад США" },
    description: { 
      en: "Discovery of Sin Nombre virus after a series of respiratory distress cases in the Four Corners region.",
      ru: "Открытие вируса Sin Nombre после серии случаев респираторного дистресса в регионе Четырех Углов."
    }
  },
  {
    year: "1995",
    title: { en: "Andes Virus Identification", ru: "Идентификация вируса Андес" },
    location: { en: "Argentina", ru: "Аргентина" },
    description: { 
      en: "Identification of the Andes virus in El Bolsón, Argentina, during an outbreak of HPS.",
      ru: "Идентификация вируса Андес в Эль-Больсоне, Аргентина, во время вспышки ХПС."
    }
  },
  {
    year: "2012",
    title: { en: "Yosemite Outbreak", ru: "Вспышка в Йосемити" },
    location: { en: "Yosemite National Park, USA", ru: "Нацпарк Йосемити, США" },
    description: { 
      en: "Hantavirus Pulmonary Syndrome (HPS) cases linked to signature tent cabins in Curry Village.",
      ru: "Случаи Хантавирусного пульмонарного синдрома (ХПС), связанные с палатками в Curry Village."
    }
  },
  {
    year: "2019",
    title: { en: "Chubut Outbreak", ru: "Вспышка в Чубуте" },
    location: { en: "Epuyén, Argentina", ru: "Эпуэн, Аргентина" },
    description: { 
      en: "Evidence of person-to-person transmission of Andes virus during an outbreak in Patagonia.",
      ru: "Доказательства передачи вируса Андес от человека к человеку во время вспышки в Патагонии."
    }
  },
  {
    year: "2024",
    title: { en: "Recent Signals in Europe", ru: "Сигналы в Европе (2024)" },
    location: { en: "Germany and Finland", ru: "Германия и Финляндия" },
    description: { 
      en: "Increased Puumala virus activity reported in Central and Northern Europe linked to rodent population cycles.",
      ru: "Сообщения о повышенной активности вируса Пуумала в Центральной и Северной Европе, связанные с циклами популяции грызунов."
    }
  }
];

export default function OutbreakTimeline({ lang }: { lang: "en" | "ru" }) {
  const [activeIndex, setActiveInex] = useState(0);

  const next = () => setActiveInex((prev) => (prev + 1) % outbreaks.length);
  const prev = () => setActiveInex((prev) => (prev - 1 + outbreaks.length) % outbreaks.length);

  const active = outbreaks[activeIndex];

  return (
    <section className="mt-16 space-y-8">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-zinc-950 p-2 text-white dark:bg-white dark:text-black">
          <Calendar className="h-5 w-5" />
        </div>
        <h2 className="text-2xl font-black uppercase tracking-tighter text-zinc-950 dark:text-zinc-50">
          {lang === "ru" ? "История вспышек" : "Outbreak History"}
        </h2>
      </div>

      <div className="relative overflow-hidden rounded-[2.5rem] border border-black/5 bg-white p-8 shadow-xl dark:border-white/5 dark:bg-zinc-900/50 lg:p-12">
        <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-blue-500/5 blur-3xl" />
        
        <div className="relative flex flex-col gap-8">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-1 text-xs font-bold text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50 uppercase tracking-widest">
              {active.year}
            </div>
            
            <div className="space-y-2">
              <h3 className="text-3xl font-black text-zinc-950 dark:text-zinc-50">
                {active.title[lang]}
              </h3>
              <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                {active.location[lang]}
              </p>
            </div>

            <p className="max-w-2xl text-lg font-medium leading-relaxed text-zinc-600 dark:text-zinc-400">
              {active.description[lang]}
            </p>

            <div className="flex items-center gap-4 pt-4">
              <button 
                onClick={prev}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-black/5 bg-white shadow-sm transition-all hover:scale-110 hover:shadow-md dark:border-white/5 dark:bg-zinc-950"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button 
                onClick={next}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-black/5 bg-white shadow-sm transition-all hover:scale-110 hover:shadow-md dark:border-white/5 dark:bg-zinc-950"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
              <div className="ml-auto text-xs font-bold text-zinc-400 uppercase tracking-widest">
                {activeIndex + 1} / {outbreaks.length}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
