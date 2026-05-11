import Link from "next/link";
import { getDictionary } from "@/lib/dict";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";
import { VirusIcon, BookIcon, ShieldIcon, AlertIcon, HeartIcon, SendIcon } from "@/components/Icons";
import ExternalNewsFeed from "@/components/ExternalNewsFeed";
import MapClient from "./map/MapClient";
import { getLocalizedCountryData } from "@/lib/map/countryData";
import RiskAssessment from "@/components/RiskAssessment";
import VigilanceDashboard from "@/components/VigilanceDashboard";
import HealthTips from "@/components/HealthTips";
import GlobalStats from "@/components/GlobalStats";

export const dynamicParams = false;

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "ru" }];
}

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang: Locale = isLocale(rawLang) ? rawLang : defaultLocale;
  const dict = await getDictionary(lang);

  const countryData = getLocalizedCountryData(lang);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "name": dict.siteName,
    "description": dict.home.subtitle,
    "lastReviewed": "2026-05-10",
    "mainEntity": {
      "@type": "MedicalCondition",
      "name": "Hantavirus",
      "associatedAnatomy": {
        "@type": "AnatomicalStructure",
        "name": "Lungs, Kidneys"
      },
      "possibleTreatment": "Supportive care",
      "status": "Active monitoring"
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mb-8 grid gap-6 lg:grid-cols-[1fr_350px]">
        <VigilanceDashboard lang={lang} />
        <HealthTips lang={lang} />
      </div>
      
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-[2.5rem] border border-black/5 bg-white/40 p-8 shadow-2xl backdrop-blur-3xl dark:border-white/5 dark:bg-zinc-900/40 lg:p-12 hero-gradient">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-red-500/10 blur-[100px]" />
        <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-blue-500/10 blur-[100px]" />
        
        <div className="relative flex flex-col items-start gap-8 lg:flex-row lg:items-center">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-600 dark:bg-red-900/30 dark:text-red-400 uppercase tracking-wider border border-red-100 dark:border-red-800/50">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              Live Monitoring
            </div>
            
            <h1 className="text-4xl font-black tracking-tight text-zinc-950 dark:text-zinc-50 lg:text-6xl">
              {dict.home.title}
            </h1>
            
            <p className="max-w-2xl text-lg font-medium leading-relaxed text-zinc-600 dark:text-zinc-400">
              {dict.home.subtitle}
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                href={`/${lang}/reference`}
                className="inline-flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-8 py-4 text-sm font-bold text-zinc-900 transition-all hover:bg-zinc-50 hover:border-zinc-300 hover:shadow-lg hover:-translate-y-0.5 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
              >
                <BookIcon className="w-5 h-5" />
                {dict.nav.reference}
              </Link>
            </div>
          </div>
          
          <div className="hidden lg:block">
            <div className="relative h-64 w-64 lg:h-80 lg:w-80">
              <div className="absolute inset-0 animate-pulse rounded-full bg-red-500/20 blur-3xl" />
              <VirusIcon className="relative h-full w-full text-zinc-900/10 dark:text-white/10" />
            </div>
          </div>
        </div>
      </section>

      {/* Recent Alerts Ticker */}
      {(() => {
        const alerts = countryData.filter(c => c.riskLevel === "high" || c.riskLevel === "critical");
        if (!alerts.length) return null;
        return (
          <section className="mt-8 rounded-2xl border border-red-100 bg-red-50/50 p-4 dark:border-red-900/30 dark:bg-red-900/10">
            <div className="flex items-center gap-2 mb-3">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest text-red-600 dark:text-red-400">
                {lang === "ru" ? "Тревоги" : "Alerts"}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {alerts.slice(0, 8).map((c) => (
                <Link
                  key={c.iso3}
                  href={`/${lang}/map?country=${c.iso3}`}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-zinc-900 shadow-sm hover:bg-zinc-50 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800 border border-black/5 dark:border-white/10"
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${c.riskLevel === "critical" ? "bg-red-500" : "bg-orange-500"}`} />
                  {c.country}
                </Link>
              ))}
            </div>
          </section>
        );
      })()}

      {/* Global Statistics Summary */}
      <GlobalStats 
        dict={dict} 
        lang={lang} 
        baseCountryCount={countryData.length}
        baseHighRiskCount={countryData.filter(c => c.riskLevel === "high" || c.riskLevel === "critical").length}
        baseTotalSignals={countryData.reduce((sum, c) => sum + (c.casesTotal || 0), 0)}
      />

      {/* Global Monitoring Map Section */}
      <section className="mt-20 space-y-8">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-black text-zinc-950 dark:text-zinc-50 uppercase tracking-tighter">
            {dict.nav.map}
          </h2>
          <div className="flex items-center justify-between">
            <p className="text-zinc-500 font-medium">{dict.map.mvpNote}</p>
            <Link 
              href={`/${lang}/map`}
              className="group inline-flex items-center gap-1 text-sm font-bold text-blue-600 dark:text-blue-400"
            >
              {dict.map.details} 
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>
        
        <div className="relative overflow-hidden rounded-[2.5rem] border border-black/5 bg-white p-2 shadow-2xl dark:border-white/5 dark:bg-zinc-950">
          <div className="h-[750px] overflow-hidden rounded-[2rem]">
            <MapClient data={countryData} dict={dict} />
          </div>
        </div>
      </section>

      {/* Interactive Risk Assessment Tool */}
      <RiskAssessment lang={lang as "en" | "ru"} />

      {/* Telegram Community CTA */}
      <section className="mt-20">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-blue-700 p-8 shadow-2xl lg:p-12">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-[80px]" />
          <div className="relative flex flex-col items-center gap-8 text-center lg:flex-row lg:text-left">
            <div className="flex-1 space-y-4">
              <h2 className="text-3xl font-black tracking-tight text-white lg:text-4xl">
                {lang === "ru" ? "Присоединяйтесь к сообществу" : "Join the Community"}
              </h2>
              <p className="max-w-xl text-lg font-medium text-blue-50/80">
                {lang === "ru" 
                  ? "Получайте мгновенные уведомления о новых сигналах, обсуждайте ситуацию и делитесь данными в нашем Telegram-канале." 
                  : "Get instant alerts for new signals, discuss the situation, and share data in our Telegram channel."}
              </p>
            </div>
            <a
              href="https://t.me/HantavirusGM"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-2xl bg-white px-8 py-4 text-lg font-bold text-blue-600 transition-all hover:scale-105 hover:shadow-xl active:scale-95"
            >
              <SendIcon className="h-6 w-6" />
              {lang === "ru" ? "Подписаться" : "Join Channel"}
            </a>
          </div>
        </div>
      </section>

      {/* Enhanced Quick Access Cards */}
      <section className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Link href={`/${lang}/reference/what-is-hantavirus`} className="group relative overflow-hidden rounded-3xl border border-black/5 bg-white p-8 transition-all hover:shadow-2xl hover:-translate-y-1 dark:border-white/5 dark:bg-zinc-900/50">
          <div className="mb-6 inline-flex rounded-2xl bg-red-50 p-4 text-red-600 transition-colors group-hover:bg-red-500 group-hover:text-white dark:bg-red-900/20 dark:text-red-400">
            <VirusIcon className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-zinc-950 dark:text-zinc-50">{dict.home.quickCards.whatIs.title}</h3>
          <p className="mt-3 text-sm font-medium leading-relaxed text-zinc-600 dark:text-zinc-400">{dict.home.quickCards.whatIs.desc}</p>
        </Link>

        <Link href={`/${lang}/reference/symptoms`} className="group relative overflow-hidden rounded-3xl border border-black/5 bg-white p-8 transition-all hover:shadow-2xl hover:-translate-y-1 dark:border-white/5 dark:bg-zinc-900/50">
          <div className="mb-6 inline-flex rounded-2xl bg-amber-50 p-4 text-amber-600 transition-colors group-hover:bg-amber-500 group-hover:text-white dark:bg-amber-900/20 dark:text-amber-400">
            <AlertIcon className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-zinc-950 dark:text-zinc-50">{dict.home.quickCards.symptoms.title}</h3>
          <p className="mt-3 text-sm font-medium leading-relaxed text-zinc-600 dark:text-zinc-400">{dict.home.quickCards.symptoms.desc}</p>
        </Link>

        <Link href={`/${lang}/reference/prevention`} className="group relative overflow-hidden rounded-3xl border border-black/5 bg-white p-8 transition-all hover:shadow-2xl hover:-translate-y-1 dark:border-white/5 dark:bg-zinc-900/50">
          <div className="mb-6 inline-flex rounded-2xl bg-emerald-50 p-4 text-emerald-600 transition-colors group-hover:bg-emerald-500 group-hover:text-white dark:bg-red-900/20 dark:text-emerald-400">
            <ShieldIcon className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-zinc-950 dark:text-zinc-50">{dict.home.quickCards.prevention.title}</h3>
          <p className="mt-3 text-sm font-medium leading-relaxed text-zinc-600 dark:text-zinc-400">{dict.home.quickCards.prevention.desc}</p>
        </Link>

        <Link href={`/${lang}/reference/faq`} className="group relative overflow-hidden rounded-3xl border border-black/5 bg-white p-8 transition-all hover:shadow-2xl hover:-translate-y-1 dark:border-white/5 dark:bg-zinc-900/50">
          <div className="mb-6 inline-flex rounded-2xl bg-blue-50 p-4 text-blue-600 transition-colors group-hover:bg-blue-500 group-hover:text-white dark:bg-blue-900/20 dark:text-blue-400">
            <HeartIcon className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-zinc-950 dark:text-zinc-50">{dict.home.quickCards.faq.title}</h3>
          <p className="mt-3 text-sm font-medium leading-relaxed text-zinc-600 dark:text-zinc-400">{dict.home.quickCards.faq.desc}</p>
        </Link>
      </section>

      <div className="mt-24">
        <ExternalNewsFeed lang={lang as "en" | "ru"} />
      </div>
    </div>
  );
}
