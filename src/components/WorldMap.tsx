"use client";

import { useMemo, useState, useEffect } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";

import type { CountryDatum, CountryStatus } from "@/lib/map/countryData";

const GEO_URL = "/countries-110m.json";

// Координаты и количество случаев для точек (Hantavirus only)
const countryMarkers: Record<string, { coords: [number, number]; cases: number }> = {
  USA: { coords: [-95.7, 37.1], cases: 890 },
  CHN: { coords: [104.2, 35.9], cases: 40000 },
  RUS: { coords: [105.3, 61.5], cases: 7000 },
  GBR: { coords: [-3.4, 55.4], cases: 7 },
  DEU: { coords: [10.5, 51.2], cases: 1885 },
  FIN: { coords: [25.7, 61.9], cases: 2000 },
  ARG: { coords: [-63.6, -38.4], cases: 100 },
  BRA: { coords: [-51.9, -14.2], cases: 150 },
  CHL: { coords: [-71.5, -35.7], cases: 80 },
  ZAF: { coords: [22.9, -30.6], cases: 1 },
  KOR: { coords: [127.8, 35.9], cases: 400 },
  PAN: { coords: [-80.7, 8.5], cases: 45 },
  BOL: { coords: [-63.5, -16.2], cases: 12 },
  FRA: { coords: [2.2, 46.2], cases: 15 },
  PRY: { coords: [-58.4, -23.4], cases: 18 },
  URY: { coords: [-55.7, -32.5], cases: 8 },
  SWE: { coords: [18.6, 60.1], cases: 450 },
  NOR: { coords: [8.4, 60.4], cases: 120 },
  SRB: { coords: [21.0, 44.0], cases: 85 },
  SVN: { coords: [14.9, 46.1], cases: 60 },
  KAZ: { coords: [66.9, 48.0], cases: 25 },
  VNM: { coords: [108.2, 14.0], cases: 40 },
  THA: { coords: [100.9, 15.8], cases: 30 },
  ESP: { coords: [-3.7, 40.4], cases: 5 },
  ITA: { coords: [12.6, 41.9], cases: 5 },
  HRV: { coords: [15.2, 45.1], cases: 10 },
  BIH: { coords: [17.7, 43.9], cases: 10 },
  CZE: { coords: [14.5, 49.8], cases: 15 },
  SVK: { coords: [19.6, 48.7], cases: 15 },
  POL: { coords: [19.1, 51.9], cases: 20 },
  GRC: { coords: [21.8, 39.1], cases: 5 },
  JPN: { coords: [138.3, 36.2], cases: 10 },
  IDN: { coords: [113.9, -0.8], cases: 5 },
  IND: { coords: [78.9, 20.6], cases: 5 },
  IRN: { coords: [53.7, 32.4], cases: 5 },
  TUR: { coords: [35.2, 39.0], cases: 10 },
};

function statusColor(status: CountryStatus) {
  switch (status) {
    case "ok": return "#10b981"; // Emerald
    case "watch": return "#f59e0b"; // Amber
    case "alert": return "#ef4444"; // Red
    default: return "#64748b"; // Slate
  }
}

