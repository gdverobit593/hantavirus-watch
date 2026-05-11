"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { Search, Filter, X, Share2, Check, TrendingUp, Link as LinkIcon, Send as SendIcon, Download, Heart, Globe as GlobeIcon } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import WorldMap from "@/components/WorldMap";
import type { CountryDatum } from "@/lib/map/countryData";
import type { Dictionary } from "@/lib/dict";
import { useVigilance, XP_MAP_ACTION, XP_REPORT_DOWNLOAD } from "@/components/VigilanceDashboard";

const generateTrendData = (baseScore: number) => {
  const data = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(now.getDate() - i * 5);
    data.push({
      date: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      mentions: Math.max(0, Math.floor(baseScore * (0.8 + Math.random() * 0.4))),
    });
  }
  return data;
};

export default function MapClient({
  data,
  dict,
}: {
  data: CountryDatum[];
  dict: Dictionary;
}) {
  const [selected, setSelected] = useState<CountryDatum | null>(null);
  const [liveSignals, setLiveSignals] = useState<Record<string, { count: number; headlines: string[] }>>({});
  const [newsItems, setNewsItems] = useState<
    { title: string; link: string; publishedAt: string; source?: string; image?: string }[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRisk, setFilterRisk] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { addXp } = useVigilance();

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const search = params.get("search") || "";
      if (search.trim()) setSearchQuery(search.trim());
      const risk = params.get("risk");
      if (risk) setFilterRisk(risk);
      const countryIso = params.get("country");
      if (countryIso) {
        const found = data.find((d) => d.iso3.toLowerCase() === countryIso.toLowerCase());
        if (found) setSelected(found);
      }
    } catch {
      // ignore
    }
  }, [data]);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  // Sync URL state (country/search/risk) without page reload
  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      if (selected) url.searchParams.set("country", selected.iso3);
      else url.searchParams.delete("country");
      if (searchQuery) url.searchParams.set("search", searchQuery);
      else url.searchParams.delete("search");
      if (filterRisk) url.searchParams.set("risk", filterRisk);
      else url.searchParams.delete("risk");
      window.history.replaceState({}, "", url.toString());
    } catch {
      // ignore
    }
  }, [selected, searchQuery, filterRisk]);

  useEffect(() => {
    if (selected) {
      addXp(XP_MAP_ACTION / 2); // Small XP for just selecting
    }
  }, [selected, addXp]);

  const handleCopyLink = async () => {
    if (!selectedWithLive) return;
    try {
      const url = new URL(window.location.href);
      url.searchParams.set("country", selectedWithLive.iso3);
      await navigator.clipboard.writeText(url.toString());
      setCopied(true);
      addXp(XP_MAP_ACTION);
    } catch {
      // ignore
    }
  };

  const handleShare = async (country: string) => {
    const text = dict.nav.home === "Главная" 
      ? `Оперативная сводка по хантавирусу: ${country}. Текущий мониторинг и риски на Hantavirus Watch.`
      : `Hantavirus update for ${country}. Current monitoring and risks on Hantavirus Watch.`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Hantavirus Watch',
          text: text,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Share failed:", err);
      }
    } else {
      await navigator.clipboard.writeText(`${text} ${window.location.href}`);
      setCopied(true);
    }
  };

  useEffect(() => {
    async function fetchSignals() {
      try {
        const res = await fetch(`/api/map-signals?lang=${dict.nav.home === "Главная" ? "ru" : "en"}`);
        const json = await res.json();
        if (json.success) {
          setLiveSignals(json.signals);
        }
      } catch (e) {
        console.error("Failed to fetch live map signals", e);
      }
    }
    fetchSignals();
    const interval = setInterval(fetchSignals, 60000);
    return () => clearInterval(interval);
  }, [dict]);

  useEffect(() => {
    let canceled = false;
    async function loadNews() {
      try {
        const lang = dict.nav.home === "Главная" ? "ru" : "en";
        const res = await fetch(`/api/external-news?lang=${lang}`);
        const json = (await res.json()) as {
          items?: { title: string; link: string; publishedAt: string; source?: string; image?: string }[];
        };
        if (!canceled) setNewsItems(Array.isArray(json.items) ? json.items : []);
      } catch {
        if (!canceled) setNewsItems([]);
      }
    }
    loadNews();
    return () => {
      canceled = true;
    };
  }, [dict]);

  const mergedData = useMemo(() => {
    let result = data.map(item => {
      const live = liveSignals[item.iso3];
      if (live) {
        return {
          ...item,
          casesTotal: (item.casesTotal || 0) + live.count,
          // Store headlines for the detail view
          liveHeadlines: live.headlines
        };
      }
      return item;
    });

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(d => 
        d.country.toLowerCase().includes(q) || 
        d.iso3.toLowerCase().includes(q)
      );
    }

    if (filterRisk) {
      result = result.filter(d => d.riskLevel === filterRisk);
    }

    return result;
  }, [data, liveSignals, searchQuery, filterRisk]);

  const sources = useMemo(() => selected?.sources ?? [], [selected]);

  const confidence = useMemo(() => {
    if (!selected) return null;

    const liveCount = liveSignals[selected.iso3]?.count ?? 0;
    const sourcesCount = (selected.sources ?? []).length;

    if (liveCount >= 8 || sourcesCount >= 2) return "high" as const;
    if (liveCount >= 3 || sourcesCount >= 1) return "medium" as const;
    return "low" as const;
  }, [selected, liveSignals]);

  const confidenceLabel = useMemo(() => {
    if (!confidence) return "";
    if (confidence === "high") return dict.map.confidenceHigh;
    if (confidence === "medium") return dict.map.confidenceMedium;
    return dict.map.confidenceLow;
  }, [confidence, dict]);

  const confidenceBadgeClass = useMemo(() => {
    if (!confidence) return "";
    if (confidence === "high") return "bg-emerald-500 text-white";
    if (confidence === "medium") return "bg-amber-500 text-white";
    return "bg-zinc-500 text-white";
  }, [confidence]);

  const selectedWithLive = useMemo(() => {
    if (!selected) return null;
    return mergedData.find(d => d.iso3 === selected.iso3) || selected;
  }, [selected, mergedData]);

  const relatedNews = useMemo(() => {
    if (!selectedWithLive) return [] as typeof newsItems;
    const name = selectedWithLive.country.toLowerCase();
    const iso = selectedWithLive.iso3.toLowerCase();

    const aliasesByIso: Record<string, string[]> = {
      usa: ["us", "u s", "united states", "america"],
      gbr: ["uk", "u k", "united kingdom", "britain", "england"],
      rus: ["russia", "russian"],
      deu: ["germany", "deutschland"],
      chn: ["china", "prc"],
    };

    const aliases = aliasesByIso[iso] ?? [];

    const matches = newsItems.filter((n) => {
      const t = (n.title || "").toLowerCase();
      if (t.includes(name)) return true;
      if (aliases.some((a) => t.includes(a))) return true;
      return false;
    });

    return matches.slice(0, 5);
  }, [newsItems, selectedWithLive]);

  const langSegment = dict.nav.home === "Главная" ? "ru" : "en";

  const fallbackSources = useMemo(() => {
    if (!selectedWithLive) return [] as { label: string; url: string }[];
    if ((selectedWithLive.sources ?? []).length > 0) return selectedWithLive.sources ?? [];
    return [
      {
        label: dict.nav.methodology,
        url: `/${dict.nav.home === "Главная" ? "ru" : "en"}/methodology`,
      },
    ];
  }, [selectedWithLive, dict]);

  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    let buffer = "";
    const handleKeyDown = (e: KeyboardEvent) => {
      buffer += e.key.toLowerCase();
      if (buffer.endsWith("virus")) {
        setIsScanning(true);
        setTimeout(() => setIsScanning(false), 3000);
        buffer = "";
      }
      if (buffer.length > 10) buffer = buffer.slice(-10);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsInitialLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-4 rounded-3xl border border-black/5 bg-white/50 p-4 backdrop-blur-xl dark:border-white/5 dark:bg-zinc-900/50">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            aria-label={dict.map.searchPlaceholder}
            placeholder={dict.map.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border border-black/5 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-white/5 dark:bg-zinc-950"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2" aria-label={dict.nav.home === "Главная" ? "Очистить поиск" : "Clear search"}>
              <X className="h-4 w-4 text-zinc-400 hover:text-zinc-600" />
            </button>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-zinc-400" />
          <select
            aria-label={dict.map.allRiskLevels}
            value={filterRisk || ""}
            onChange={(e) => setFilterRisk(e.target.value || null)}
            className="rounded-2xl border border-black/5 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-white/5 dark:bg-zinc-950"
          >
            <option value="">{dict.map.allRiskLevels}</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <GlobeIcon className="h-4 w-4 text-zinc-400" />
          <select
            aria-label={langSegment === "ru" ? "Выбрать страну" : "Quick jump..."}
            value={selected?.iso3 || ""}
            onChange={(e) => {
              const found = data.find(d => d.iso3 === e.target.value);
              if (found) setSelected(found);
            }}
            className="rounded-2xl border border-black/5 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-white/5 dark:bg-zinc-950"
          >
            <option value="">{langSegment === "ru" ? "Перейти к стране..." : "Quick jump..."}</option>
            {data.sort((a, b) => a.country.localeCompare(b.country)).map(c => (
              <option key={c.iso3} value={c.iso3}>{c.country}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className={`relative overflow-hidden rounded-[2.5rem] border border-black/5 bg-white p-2 shadow-2xl dark:border-white/5 dark:bg-zinc-950 transition-opacity duration-500 ${isInitialLoading ? 'opacity-50' : 'opacity-100'}`}>
          <WorldMap data={mergedData} onSelect={setSelected} />
          {isScanning && (
            <div className="pointer-events-none absolute inset-0 z-50 overflow-hidden rounded-[2rem]">
              <div className="absolute inset-0 bg-blue-500/5 backdrop-grayscale-[0.2]" />
              <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-b from-blue-400 to-transparent animate-scan" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-[10vw] font-black text-blue-500/10 uppercase tracking-[2em] animate-pulse">
                  Scanning
                </div>
              </div>
            </div>
          )}
          {isInitialLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/10 backdrop-blur-sm dark:bg-black/10">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
            </div>
          )}
        </div>

        <div className="flex flex-col overflow-hidden rounded-2xl border border-black/10 bg-white dark:border-white/10 dark:bg-black shadow-xl">
          <div className="border-b border-black/5 p-6 dark:border-white/5 bg-zinc-50/50 dark:bg-zinc-900/50">
            <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
              {dict.map.details}
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar text-sm" style={{ maxHeight: "600px" }}>
            {isInitialLoading ? (
              <div className="space-y-6 animate-pulse">
                <div className="h-8 w-3/4 bg-zinc-100 dark:bg-zinc-800 rounded" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-16 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl" />
                  <div className="h-16 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl" />
                </div>
                <div className="h-16 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl" />
                <div className="space-y-2">
                  <div className="h-4 w-1/4 bg-zinc-100 dark:bg-zinc-800 rounded" />
                  <div className="h-4 w-full bg-zinc-100 dark:bg-zinc-800 rounded" />
                  <div className="h-4 w-full bg-zinc-100 dark:bg-zinc-800 rounded" />
                </div>
              </div>
            ) : selectedWithLive ? (
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-lg font-bold text-zinc-950 dark:text-zinc-50">
                    {selectedWithLive.country}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleShare(selectedWithLive.country)}
                      className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors"
                      title={dict.map.shareReport}
                      aria-label={dict.map.shareReport}
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    <a
                      href={`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(dict.nav.home === "Главная" ? `Оперативная сводка по хантавирусу: ${selectedWithLive.country}. Текущий мониторинг и риски на Hantavirus Watch.` : `Hantavirus update for ${selectedWithLive.country}. Current monitoring and risks on Hantavirus Watch.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors"
                      title="Share to Telegram"
                      aria-label="Share to Telegram"
                    >
                      <SendIcon className="w-4 h-4" />
                    </a>
                    <button
                      onClick={handleCopyLink}
                      className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors"
                      title={dict.nav.home === "Главная" ? "Копировать ссылку" : "Copy link"}
                      aria-label={dict.nav.home === "Главная" ? "Копировать ссылку" : "Copy link"}
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <LinkIcon className="w-4 h-4" />}
                    </button>
                    <span className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${
                      selectedWithLive.riskLevel === 'critical' ? 'bg-red-500 text-white' :
                      selectedWithLive.riskLevel === 'high' ? 'bg-orange-500 text-white' :
                      selectedWithLive.riskLevel === 'medium' ? 'bg-amber-500 text-white' :
                      'bg-emerald-500 text-white'
                    }`}>
                      {selectedWithLive.riskLevel || 'low'} {dict.map.riskLevel}
                    </span>
                  </div>
                </div>

                <dl className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-xl bg-zinc-50 p-3 dark:bg-zinc-900/50 border border-black/5 dark:border-white/5">
                      <dt className="text-[10px] font-bold text-zinc-500 uppercase">{dict.map.status}</dt>
                      <dd className="mt-1 font-bold text-zinc-900 dark:text-zinc-50">{selectedWithLive.status}</dd>
                    </div>
                    <div className="rounded-xl bg-zinc-50 p-3 dark:bg-zinc-900/50 border border-black/5 dark:border-white/5">
                      <dt className="text-[10px] font-bold text-zinc-500 uppercase">{dict.map.endemic}</dt>
                      <dd className="mt-1 font-bold text-zinc-900 dark:text-zinc-50">
                        {selectedWithLive.endemic === true ? dict.map.yes : dict.map.no}
                      </dd>
                    </div>
                  </div>

                  {confidence && (
                    <div className="rounded-xl bg-zinc-50 p-3 dark:bg-zinc-900/50 border border-black/5 dark:border-white/5">
                      <dt className="text-[10px] font-bold text-zinc-500 uppercase">{dict.map.confidence}</dt>
                      <dd className="mt-1">
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${confidenceBadgeClass}`}>
                          {confidenceLabel}
                        </span>
                      </dd>
                    </div>
                  )}

                  {selectedWithLive.strains && selectedWithLive.strains.length > 0 && (
                    <div className="space-y-1">
                      <dt className="text-[10px] font-bold text-zinc-500 uppercase">{dict.map.viralStrains}</dt>
                      <dd className="flex flex-wrap gap-1">
                        {selectedWithLive.strains.map(s => (
                          <span key={s} className="rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-100 dark:border-blue-800">
                            {s}
                          </span>
                        ))}
                      </dd>
                    </div>
                  )}

                  {selectedWithLive.primaryHosts && selectedWithLive.primaryHosts.length > 0 && (
                    <div className="space-y-1">
                      <dt className="text-[10px] font-bold text-zinc-500 uppercase">{dict.map.primaryHosts}</dt>
                      <dd className="text-zinc-700 dark:text-zinc-300 text-xs italic">
                        {selectedWithLive.primaryHosts.join(", ")}
                      </dd>
                    </div>
                  )}

                  {selectedWithLive.transmission && (
                    <div className="space-y-1">
                      <dt className="text-[10px] font-bold text-zinc-500 uppercase">{dict.map.transmissionPath}</dt>
                      <dd className="text-zinc-700 dark:text-zinc-300 text-xs leading-relaxed">
                        {selectedWithLive.transmission}
                      </dd>
                    </div>
                  )}

                  {selectedWithLive.recommendations && selectedWithLive.recommendations.length > 0 && (
                    <div className="rounded-xl bg-emerald-50/50 p-4 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30">
                      <dt className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 uppercase mb-2">{dict.map.preventionRecs}</dt>
                      <dd>
                        <ul className="space-y-1.5">
                          {selectedWithLive.recommendations.map((r, i) => (
                            <li key={i} className="flex gap-2 text-[11px] text-zinc-700 dark:text-zinc-300">
                              <span className="text-emerald-500">•</span>
                              {r}
                            </li>
                          ))}
                        </ul>
                      </dd>
                    </div>
                  )}

                  {selectedWithLive.symptoms && selectedWithLive.symptoms.length > 0 && (
                    <div className="space-y-1">
                      <dt className="text-[10px] font-bold text-zinc-500 uppercase">{dict.map.typicalSymptoms}</dt>
                      <dd className="flex flex-wrap gap-1">
                        {selectedWithLive.symptoms.map(s => (
                          <span key={s} className="rounded-md bg-red-50 px-2 py-0.5 text-[11px] font-medium text-red-700 dark:bg-red-900/30 dark:text-red-300 border border-red-100 dark:border-red-800">
                            {s}
                          </span>
                        ))}
                      </dd>
                    </div>
                  )}

                  {selectedWithLive.diagnostics && selectedWithLive.diagnostics.length > 0 && (
                    <div className="space-y-1">
                      <dt className="text-[10px] font-bold text-zinc-500 uppercase">{dict.map.availableDiagnostics}</dt>
                      <dd className="text-zinc-700 dark:text-zinc-300 text-xs">
                        {selectedWithLive.diagnostics.join(", ")}
                      </dd>
                    </div>
                  )}

                  {selectedWithLive.mortalityDetails && (
                    <div className="rounded-xl bg-zinc-50 p-3 dark:bg-zinc-900/50 border border-black/5 dark:border-white/5">
                      <dt className="text-[10px] font-bold text-zinc-500 uppercase">{dict.map.mortalityContext}</dt>
                      <dd className="mt-1 text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                        {selectedWithLive.mortalityDetails}
                      </dd>
                    </div>
                  )}

                  {selectedWithLive.localHealthAuth && (
                    <div className="space-y-1">
                      <dt className="text-[10px] font-bold text-zinc-500 uppercase">{dict.map.localAuthority}</dt>
                      <dd className="text-zinc-900 dark:text-zinc-100 text-xs font-semibold flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                        {selectedWithLive.localHealthAuth}
                      </dd>
                    </div>
                  )}

                  <div className="space-y-2">
                    <dt className="text-[10px] font-bold text-zinc-500 uppercase">{dict.map.sources}</dt>
                    <dd className="space-y-2">
                      {fallbackSources.map((s) => (
                        <div key={s.url} className="text-xs">
                          <a
                            href={s.url}
                            target={s.url.startsWith("/") ? undefined : "_blank"}
                            rel={s.url.startsWith("/") ? undefined : "noopener noreferrer"}
                            className="text-blue-600 hover:underline dark:text-blue-400"
                          >
                            {s.label}
                          </a>
                        </div>
                      ))}
                      {!sources.length && selectedWithLive?.localHealthAuth && (
                        <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                          {selectedWithLive.localHealthAuth}
                        </div>
                      )}
                    </dd>
                  </div>

                  <div className="rounded-xl bg-zinc-50 p-4 dark:bg-zinc-900/50 border border-black/5 dark:border-white/5">
                    <dt className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-3">
                      {dict.map.relatedNews}
                    </dt>
                    <dd className="space-y-3">
                      {selectedWithLive && (
                        <a
                          href={`/${langSegment}?q=${encodeURIComponent(selectedWithLive.country)}#news-section`}
                          className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-3 py-2 text-[10px] font-bold text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-white uppercase tracking-wider"
                        >
                          {dict.nav.news}
                        </a>
                      )}
                      {relatedNews.length ? (
                        relatedNews.map((n) => (
                          <a
                            key={n.link}
                            href={n.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block rounded-lg border border-black/5 bg-white p-3 text-xs text-zinc-700 hover:bg-zinc-50 dark:border-white/5 dark:bg-black dark:text-zinc-200 dark:hover:bg-zinc-900"
                            aria-label={`${dict.map.openArticle}: ${n.title}`}
                          >
                            <div className="font-semibold leading-snug">{n.title}</div>
                            <div className="mt-1 text-[10px] uppercase tracking-wider text-zinc-400">
                              {n.source || ""}
                            </div>
                          </a>
                        ))
                      ) : (
                        <div className="text-xs text-zinc-500 dark:text-zinc-400">
                          {dict.map.relatedNewsEmpty}
                        </div>
                      )}
                    </dd>
                  </div>

                  {(selectedWithLive as any).liveHeadlines?.length > 0 && (
                    <div className="rounded-xl bg-red-50/50 p-4 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30">
                      <dt className="text-[10px] font-black uppercase tracking-widest text-red-600 dark:text-red-400 mb-3 flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                        </span>
                        {dict.map.liveMentions}
                      </dt>
                      <dd className="space-y-3">
                        {(selectedWithLive as any).liveHeadlines.map((h: string, i: number) => (
                          <div key={i} className="text-[11px] leading-snug text-zinc-700 dark:text-zinc-300 italic border-l-2 border-red-200 dark:border-red-800 pl-3">
                            "{h}"
                          </div>
                        ))}
                      </dd>
                    </div>
                  )}
                </dl>

                <div className="mt-8 pt-6 border-t border-black/5 dark:border-white/5 space-y-3">
                  <button
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-xs font-bold text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
                    onClick={() => {
                      const reportData = {
                        country: selectedWithLive.country,
                        iso3: selectedWithLive.iso3,
                        riskLevel: selectedWithLive.riskLevel,
                        casesTotal: selectedWithLive.casesTotal,
                        fatalityRate: selectedWithLive.fatalityRate,
                        updatedAt: selectedWithLive.updatedAt,
                        sources: selectedWithLive.sources,
                        recommendations: selectedWithLive.recommendations,
                        symptoms: selectedWithLive.symptoms,
                        diagnostics: selectedWithLive.diagnostics,
                      };
                      const sections = [];
                      sections.push(`=== HANTAVIRUS REPORT ===`);
                      sections.push(`Country: ${reportData.country} (${reportData.iso3})`);
                      sections.push(`Risk Level: ${reportData.riskLevel}`);
                      sections.push(`Total Cases/Mentions: ${reportData.casesTotal}`);
                      if (reportData.fatalityRate) sections.push(`Fatality Rate: ${reportData.fatalityRate}`);
                      sections.push(`Last Updated: ${reportData.updatedAt}`);
                      sections.push(``);
                      if (reportData.recommendations?.length) {
                        sections.push(`--- PREVENTION RECOMMENDATIONS ---`);
                        reportData.recommendations.forEach((r, i) => sections.push(`${i + 1}. ${r}`));
                        sections.push(``);
                      }
                      if (reportData.symptoms?.length) {
                        sections.push(`--- TYPICAL SYMPTOMS ---`);
                        reportData.symptoms.forEach((s, i) => sections.push(`${i + 1}. ${s}`));
                        sections.push(``);
                      }
                      if (reportData.diagnostics?.length) {
                        sections.push(`--- AVAILABLE DIAGNOSTICS ---`);
                        reportData.diagnostics.forEach((d, i) => sections.push(`${i + 1}. ${d}`));
                        sections.push(``);
                      }
                      if (reportData.sources?.length) {
                        sections.push(`--- SOURCES ---`);
                        reportData.sources.forEach((s, i) => sections.push(`${i + 1}. ${s.label}: ${s.url}`));
                        sections.push(``);
                      }
                      sections.push(`Generated: ${new Date().toISOString()}`);
                      sections.push(`Source: Hantavirus Watch (https://hantavirus.watch)`);
                      const dataStr = sections.join('\n');
                      const blob = new Blob([dataStr], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `hantavirus-report-${selectedWithLive.iso3}-${new Date().toISOString().split('T')[0]}.txt`;
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      URL.revokeObjectURL(url);
                      addXp(XP_REPORT_DOWNLOAD);
                    }}
                  >
                    <Download className="w-4 h-4" />
                    {dict.map.downloadReport}
                  </button>
                  <Link
                    href={`/${langSegment}/about#support`}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-black/5 bg-white px-4 py-3 text-xs font-bold text-zinc-900 hover:bg-zinc-50 dark:border-white/5 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800 transition-all active:scale-95"
                  >
                    <Heart className="w-4 h-4 text-red-500" />
                    {dict.map.supportProject}
                  </Link>
                </div>

                <div className="mt-6 flex flex-wrap gap-4 items-center justify-between border-t border-black/5 pt-4 dark:border-white/5">
                  <div className="text-[10px] text-zinc-400 uppercase font-bold">
                    {dict.map.updated}: {selectedWithLive.updatedAt}
                  </div>
                  <button
                    className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-4 py-2 text-[10px] font-bold text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-white transition-all uppercase tracking-wider"
                    onClick={() => setSelected(null)}
                    type="button"
                  >
                    {dict.map.clearSelection}
                  </button>
                </div>
              </div>
            ) : (
              <p className="mt-2 text-zinc-600 dark:text-zinc-300">
                {dict.map.clickPrompt}
              </p>
            )}
          </div>
          <div className="border-t border-black/5 p-4 dark:border-white/5 bg-zinc-50/50 dark:bg-zinc-900/50">
            <p className="text-[10px] text-zinc-500">
              {dict.map.mvpNote}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
