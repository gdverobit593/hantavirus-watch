import { NextResponse } from "next/server";

import { listNews } from "@/lib/content/fs";

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export async function GET() {
  const siteUrl = process.env.SITE_URL || "http://localhost:3000";

  const items = [
    ...listNews("en").map((n) => ({ lang: "en" as const, ...n })),
    ...listNews("ru").map((n) => ({ lang: "ru" as const, ...n })),
  ].sort((a, b) => (a.frontmatter.date < b.frontmatter.date ? 1 : -1));

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml("Hantavirus Watch")}</title>
    <link>${escapeXml(siteUrl)}</link>
    <description>${escapeXml(
      "Global hantavirus daily digest (RU+EN)."
    )}</description>
    ${items
      .map((item) => {
        const url = `${siteUrl}/${item.lang}/news/${item.slug}`;
        return `
    <item>
      <title>${escapeXml(item.frontmatter.title)}</title>
      <link>${escapeXml(url)}</link>
      <guid>${escapeXml(url)}</guid>
      <pubDate>${escapeXml(new Date(item.frontmatter.date).toUTCString())}</pubDate>
      <description>${escapeXml(item.frontmatter.summary)}</description>
    </item>`;
      })
      .join("\n")}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600",
    },
  });
}
