
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
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: `${context ? `Context: ${JSON.stringify(context)}\n\n` : ''}${prompt}`
          }]
        })
      });

      const data = await response.json();
      return data.content[0].text;
    } catch (error) {
      console.error('Claude API error:', error);
      throw new Error('Failed to generate content with Claude');
    }
  }

  async enhanceIdea(ideaData: any): Promise<any> {
    const prompt = `Enhance this business idea with detailed analysis:
    
Title: ${ideaData.title}
Summary: ${ideaData.summary}
Problem: ${ideaData.problem}
Solution: ${ideaData.solution}

Please provide:
1. Enhanced problem statement
2. Improved solution description
3. Market opportunity analysis
4. Competitive advantages
5. Potential risks and mitigation strategies

Format as JSON with keys: enhancedProblem, enhancedSolution, marketOpportunity, competitiveAdvantages, risks`;

    const response = await this.generateContent(prompt);
    try {
      return JSON.parse(response);
    } catch {
      return { enhancedContent: response };
    }
  }

  async generateValuation(ideaData: any): Promise<number> {
    const prompt = `Estimate the potential valuation for this business idea based on market size, execution complexity, and competitive landscape:

Title: ${ideaData.title}
Summary: ${ideaData.summary}
Category: ${ideaData.category}
Market: ${ideaData.market}
Business Model: ${ideaData.businessModel}

Consider factors like:
- Total Addressable Market (TAM)
- Scalability potential
- Execution difficulty
- Competition level
- Revenue model viability

Provide only a number representing the estimated valuation in USD (no currency symbols or formatting).`;

    const response = await this.generateContent(prompt);
    const valuation = parseInt(response.replace(/[^\d]/g, ''));
    return valuation || 500000; // fallback
  }

  async generateTags(content: string): Promise<string[]> {
    const prompt = `Based on this business idea content, suggest 5-8 relevant tags:

${content}

Available tag options: AI, SaaS, FinTech, HealthTech, EdTech, LegalTech, ClimaTech, Productivity, B2B, B2C, Marketplace, Blockchain, Mobile, Web, Social, Enterprise, Consumer, Hardware, Software, Data, Analytics, Security, IoT, AR/VR

Return only a comma-separated list of tags.`;

    const response = await this.generateContent(prompt);
    return response.split(',').map(tag => tag.trim()).slice(0, 8);
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
            maxOutputTokens: 1000,
          }
        })
      });

      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Gemini API error:', error);
      throw new Error('Failed to generate content with Gemini');
    }
  }

  async enhanceIdea(ideaData: any): Promise<any> {
    const prompt = `Enhance this business idea with detailed analysis:
    
Title: ${ideaData.title}
Summary: ${ideaData.summary}
Problem: ${ideaData.problem}
Solution: ${ideaData.solution}

Please provide:
1. Enhanced problem statement
2. Improved solution description
3. Market opportunity analysis
4. Competitive advantages
5. Potential risks and mitigation strategies

Format as JSON with keys: enhancedProblem, enhancedSolution, marketOpportunity, competitiveAdvantages, risks`;

    const response = await this.generateContent(prompt);
    try {
      return JSON.parse(response);
    } catch {
      return { enhancedContent: response };
    }
  }

  async generateValuation(ideaData: any): Promise<number> {
    const prompt = `Estimate the potential valuation for this business idea based on market size, execution complexity, and competitive landscape:

Title: ${ideaData.title}
Summary: ${ideaData.summary}
Category: ${ideaData.category}
Market: ${ideaData.market}
Business Model: ${ideaData.businessModel}

Consider factors like:
- Total Addressable Market (TAM)
- Scalability potential
- Execution difficulty
- Competition level
- Revenue model viability

Provide only a number representing the estimated valuation in USD (no currency symbols or formatting).`;

    const response = await this.generateContent(prompt);
    const valuation = parseInt(response.replace(/[^\d]/g, ''));
    return valuation || 500000; // fallback
  }

  async generateTags(content: string): Promise<string[]> {
    const prompt = `Based on this business idea content, suggest 5-8 relevant tags:

${content}

Available tag options: AI, SaaS, FinTech, HealthTech, EdTech, LegalTech, ClimaTech, Productivity, B2B, B2C, Marketplace, Blockchain, Mobile, Web, Social, Enterprise, Consumer, Hardware, Software, Data, Analytics, Security, IoT, AR/VR

Return only a comma-separated list of tags.`;

    const response = await this.generateContent(prompt);
    return response.split(',').map(tag => tag.trim()).slice(0, 8);
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
      return await this.provider.enhanceIdea(ideaData);
    } catch (error) {
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
