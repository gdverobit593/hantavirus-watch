import { XMLParser } from "fast-xml-parser";

export type ExternalNewsItem = {
  title: string;
  link: string;
  publishedAt: string;
  source?: string;
  image?: string;
};

function getGoogleNewsRssUrl(lang: "en" | "ru") {
  if (lang === "ru") {
    const q = encodeURIComponent("хантавирус");
    return `https://news.google.com/rss/search?q=${q}&hl=ru&gl=RU&ceid=RU:ru`;
  }

  const q = encodeURIComponent("hantavirus");
  return `https://news.google.com/rss/search?q=${q}&hl=en-US&gl=US&ceid=US:en`;
}

function firstImgFromHtml(html: string | undefined) {
  if (!html) return undefined;
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match?.[1];
}

function firstExternalLinkFromHtml(html: string | undefined) {
  if (!html) return undefined;
  const match = html.match(/<a[^>]+href=["']([^"']+)["']/i);
  const href = match?.[1]?.replace(/&amp;/g, "&")?.trim();
  if (!href) return undefined;

  try {
    const u = new URL(href);
    const host = u.hostname.toLowerCase();
    if (host === "news.google.com" || host.endsWith("google.com")) return undefined;
    return u.toString();
  } catch {
    return undefined;
  }
}

function isGooglePlaceholderImage(url: string) {
  // Google News RSS часто отдаёт логотип/превью Google вместо изображения статьи.
  // Считаем плейсхолдерами только явно Google-hosted thumbnails.
  return (
    url.includes("googleusercontent.com") ||
    url.includes("gstatic.com") ||
    url.includes("googleapis.com")
  );
}

export async function fetchGoogleNews(lang: "en" | "ru") {
  const url = getGoogleNewsRssUrl(lang);

  const res = await fetch(url, {
    next: { revalidate: 300 },
    headers: {
      "User-Agent": "HantavirusWatch/1.0 (+https://example.com)",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch RSS: ${res.status}`);
  }

  const xml = await res.text();

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
  });

  const data = parser.parse(xml) as any;
  const itemsRaw = data?.rss?.channel?.item;
  const items: any[] = Array.isArray(itemsRaw) ? itemsRaw : itemsRaw ? [itemsRaw] : [];

  return items
    .map((item) => {
      const title = String(item?.title ?? "").trim();
      const rawLink = String(item?.link ?? "").trim();
      const publisherLink = firstExternalLinkFromHtml(item?.description);
      const link = publisherLink ?? rawLink;
      const publishedAt = String(item?.pubDate ?? "").trim();

      const source =
        typeof item?.source === "string"
          ? item.source
          : typeof item?.source?.["#text"] === "string"
            ? item.source["#text"]
            : undefined;

      const mediaContentUrl =
        item?.["media:content"]?.["@_url"] ||
        item?.enclosure?.["@_url"] ||
        firstImgFromHtml(item?.description);

      const rawImage = typeof mediaContentUrl === "string" ? mediaContentUrl : undefined;
      const image = rawImage && !isGooglePlaceholderImage(rawImage) ? rawImage : undefined;

      const mapped: ExternalNewsItem = {
        title,
        link,
        publishedAt,
        source,
        image,
      };

      return mapped;
    })
    .filter((x) => x.title && x.link);
}
