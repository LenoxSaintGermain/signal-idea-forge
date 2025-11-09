
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AIService } from '@/services/aiService';

interface AIContextType {
  aiService: AIService | null;
  isConfigured: boolean;
  configureAI: (claudeKey: string, geminiKey: string) => void;
  generateIdea: (prompt: string) => Promise<string>;
  enhanceIdea: (ideaData: any) => Promise<any>;
  generateValuation: (ideaData: any) => Promise<number>;
  generateTags: (content: string) => Promise<string[]>;
  isLoading: boolean;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export const useAI = () => {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
};

interface AIProviderProps {
  children: ReactNode;
}

export const AIProvider = ({ children }: AIProviderProps) => {
  const [aiService, setAIService] = useState<AIService | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const configureAI = (claudeKey: string, geminiKey: string) => {
    try {
      // Use Claude as primary, Gemini as fallback
      const service = new AIService(claudeKey, 'claude', geminiKey, 'gemini');
      setAIService(service);
      
      // Store keys in localStorage for persistence (temporary solution)
      localStorage.setItem('ai_claude_key', claudeKey);
      localStorage.setItem('ai_gemini_key', geminiKey);
      
      console.log('AI service configured successfully');
    } catch (error) {
      console.error('Failed to configure AI service:', error);
    }
  };

  // Initialize from localStorage on first load
  React.useEffect(() => {
    const claudeKey = localStorage.getItem('ai_claude_key');
    const geminiKey = localStorage.getItem('ai_gemini_key');
    
    if (claudeKey && geminiKey) {
      configureAI(claudeKey, geminiKey);
    }
  }, []);

  const generateIdea = async (prompt: string): Promise<string> => {
    if (!aiService) throw new Error('AI service not configured');
    setIsLoading(true);
    try {
      const content = await aiService.generateContent(`Generate a detailed business idea based on: ${prompt}. Include title, summary, problem statement, and solution overview.`);
      return content;
    } finally {
      setIsLoading(false);
    }
  };

  const enhanceIdea = async (ideaData: any): Promise<any> => {
    if (!aiService) throw new Error('AI service not configured');
    setIsLoading(true);
    try {
      return await aiService.enhanceIdea(ideaData);
    } finally {
      setIsLoading(false);
    }
  };

  const generateValuation = async (ideaData: any): Promise<number> => {
    if (!aiService) throw new Error('AI service not configured');
    setIsLoading(true);
    try {
      return await aiService.generateValuation(ideaData);
    } finally {
      setIsLoading(false);
    }
  };

  const generateTags = async (content: string): Promise<string[]> => {
    if (!aiService) throw new Error('AI service not configured');
    setIsLoading(true);
    try {
      return await aiService.generateTags(content);
    } finally {
      setIsLoading(false);
    }
  };

  const value: AIContextType = {
    aiService,
    isConfigured: !!aiService,
    configureAI,
    generateIdea,
    enhanceIdea,
    generateValuation,
    generateTags,
    isLoading
  };

  return (
    <AIContext.Provider value={value}>
      {children}
    </AIContext.Provider>
  );
};
