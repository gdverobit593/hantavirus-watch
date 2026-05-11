import Link from "next/link";
import { notFound } from "next/navigation";

import MDXRenderer from "@/components/MDXRenderer";
import { getDictionary } from "@/lib/dict";
import { getNewsBySlug, listNews } from "@/lib/content/fs";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";

export const dynamicParams = false;

export function generateStaticParams() {
  const locales: Locale[] = ["en", "ru"];

  const params = locales.flatMap((lang) =>
    listNews(lang).map((item) => ({ lang, slug: item.slug }))
  );

  return params;
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang: rawLang, slug } = await params;
  const lang: Locale = isLocale(rawLang) ? rawLang : defaultLocale;

  const dict = getDictionary(lang);
  const item = getNewsBySlug(lang, slug);

  if (!item) notFound();

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <Link
        href={`/${lang}/news`}
        className="text-sm font-medium text-zinc-600 hover:underline dark:text-zinc-300"
      >
        ← {dict.nav.news}
      </Link>

      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
        {item.frontmatter.title}
      </h1>
      <p className="mt-2 text-sm text-zinc-500">{item.frontmatter.date}</p>

      <div className="prose prose-zinc mt-8 max-w-none dark:prose-invert">
        <MDXRenderer content={item.content} />
      </div>

      {item.frontmatter.sources?.length ? (
        <section className="mt-10 rounded-2xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-black">
          <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
            {dict.common.source}
          </h2>
          <ul className="mt-3 list-disc pl-5 text-sm">
            {item.frontmatter.sources.map((s) => (
              <li key={s.url}>
                <a
                  href={s.url}
                  className="text-zinc-700 hover:underline dark:text-zinc-200"
                  target="_blank"
                  rel="noreferrer"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </main>
  );
}
