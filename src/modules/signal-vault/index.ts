// Signal Vault Module - Public API
// Barrel export for clean imports in parent application

// Components
export { default as Dashboard } from './components/Dashboard';
export { default as FilterBar } from './components/FilterBar';
export { default as Navigation } from './components/Navigation';
export { default as IdeaCard } from './components/IdeaCard';
export { default as IdeaDetailModal } from './components/IdeaDetailModal';
export { default as ROISimulator } from './components/ROISimulator';
export { default as SubmitIdeaForm } from './components/SubmitIdeaForm';

// Services
export { AIService } from './services/aiService';

// Types
export type {
  Idea,
  User,
  Signal,
  Comment,
  IdeaEquity,
  Transaction,
  ROICalculation,
  IdeaCardProps,
  IdeaDetailModalProps,
  DashboardProps,
  FilterBarProps,
  NavigationProps,
  SubmitIdeaFormProps,
  AIConfigModalProps,
  AIProvider as IAIProvider,
  AIResponse,
  AIContextType,
  SortOption,
  CategoryFilter,
  StatusFilter
} from './types';

// Utilities
export {
  formatCurrency,
  formatNumber,
  calculateEquity,
  calculateROI,
  calculateAnnualizedReturn,
  generateMockData
} from './utils';

// Hooks
export { useSignalVault } from './hooks';
