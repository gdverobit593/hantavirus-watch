import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

import type {
  ContentItem,
  NewsFrontmatter,
  ReferenceFrontmatter,
} from "@/lib/content/types";

function contentRoot() {
  return path.join(process.cwd(), "src", "content");
}

function safeReadDir(dirPath: string) {
  if (!fs.existsSync(dirPath)) return [];
  return fs.readdirSync(dirPath);
}

function readMdxFile<TFrontmatter>(filePath: string): ContentItem<TFrontmatter> {
  const raw = fs.readFileSync(filePath, "utf8");
  const parsed = matter(raw);
  const slug = path.basename(filePath).replace(/\.mdx$/, "");

  // Extract first image from content if frontmatter.image is missing
  const content = parsed.content;
  let image = (parsed.data as any).image;
  if (!image) {
    const imgMatch = content.match(/!\[.*?\]\((.*?)\)/);
    if (imgMatch) image = imgMatch[1];
  }

  return {
    slug,
    frontmatter: { ...parsed.data, image } as TFrontmatter,
    content: parsed.content,
  };
}

export function listNews(
  locale: "en" | "ru",
  options?: {
    includeCategories?: Array<"news" | "digest" | "site">;
  }
) {
  const dir = path.join(contentRoot(), "news", locale);
  const files = safeReadDir(dir).filter((f) => f.endsWith(".mdx"));
  const items = files
    .map((f) => readMdxFile<NewsFrontmatter>(path.join(dir, f)))
    .filter((item) => {
      const category = item.frontmatter.category ?? "digest";
      const include = options?.includeCategories;
      if (include?.length) return include.includes(category);
      return category !== "site";
    })
    .sort((a, b) => (a.frontmatter.date < b.frontmatter.date ? 1 : -1));
  return items;
}

export function getNewsBySlug(locale: "en" | "ru", slug: string) {
  const filePath = path.join(contentRoot(), "news", locale, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  return readMdxFile<NewsFrontmatter>(filePath);
}

export function listReference(locale: "en" | "ru") {
  const dir = path.join(contentRoot(), "reference", locale);
  const files = safeReadDir(dir).filter((f) => f.endsWith(".mdx"));
  const items = files
    .map((f) => readMdxFile<ReferenceFrontmatter>(path.join(dir, f)))
    .sort((a, b) => (a.frontmatter.title > b.frontmatter.title ? 1 : -1));
  return items;
}

export function getReferenceBySlug(locale: "en" | "ru", slug: string) {
  const filePath = path.join(
    contentRoot(),
    "reference",
    locale,
    `${slug}.mdx`
  );
  if (!fs.existsSync(filePath)) return null;
  return readMdxFile<ReferenceFrontmatter>(filePath);
}
