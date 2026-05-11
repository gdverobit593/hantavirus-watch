import { NextResponse } from "next/server";
import { fetchGoogleNews } from "@/lib/externalNews/googleNewsRss";

// Список ключевых слов для поиска стран в заголовках новостей
const countryKeywords: Record<string, string[]> = {
  USA: ["USA", "United States", "America", "California", "Arizona", "Washington"],
  CHN: ["China", "Chinese", "Shaanxi", "Heilongjiang"],
  RUS: ["Russia", "Russian", "Volga", "Ural", "Moscow"],
  GBR: ["UK", "United Kingdom", "Britain", "British", "Dutch"],
  PAN: ["Panama", "Panamanian", "Los Santos"],
  DEU: ["Germany", "German", "Baden-Württemberg", "Saxony"],
  BOL: ["Bolivia", "Bolivian", "Tarija"],
  BRA: ["Brazil", "Brazilian", "Santa Catarina", "Paraná"],
  CHL: ["Chile", "Chilean", "Andes"],
  FIN: ["Finland", "Finnish", "Puumala"],
  SWE: ["Sweden", "Swedish"],
  NOR: ["Norway", "Norwegian"],
  ARG: ["Argentina", "Argentinian"],
  KOR: ["South Korea", "Korea", "Hantaan"],
  ZAF: ["South Africa", "Johannesburg"],
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lang = (searchParams.get("lang") as "en" | "ru") || "en";

  try {
    // Получаем свежие новости
    const news = await fetchGoogleNews(lang);
    
    // Считаем упоминания стран в последних новостях
    const signals: Record<string, { count: number; headlines: string[] }> = {};

    for (const item of news) {
      const text = (item.title + " " + (item.source || "")).toLowerCase();
      
      for (const [iso3, keywords] of Object.entries(countryKeywords)) {
        if (keywords.some(kw => text.includes(kw.toLowerCase()))) {
          if (!signals[iso3]) {
            signals[iso3] = { count: 0, headlines: [] };
          }
          signals[iso3].count += 1;
          if (signals[iso3].headlines.length < 3) {
            signals[iso3].headlines.push(item.title);
          }
        }
      }
    }

    return NextResponse.json({ 
      success: true, 
      signals,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error("Map signals API error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch signals" }, { status: 500 });
  }
}
