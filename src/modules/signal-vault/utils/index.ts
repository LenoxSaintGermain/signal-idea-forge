// Utility functions for Signal Vault module

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1
  }).format(value);
};

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1
  }).format(value);
};

export const calculateEquity = (signalPoints: number, totalSignals: number): number => {
  if (totalSignals === 0) return 0;
  return signalPoints / totalSignals;
};

export const calculateROI = (
  investmentAmount: number,
  exitValuation: number,
  equityPercentage: number
): number => {
  const potentialReturn = exitValuation * equityPercentage;
  return ((potentialReturn - investmentAmount) / investmentAmount) * 100;
};

export const calculateAnnualizedReturn = (
  roi: number,
  years: number
): number => {
  return Math.pow(1 + (roi / 100), 1 / years) - 1;
};

export const generateMockData = () => {
  return {
    ideas: [
      {
        id: "idea-001",
        title: "AI Agent for HOA Disputes",
        summary: "Autonomous AI lawyer that mediates petty neighborhood conflicts and automates bureaucratic processes",
        tags: ["LegalTech", "AI", "SaaS"],
        valuationEstimate: 1200000,
        voteCount: 102,
        commentCount: 18,
        userEquity: 0.09,
        status: "hot" as const
      },
      {
        id: "idea-002",
        title: "Micro-Dosing App for Productivity",
        summary: "Precision wellness platform for optimizing cognitive performance through tracked micro-interventions",
        tags: ["HealthTech", "Productivity", "B2C"],
        valuationEstimate: 850000,
        voteCount: 87,
        commentCount: 23,
        userEquity: 0.05,
        status: "trending" as const
      },
      {
        id: "idea-003",
        title: "Climate Credit Marketplace",
        summary: "P2P platform for trading verified carbon offsets with blockchain verification and impact tracking",
        tags: ["ClimateTech", "Blockchain", "ESG"],
        valuationEstimate: 2100000,
        voteCount: 156,
        commentCount: 31,
        userEquity: 0.12,
        status: "rising" as const
      }
    ]
  };
};
