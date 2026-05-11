import { NextResponse } from "next/server";

import { fetchGoogleNews } from "@/lib/externalNews/googleNewsRss";

const OG_CACHE_TTL_OK_MS = 1000 * 60 * 60;
const OG_CACHE_TTL_NULL_MS = 1000 * 60 * 2;
const ogImageCache = new Map<string, { image: string | null; expiresAt: number }>();

function hashSeed(input: string) {
  // Simple deterministic hash for seed generation.
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function abstractPreviewDataUri(seedText: string) {
  const seed = hashSeed(seedText);
  const rnd = mulberry32(seed);

  const palette = [
    "#0ea5e9", // sky
    "#8b5cf6", // violet
    "#22c55e", // green
    "#f97316", // orange
    "#ef4444", // red
    "#14b8a6", // teal
  ];

  const pick = () => palette[Math.floor(rnd() * palette.length)];
  const bg1 = pick();
  const bg2 = pick();
  const accent = pick();

  const circles = Array.from({ length: 6 }, () => {
    const cx = Math.floor(rnd() * 800);
    const cy = Math.floor(rnd() * 500);
    const r = Math.floor(60 + rnd() * 220);
    const fill = pick();
    const o = (0.10 + rnd() * 0.20).toFixed(2);
    return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" fill-opacity="${o}"/>`;
  }).join("");

  const strokeWidth = (6 + rnd() * 10).toFixed(1);
  const x1 = Math.floor(rnd() * 200);
  const y1 = Math.floor(200 + rnd() * 200);
  const x2 = Math.floor(600 + rnd() * 200);
  const y2 = Math.floor(50 + rnd() * 200);

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${bg1}"/>
      <stop offset="100%" stop-color="${bg2}"/>
    </linearGradient>
    <filter id="blur" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="18" />
    </filter>
  </defs>
  <rect width="800" height="500" fill="url(#bg)"/>
  <g filter="url(#blur)">
    ${circles}
  </g>
  <path d="M ${x1} ${y1} C 320 40, 480 520, ${x2} ${y2}" fill="none" stroke="${accent}" stroke-width="${strokeWidth}" stroke-linecap="round" opacity="0.35"/>
</svg>`;

  const encoded = encodeURIComponent(svg)
    .replace(/%0A/g, "")
    .replace(/%20/g, " ");

  return `data:image/svg+xml;charset=utf-8,${encoded}`;
}

function isGoogleHostedImage(url: string) {
  // We only want to exclude the Google News *thumbnail/logo* images that look like:
  // https://lh3.googleusercontent.com/...=s0-w300
  // Some publishers legitimately host og:image on Google CDNs, so we keep those.
  try {
    const u = new URL(url);
    const host = u.hostname.toLowerCase();
    const isLhGoogleUserContent =
      host === "lh3.googleusercontent.com" ||
      host === "lh4.googleusercontent.com" ||
      host === "lh5.googleusercontent.com" ||
      host === "lh6.googleusercontent.com";

    const looksLikeGoogleNewsThumb =
      isLhGoogleUserContent && /[?&=]s0-w\d+/i.test(u.toString());

    return looksLikeGoogleNewsThumb;
  } catch {
    return false;
  }
}

function extractOgImage(html: string) {
  const patterns = [
    /<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']\s*\/?>/i,
    /<meta\s+content=["']([^"']+)["']\s+property=["']og:image["']\s*\/?>/i,
    /<meta\s+name=["']twitter:image["']\s+content=["']([^"']+)["']\s*\/?>/i,
    /<meta\s+content=["']([^"']+)["']\s+name=["']twitter:image["']\s*\/?>/i,
  ];

  for (const re of patterns) {
    const m = html.match(re);
    const url = m?.[1]?.trim();
    if (url) return url;
  }
  return null;
}

async function fetchHtmlWithTimeout(url: string, timeoutMs: number) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "HantavirusWatch/1.0",
        "Accept": "text/html,application/xhtml+xml",
      },
      redirect: "follow",
    });

    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

function toJinaProxyUrl(url: string) {
  // Simple read-only proxy that often bypasses bot protections for HTML reading.
  // It returns the fetched content as text.
  const normalized = url.replace(/\s+/g, "").trim();
  const isHttps = /^https:\/\//i.test(normalized);
  const withoutScheme = normalized.replace(/^https?:\/\//i, "");
  return `https://r.jina.ai/${isHttps ? "https" : "http"}://${withoutScheme}`;
}

async function fetchHtmlWithFallback(url: string, timeoutMs: number) {
  const direct = await fetchHtmlWithTimeout(url, timeoutMs);
  if (direct) return direct;

  // Fallback to proxy if direct is blocked (403) / times out.
  return await fetchHtmlWithTimeout(toJinaProxyUrl(url), timeoutMs);
}

function tryExtractPublisherUrlFromGoogleNewsHtml(html: string) {
  // Google News pages usually contain the real publisher link somewhere in HTML.
  // Pick the first https URL that is not a google/news domain.
  const re = /https?:\/\/[^\s"'<>]+/gi;
  const matches = html.match(re) ?? [];

  for (const raw of matches) {
    const cleaned = raw.replace(/&amp;/g, "&").trim();
    try {
      const u = new URL(cleaned);
      const host = u.hostname.toLowerCase();
      // Sometimes publisher links are wrapped like https://www.google.com/url?url=<publisher>
      if (host === "www.google.com" && u.pathname === "/url") {
        const embedded = u.searchParams.get("url") || u.searchParams.get("q");
        if (embedded) return embedded;
      }

      if (host.endsWith("google.com")) continue;
      if (host.endsWith("news.google.com")) continue;
      return u.toString();
    } catch {
      // ignore
    }
  }
  return null;
}

async function resolveGoogleNewsToPublisherUrl(url: string) {
  try {
    const u = new URL(url);
    if (u.hostname.toLowerCase() !== "news.google.com") return url;
  } catch {
    return url;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);

  try {
    // First attempt: do NOT auto-follow redirects, capture Location header.
    // Google News often redirects to a URL that contains the real publisher URL in a query param.
    const manual = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "HantavirusWatch/1.0",
        "Accept": "text/html,application/xhtml+xml",
      },
      redirect: "manual",
    });

    if (manual.status >= 300 && manual.status < 400) {
      const loc = manual.headers.get("location");
      if (loc) {
        try {
          const locUrl = new URL(loc, url);
          const embedded = locUrl.searchParams.get("url") || locUrl.searchParams.get("q");
          if (embedded) return embedded;
        } catch {
          // ignore
        }
      }
    }

    // Second attempt: follow redirects and inspect the final URL.
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "HantavirusWatch/1.0",
        "Accept": "text/html,application/xhtml+xml",
      },
      redirect: "follow",
    });

    // If following redirects already landed us on the publisher domain, use it directly.
    try {
      const finalUrl = new URL(res.url);
      const host = finalUrl.hostname.toLowerCase();
      if (host !== "news.google.com" && !host.endsWith("google.com")) {
        return finalUrl.toString();
      }
    } catch {
      // ignore
    }

    // Sometimes the resolved URL contains ?url=<publisher>
    try {
      const finalUrl = new URL(res.url);
      const embedded = finalUrl.searchParams.get("url") || finalUrl.searchParams.get("q");
      if (embedded) return embedded;
    } catch {
      // ignore
    }

    if (!res.ok) return url;
    const html = await res.text();
    const fromHtml = tryExtractPublisherUrlFromGoogleNewsHtml(html);
    if (fromHtml) return fromHtml;

    // Final attempt: use proxy to read the page and extract publisher URL.
    const proxyHtml = await fetchHtmlWithFallback(url, 6000);
    const fromProxy = proxyHtml ? tryExtractPublisherUrlFromGoogleNewsHtml(proxyHtml) : null;
    return fromProxy ?? url;
  } catch {
    return url;
  } finally {
    clearTimeout(timeout);
  }
}

