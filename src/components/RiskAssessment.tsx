"use client";

import { useState } from "react";
import { ShieldAlert, CheckCircle2, ChevronRight, RefreshCcw, AlertTriangle } from "lucide-react";
import { useVigilance, XP_QUIZ_ACTION } from "./VigilanceDashboard";

type Question = {
  id: number;
  text: { en: string; ru: string };
  options: {
    id: string;
    text: { en: string; ru: string };
    score: number;
  }[];
};

const questions: Question[] = [
  {
    id: 1,
    text: {
      en: "Have you recently been in a rural or forested area?",
      ru: "Вы недавно были в сельской местности или в лесу?",
    },
    options: [
      { id: "a", text: { en: "Yes, frequently", ru: "Да, часто" }, score: 3 },
      { id: "b", text: { en: "Occasionally", ru: "Изредка" }, score: 1 },
      { id: "c", text: { en: "No", ru: "Нет" }, score: 0 },
    ],
  },
  {
    id: 2,
    text: {
      en: "Have you cleaned any dusty spaces (attics, barns, sheds) lately?",
      ru: "Вы недавно проводили уборку в пыльных помещениях (чердаки, сараи, подвалы)?",
    },
    options: [
      { id: "a", text: { en: "Yes, without a mask", ru: "Да, без маски" }, score: 5 },
      { id: "b", text: { en: "Yes, with protection", ru: "Да, в средствах защиты" }, score: 1 },
      { id: "c", text: { en: "No", ru: "Нет" }, score: 0 },
    ],
  },
  {
    id: 3,
    text: {
      en: "Have you noticed any signs of rodents in your living/working area?",
      ru: "Вы замечали следы грызунов там, где живете или работаете?",
    },
    options: [
      { id: "a", text: { en: "Yes, active infestation", ru: "Да, активные следы" }, score: 4 },
      { id: "b", text: { en: "Found some old droppings", ru: "Находил старые следы" }, score: 2 },
      { id: "c", text: { en: "No signs", ru: "Признаков нет" }, score: 0 },
    ],
  },
  {
    id: 4,
    text: {
      en: "Are you currently experiencing flu-like symptoms (fever, muscle ache)?",
      ru: "Чувствуете ли вы симптомы гриппа (лихорадка, боли в мышцах)?",
    },
    options: [
      { id: "a", text: { en: "Yes, severe", ru: "Да, сильные" }, score: 4 },
      { id: "b", text: { en: "Mild symptoms", ru: "Легкое недомогание" }, score: 2 },
      { id: "c", text: { en: "I feel fine", ru: "Чувствую себя хорошо" }, score: 0 },
    ],
  },
];

