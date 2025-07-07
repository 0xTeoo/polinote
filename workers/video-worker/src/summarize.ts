import { Language } from "@polinote/entities";
import { openai } from "./config";

/**
 * Summarize transcript using OpenAI GPT-4
 */
export async function summarize(transcript: string, language: Language): Promise<{
  overview: string;
  keySections: {
    introduction: string;
    mainPoints: string[];
    conclusion: string;
  },
  analysis: string;
}> {
  try {
    const prompt = `Please analyze this transcript and provide a structured summary in ${language === Language.KO ? 'Korean' : 'English'
      }. 

    Required sections:
    - Overview: A concise summary of the main content
    - Key Sections:
      - Introduction: Opening remarks and context
      - Main Points: Key discussion points
      - Conclusion: Closing remarks and outcomes
    - Analysis: Thoughtful analysis of implications and significance

    Formatting requirements:
    1. Use markdown for emphasis:
       - **Bold** for key policy announcements, decisions, or significant statements
       - *Italic* for names of people, organizations, or important terms when first mentioned
       - \`backticks\` for specific numbers, dates, or statistical data
       - > Blockquotes for direct quotes from speakers
       - ### Headers for major topic transitions

    2. Always emphasize:
       - Policy changes or announcements
       - Numerical data or statistics
       - Names of key officials or organizations
       - Critical deadlines or dates
       - Direct quotes from officials
       - Major conclusions or decisions

    Format the response as a JSON with the following structure:
    {
      "overview": "A concise overview with emphasized key points",
      "keySections": {
        "introduction": "Description of opening remarks with emphasis",
        "mainPoints": ["Array of key points with proper markdown emphasis"],
        "conclusion": "Summary of closing remarks with emphasis"
      },
      "analysis": "A thoughtful analysis with emphasized significant points"
    }

    Transcript:
    ${transcript}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content:
            'You are an expert political analyst specializing in White House press briefings. Your task is to provide clear, accurate, and insightful summaries of briefing transcripts. Use markdown formatting effectively to highlight key information and make the content more readable and impactful.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');

    if (!result.overview || !result.keySections || !result.analysis) {
      throw new Error('Invalid response format from OpenAI');
    }

    return {
      overview: result.overview,
      keySections: result.keySections,
      analysis: result.analysis,
    };
  } catch (error) {
    console.error('Error generating summary:', error);
    throw error;
  }
}
