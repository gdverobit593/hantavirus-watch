export type CountryStatus = "ok" | "watch" | "alert" | "unknown";

export type CountryDatum = {
  iso3: string;
  country: string;
  status: CountryStatus;
  updatedAt: string;
  endemic?: boolean;
  casesInfo?: string;
  statsPeriod?: string;
  casesTotal?: number;
  fatalityRate?: string;
  note?: string;
  sources?: { label: string; url: string }[];
  // New detailed fields
  strains?: string[];
  primaryHosts?: string[];
  riskLevel?: "low" | "medium" | "high" | "critical";
  transmission?: string;
  recommendations?: string[];
  // Even more details
  symptoms?: string[];
  diagnostics?: string[];
  mortalityDetails?: string;
  localHealthAuth?: string;
};

export const sampleCountryData: CountryDatum[] = [
  // Americas — HPS endemic areas
  {
    iso3: "USA",
    country: "United States",
    status: "watch",
    updatedAt: "2026-05-10",
    endemic: true,
    statsPeriod: "1993–2023",
    casesTotal: 890,
    fatalityRate: "35%",
    casesInfo: "890 reported cases since 1993; ~35% fatality rate (CDC). Recent mentions of SNV in California and Arizona.",
    note: "Sin Nombre virus. Endemic in western states. Sporadic cases reported annually.",
    sources: [
      {
        label: "CDC - Reported Cases of Hantavirus Disease",
        url: "https://www.cdc.gov/hantavirus/data-research/cases/index.html",
      },
      { label: "CDC - Hantavirus", url: "https://www.cdc.gov/hantavirus/" },
    ],
    strains: ["Sin Nombre (SNV)", "Black Creek Canal (BCCV)", "Bayou (BAYV)"],
    primaryHosts: ["Deer mouse (Peromyscus maniculatus)", "Cotton rat", "Rice rat"],
    riskLevel: "medium",
    transmission: "Inhalation of aerosolized rodent excreta, bites (rare).",
    recommendations: ["Seal gaps in homes", "Use wet mopping for cleaning", "Avoid dusty areas"],
    symptoms: ["Fever", "Severe muscle aches", "Fatigue", "Coughing", "Shortness of breath"],
    diagnostics: ["ELISA for IgM/IgG", "RT-PCR for viral RNA", "Immunohistochemistry"],
    mortalityDetails: "Case fatality rate remains high at ~35% despite modern ICU care.",
    localHealthAuth: "CDC (Centers for Disease Control and Prevention)",
  },
  {
    iso3: "CHN",
    country: "China",
    status: "watch",
    updatedAt: "2026-05-10",
    endemic: true,
    casesTotal: 1000,
    casesInfo: "Hantaan and Seoul virus signals in agricultural regions. 1000 signals monitorized.",
    note: "Hantaan virus (HTNV) historical origin. Vaccination programs active.",
    sources: [
      {
        label: "China CDC - Hantavirus",
        url: "https://www.chinacdc.cn/yyrdgz/202005/t20200511_216786.htm",
      },
    ],
    strains: ["Hantaan (HTNV)", "Seoul (SEOV)"],
    primaryHosts: ["Apodemus agrarius (Striped field mouse)", "Rattus norvegicus (Brown rat)"],
    riskLevel: "high",
    transmission: "Aerosolized rodent waste, close contact with rodents in agricultural settings.",
    recommendations: ["Rodent control in grain stores", "Vaccination in high-risk areas", "Protective gear during farm work"],
    symptoms: ["Fever", "Headache", "Back pain", "Abdominal pain", "Renal failure signs"],
    diagnostics: ["Serological testing", "Viral culture in high-containment labs", "PCR"],
    mortalityDetails: "HTNV carries 5-15% mortality; SEOV is typically milder (<1%).",
    localHealthAuth: "China CDC",
  },
  {
    iso3: "RUS",
    country: "Russia",
    status: "watch",
    updatedAt: "2026-05-10",
    endemic: true,
    casesTotal: 500,
    casesInfo: "Hantaan and Puumala virus signals in rural areas. 500 signals detected.",
    note: "Hantaan virus (HTNV) and Puumala virus (PUUV) are the primary strains.",
    sources: [
      {
        label: "Rospotrebnadzor - Hantavirus",
        url: "https://rospotrebnadzor.ru/about/info/news/news_details.php?ELEMENT_ID=14255",
      },
    ],
    strains: ["Hantaan (HTNV)", "Puumala (PUUV)"],
    primaryHosts: ["Apodemus agrarius (Striped field mouse)", "Clethrionomys glareolus (Bank vole)"],
    riskLevel: "medium",
    transmission: "Aerosolized rodent waste, close contact with rodents in rural settings.",
    recommendations: ["Rodent control in homes", "Vaccination in high-risk areas", "Protective gear during outdoor work"],
    symptoms: ["Fever", "Headache", "Back pain", "Abdominal pain", "Renal failure signs"],
    diagnostics: ["Serological testing", "Viral culture in high-containment labs", "PCR"],
    mortalityDetails: "HTNV carries 5-15% mortality; PUUV is typically milder (<1%).",
    localHealthAuth: "Rospotrebnadzor",
  },
  {
    iso3: "GBR",
    country: "United Kingdom",
    status: "alert",
    updatedAt: "2026-05-10",
    casesTotal: 7,
    casesInfo: "Cluster of 7 cases (2 confirmed) linked to a Dutch-flagged cruise ship. High social media volume.",
    note: "First significant hantavirus cluster reported by UK IHR Focal Point. Linked to South American travel.",
    sources: [
      {
        label: "HantavirusMap",
        url: "https://hantavirusmap.com/outbreaks/mv-hondius-2026",
      },
      { label: "WHO", url: "https://www.who.int/emergencies/disease-outbreak-news/item/2026-DON599" }
    ],
  },
  {
    iso3: "PAN",
    country: "Panama",
    status: "alert",
    updatedAt: "2026-05-10",
    endemic: true,
    casesTotal: 45,
    casesInfo: "Ongoing HPS signals in Los Santos province. Choclo virus mentions increasing. 45 signals detected in last 3 months.",
    note: "High endemicity in central provinces. Annual seasonal peaks related to agriculture.",
    sources: [{ label: "MINSA Panama", url: "https://www.minsa.gob.pa" }],
    strains: ["Choclo virus (CHOV)"],
    primaryHosts: ["Oligoryzomys fulvescens (Pygmy rice rat)"],
    riskLevel: "high",
    transmission: "Inhalation of aerosolized rodent waste during agricultural activities.",
    recommendations: ["Use masks during crop harvesting", "Rodent-proof grain storage", "Maintain domestic hygiene"],
    symptoms: ["High fever", "Myalgia", "Rapid respiratory distress", "Nausea"],
    diagnostics: ["Serology (IgM/IgG)", "RT-PCR"],
    mortalityDetails: "Choclo virus mortality rate is approximately 10-15%.",
    localHealthAuth: "MINSA (Ministerio de Salud de Panamá)",
  },
  {
    iso3: "PRY",
    country: "Paraguay",
    status: "watch",
    updatedAt: "2026-05-10",
    endemic: true,
    casesTotal: 18,
    casesInfo: "Laguna Negra virus activity in the Chaco region. 18 signals reported recently.",
    note: "Laguna Negra virus is the primary hantavirus. Sporadic cases in rural areas.",
    strains: ["Laguna Negra virus (LANV)"],
    primaryHosts: ["Calomys laucha (Small vesper mouse)"],
    riskLevel: "medium",
    transmission: "Dust inhalation in semi-arid Chaco regions.",
    recommendations: ["Avoid sleeping on the ground", "Seal food containers", "Wetting surfaces before sweeping"],
    symptoms: ["Fever", "Headache", "Muscle pain", "Non-productive cough"],
    diagnostics: ["ELISA", "PCR at central labs"],
    mortalityDetails: "Lancet studies indicate mortality around 15% for LANV.",
    localHealthAuth: "Ministerio de Salud Pública y Bienestar Social",
  },
  {
    iso3: "URY",
    country: "Uruguay",
    status: "watch",
    updatedAt: "2026-05-10",
    endemic: true,
    casesTotal: 8,
    casesInfo: "Andes virus lineage activity detected. 8 signals from Southern regions.",
    note: "Andes virus (ANDV) is endemic. Local healthcare surveillance active.",
    strains: ["Andes virus (ANDV-Uru)"],
    primaryHosts: ["Oligoryzomys flavescens (Yellow pygmy rice rat)"],
    riskLevel: "medium",
    transmission: "Contact with rodent excreta in rural and suburban areas.",
    recommendations: ["Clean outbuildings with bleach", "Keep grass short around homes", "Store firewood away from house"],
    symptoms: ["Fever", "Gastrointestinal upset", "Fatigue", "Dizziness"],
    diagnostics: ["Immunofluorescence", "RT-PCR"],
    mortalityDetails: "Mortality rates vary but can reach 20-30% for ANDV lineages.",
    localHealthAuth: "Ministerio de Salud Pública (MSP)",
  },
  {
    iso3: "BOL",
    country: "Bolivia",
    status: "alert",
    updatedAt: "2026-05-10",
    endemic: true,
    casesTotal: 12,
    casesInfo: "Recent signals of HPS in Tarija region. Local media reporting cluster. 12 signals.",
    note: "Laguna Negra virus. Remote areas often under-reported.",
    strains: ["Laguna Negra virus (LANV)", "Bermejo virus"],
    primaryHosts: ["Calomys laucha", "Oligoryzomys microtis"],
    riskLevel: "high",
    transmission: "Inhalation of dust in agricultural and woodland areas.",
    recommendations: ["Use respirators when cleaning barns", "Rodent-proof dwellings", "Early clinical consultation for fever"],
    symptoms: ["Sudden fever", "Intense headache", "Muscle aches in legs and back"],
    diagnostics: ["IgM Serology", "Molecular testing"],
    mortalityDetails: "Mortality can exceed 30% due to limited access to intensive care in remote areas.",
    localHealthAuth: "Ministerio de Salud y Deportes",
  },
  {
    iso3: "SRB",
    country: "Serbia",
    status: "alert",
    updatedAt: "2026-05-10",
    endemic: true,
    casesTotal: 85,
    casesInfo: "Dobrava-Belgrade virus activity in Balkan region. 85 signals in medical journals.",
    note: "High HFRS severity linked to Dobrava strain.",
    strains: ["Dobrava-Belgrade virus (DOBV)", "Puumala virus (PUUV)"],
    primaryHosts: ["Apodemus flavicollis (Yellow-necked mouse)", "Bank vole"],
    riskLevel: "high",
    transmission: "Inhalation of aerosols from forest rodent waste.",
    recommendations: ["Avoid contact with rodents in forests", "Hygiene in mountain huts", "Disinfection of storage areas"],
    symptoms: ["High fever", "Hemorrhagic manifestations", "Acute kidney injury", "Severe back pain"],
    diagnostics: ["ELISA for IgM", "PCR", "IFA"],
    mortalityDetails: "DOBV mortality can reach 10-12%; PUUV is much lower.",
    localHealthAuth: "Institute of Public Health of Serbia (Dr Milan Jovanovic Batut)",
  },
  {
    iso3: "SVN",
    country: "Slovenia",
    status: "alert",
    updatedAt: "2026-05-10",
    endemic: true,
    casesTotal: 60,
    casesInfo: "High Dobrava-Belgrade virus signal volume. 60 signals from endemic clusters.",
    note: "Frequent HFRS outbreaks linked to forest rodent population cycles.",
    strains: ["Dobrava virus", "Puumala virus"],
    primaryHosts: ["Apodemus flavicollis", "Myodes glareolus"],
    riskLevel: "high",
    transmission: "Forestry work, wood handling, outdoor recreation.",
    recommendations: ["Wear masks during forest floor activities", "Wash hands after outdoor work", "Rodent-proof cabins"],
    symptoms: ["Sudden high fever", "Eye pain", "Kidney function decline", "Vomiting"],
    diagnostics: ["Molecular detection", "Serological confirmation"],
    mortalityDetails: "Significant clinical burden during 'mouse years' with 5-10% mortality for DOBV cases.",
    localHealthAuth: "National Institute of Public Health (NIJZ)",
  },
  {
    iso3: "KOR",
    country: "South Korea",
    status: "alert",
    updatedAt: "2026-05-10",
    endemic: true,
    casesTotal: 400,
    casesInfo: "Hantaan and Seoul virus signals near demilitarized zone. 400 signals monitorized.",
    note: "Hantaan virus (HTNV) historical origin. Vaccination programs active.",
  },
  {
    iso3: "KAZ",
    country: "Kazakhstan",
    status: "watch",
    updatedAt: "2026-05-10",
    endemic: true,
  },
  // Other regions
  {
    iso3: "AUS",
    country: "Australia",
    status: "ok",
    updatedAt: "2026-05-10",
    note: "No endemic hantaviruses reported in humans. Rodent-associated viruses under study.",
  },
  {
    iso3: "NLD",
    country: "Netherlands",
    status: "ok",
    updatedAt: "2026-05-10",
    note: "No endemic human hantavirus disease reported.",
  },
];

