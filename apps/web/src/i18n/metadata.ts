export interface LocaleMetadata {
  title: string;
  description: string;
  keywords: string[];
}

export const metadataConfig: Record<string, LocaleMetadata> = {
  ko: {
    title: "Polinote - 글로벌 정치 요약 서비스",
    description:
      "방대한 국제·정치 뉴스를 몇 분 안에 핵심만 파악하세요. AI 기반 분석으로 빠르고 정확한 글로벌 정치 요약을 제공합니다.",
    keywords: [
      "정치",
      "국제뉴스",
      "AI요약",
      "정치분석",
      "글로벌뉴스",
      "정치요약",
    ],
  },
  en: {
    title: "Polinote - Global Political Summaries",
    description:
      "Understand complex international and political news in minutes. AI-powered summaries for fast, accurate global political insights.",
    keywords: [
      "politics",
      "international news",
      "AI summary",
      "political analysis",
      "global news",
      "political summaries",
    ],
  },
};

// supported locales
export type SupportedLocale = keyof typeof metadataConfig;

// validate locale and set default value
export function getValidLocale(locale: string): SupportedLocale {
  return (locale in metadataConfig ? locale : "en") as SupportedLocale;
}

// get metadata for locale
export function getMetadataForLocale(locale: string): LocaleMetadata {
  const validLocale = getValidLocale(locale);
  return metadataConfig[validLocale];
}