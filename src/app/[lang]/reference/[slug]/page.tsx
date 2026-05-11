import Link from "next/link";
import { notFound } from "next/navigation";

import MDXRenderer from "@/components/MDXRenderer";
import { getDictionary } from "@/lib/dict";
import { getReferenceBySlug, listReference } from "@/lib/content/fs";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";

export const dynamicParams = false;

export function generateStaticParams() {
  const locales: Locale[] = ["en", "ru"];

  const params = locales.flatMap((lang) =>
    listReference(lang).map((item) => ({ lang, slug: item.slug }))
  );

  return params;
}

export default async function ReferenceArticlePage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang: rawLang, slug } = await params;
  const lang: Locale = isLocale(rawLang) ? rawLang : defaultLocale;

  const dict = getDictionary(lang);
  const item = getReferenceBySlug(lang, slug);

  if (!item) notFound();

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <Link
        href={`/${lang}/reference`}
        className="text-sm font-medium text-zinc-600 hover:underline dark:text-zinc-300"
      >
        ← {dict.nav.reference}
      </Link>

      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
        {item.frontmatter.title}
      </h1>

      <div className="prose prose-zinc mt-8 max-w-none dark:prose-invert">
        <MDXRenderer content={item.content} />
      </div>

      <p className="mt-10 text-xs text-zinc-500">
        {dict.siteName} — informational content only.
      </p>
    </main>
  );
}
