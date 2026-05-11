"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { SendIcon } from "./Icons";
import { useSearchParams } from "next/navigation";
import { RefreshCcw } from "lucide-react";

type Item = {
  title: string;
  link: string;
  publishedAt: string;
  source?: string;
  image?: string;
};

function formatDateTime(value: string, locale: "en" | "ru") {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat(locale === "ru" ? "ru-RU" : "en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default function ExternalNewsFeed({ lang }: { lang: "en" | "ru" }) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [q, setQ] = useState("");

  const load = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);
    try {
      const res = await fetch(`/api/external-news?lang=${lang}${isManual ? '&t=' + Date.now() : ''}`);
      const json = (await res.json()) as { items: Item[] };
      setItems(json.items || []);
    } finally {
      if (isManual) setRefreshing(false);
      else setLoading(false);
    }
  };

  useEffect(() => {
    try {
      const nextQ = new URLSearchParams(window.location.search).get("q") || "";
      setQ(nextQ.trim());
    } catch {
      setQ("");
    }
  }, []);

  useEffect(() => {
    load();
  }, [lang]);

  const filtered = useMemo(() => {
    if (!q) return items;
    const qq = q.toLowerCase();
    return items.filter((x) => (x.title || "").toLowerCase().includes(qq));
  }, [items, q]);

  const top = useMemo(() => filtered.filter((x) => !!x.image).slice(0, 10), [filtered]);

  if (loading) {
    return (
      <section className="mt-24 space-y-12">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="h-10 w-64 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-1.5 w-24 rounded-full bg-zinc-200 dark:bg-zinc-800" />
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex flex-col overflow-hidden rounded-[2rem] border border-black/5 bg-white dark:border-white/5 dark:bg-zinc-900/50">
              <div className="aspect-[16/10] w-full animate-pulse bg-zinc-200 dark:bg-zinc-800" />
              <div className="flex flex-1 flex-col p-8 space-y-4">
                <div className="h-4 w-32 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800" />
                <div className="h-6 w-full animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-6 w-3/4 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
                <div className="mt-auto pt-6 h-4 w-24 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!top.length) {
    return (
      <div className="rounded-3xl border border-black/10 bg-white p-8 dark:border-white/10 dark:bg-black">
        <p className="text-sm text-zinc-500 text-center">
          {lang === "ru"
            ? "Не удалось загрузить ленту новостей."
            : "Could not load the news feed."}
        </p>
      </div>
    );
  }

  return (
    <section id="news-section" className="mt-24 space-y-12">
      <div className="flex flex-col items-center text-center gap-4 relative">
        <h2 className="text-4xl font-black text-zinc-950 dark:text-zinc-50 uppercase tracking-tighter lg:text-5xl">
          {lang === "ru" ? "Актуальные новости" : "Latest Updates"}
        </h2>
        <div className="h-1.5 w-24 rounded-full bg-red-600" />
        
        <button
          onClick={() => load(true)}
          disabled={refreshing}
          className="absolute right-0 top-0 p-3 rounded-2xl border border-black/5 bg-white shadow-sm hover:shadow-md transition-all active:scale-95 disabled:opacity-50 dark:border-white/5 dark:bg-zinc-900"
          title={lang === "ru" ? "Обновить новости" : "Refresh news"}
        >
          <RefreshCcw className={`h-5 w-5 text-zinc-600 dark:text-zinc-400 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {q && (
        <div className="rounded-2xl border border-black/5 bg-white p-4 text-sm dark:border-white/5 dark:bg-zinc-900/50">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-zinc-700 dark:text-zinc-300">
              <span className="font-bold">
                {lang === "ru" ? "Фильтр:" : "Filter:"}
              </span>{" "}
              <span className="font-semibold">{q}</span>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={`/${lang}/map?search=${encodeURIComponent(q)}`}
                className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-4 py-2 text-[11px] font-bold text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-white uppercase tracking-wider"
              >
                {lang === "ru" ? "Открыть карту" : "Open map"}
              </Link>
              <Link
                href={`/${lang}#news-section`}
                className="text-[11px] font-bold text-zinc-500 hover:underline dark:text-zinc-400 uppercase tracking-wider"
              >
                {lang === "ru" ? "Сбросить" : "Clear"}
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {top.map((item) => {
          const isInternal = item.link.startsWith('/');
          const linkAria = (lang === "ru" ? "Открыть новость: " : "Open news: ") + item.title;
          
          return (
            <div key={item.link} className="group relative flex flex-col overflow-hidden rounded-[2rem] border border-black/5 bg-white transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 dark:border-white/5 dark:bg-zinc-900/50">
              {isInternal ? (
                <Link href={item.link} className="flex flex-col h-full">
                  <NewsContent item={item} lang={lang} />
                </Link>
              ) : (
                <a
                  href={item.link}
                  className="flex flex-col h-full"
                  target="_blank"
                  rel="noopener noreferrer"
                  referrerPolicy="no-referrer"
                  aria-label={linkAria}
                >
                  <NewsContent item={item} lang={lang} />
                </a>
              )}
              {/* Floating Share Button to avoid nested <a> tags */}
              <div className="absolute bottom-8 right-8 z-10">
                <a
                  href={`https://t.me/share/url?url=${encodeURIComponent(item.link)}&text=${encodeURIComponent(item.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-zinc-50/80 backdrop-blur-md border border-black/5 hover:bg-white text-zinc-400 hover:text-blue-500 transition-all shadow-sm dark:bg-zinc-800/80 dark:border-white/5 dark:hover:bg-zinc-700"
                  title="Share to Telegram"
                  aria-label="Share to Telegram"
                >
                  <SendIcon className="w-4 h-4" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-[10px] text-zinc-400 font-medium text-center italic border-t border-black/5 pt-4 dark:border-white/5">
        {lang === "ru"
          ? "Лента агрегируется автоматически из проверенных источников."
          : "Feed automatically aggregated from verified sources."}
      </p>
    </section>
  );
}

function NewsContent({ item, lang }: { item: Item; lang: "en" | "ru" }) {
  return (
    <>
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        {item.image ? (
          <img
            src={item.image}
            alt={item.title}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
            <span className="text-4xl opacity-20">☣️</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
        
        <div className="absolute top-4 left-4">
          <span className="inline-flex items-center rounded-lg bg-white/90 px-3 py-1 text-[10px] font-black text-zinc-900 shadow-xl backdrop-blur-md uppercase tracking-wider dark:bg-zinc-900/90 dark:text-zinc-50">
            {item.source || (lang === "ru" ? "ОТЧЕТ" : "REPORT")}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-8">
        <div className="mb-4 flex items-center gap-3">
          <span className="h-px flex-1 bg-zinc-100 dark:bg-zinc-800" />
          <time className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
            {formatDateTime(item.publishedAt, lang)}
          </time>
        </div>
        
        <h3 className="text-xl font-bold leading-tight text-zinc-950 group-hover:text-blue-600 dark:text-zinc-50 dark:group-hover:text-blue-400 transition-colors duration-300">
          {item.title}
        </h3>
        
        <div className="mt-auto pt-6 flex items-center justify-between">
          <span className="inline-flex items-center gap-2 text-xs font-black text-zinc-400 uppercase tracking-widest group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors">
            {lang === "ru" ? "Подробнее" : "Read More"}
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </span>
        </div>
      </div>
    </>
  );
}
