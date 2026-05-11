import { getDictionary } from "@/lib/dict";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";

export const dynamicParams = false;

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "ru" }];
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang: Locale = isLocale(rawLang) ? rawLang : defaultLocale;
  const dict = getDictionary(lang);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
        {dict.nav.about}
      </h1>
      <div className="prose prose-zinc mt-6 max-w-3xl dark:prose-invert">
        <p>
          {dict.about.p1}
        </p>
        <p>
          {dict.about.p2}
        </p>
      </div>
    </main>
  );
}
