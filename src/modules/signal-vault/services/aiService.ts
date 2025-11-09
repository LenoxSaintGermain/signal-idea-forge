
interface AIProvider {
  generateContent(prompt: string, context?: any): Promise<string>;
  enhanceIdea(ideaData: any): Promise<any>;
  generateValuation(ideaData: any): Promise<number>;
  generateTags(content: string): Promise<string[]>;
}

interface AIResponse {
  content: string;
  confidence?: number;
  suggestions?: string[];
}

// Helper function to extract JSON from markdown code blocks
const extractJsonFromResponse = (response: string): any => {
  console.log('Raw AI response:', response);
  
  // Try to find JSON in markdown code blocks
  const jsonMatch = response.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[1]);
      console.log('Parsed JSON from markdown:', parsed);
      return parsed;
    } catch (error) {
      console.error('Failed to parse JSON from markdown:', error);
    }
  }
  
  // Try to parse the entire response as JSON
  try {
    const parsed = JSON.parse(response);
    console.log('Parsed entire response as JSON:', parsed);
    return parsed;
  } catch (error) {
    console.log('Response is not valid JSON, returning as text');
    return { enhancedContent: response };
  }
};

class ClaudeProvider implements AIProvider {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateContent(prompt: string, context?: any): Promise<string> {
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-sonnet-20240229',
          max_tokens: 1500,
          messages: [{
            role: 'user',
            content: `${context ? `Context: ${JSON.stringify(context)}\n\n` : ''}${prompt}`
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`Claude API error: ${response.status}`);
      }

      const data = await response.json();
      return data.content[0].text;
    } catch (error) {
      console.error('Claude API error:', error);
      throw new Error('Failed to generate content with Claude');
    }
  }

  async enhanceIdea(ideaData: any): Promise<any> {
    const prompt = `Enhance this business idea with detailed analysis. Respond with valid JSON only, no markdown formatting:

Title: ${ideaData.title}
Summary: ${ideaData.summary}
Problem: ${ideaData.problem || ''}
Solution: ${ideaData.solution || ''}

Provide a JSON response with these exact keys:
{
  "enhancedProblem": "detailed problem statement",
  "enhancedSolution": "improved solution description", 
  "marketOpportunity": "market analysis and opportunity",
  "competitiveAdvantages": "key competitive advantages",
  "risks": "potential risks and mitigation strategies"
}`;

    const response = await this.generateContent(prompt);
    return extractJsonFromResponse(response);
  }

  async generateValuation(ideaData: any): Promise<number> {
    const prompt = `Estimate the potential valuation for this business idea. Consider market size, scalability, competition, and execution difficulty.

Title: ${ideaData.title}
Summary: ${ideaData.summary}
Category: ${ideaData.category || ''}
Market: ${ideaData.market || ''}

Respond with only a number representing the estimated valuation in USD (no currency symbols, commas, or text).`;

    const response = await this.generateContent(prompt);
    const valuation = parseInt(response.replace(/[^\d]/g, ''));
    console.log('Generated valuation:', valuation);
    return valuation || 500000;
  }

  async generateTags(content: string): Promise<string[]> {
    const prompt = `Based on this content, suggest 5-8 relevant tags from this list:
AI, SaaS, FinTech, HealthTech, EdTech, LegalTech, ClimaTech, Productivity, B2B, B2C, Marketplace, Blockchain, Mobile, Web, Social, Enterprise, Consumer, Hardware, Software, Data, Analytics, Security, IoT, AR/VR

Content: ${content}

Respond with only comma-separated tags, no other text.`;

    const response = await this.generateContent(prompt);
    const tags = response.split(',').map(tag => tag.trim()).slice(0, 8);
    console.log('Generated tags:', tags);
    return tags;
  }
}

