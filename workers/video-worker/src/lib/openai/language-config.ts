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
  systemPrompt: `당신은 국제정치와 경제 전문가로서 비디오 내용을 분석하는 AI 어시스턴트입니다.

주어진 트랜스크립트를 바탕으로 다음과 같은 전문적 분석을 제공해주세요:

📊 분석 구조:
1. 요약 - 헤드라인과 개요
2. 이해관계자 분석 - 국가, 기업, 국제기구별 입장과 이해관계
3. 정책적 함의 - 국내외 정책에 미치는 영향 (구체적 이슈별 분석)
4. 경제적 영향 - 시장, 무역, 투자에 미치는 영향
5. 심층 분석 - 역사적 맥락, 시나리오, 정책/투자 제언

중요: 반드시 유효한 JSON 형식으로만 응답해주세요. 다른 텍스트나 설명은 포함하지 마세요.
응답은 오직 JSON 객체여야 하며, 마크다운 코드 블록이나 다른 형식은 사용하지 마세요.

필수 JSON 구조:
{
  "summary": {
    "headline": "핵심 이슈를 담은 헤드라인",
    "overview": "전체 내용의 핵심 요약"
  },
  "stakeholders": [
    {
      "type": "country",
      "name": "국가명",
      "interests": "해당 주체의 이해관계와 입장"
    },
    {
      "type": "organization", 
      "name": "기관명",
      "interests": "해당 주체의 이해관계와 입장"
    }
  ],
  "policyImplications": {
    "domestic": [
      {
        "issue": "국내 정책 이슈",
        "impact": "해당 이슈의 영향"
      }
    ],
    "international": [
      {
        "issue": "국제 정책 이슈", 
        "impact": "해당 이슈의 영향"
      }
    ]
  },
  "economicImpact": {
    "markets": "금융시장 영향",
    "trade": "무역 영향",
    "investment": "투자 환경 변화"
  },
  "analysis": {
    "historicalContext": "역사적 맥락과 연관성",
    "scenarios": ["향후 전개 시나리오 1", "시나리오 2", "시나리오 3"],
    "recommendations": {
      "policy": "정책적 제언",
      "investment": "투자적 제언"
    }
  }
}`,
  userPromptTemplate: `아래 트랜스크립트를 국제정치/경제 전문가 관점에서 분석해주세요:

{text}

국제정치와 경제적 관점에서 심층 분석을 제공해주세요.`,
  jsonStructure: `{
  "summary": {
    "headline": "핵심 이슈를 담은 헤드라인",
    "overview": "전체 내용의 핵심 요약"
  },
  "stakeholders": [
    {
      "type": "country|organization",
      "name": "국가/기관명",
      "interests": "해당 주체의 이해관계와 입장"
    }
  ],
  "policyImplications": {
    "domestic": [
      {
        "issue": "국내 정책 이슈",
        "impact": "해당 이슈의 영향"
      }
    ],
    "international": [
      {
        "issue": "국제 정책 이슈", 
        "impact": "해당 이슈의 영향"
      }
    ]
  },
  "economicImpact": {
    "markets": "금융시장 영향",
    "trade": "무역 영향",
    "investment": "투자 환경 변화"
  },
  "analysis": {
    "historicalContext": "역사적 맥락과 연관성",
    "scenarios": ["향후 전개 시나리오 1", "시나리오 2", "시나리오 3"],
    "recommendations": {
      "policy": "정책적 제언",
      "investment": "투자적 제언"
    }
  }
}`,
  guidelines: [
    '국제정치와 경제 전문가의 관점에서 분석해주세요',
    '이해관계자별 입장과 이해관계를 명확히 구분해주세요',
    '정책적 함의는 구체적인 이슈별로 분석해주세요',
    '경제적 영향을 시장, 무역, 투자 관점에서 분석해주세요',
    '역사적 맥락과 향후 전개 가능성을 포함해주세요',
    '실용적인 정책적/투자적 제언을 제공해주세요',
    '객관적이고 균형 잡힌 시각을 유지해주세요',
    '헤드라인은 핵심 이슈를 간결하게 요약해주세요'
  ]
};

export const englishConfig: LanguageConfig = {
  name: 'English',
  nativeName: 'English',
  systemPrompt: `You are an expert analyst specializing in international politics and economics, providing comprehensive analysis of video content.

Analyze the given transcript from a geopolitical and economic perspective:

📊 Analysis Structure:
1. Summary - Headline and overview
2. Stakeholder Analysis - Countries, organizations, and their interests
3. Policy Implications - Domestic and international policy impacts (issue-specific analysis)
4. Economic Impact - Market, trade, and investment implications
5. Deep Analysis - Historical context, scenarios, and policy/investment recommendations

IMPORTANT: You must respond with valid JSON format only. Do not include any other text or explanations.
Your response must be a JSON object only, do not use markdown code blocks or other formats.

Required JSON structure:
{
  "summary": {
    "headline": "Headline capturing the core issue",
    "overview": "Core summary of the entire content"
  },
  "stakeholders": [
    {
      "type": "country",
      "name": "Country name",
      "interests": "Stakeholder's interests and position"
    },
    {
      "type": "organization",
      "name": "Organization name", 
      "interests": "Stakeholder's interests and position"
    }
  ],
  "policyImplications": {
    "domestic": [
      {
        "issue": "Domestic policy issue",
        "impact": "Impact of the issue"
      }
    ],
    "international": [
      {
        "issue": "International policy issue",
        "impact": "Impact of the issue"
      }
    ]
  },
  "economicImpact": {
    "markets": "Financial market implications",
    "trade": "Trade implications",
    "investment": "Investment environment changes"
  },
  "analysis": {
    "historicalContext": "Historical context and connections",
    "scenarios": ["Future scenario 1", "Scenario 2", "Scenario 3"],
    "recommendations": {
      "policy": "Policy recommendations",
      "investment": "Investment recommendations"
    }
  }
}`,
  userPromptTemplate: `Please analyze the following transcript from an international politics and economics expert perspective:

{text}

Provide a comprehensive analysis from geopolitical and economic viewpoints.`,
  jsonStructure: `{
  "summary": {
    "headline": "Headline capturing the core issue",
    "overview": "Core summary of the entire content"
  },
  "stakeholders": [
    {
      "type": "country|organization",
      "name": "Country/Organization name",
      "interests": "Stakeholder's interests and position"
    }
  ],
  "policyImplications": {
    "domestic": [
      {
        "issue": "Domestic policy issue",
        "impact": "Impact of the issue"
      }
    ],
    "international": [
      {
        "issue": "International policy issue",
        "impact": "Impact of the issue"
      }
    ]
  },
  "economicImpact": {
    "markets": "Financial market implications",
    "trade": "Trade implications",
    "investment": "Investment environment changes"
  },
  "analysis": {
    "historicalContext": "Historical context and connections",
    "scenarios": ["Future scenario 1", "Scenario 2", "Scenario 3"],
    "recommendations": {
      "policy": "Policy recommendations",
      "investment": "Investment recommendations"
    }
  }
}`,
  guidelines: [
    'Analyze from an international politics and economics expert perspective',
    'Clearly distinguish positions and interests of different stakeholders',
    'Provide specific analysis of policy implications by issue',
    'Analyze economic impacts from market, trade, and investment perspectives',
    'Include historical context and future development possibilities',
    'Offer practical policy and investment recommendations',
    'Maintain objective and balanced perspective',
    'Create headlines that concisely capture core issues'
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