export function getLocalizedCountryData(lang: string): CountryDatum[] {
  if (lang === "ru") {
    return sampleCountryData.map((d) => {
      const localized: CountryDatum = { ...d };
      switch (d.iso3) {
        case "USA":
          localized.country = "США";
          localized.casesInfo = "890 зарегистрированных случаев с 1993 года; летальность ~35% (CDC). Недавние упоминания SNV в Калифорнии и Аризоне.";
          localized.note = "Вирус Sin Nombre. Эндемичен в западных штатах. Спорадические случаи регистрируются ежегодно.";
          localized.strains = ["Sin Nombre (SNV)", "Black Creek Canal (BCCV)", "Bayou (BAYV)"];
          localized.primaryHosts = ["Оленья мышь (Peromyscus maniculatus)", "Хлопковая крыса", "Рисовая мышь"];
          localized.transmission = "Вдыхание аэрозолей экскрементов грызунов, укусы (редко).";
          localized.recommendations = ["Закрыть щели в домах", "Использовать влажную уборку", "Избегать запыленных мест"];
          localized.symptoms = ["Лихорадка", "Сильные мышечные боли", "Усталость", "Кашель", "Одышка"];
          localized.diagnostics = ["ИФА (ELISA) на IgM/IgG", "ОТ-ПЦР на РНК вируса", "Иммуногистохимия"];
          localized.mortalityDetails = "Летальность остается высокой (~35%), несмотря на современную интенсивную терапию.";
          localized.localHealthAuth = "CDC (Центры по контролю и профилактике заболеваний)";
          break;
        case "CHN":
          localized.country = "Китай";
          localized.casesInfo = "Стабильные сигналы ГЛПС в провинциях Шэньси и Хэйлунцзян. Частые медицинские отчеты. 40000 сигналов.";
          localized.note = "Вирусы Hantaan и Seoul. Высокое бремя ГЛПС, особенно в северо-восточных провинциях.";
          localized.strains = ["Hantaan (HTNV)", "Seoul (SEOV)"];
          localized.primaryHosts = ["Полевая мышь (Apodemus agrarius)", "Серая крыса (Rattus norvegicus)"];
          localized.transmission = "Аэрозоли отходов грызунов, тесный контакт с грызунами в сельской местности.";
          localized.recommendations = ["Контроль грызунов в зернохранилищах", "Вакцинация в районах высокого риска", "Защитное снаряжение при полевых работах"];
          localized.symptoms = ["Лихорадка", "Головная боль", "Боли в спине", "Боли в животе", "Признаки почечной недостаточности"];
          localized.diagnostics = ["Серологическое тестирование", "Культивирование вируса", "ПЦР"];
          localized.mortalityDetails = "HTNV имеет летальность 5-15%; SEOV обычно протекает легче (<1%).";
          localized.localHealthAuth = "China CDC";
          break;
        case "RUS":
          localized.country = "Россия";
          localized.casesInfo = "Высокий объем отчетов о ГЛПС из Поволжья и Урала. Преобладают упоминания вируса Puumala. 7000 сигналов.";
          localized.note = "Широкое распространение ГЛПС во многих регионах. Значительная сезонная активность.";
          localized.strains = ["Puumala (PUUV)", "Hantaan (HTNV)", "Dobrava (DOBV)", "Seoul (SEOV)"];
          localized.primaryHosts = ["Рыжая полевка (Myodes glareolus)", "Полевая мышь"];
          localized.transmission = "Вдыхание пыли из зараженных мест (леса, подвалы, дачи).";
          localized.recommendations = ["Дезинфекция дачных поверхностей после зимы", "Использование респираторов в пыльных закрытых помещениях", "Предотвращение доступа грызунов к пище"];
          localized.symptoms = ["Высокая температура", "Боли в пояснице", "Нарушения зрения", "Тошнота/Рвота"];
          localized.diagnostics = ["Иммуноферментный анализ", "Молекулярная диагностика (ПЦР)"];
          localized.mortalityDetails = "Летальность PUUV очень низкая (<0,1%); DOBV может быть намного выше (до 12%).";
          localized.localHealthAuth = "Роспотребнадзор";
          break;
        case "GBR":
          localized.country = "Великобритания";
          localized.casesInfo = "Кластер из 7 случаев (2 подтвержденных), связанных с круизным судном под флагом Нидерландов. Высокий объем упоминаний в соцсетях.";
          localized.note = "Первый значительный кластер хантавируса, зарегистрированный координатором ММСП Великобритании. Связан с поездками в Южную Америку.";
          localized.strains = ["Вирус Andes (предположительно)"];
          localized.primaryHosts = ["Переносчики из Южной Америки (импортные случаи)"];
          localized.riskLevel = "low";
          localized.transmission = "Завозные случаи, связанные с поездками; низкий риск местного распространения.";
          localized.recommendations = ["Медицинское наблюдение для путешественников", "Информирование экипажей судов", "Скрининг при симптомах после поездок"];
          localized.symptoms = ["Лихорадка", "Головная боль", "Кашель после поездки"];
          localized.diagnostics = ["ПЦР", "Специфическая серология"];
          localized.mortalityDetails = "Летальность зависит от штамма; в текущем кластере летальных исходов в Великобритании не зафиксировано.";
          localized.localHealthAuth = "UK Health Security Agency (UKHSA)";
          break;
        case "ZAF":
          localized.country = "Южная Африка";
          localized.casesInfo = "Подтвержденное заражение у пациента, эвакуированного с острова Вознесения. Активны международные медицинские сигналы.";
          localized.note = "Случай связан с международными поездками; пациент проходил лечение в отделении интенсивной терапии Йоханнесбурга.";
          localized.strains = ["Неизвестный штамм (подлежит типированию)"];
          localized.primaryHosts = ["Местные грызуны (под наблюдением)"];
          localized.riskLevel = "low";
          localized.transmission = "Завозной случай; мониторинг местных видов грызунов на наличие хантавирусов.";
          localized.recommendations = ["Усиленный эпиднадзор", "Обучение медицинского персонала", "Мониторинг популяции грызунов"];
          localized.symptoms = ["Критическое состояние", "Органные нарушения"];
          localized.diagnostics = ["Специализированные тесты NICD"];
          localized.mortalityDetails = "Данные ограничены; требуется подтверждение штамма.";
          localized.localHealthAuth = "National Institute for Communicable Diseases (NICD)";
          break;
        case "BRA":
          localized.country = "Бразилия";
          localized.casesInfo = "Упоминания вирусов Juquitiba и Araraquara в Санта-Катарине и Паране. 150 активных сигналов.";
          localized.note = "Присутствуют несколько вирусных линий. Высокая плотность в южных сельскохозяйственных районах.";
          localized.strains = ["Juquitiba (JUQV)", "Araraquara (ARAQV)", "Castelo dos Sonhos"];
          localized.primaryHosts = ["Oligoryzomys nigripes", "Necromys lasiurus"];
          localized.riskLevel = "medium";
          localized.transmission = "Сельскохозяйственные работы, вырубка лесов, контакт с экскрементами грызунов.";
          localized.recommendations = ["Контроль грызунов в сельских домах", "Гигиена при хранении зерна", "Ранняя консультация при гриппоподобных симптомах"];
          localized.symptoms = ["Лихорадка", "Миалгия", "Головная боль", "Быстро прогрессирующая дыхательная недостаточность"];
          localized.diagnostics = ["ИФА (ELISA)", "ОТ-ПЦР", "Иммуногистохимия"];
          localized.mortalityDetails = "Уровень летальности для ARAQV высок, часто превышает 30-40%.";
          localized.localHealthAuth = "Ministério da Saúde (Служба эпиднадзора)";
          break;
        case "CHL":
          localized.country = "Чили";
          localized.casesInfo = "Активность вируса Andes в регионах Лос-Лагос и Араукания. Отслеживается 80 сигналов.";
          localized.note = "Вирус Andes эндемичен. Мониторинг потенциала передачи от человека к человеку.";
          localized.strains = ["Вирус Andes (ANDV)"];
          localized.primaryHosts = ["Oligoryzomys longicaudatus (Длиннохвостая рисовая мышь)"];
          localized.riskLevel = "medium";
          localized.transmission = "Контакт с грызунами, задокументирована передача от человека к человеку в специфических кластерах.";
          localized.recommendations = ["Избегать контакта с длиннохвостыми мышами", "Проветривать закрытые помещения перед входом", "Часто мыть руки в сельской местности"];
          localized.symptoms = ["Внезапная лихорадка", "Сильные мышечные боли", "Тошнота", "Отек легких"];
          localized.diagnostics = ["Серология", "Молекулярная биология (RT-qPCR)"];
          localized.mortalityDetails = "ANDV крайне опасен, летальность составляет от 25% до 35%.";
          localized.localHealthAuth = "Ministerio de Salud (MINSAL)";
          break;
        case "ARG":
          localized.country = "Аргентина";
          localized.casesInfo = "Вирус Andes эндемичен. Сигналы сосредоточены в провинциях Чубут и Сальта. Обнаружено 100 сигналов.";
          localized.note = "Самое высокое бремя HPS в Южной Америке. Вирус Andes является основным штаммом.";
          localized.strains = ["Andes virus (ANDV)"];
          localized.primaryHosts = ["Oligoryzomys longicaudatus"];
          localized.riskLevel = "high";
          localized.transmission = "Вдыхание аэрозолей, тесный контакт с инфицированными (вспышки в Чубуте).";
          localized.recommendations = ["Использовать защиту при очистке сараев", "Не оставлять еду доступной для грызунов", "Своевременная диагностика"];
          localized.symptoms = ["Лихорадка", "Миалгия", "Рвота", "Дыхательная недостаточность"];
          localized.diagnostics = ["ИФА", "ПЦР"];
          localized.mortalityDetails = "Летальность штамма Andes может достигать 30-40%.";
          localized.localHealthAuth = "Ministerio de Salud de la Nación";
          break;
        case "CAN":
          localized.country = "Канада";
          localized.casesInfo = "Сигналы вируса Sin Nombre в Альберте и Британской Колумбии. 12 упоминаний в отчетах о дикой природе.";
          localized.note = "Хантавирусный пульмонарный синдром (HPS) является основной проблемой.";
          localized.strains = ["Sin Nombre (SNV)"];
          localized.primaryHosts = ["Peromyscus maniculatus (Оленья мышь)"];
          localized.riskLevel = "medium";
          localized.transmission = "Контакт с пометом грызунов в сельских постройках.";
          localized.recommendations = ["Проветривание помещений", "Влажная уборка с хлоркой", "Герметизация зданий"];
          localized.symptoms = ["Лихорадка", "Мышечные боли", "Кашель", "Отек легких"];
          localized.diagnostics = ["Серология", "ПЦР"];
          localized.mortalityDetails = "Летальность HPS в Канаде составляет около 30%.";
          localized.localHealthAuth = "Public Health Agency of Canada (PHAC)";
          break;
        case "FIN":
          localized.country = "Финляндия";
          localized.casesInfo = "Случаи ГЛПС; в ЕС/ЕЭЗ зарегистрировано 1885 случаев в 2023 году (ECDC). 2000 сигналов.";
          localized.note = "Вирус Puumala (PUUV). Ежегодные вспышки связаны с циклами размножения рыжих полевок.";
          localized.strains = ["Puumala (PUUV)"];
          localized.primaryHosts = ["Myodes glareolus (Рыжая полевка)"];
          localized.riskLevel = "medium";
          localized.transmission = "Вдыхание пыли при обработке дров или уборке подвалов.";
          localized.recommendations = ["Избегать пыли в лесных домиках", "Защита дровяников от грызунов", "Гигиена рук"];
          localized.symptoms = ["Лихорадка", "Головная боль", "Нарушение зрения", "Боли в пояснице"];
          localized.diagnostics = ["Специфический ИФА"];
          localized.mortalityDetails = "Летальность PUUV крайне низкая (<0.1%).";
          localized.localHealthAuth = "THL (Finnish Institute for Health and Welfare)";
          break;
        case "SWE":
          localized.country = "Швеция";
          localized.casesInfo = "Сигналы вируса Puumala в северных и центральных регионах. Обнаружено 450 сигналов.";
          localized.note = "Вирус Puumala эндемичен. Сезонные пики.";
          localized.strains = ["Puumala (PUUV)"];
          localized.primaryHosts = ["Рыжая полевка"];
          localized.riskLevel = "medium";
          localized.transmission = "Контакт с аэрозолями в сельской местности.";
          localized.recommendations = ["Проветривание сараев", "Влажная уборка", "Борьба с грызунами"];
          localized.symptoms = ["Гриппоподобные симптомы", "Проблемы с почками"];
          localized.diagnostics = ["Серологические тесты"];
          localized.mortalityDetails = "Летальность минимальна.";
          localized.localHealthAuth = "Folkhälsomyndigheten";
          break;
        case "NOR":
          localized.country = "Норвегия";
          localized.casesInfo = "Сигналы вируса Puumala в южных горных регионах. Зарегистрировано 120 сигналов.";
          localized.note = "Вирус Puumala. Эндемичен в южных регионах.";
          localized.strains = ["Puumala (PUUV)"];
          localized.primaryHosts = ["Рыжая полевка"];
          localized.riskLevel = "low";
          localized.transmission = "Контакт с пометом грызунов в хижинах.";
          localized.recommendations = ["Гигиена в лесных домиках", "Удаление грызунов"];
          localized.symptoms = ["Лихорадка", "Боли в спине"];
          localized.diagnostics = ["Лабораторные тесты (ИФА)"];
          localized.mortalityDetails = "Летальность крайне низкая.";
          localized.localHealthAuth = "FHI (Norwegian Institute of Public Health)";
          break;
        case "SVN":
          localized.country = "Словения";
          localized.casesInfo = "Высокий объем сигналов вируса Dobrava-Belgrade. 60 сигналов из эндемичных кластеров.";
          localized.note = "Частые вспышки ГЛПС, связанные с циклами популяции лесных грызунов.";
          localized.strains = ["Вирус Dobrava", "Вирус Puumala"];
          localized.primaryHosts = ["Apodemus flavicollis", "Myodes glareolus"];
          localized.riskLevel = "high";
          localized.transmission = "Лесные работы, заготовка дров, отдых на природе.";
          localized.recommendations = ["Носить маски при работах в лесу", "Мыть руки после прогулок", "Защита хижин от грызунов"];
          localized.symptoms = ["Внезапная лихорадка", "Боль в глазах", "Нарушение функции почек", "Рвота"];
          localized.diagnostics = ["Молекулярная диагностика", "Серологическое подтверждение"];
          localized.mortalityDetails = "Значительное клиническое бремя в «мышиные годы» с летальностью 5-10% для случаев DOBV.";
          localized.localHealthAuth = "Национальный институт общественного здоровья (NIJZ)";
          break;
        case "SRB":
          localized.country = "Сербия";
          localized.casesInfo = "Активность вируса Dobrava-Belgrade в Балканском регионе. 85 сигналов в медицинских журналах.";
          localized.note = "Высокая тяжесть ГЛПС, связанная со штаммом Dobrava.";
          localized.strains = ["Вирус Dobrava-Belgrade (DOBV)", "Вирус Puumala (PUUV)"];
          localized.primaryHosts = ["Желтогорлая мышь (Apodemus flavicollis)", "Рыжая полевка"];
          localized.riskLevel = "high";
          localized.transmission = "Вдыхание аэрозолей отходов лесных грызунов.";
          localized.recommendations = ["Избегать контакта с грызунами в лесах", "Гигиена в горных хижинах", "Дезинфекция складских помещений"];
          localized.symptoms = ["Высокая температура", "Геморрагические проявления", "Острое поражение почек", "Сильная боль в спине"];
          localized.diagnostics = ["ИФА на IgM", "ПЦР", "НРИФ"];
          localized.mortalityDetails = "Летальность DOBV может достигать 10-12%; PUUV значительно ниже.";
          localized.localHealthAuth = "Институт общественного здравоохранения Сербии (Dr Milan Jovanovic Batut)";
          break;
        case "PAN":
          localized.country = "Панама";
          localized.casesInfo = "Текущие сигналы HPS в провинции Лос-Сантос. Упоминания вируса Choclo растут. Обнаружено 45 сигналов за последние 3 месяца.";
          localized.note = "Высокая эндемичность в центральных провинциях. Ежегодные сезонные пики, связанные с сельским хозяйством.";
          localized.strains = ["Вирус Choclo (CHOV)"];
          localized.primaryHosts = ["Oligoryzomys fulvescens (Рисовая мышь)"];
          localized.riskLevel = "high";
          localized.transmission = "Вдыхание аэрозолей отходов грызунов во время сельскохозяйственных работ.";
          localized.recommendations = ["Использовать маски при сборе урожая", "Защита хранилищ зерна от грызунов", "Соблюдение домашней гигиены"];
          localized.symptoms = ["Высокая температура", "Миалгия", "Быстрое нарушение дыхания", "Тошнота"];
          localized.diagnostics = ["Серология (IgM/IgG)", "ОТ-ПЦР"];
          localized.mortalityDetails = "Уровень летальности вируса Choclo составляет примерно 10-15%.";
          localized.localHealthAuth = "MINSA (Министерство здравоохранения Панамы)";
          break;
        case "PRY":
          localized.country = "Парагвай";
          localized.casesInfo = "Активность вируса Laguna Negra в регионе Чако. Недавно зарегистрировано 18 сигналов.";
          localized.note = "Вирус Laguna Negra является основным хантавирусом. Спорадические случаи в сельской местности.";
          localized.strains = ["Вирус Laguna Negra (LANV)"];
          localized.primaryHosts = ["Calomys laucha"];
          localized.riskLevel = "medium";
          localized.transmission = "Вдыхание пыли в засушливых регионах Чако.";
          localized.recommendations = ["Избегать сна на земле", "Герметизация контейнеров с едой", "Смачивание поверхностей перед подметанием"];
          localized.symptoms = ["Лихорадка", "Головная боль", "Мышечная боль", "Сухой кашель"];
          localized.diagnostics = ["ИФА (ELISA)", "ПЦР в центральных лабораториях"];
          localized.mortalityDetails = "Исследования показывают летальность около 15% для LANV.";
          localized.localHealthAuth = "Ministerio de Salud Pública y Bienestar Social";
          break;
        case "URY":
          localized.country = "Уругвай";
          localized.casesInfo = "Обнаружена активность линии вируса Andes. 8 сигналов из южных регионов.";
          localized.note = "Вирус Andes (ANDV) эндемичен. Активный мониторинг местного здравоохранения.";
          localized.strains = ["Вирус Andes (ANDV-Uru)"];
          localized.primaryHosts = ["Oligoryzomys flavescens"];
          localized.riskLevel = "medium";
          localized.transmission = "Контакт с экскрементами грызунов в сельской и пригородной местности.";
          localized.recommendations = ["Уборка хозпостроек с хлоркой", "Короткая трава вокруг дома", "Хранение дров вдали от дома"];
          localized.symptoms = ["Лихорадка", "Желудочно-кишечные расстройства", "Усталость", "Головокружение"];
          localized.diagnostics = ["Иммунофлуоресценция", "ОТ-ПЦР"];
          localized.mortalityDetails = "Уровень летальности варьируется, но может достигать 20-30% для линий ANDV.";
          localized.localHealthAuth = "Ministerio de Salud Pública (MSP)";
          break;
        case "BOL":
          localized.country = "Боливия";
          localized.casesInfo = "Недавние сигналы HPS в регионе Тариха. Местные СМИ сообщают о кластере. 12 сигналов.";
          localized.note = "Вирус Laguna Negra. Отдаленные районы часто недостаточно охвачены отчетностью.";
          localized.strains = ["Вирус Laguna Negra (LANV)", "Вирус Bermejo"];
          localized.primaryHosts = ["Calomys laucha", "Oligoryzomys microtis"];
          localized.riskLevel = "high";
          localized.transmission = "Вдыхание пыли в сельскохозяйственных и лесных районах.";
          localized.recommendations = ["Респираторы при чистке сараев", "Защита жилья от грызунов", "Ранняя консультация при лихорадке"];
          localized.symptoms = ["Внезапная лихорадка", "Сильная головная боль", "Боли в ногах и спине"];
          localized.diagnostics = ["IgM серология", "Молекулярное тестирование"];
          localized.mortalityDetails = "Летальность может превышать 30% из-за ограниченного доступа к интенсивной терапии.";
          localized.localHealthAuth = "Ministerio de Salud y Deportes";
          break;
        case "DEU":
          localized.country = "Германия";
          localized.casesInfo = "Колеблющиеся сигналы вируса Puumala в Баден-Вюртемберге и Нижней Саксонии. 1885 сигналов.";
          localized.note = "Вирусы Dobrava-Belgrade, Puumala, Tula. Сильная связь с популяциями рыжей полевки.";
          localized.strains = ["Dobrava-Belgrade", "Puumala", "Tula"];
          localized.primaryHosts = ["Рыжая полевка", "Желтогорлая мышь"];
          localized.riskLevel = "medium";
          localized.transmission = "Вдыхание пыли в сельской местности.";
          localized.recommendations = ["Контроль грызунов в домах", "Маски при уборке"];
          localized.symptoms = ["Лихорадка", "Головная боль", "Почечные симптомы"];
          localized.diagnostics = ["ИФА", "ПЦР"];
          localized.mortalityDetails = "Низкая общая летальность.";
          localized.localHealthAuth = "Robert Koch Institute (RKI)";
          localized.symptoms = ["Лихорадка", "Головная боль", "Боли в спине", "Боли в животе", "Признаки почечной недостаточности"];
          localized.diagnostics = ["Серологическое тестирование", "Культивирование вируса", "ПЦР"];
          localized.mortalityDetails = "HTNV имеет летальность 5-15%; SEOV обычно протекает легче (<1%).";
          localized.localHealthAuth = "China CDC";
          break;
        case "RUS":
          localized.country = "Россия";
          localized.casesInfo = "Высокий объем отчетов о ГЛПС из Поволжья и Урала. Преобладают упоминания вируса Puumala. 7000 сигналов.";
          localized.note = "Широкое распространение ГЛПС во многих регионах. Значительная сезонная активность.";
          localized.strains = ["Puumala (PUUV)", "Hantaan (HTNV)", "Dobrava (DOBV)", "Seoul (SEOV)"];
          localized.primaryHosts = ["Рыжая полевка (Myodes glareolus)", "Полевая мышь"];
          localized.transmission = "Вдыхание пыли из зараженных мест (леса, подвалы, дачи).";
          localized.recommendations = ["Дезинфекция дачных поверхностей после зимы", "Использование респираторов в пыльных закрытых помещениях", "Предотвращение доступа грызунов к пище"];
          localized.symptoms = ["Высокая температура", "Боли в пояснице", "Нарушения зрения", "Тошнота/Рвота"];
          localized.diagnostics = ["Иммуноферментный анализ", "Молекулярная диагностика (ПЦР)"];
          localized.mortalityDetails = "Летальность PUUV очень низкая (<0,1%); DOBV может быть намного выше (до 12%).";
          localized.localHealthAuth = "Роспотребнадзор";
          break;
        case "THA":
          localized.country = "Таиланд";
          localized.casesInfo = "Сигналы вируса Seoul в сельском надзоре. Обнаружено 30 сигналов.";
          localized.note = "Эндемичен для различных видов грызунов. Спорадические случаи ГЛПС у людей.";
// ... (rest of the code remains the same)
        case "KAZ":
          localized.country = "Казахстан";
          localized.casesInfo = "Сигналы Hantaan и Dobrava на южных и восточных границах. 25 упоминаний.";
          localized.note = "Трансграничная миграция грызунов влияет на объем сигналов.";
          break;
        case "USA":
          localized.country = "США";
          localized.casesInfo = "890 зарегистрированных случаев с 1993 года; летальность ~35% (CDC). Недавние упоминания SNV в Калифорнии и Аризоне.";
          localized.note = "Вирус Sin Nombre. Эндемичен в западных штатах. Спорадические случаи регистрируются ежегодно.";
          break;
        case "GBR":
          localized.country = "Великобритания";
          localized.casesInfo = "Кластер из 7 случаев (2 подтвержденных), связанных с круизным судном под флагом Нидерландов. Высокий объем упоминаний в соцсетях.";
          localized.note = "Первый значительный кластер хантавируса, зарегистрированный координатором ММСП Великобритании. Связан с поездками в Южную Америку.";
          break;
        case "ZAF":
          localized.country = "Южная Африка";
          localized.casesInfo = "Подтвержденное заражение у пациента, эвакуированного с острова Вознесения. Активны международные медицинские сигналы.";
          localized.note = "Случай связан с международными поездками; пациент проходил лечение в отделении интенсивной терапии Йоханнесбурга.";
          break;
      }
      return localized;
    });
  }
  return sampleCountryData;
}
