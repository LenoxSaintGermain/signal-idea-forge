# Signal Vault Module

## Overview
Signal Vault is a modular idea marketplace and validation platform that can be integrated into any React application. It features community-driven validation, AI-powered enhancements, gamification through Signal Points, and ROI simulation.

## Module Structure
```
src/modules/signal-vault/
├── components/          # All UI components
│   ├── Dashboard.tsx
│   ├── FilterBar.tsx
│   ├── Navigation.tsx
│   ├── IdeaCard.tsx
│   ├── IdeaDetailModal.tsx
│   ├── ROISimulator.tsx
│   ├── SubmitIdeaForm.tsx
│   └── AIConfigModal.tsx
├── contexts/           # React Context providers
│   └── AIContext.tsx
├── services/          # External service integrations
│   └── aiService.ts
├── types/             # TypeScript type definitions
│   └── index.ts
├── utils/             # Utility functions
│   └── index.ts
├── hooks/             # Custom React hooks
│   └── index.ts
├── index.ts           # Barrel export (public API)
└── module-manifest.json
```

## Installation

### Option 1: Copy Module Directory
```bash
# Copy the entire module directory to your project
cp -r src/modules/signal-vault /path/to/your-project/src/modules/
```

### Option 2: Import as Package
```bash
# Future: npm install @signal-vault/core
```

## Dependencies
The module requires the following packages (already included in this project):
- React 18+
- lucide-react
- shadcn/ui components (button, card, badge, input, select, dialog, etc.)
- @radix-ui primitives

See `module-manifest.json` for complete dependency list.

## Basic Usage

### 1. Wrap your app with AIProvider
```tsx
import { AIProvider } from '@/modules/signal-vault';

function App() {
  return (
    <AIProvider>
      {/* Your app */}
    </AIProvider>
  );
}
```

### 2. Use components in your routes
```tsx
import { Navigation, Dashboard, IdeaCard } from '@/modules/signal-vault';

function MyPage() {
  return (
    <>
      <Navigation 
        activeView="explore" 
        setActiveView={setView}
        userPoints={userPoints}
      />
      <Dashboard userPoints={userPoints} ideas={ideas} />
    </>
  );
}
```

### 3. Use utilities for data formatting
```tsx
import { formatCurrency, generateMockData } from '@/modules/signal-vault';

const { ideas } = generateMockData();
const formatted = formatCurrency(1200000); // "$1.2M"
```

## Features

### Core Features
- ✅ Idea submission and browsing
- ✅ Community voting and commenting
- ✅ Signal Points gamification system
- ✅ User dashboard with portfolio tracking
- ✅ ROI simulator for investment scenarios
- ✅ Advanced filtering and sorting
- ✅ AI-powered idea enhancement (Claude/Gemini)
- ✅ Responsive design (mobile-first)

### Integration Ready
- 🔄 Persona-based customization (recruiters, C-suite, etc.)
- 🔄 Supabase backend integration
- 🔄 Authentication (can share with parent app)
- 🔄 Real-time updates
- 🔄 Analytics and tracking

## Configuration

### AI Configuration
Users can configure AI providers (Claude/Gemini) through the AIConfigModal:
```tsx
import { AIConfigModal, useAI } from '@/modules/signal-vault';

function Settings() {
  const { isConfigured } = useAI();
  
  return (
    <AIConfigModal 
      isOpen={!isConfigured} 
      onClose={() => {}}
    />
  );
}
```

### Customization
The module uses Tailwind CSS and can be customized via:
- Tailwind config (colors, spacing, etc.)
- CSS variables (defined in parent app's index.css)
- Component prop overrides

## Standalone vs Integrated Mode

### Standalone Mode
Use as a complete feature section with all views:
```tsx
import { useState } from 'react';
import * as SignalVault from '@/modules/signal-vault';

function SignalVaultStandalone() {
  const [view, setView] = useState('explore');
  
  // Render different views based on state
  return <SignalVault.Navigation activeView={view} ... />;
}
```

### Integrated Mode
Cherry-pick components for specific use cases:
```tsx
import { IdeaCard, ROISimulator } from '@/modules/signal-vault';

function MyCustomPage() {
  return (
    <div>
      <h1>My Use Cases</h1>
      {ideas.map(idea => <IdeaCard idea={idea} ... />)}
    </div>
  );
}
```

## TypeScript Support
Full TypeScript definitions included. Import types:
```tsx
import type { Idea, User, Signal } from '@/modules/signal-vault';

const myIdea: Idea = {
  id: '1',
  title: 'My Idea',
  summary: 'Description',
  tags: ['tech'],
  valuationEstimate: 1000000,
  voteCount: 0,
  commentCount: 0,
  status: 'new'
};
```

## Mock Data
Generate test data for demos:
```tsx
import { generateMockData } from '@/modules/signal-vault';

const { ideas } = generateMockData();
// Returns 3 pre-configured idea objects
```

## Next Steps
- [ ] Add Supabase backend integration
- [ ] Implement real authentication
- [ ] Add persona customization layer
- [ ] Create migration scripts for Bolt integration
- [ ] Add analytics tracking
- [ ] Implement real-time features

## License
Part of Signal Vault project - Portable module for integration

## Support
For integration questions or issues, refer to the main project documentation.