async function getOgImageForUrl(url: string) {
  const cached = ogImageCache.get(url);
  if (cached && cached.expiresAt > Date.now()) return cached.image;

  try {
    const resolvedUrl = await resolveGoogleNewsToPublisherUrl(url);

    // Prefer extracting from publisher URL first.
    let image: string | null = null;
    if (resolvedUrl !== url) {
      const publisherHtml = await fetchHtmlWithFallback(resolvedUrl, 6000);
      if (publisherHtml) {
        const publisherImage = extractOgImage(publisherHtml);
        if (publisherImage && !isGoogleHostedImage(publisherImage)) {
          image = publisherImage;
        }
      }
    }

    // Fallback: try extracting from original URL.
    if (!image) {
      const html = await fetchHtmlWithFallback(url, 6000);
      if (html) {
        const extracted = extractOgImage(html);
        if (extracted && !isGoogleHostedImage(extracted)) {
          image = extracted;
        }
      }
    }

    ogImageCache.set(url, {
      image,
      expiresAt: Date.now() + (image ? OG_CACHE_TTL_OK_MS : OG_CACHE_TTL_NULL_MS),
    });
    return image;
  } catch {
    ogImageCache.set(url, { image: null, expiresAt: Date.now() + OG_CACHE_TTL_NULL_MS });
    return null;
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const lang = url.searchParams.get("lang") === "ru" ? "ru" : "en";

  // Avoid stale 'null' cache during development while iterating on extraction.
  if (process.env.NODE_ENV !== "production") {
    ogImageCache.clear();
  }

  try {
    const items = await fetchGoogleNews(lang);
  
    const filtered = items.filter((i) =>
      i.title.toLowerCase().includes("hantavirus") ||
      i.title.toLowerCase().includes("хантавирус")
    );

    const normalizeTitle = (t: string) =>
      t
        .toLowerCase()
        .replace(/&quot;|&amp;|&nbsp;/g, " ")
        .replace(/[\u2018\u2019]/g, "'")
        .replace(/[\u201C\u201D]/g, '"')
        .replace(/[^\p{L}\p{N}]+/gu, " ")
        .replace(/\s+/g, " ")
        .trim();

    const safeHostname = (u: string) => {
      try {
        return new URL(u).hostname.replace(/^www\./i, "").toLowerCase();
      } catch {
        return "";
      }
    };

    const seen = new Set<string>();
    const unique = filtered.filter((i) => {
      const key = `${safeHostname(i.link)}::${normalizeTitle(i.title)}`;
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    // Enrich preview images (when RSS doesn't provide one) for top results only.
    const top = unique.slice(0, 12);
    const enriched = await Promise.all(
      top.map(async (item) => {
        const ogImage = await getOgImageForUrl(item.link);
        const candidate = ogImage ?? item.image;

        // If no usable image (or Google News thumb), generate a unique abstract preview.
        const fallback = abstractPreviewDataUri(`${item.title}::${item.link}`);
        const image = candidate && !isGoogleHostedImage(String(candidate)) ? candidate : fallback;

        return { ...item, image };
      })
    );

    // Add caching for 5 minutes
    return NextResponse.json(
      { items: enriched },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=120',
        },
      }
    );
  } catch (e) {
    return NextResponse.json(
      { items: [], error: e instanceof Error ? e.message : "Unknown error" },
      { status: 200 }
    );
  }
}
