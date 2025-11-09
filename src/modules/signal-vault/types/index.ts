// Core Data Models for Signal Vault Module

export interface Idea {
  id: string;
  title: string;
  summary: string;
  problem?: string;
  solution?: string;
  marketOpportunity?: string;
  businessModel?: string;
  tags: string[];
  valuationEstimate: number;
  voteCount: number;
  commentCount: number;
  userEquity?: number;
  status: 'hot' | 'trending' | 'rising' | 'new';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface User {
  id: string;
  email?: string;
  signalPoints: number;
  ideasSubmitted: number;
  ideasVoted: number;
  totalEquity: number;
  createdAt?: Date;
}

export interface Signal {
  id: string;
  userId: string;
  ideaId: string;
  type: 'vote' | 'comment' | 'enhancement' | 'submission';
  points: number;
  createdAt: Date;
}

export interface Comment {
  id: string;
  ideaId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: Date;
}

export interface IdeaEquity {
  userId: string;
  ideaId: string;
  equityPercentage: number;
  signalPointsContributed: number;
  lastUpdated: Date;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'earn' | 'spend';
  amount: number;
  source: string;
  description: string;
  createdAt: Date;
}

export interface ROICalculation {
  investmentAmount: number;
  exitValuation: number;
  equityPercentage: number;
  potentialReturn: number;
  roi: number;
  annualizedReturn: number;
  timeHorizon: number;
}

// Component Props Types
export interface IdeaCardProps {
  idea: Idea;
  onVote: (ideaId: string, voteType: 'up' | 'down') => void;
  hasVoted: boolean;
  onClick?: (idea: Idea) => void;
}

export interface IdeaDetailModalProps {
  idea: Idea | null;
  isOpen: boolean;
  onClose: () => void;
  onVote: (ideaId: string, voteType: 'up' | 'down') => void;
  hasVoted: boolean;
}

export interface DashboardProps {
  userPoints: number;
  ideas: Idea[];
}

export interface FilterBarProps {
  onSortChange: (sort: string) => void;
  onCategoryChange: (category: string) => void;
  onStatusChange: (status: string) => void;
  onValuationChange: (valuation: string) => void;
}

export interface NavigationProps {
  activeView: string;
  setActiveView: (view: string) => void;
  userPoints: number;
}

export interface SubmitIdeaFormProps {
  onBack: () => void;
  onSubmit?: (idea: Partial<Idea>) => void;
}

export interface AIConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// AI Service Types
export interface AIProvider {
  generateContent(prompt: string, context?: any): Promise<string>;
  enhanceIdea(ideaData: any): Promise<any>;
  generateValuation(ideaData: any): Promise<number>;
  generateTags(content: string): Promise<string[]>;
}

export interface AIResponse {
  content: string;
  confidence?: number;
  suggestions?: string[];
}

export interface AIContextType {
  aiService: any | null;
  isConfigured: boolean;
  configureAI: (claudeKey: string, geminiKey: string) => void;
  generateIdea: (prompt: string) => Promise<string>;
  enhanceIdea: (ideaData: any) => Promise<any>;
  generateValuation: (ideaData: any) => Promise<number>;
  generateTags: (content: string) => Promise<string[]>;
  isLoading: boolean;
}

// Utility Types
export type SortOption = 'popular' | 'recent' | 'hot' | 'trending';
export type CategoryFilter = 'all' | 'ai-automation' | 'fintech' | 'healthtech' | 'legaltech' | 'climatetech';
export type StatusFilter = 'all' | 'hot' | 'trending' | 'rising';
