import Link from "next/link";
import { getDictionary } from "@/lib/dict";
import { listReference } from "@/lib/content/fs";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";
import OutbreakTimeline from "@/components/OutbreakTimeline";
import { VirusIcon, AlertIcon, ShieldIcon, HeartIcon, BookIcon, GlobeIcon, NewsIcon } from "@/components/Icons";

export const dynamicParams = false;

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "ru" }];
}

export default async function ReferenceIndex({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang: Locale = isLocale(rawLang) ? rawLang : defaultLocale;
  const dict = getDictionary(lang);

  const items = listReference(lang);

  const iconMap: Record<string, React.ReactNode> = {
    "what-is-hantavirus": <VirusIcon className="w-5 h-5" />,
    symptoms: <AlertIcon className="w-5 h-5" />,
    transmission: <GlobeIcon className="w-5 h-5" />,
    prevention: <ShieldIcon className="w-5 h-5" />,
    treatment: <HeartIcon className="w-5 h-5" />,
    faq: <BookIcon className="w-5 h-5" />,
    myths: <NewsIcon className="w-5 h-5" />,
  };

  const colorMap: Record<string, string> = {
    "what-is-hantavirus": "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
    symptoms: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
    transmission: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    prevention: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
    treatment: "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400",
    faq: "bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400",
    myths: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
  };

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-violet-100 p-2 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400">
          <BookIcon className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          {dict.nav.reference}
        </h1>
      </div>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600 dark:text-zinc-300">
        {lang === "ru"
          ? "Проверенные справочные материалы о хантавирусе: симптомы, передача, профилактика и мифы."
          : "Verified reference materials about hantavirus: symptoms, transmission, prevention, and myths."}
      </p>

      <OutbreakTimeline lang={lang} />

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <Link
            key={item.slug}
            href={`/${lang}/reference/${item.slug}`}
            className="group flex gap-4 rounded-2xl border border-black/10 bg-white p-5 hover:bg-zinc-50 dark:border-white/10 dark:bg-black dark:hover:bg-zinc-900"
          >
            <div className={`shrink-0 rounded-lg p-2.5 h-fit ${colorMap[item.slug] || "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"}`}>
              {iconMap[item.slug] || <BookIcon className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-base font-semibold text-zinc-950 group-hover:text-blue-600 dark:text-zinc-50 dark:group-hover:text-blue-400">
                {item.frontmatter.title}
              </h2>
              <p className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                {item.frontmatter.summary}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <p className="mt-10 text-xs text-zinc-500">
        {dict.siteName} — {lang === "ru" ? "информационный контент только" : "informational content only"}.
      </p>
    </main>
  );
}
