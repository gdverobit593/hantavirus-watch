import type { Metadata } from "next";
import Link from "next/link";
import { getDictionary } from "@/lib/dict";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";
import { SendIcon, HeartIcon, Heart } from "@/components/Icons";
import LiveSignalTicker from "@/components/LiveSignalTicker";

export const dynamicParams = false;

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "ru" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const lang = isLocale(rawLang) ? rawLang : defaultLocale;
  const dict = getDictionary(lang);

  const siteUrl = process.env.SITE_URL || "http://localhost:3000";
  const baseUrl = new URL(siteUrl);
  const title = dict.siteName;
  const description =
    "Global hantavirus updates, map, and practical explainers in RU and EN.";

  return {
    title,
    description,
    metadataBase: baseUrl,
    alternates: {
      canonical: `/${lang}`,
      languages: {
        en: "/en",
        ru: "/ru",
      },
    },
    openGraph: {
      type: "website",
      url: `/${lang}`,
      siteName: title,
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

function LanguageSwitcher({ lang }: { lang: Locale }) {
  const other = lang === "en" ? "ru" : "en";
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-zinc-500">{lang.toUpperCase()}</span>
      <span className="text-zinc-300">/</span>
      <Link
        href={`/${other}`}
        className="text-zinc-700 hover:text-zinc-950 dark:text-zinc-200 dark:hover:text-white"
      >
        {other.toUpperCase()}
      </Link>
    </div>
  );
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang = isLocale(rawLang) ? rawLang : defaultLocale;
  const dict = getDictionary(lang);

  return (
    <>
      <LiveSignalTicker lang={lang} />
      <header className="sticky top-0 z-50 w-full border-b border-black/5 bg-white/70 backdrop-blur-xl dark:border-white/5 dark:bg-black/70">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-6">
            <Link
              href={`/${lang}`}
              className="font-semibold tracking-tight text-zinc-950 dark:text-zinc-50"
            >
              {dict.siteName}
            </Link>
            <nav className="hidden items-center gap-4 text-sm sm:flex">
              <Link href={`/${lang}`} className="hover:underline">
                {dict.nav.home}
              </Link>
              <Link href={`/${lang}/reference`} className="hover:underline">
                {dict.nav.reference}
              </Link>
              <Link href={`/${lang}/map`} className="hover:underline">
                {dict.nav.map}
              </Link>
              <Link href={`/${lang}/about`} className="hover:underline">
                {dict.nav.about}
              </Link>
            </nav>
          </div>
          <LanguageSwitcher lang={lang} />
        </div>
      </header>

      <div className="flex-1">{children}</div>

      <footer className="border-t border-black/10 py-10 text-sm text-zinc-500 dark:border-white/10">
        <div className="mx-auto w-full max-w-6xl px-4">
          <p>
            {dict.siteName} — informational content only. Not medical advice.
          </p>
          <p className="mt-2 flex flex-wrap items-center gap-4">
            <Link
              href={`/${lang}/methodology`}
              className="text-zinc-600 hover:underline dark:text-zinc-300"
            >
              {dict.nav.methodology}
            </Link>
            <span className="text-zinc-300">•</span>
            <Link
              href={`/${lang}/about#api`}
              className="text-zinc-600 hover:underline dark:text-zinc-300 font-medium"
            >
              {dict.map.proApi}
            </Link>
            <span className="text-zinc-300">•</span>
            <Link
              href={`/${lang}/about#support`}
              className="flex items-center gap-1 text-zinc-600 hover:underline dark:text-zinc-300 font-medium"
            >
              <Heart className="w-3.5 h-3.5 text-red-500" />
              {dict.nav.support}
            </Link>
            <span className="text-zinc-300">•</span>
            <a
              href="https://t.me/HantavirusGM"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-blue-600 hover:underline dark:text-blue-400 font-medium"
            >
              <SendIcon className="w-3.5 h-3.5" />
              Telegram
            </a>
          </p>
          <p className="mt-2">
            <a
              href="/rss.xml"
              className="text-zinc-600 hover:underline dark:text-zinc-300"
            >
              RSS
            </a>
          </p>
        </div>
      </footer>
    </>
  );
}
