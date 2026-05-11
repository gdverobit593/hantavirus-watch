import Link from "next/link";

import { getDictionary } from "@/lib/dict";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";

export const dynamicParams = false;

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "ru" }];
}

export default async function MethodologyPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang: Locale = isLocale(rawLang) ? rawLang : defaultLocale;
  const dict = getDictionary(lang);

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <Link
        href={`/${lang}`}
        className="text-sm font-medium text-zinc-600 hover:underline dark:text-zinc-300"
      >
        ← {dict.nav.home}
      </Link>

      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
        {dict.nav.methodology}
      </h1>

      <div className="prose prose-zinc mt-6 max-w-none dark:prose-invert">
        {lang === "ru" ? (
          <>
            <p>
              Эта страница описывает, как мы собираем и показываем сигналы о
              хантавирусе на карте. Проект носит информационный характер и не
              является медицинской консультацией.
            </p>
            <h2>Источники</h2>
            <p>
              Мы используем открытые источники (например, новостные ленты) и
              ссылки на официальные страницы здравоохранения, когда они доступны.
              В карточке страны указываются ссылки на источники и примечания.
            </p>
            <h2>Обновления</h2>
            <p>
              Сигналы обновляются автоматически через API. Наличие сигнала не
              равно подтверждённому случаю: это индикатор упоминаний в источниках
              и повод проверить официальные рекомендации.
            </p>
            <h2>Ограничения</h2>
            <p>
              Данные могут быть неполными или запаздывать. Разные страны и языки
              освещаются неравномерно. Всегда сверяйтесь с официальными
              рекомендациями местных органов здравоохранения.
            </p>
          </>
        ) : (
          <>
            <p>
              This page explains how we collect and display hantavirus signals on
              the map. The project is informational only and not medical advice.
            </p>
            <h2>Sources</h2>
            <p>
              We use open sources (for example, news feeds) and link to official
              public health pages when available. Country cards include notes and
              source links.
            </p>
            <h2>Updates</h2>
            <p>
              Signals are updated automatically via API. A signal is not the same
              as a confirmed case: it indicates mentions in sources and a reason
              to check official guidance.
            </p>
            <h2>Limitations</h2>
            <p>
              Data can be incomplete or delayed. Coverage varies by country and
              language. Always rely on official local health authority guidance.
            </p>
            <h2 id="partnership">Partnership & Sponsorship</h2>
            <p>
              Hantavirus Watch is an independent monitoring project. We are open to
              partnerships with health organizations, diagnostic laboratories, and
              research institutions. For data licensing, API access, or sponsorship
              inquiries, please contact us via our Telegram community.
            </p>
          </>
        )}
      </div>

      <div className="mt-12 rounded-2xl bg-zinc-50 p-8 dark:bg-zinc-900/50 border border-black/5 dark:border-white/5">
        <h3 className="text-xl font-bold text-zinc-950 dark:text-zinc-50">
          {lang === "ru" ? "Поддержать проект" : "Support Project"}
        </h3>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          {lang === "ru" 
            ? "Ваши пожертвования помогают нам поддерживать серверы и развивать алгоритмы мониторинга." 
            : "Your support helps us maintain servers and improve our monitoring algorithms."}
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
          <a
            href="https://t.me/HantavirusGM"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
          >
            {lang === "ru" ? "Связаться с нами" : "Contact Us"}
          </a>
        </div>
      </div>

      <p className="mt-10 text-xs text-zinc-500">
        {dict.siteName} — informational content only.
      </p>
    </main>
  );
}