export default function WorldMap({
  data,
  onSelect,
}: {
  data: CountryDatum[];
  onSelect: (item: CountryDatum | null) => void;
}) {
  const [hoverIso3, setHoverIso3] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [position, setPosition] = useState({ coordinates: [0, 20] as [number, number], zoom: 1 });

  useEffect(() => {
    setMounted(true);
  }, []);

  const byIso3 = useMemo(() => {
    const map = new Map<string, CountryDatum>();
    for (const item of data) {
      map.set(item.iso3.toUpperCase(), item);
    }
    return map;
  }, [data]);

  const activeMarkers = useMemo(() => {
    const seen = new Set<string>();
    const result: Array<CountryDatum & { coords: [number, number]; cases: number }> = [];

    for (const item of data) {
      const iso3 = item.iso3.toUpperCase();
      if (seen.has(iso3)) continue;
      const marker = countryMarkers[iso3];
      if (!marker) continue;
      seen.add(iso3);
      result.push({
        ...item,
        ...marker,
      });
    }

    return result;
  }, [data]);

  if (!mounted) {
    return (
      <div className="flex h-[500px] w-full items-center justify-center rounded-3xl bg-zinc-50 dark:bg-zinc-900/50">
        <div className="animate-pulse text-zinc-400 font-medium">Загрузка карты Hantavirus...</div>
      </div>
    );
  }

  return (
    <div className="group/map flex flex-col overflow-hidden rounded-3xl border border-black/5 bg-white shadow-2xl dark:border-white/5 dark:bg-zinc-950">
      <div className="flex items-center justify-between border-b border-black/5 px-6 py-4 dark:border-white/5 bg-zinc-50/50 dark:bg-zinc-900/50">
        <div className="flex flex-col">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-tight">Эпидемиологическая обстановка</h3>
          <p className="text-[10px] text-zinc-500 font-medium tracking-wide uppercase">Глобальный мониторинг Hantavirus</p>
        </div>
        {hoverIso3 && (
          <div className="flex items-center gap-2 rounded-lg bg-white px-3 py-1.5 shadow-sm dark:bg-zinc-800 border border-black/5 dark:border-white/5">
            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-50">
              {byIso3.get(hoverIso3)?.country || hoverIso3}
            </span>
          </div>
        )}
      </div>

      <div className="relative aspect-[16/9] w-full bg-zinc-50 dark:bg-zinc-900/10">
        <ComposableMap
          projection="geoEqualEarth"
          projectionConfig={{ scale: 150 }}
          className="h-full w-full"
        >
          <ZoomableGroup 
            zoom={position.zoom} 
            center={position.coordinates}
            onMoveEnd={(newPos: { coordinates: [number, number]; zoom: number }) => setPosition(newPos)}
            maxZoom={10}
          >
            <Geographies geography={GEO_URL}>
              {({ geographies, projection }: any) => {
                if (!geographies || geographies.length === 0) return null;

                // Точки уменьшаются (масштабируются) при увеличении карты
                const baseSize = 8;
                const radius = Math.max(1.5, baseSize / Math.pow(position.zoom, 0.75));

                return (
                  <>
                    {geographies.map((geo: any) => {
                      const props = geo.properties || {};
                      const iso3 = (props.iso_a3 || props.ISO_A3 || props.adm0_a3 || "").toUpperCase();
                      const item = byIso3.get(iso3);
                      const fill = item ? statusColor(item.status) : "#e2e8f0";

                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          fill={fill}
                          stroke="#FFFFFF"
                          strokeWidth={0.5 / position.zoom}
                          style={{
                            default: { outline: "none", fillOpacity: item ? 0.7 : 0.2, transition: "all 300ms" },
                            hover: { outline: "none", fillOpacity: 1, cursor: "pointer", stroke: "#000000", strokeWidth: 1.5 / position.zoom },
                            pressed: { outline: "none" },
                          }}
                          onMouseEnter={() => setHoverIso3(iso3)}
                          onMouseLeave={() => setHoverIso3(null)}
                          onClick={() => item && onSelect(item)}
                        />
                      );
                    })}

                    {typeof projection === "function"
                      ? activeMarkers.map((marker) => {
                          const p = projection(marker.coords);
                          if (!p || p.length < 2) return null;
                          const [x, y] = p as [number, number];

                          return (
                            <g
                              key={marker.iso3}
                              className="cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelect(marker);
                              }}
                              onMouseEnter={() => setHoverIso3(marker.iso3)}
                              onMouseLeave={() => setHoverIso3(null)}
                            >
                              <circle
                                cx={x}
                                cy={y}
                                r={radius * 1.5}
                                fill={statusColor(marker.status)}
                                stroke="#fff"
                                strokeWidth={1.5 / position.zoom}
                                className="transition-all hover:opacity-80"
                                filter="drop-shadow(0 0 2px rgba(0,0,0,0.3))"
                              />
                              <text
                                x={x}
                                y={y}
                                textAnchor="middle"
                                alignmentBaseline="central"
                                style={{
                                  fontSize: `${Math.max(6, 10 / position.zoom)}px`,
                                  fontWeight: "900",
                                  fill: "#ffffff",
                                  pointerEvents: "none",
                                  textShadow: "0 0 2px rgba(0,0,0,0.5)",
                                }}
                              >
                                {marker.cases > 1000
                                  ? `${(marker.cases / 1000).toFixed(1)}k`
                                  : marker.cases}
                              </text>
                            </g>
                          );
                        })
                      : null}
                  </>
                );
              }}
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
        
        <div className="absolute bottom-6 left-6 flex flex-col gap-2 rounded-2xl bg-white/90 p-4 shadow-xl backdrop-blur-md dark:bg-zinc-900/90 border border-black/5 dark:border-white/5">
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
            <span className="text-[10px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">Alert</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
            <span className="text-[10px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">Watch</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
            <span className="text-[10px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">Stable</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-black/5 px-6 py-4 dark:border-white/5 bg-zinc-50/50 dark:bg-zinc-900/50">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse"></span>
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Система активна</span>
        </div>
        <div className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest animate-bounce">
          Кликните на точки для деталей
        </div>
      </div>
    </div>
  );
}
