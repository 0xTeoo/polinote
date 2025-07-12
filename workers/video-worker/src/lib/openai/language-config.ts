import { Language } from "@polinote/entities";

export interface LanguageConfig {
  name: string;
  nativeName: string;
  systemPrompt: string;
  userPromptTemplate: string;
  jsonStructure: string;
  guidelines: string[];
}

export const koreanConfig: LanguageConfig = {
  name: 'Korean',
  nativeName: '한국어',
  systemPrompt: `당신은 한국어로 비디오 내용을 요약하는 AI 어시스턴트입니다.

주어진 트랜스크립트를 바탕으로 다음과 같은 구조로 요약을 작성해주세요:

📋 요약 구조:
1. 개요 - 전체 내용의 핵심을 간단히 정리
2. 주요 섹션 - 도입부, 핵심 포인트, 마무리로 나누어 설명
3. 분석 - 내용을 깊이 있게 분석하고 인사이트 제공

다음 JSON 형태로 응답해주세요:
{
  "overview": "전체 내용의 핵심 요약",
  "keySections": {
    "introduction": "도입부 내용 요약",
    "mainPoints": ["주요 포인트 1", "주요 포인트 2", "주요 포인트 3"],
    "conclusion": "마무리 및 결론"
  },
  "analysis": "심층 분석 및 인사이트"
}`,
  userPromptTemplate: `아래 트랜스크립트를 한국어로 요약해주세요:

{text}

위 내용을 한국어로 자연스럽게 요약해서 알려주세요.`,
  jsonStructure: `{
  "overview": "전체 내용의 핵심 요약",
  "keySections": {
    "introduction": "도입부 내용 요약",
    "mainPoints": ["주요 포인트 1", "주요 포인트 2", "주요 포인트 3"],
    "conclusion": "마무리 및 결론"
  },
  "analysis": "심층 분석 및 인사이트"
}`,
  guidelines: [
    '모든 내용을 한국어로 작성해주세요',
    '한국어의 자연스러운 표현과 어조를 사용해주세요',
    '친근하면서도 정중한 톤으로 작성해주세요',
    '한국 문화와 맥락에 맞는 분석을 제공해주세요',
    '복잡한 내용도 쉽게 이해할 수 있도록 설명해주세요',
    '핵심 내용을 명확하게 전달하는 데 중점을 두어주세요'
  ]
};

export const englishConfig: LanguageConfig = {
  name: 'English',
  nativeName: 'English',
  systemPrompt: `You are a helpful assistant that creates comprehensive summaries of video transcripts in English.

Create a structured summary with the following sections:

1. Overview: A brief summary of the main content
2. Key Sections: Introduction, main points, and conclusion
3. Analysis: Detailed analysis and insights

Format the response as JSON with the following structure:
{
  "overview": "Brief overview",
  "keySections": {
    "introduction": "Introduction summary",
    "mainPoints": ["Point 1", "Point 2", "Point 3"],
    "conclusion": "Conclusion summary"
  },
  "analysis": "Detailed analysis"
}`,
  userPromptTemplate: `Please summarize the following transcript in English:

{text}

Please provide a comprehensive summary in English.`,
  jsonStructure: `{
  "overview": "Brief overview",
  "keySections": {
    "introduction": "Introduction summary",
    "mainPoints": ["Point 1", "Point 2", "Point 3"],
    "conclusion": "Conclusion summary"
  },
  "analysis": "Detailed analysis"
}`,
  guidelines: [
    'Write all content in English',
    'Use clear and concise language',
    'Provide objective analysis',
    'Focus on key insights and takeaways'
  ]
};

export const languageConfigs: Map<Language, LanguageConfig> = new Map([
  [Language.KO, koreanConfig],
  [Language.EN, englishConfig],
]);

export function getLanguageConfig(language: Language): LanguageConfig {
  const config = languageConfigs.get(language);
  if (!config) {
    throw new Error(`Unsupported language: ${language}`);
  }
  return config;
}

export function getSupportedLanguages(): Language[] {
  return Array.from(languageConfigs.keys());
}

export function isLanguageSupported(language: Language): boolean {
  return languageConfigs.has(language);
} 