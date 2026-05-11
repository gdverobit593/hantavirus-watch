import Link from "next/link";
import { getDictionary } from "@/lib/dict";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";
import { listNews } from "@/lib/content/fs";
import { VirusIcon } from "@/components/Icons";

export const dynamicParams = false;

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "ru" }];
}

export default async function NewsIndex({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang: Locale = isLocale(rawLang) ? rawLang : defaultLocale;
  const dict = getDictionary(lang);
  const items = listNews(lang);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
        {dict.nav.news}
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600 dark:text-zinc-300">
        {dict.common.dailyDigest}
      </p>

      <div className="mt-8 grid gap-6">
        {items.map((item) => (
          <article
            key={item.slug}
            className="group overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm hover:shadow-xl transition-all duration-300 dark:border-white/10 dark:bg-zinc-950 dark:hover:bg-zinc-900/50"
          >
            <Link href={`/${lang}/news/${item.slug}`} className="block lg:flex">
              <div className="relative h-56 w-full lg:h-auto lg:w-72 shrink-0 overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                {item.frontmatter.image ? (
                  <img
                    src={item.frontmatter.image}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-800 dark:to-zinc-900" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <VirusIcon className="h-12 w-12 text-zinc-400 opacity-20" />
                    </div>
                  </>
                )}
                <div className="absolute top-4 left-4 rounded-full bg-black/20 px-3 py-1 text-[10px] font-bold text-white backdrop-blur uppercase tracking-widest">
                  {item.frontmatter.category || "Digest"}
                </div>
              </div>
              <div className="p-8 flex flex-col justify-center">
                <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                  <span>{item.frontmatter.date}</span>
                  <span className="text-zinc-300 dark:text-zinc-700 font-black">|</span>
                  <span className="text-blue-600 dark:text-blue-400 italic">Epidemiological Report</span>
                </div>
                <h2 className="mt-3 text-xl font-bold text-zinc-950 group-hover:text-blue-600 dark:text-zinc-50 dark:group-hover:text-blue-400 transition-colors leading-tight">
                  {item.frontmatter.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 line-clamp-2">
                  {item.frontmatter.summary}
                </p>
                <div className="mt-6 flex items-center gap-2 text-xs font-bold text-zinc-900 dark:text-zinc-100">
                  {dict.common.readMore}
                  <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </main>
  );
}