class GeminiProvider implements AIProvider {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateContent(prompt: string, context?: any): Promise<string> {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `${context ? `Context: ${JSON.stringify(context)}\n\n` : ''}${prompt}`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1500,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Gemini API error:', error);
      throw new Error('Failed to generate content with Gemini');
    }
  }

  async enhanceIdea(ideaData: any): Promise<any> {
    const prompt = `Enhance this business idea with detailed analysis. Respond with valid JSON only, no markdown formatting:

Title: ${ideaData.title}
Summary: ${ideaData.summary}
Problem: ${ideaData.problem || ''}
Solution: ${ideaData.solution || ''}

Provide a JSON response with these exact keys:
{
  "enhancedProblem": "detailed problem statement",
  "enhancedSolution": "improved solution description", 
  "marketOpportunity": "market analysis and opportunity",
  "competitiveAdvantages": "key competitive advantages",
  "risks": "potential risks and mitigation strategies"
}`;

    const response = await this.generateContent(prompt);
    return extractJsonFromResponse(response);
  }

  async generateValuation(ideaData: any): Promise<number> {
    const prompt = `Estimate the potential valuation for this business idea. Consider market size, scalability, competition, and execution difficulty.

Title: ${ideaData.title}
Summary: ${ideaData.summary}
Category: ${ideaData.category || ''}
Market: ${ideaData.market || ''}

Respond with only a number representing the estimated valuation in USD (no currency symbols, commas, or text).`;

    const response = await this.generateContent(prompt);
    const valuation = parseInt(response.replace(/[^\d]/g, ''));
    console.log('Generated valuation:', valuation);
    return valuation || 500000;
  }

  async generateTags(content: string): Promise<string[]> {
    const prompt = `Based on this content, suggest 5-8 relevant tags from this list:
AI, SaaS, FinTech, HealthTech, EdTech, LegalTech, ClimaTech, Productivity, B2B, B2C, Marketplace, Blockchain, Mobile, Web, Social, Enterprise, Consumer, Hardware, Software, Data, Analytics, Security, IoT, AR/VR

Content: ${content}

Respond with only comma-separated tags, no other text.`;

    const response = await this.generateContent(prompt);
    const tags = response.split(',').map(tag => tag.trim()).slice(0, 8);
    console.log('Generated tags:', tags);
    return tags;
  }
}

export class AIService {
  private provider: AIProvider;
  private fallbackProvider?: AIProvider;

  constructor(primaryApiKey: string, primaryProvider: 'claude' | 'gemini', fallbackApiKey?: string, fallbackProvider?: 'claude' | 'gemini') {
    this.provider = primaryProvider === 'claude' 
      ? new ClaudeProvider(primaryApiKey)
      : new GeminiProvider(primaryApiKey);

    if (fallbackApiKey && fallbackProvider) {
      this.fallbackProvider = fallbackProvider === 'claude'
        ? new ClaudeProvider(fallbackApiKey)
        : new GeminiProvider(fallbackApiKey);
    }
  }

  async enhanceIdea(ideaData: any): Promise<any> {
    try {
      console.log('Enhancing idea with primary provider:', ideaData);
      return await this.provider.enhanceIdea(ideaData);
    } catch (error) {
      console.error('Primary provider failed:', error);
      if (this.fallbackProvider) {
        console.log('Trying fallback provider...');
        return await this.fallbackProvider.enhanceIdea(ideaData);
      }
      throw error;
    }
  }

  async generateValuation(ideaData: any): Promise<number> {
    try {
      return await this.provider.generateValuation(ideaData);
    } catch (error) {
      if (this.fallbackProvider) {
        console.log('Trying fallback provider for valuation...');
        return await this.fallbackProvider.generateValuation(ideaData);
      }
      throw error;
    }
  }

  async generateTags(content: string): Promise<string[]> {
    try {
      return await this.provider.generateTags(content);
    } catch (error) {
      if (this.fallbackProvider) {
        console.log('Trying fallback provider for tags...');
        return await this.fallbackProvider.generateTags(content);
      }
      throw error;
    }
  }

  async generateContent(prompt: string, context?: any): Promise<string> {
    try {
      return await this.provider.generateContent(prompt, context);
    } catch (error) {
      if (this.fallbackProvider) {
        console.log('Trying fallback provider for content...');
        return await this.fallbackProvider.generateContent(prompt, context);
      }
      throw error;
    }
  }
}