export default function RiskAssessment({ lang }: { lang: "en" | "ru" }) {
  const [step, setStep] = useState(0); // 0: Start, 1-N: Questions, N+1: Result
  const [totalScore, setTotalScore] = useState(0);
  const { addXp } = useVigilance();

  const startQuiz = () => setStep(1);
  const resetQuiz = () => {
    setStep(0);
    setTotalScore(0);
  };

  const handleAnswer = (score: number) => {
    setTotalScore(totalScore + score);
    if (step === questions.length) {
      addXp(XP_QUIZ_ACTION);
    }
    setStep(step + 1);
  };

  const getResult = () => {
    if (totalScore >= 10) return {
      level: "High Risk",
      levelRu: "Высокий риск",
      color: "text-red-600 bg-red-50 dark:bg-red-900/20",
      desc: lang === "ru" 
        ? "Рекомендуется немедленно проконсультироваться с врачом и сообщить о возможном контакте с грызунами." 
        : "It is recommended to consult a doctor immediately and report possible contact with rodents.",
      icon: <ShieldAlert className="w-12 h-12 text-red-600" />
    };
    if (totalScore >= 5) return {
      level: "Moderate Risk",
      levelRu: "Умеренный риск",
      color: "text-amber-600 bg-amber-50 dark:bg-amber-900/20",
      desc: lang === "ru"
        ? "Будьте внимательны к своему состоянию. Избегайте контакта с пылью в закрытых помещениях."
        : "Monitor your health closely. Avoid contact with dust in enclosed spaces.",
      icon: <AlertTriangle className="w-12 h-12 text-amber-600" />
    };
    return {
      level: "Low Risk",
      levelRu: "Низкий риск",
      color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20",
      desc: lang === "ru"
        ? "Ваш текущий риск оценивается как низкий. Продолжайте соблюдать базовые меры гигиены."
        : "Your current risk is estimated as low. Continue following basic hygiene measures.",
      icon: <CheckCircle2 className="w-12 h-12 text-emerald-600" />
    };
  };

  const result = getResult();

  return (
    <section className="mt-20">
      <div className="relative overflow-hidden rounded-[2.5rem] border border-black/5 bg-white p-8 shadow-2xl dark:border-white/5 dark:bg-zinc-900/50 lg:p-12">
        <div className="absolute right-0 top-0 h-32 w-32 translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-3xl" />
        
        {step === 0 && (
          <div className="relative flex flex-col items-center text-center gap-6">
            <div className="rounded-2xl bg-blue-50 p-4 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-zinc-950 dark:text-zinc-50 uppercase tracking-tighter">
                {lang === "ru" ? "Оцените свой риск" : "Assess Your Risk"}
              </h2>
              <p className="max-w-md text-zinc-500 font-medium">
                {lang === "ru" 
                  ? "Пройдите быстрый тест, чтобы узнать вероятность заражения хантавирусом в вашей ситуации." 
                  : "Take a quick test to find out the likelihood of hantavirus infection in your situation."}
              </p>
            </div>
            <button
              onClick={startQuiz}
              className="group inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-8 py-4 text-sm font-black text-white transition-all hover:bg-blue-700 hover:shadow-xl hover:-translate-y-0.5"
            >
              {lang === "ru" ? "Начать тест" : "Start Test"}
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
            <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest mt-4">
              {lang === "ru" ? "Анонимно и бесплатно" : "Anonymous and Free"}
            </p>
          </div>
        )}

        {step > 0 && step <= questions.length && (
          <div className="relative space-y-8">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400">
                {lang === "ru" ? `Вопрос ${step} из ${questions.length}` : `Question ${step} of ${questions.length}`}
              </span>
              <div className="h-1.5 w-32 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                <div 
                  className="h-full bg-blue-600 transition-all duration-500" 
                  style={{ width: `${(step / questions.length) * 100}%` }}
                />
              </div>
            </div>

            <h3 className="text-2xl font-bold text-zinc-950 dark:text-zinc-50 leading-tight">
              {questions[step - 1].text[lang]}
            </h3>

            <div className="grid gap-3">
              {questions[step - 1].options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleAnswer(opt.score)}
                  className="flex items-center justify-between rounded-2xl border border-black/5 bg-zinc-50/50 p-6 text-left font-bold text-zinc-900 transition-all hover:border-blue-500/50 hover:bg-white hover:shadow-lg dark:border-white/5 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900"
                >
                  {opt.text[lang]}
                  <ChevronRight className="w-4 h-4 text-zinc-300" />
                </button>
              ))}
            </div>
          </div>
        )}

        {step > questions.length && (
          <div className="relative flex flex-col items-center text-center gap-8 animate-in fade-in zoom-in duration-500">
            <div className={`rounded-3xl p-6 ${result.color}`}>
              {result.icon}
            </div>
            
            <div className="space-y-3">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                {lang === "ru" ? "Ваш результат" : "Your Result"}
              </h3>
              <div className={`text-4xl font-black uppercase tracking-tighter ${result.color.split(' ')[0]}`}>
                {lang === "ru" ? result.levelRu : result.level}
              </div>
              <p className="max-w-md text-lg font-medium text-zinc-600 dark:text-zinc-300 leading-relaxed">
                {result.desc}
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <button
                onClick={resetQuiz}
                className="inline-flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-8 py-4 text-sm font-black text-zinc-900 transition-all hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
              >
                <RefreshCcw className="w-4 h-4" />
                {lang === "ru" ? "Пройти заново" : "Retake Test"}
              </button>
            </div>

            <p className="max-w-sm text-[10px] font-bold text-zinc-400 uppercase leading-relaxed">
              {lang === "ru" 
                ? "Этот тест не является медицинской диагностикой. При наличии симптомов обратитесь к врачу." 
                : "This test is not a medical diagnosis. If you have symptoms, seek professional medical help."}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
