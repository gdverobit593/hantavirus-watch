import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.SITE_URL || "http://localhost:3000";

  const routes = [
    "",
    "/map",
    "/reference",
    "/about",
    "/methodology",
    "/reference/what-is-hantavirus",
    "/reference/symptoms",
    "/reference/transmission",
    "/reference/prevention",
    "/reference/treatment",
    "/reference/faq",
    "/reference/myths",
  ];

  const locales = ["en", "ru"] as const;

  const now = new Date();

  return locales.flatMap((lang) =>
    routes.map((path) => ({
      url: `${siteUrl}/${lang}${path}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: path === "" ? 1 : 0.7,
    }))
  );
}
