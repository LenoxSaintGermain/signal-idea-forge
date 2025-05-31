
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown, Comment } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import Dashboard from "@/components/Dashboard";
import ROISimulator from "@/components/ROISimulator";
import IdeaCard from "@/components/IdeaCard";

const Index = () => {
  const { toast } = useToast();
  const [activeView, setActiveView] = useState("explore");
  const [userPoints, setUserPoints] = useState(412);
  const [votedIdeas, setVotedIdeas] = useState(new Set());

  const mockIdeas = [
    {
      id: "idea-001",
      title: "AI Agent for HOA Disputes",
      summary: "Autonomous AI lawyer that mediates petty neighborhood conflicts and automates bureaucratic processes",
      tags: ["LegalTech", "AI", "SaaS"],
      valuationEstimate: 1200000,
      voteCount: 102,
      commentCount: 18,
      userEquity: 0.09,
      status: "hot"
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
      status: "trending"
    },
    {
      id: "idea-003",
      title: "Climate Credit Marketplace",
      summary: "P2P platform for trading verified carbon offsets with blockchain verification and impact tracking",
      tags: ["ClimaTech", "Blockchain", "ESG"],
      valuationEstimate: 2100000,
      voteCount: 156,
      commentCount: 31,
      userEquity: 0.12,
      status: "rising"
    }
  ];

  const handleVote = (ideaId: string, voteType: 'up' | 'down') => {
    if (votedIdeas.has(ideaId)) {
      toast({
        title: "Already voted",
        description: "You can only vote once per idea",
        variant: "destructive"
      });
      return;
    }

    setVotedIdeas(prev => new Set([...prev, ideaId]));
    setUserPoints(prev => prev + 1);
    
    toast({
      title: "Vote recorded!",
      description: `+1 Signal Point earned`,
    });
    
    console.log(`Voted ${voteType} on idea ${ideaId}`);
  };

  if (activeView === "dashboard") {
    return <Dashboard userPoints={userPoints} ideas={mockIdeas} />;
  }

  if (activeView === "simulator") {
    return <ROISimulator />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Signal Vault
              </div>
              <Badge variant="secondary" className="text-xs">MVP</Badge>
            </div>
            
            <nav className="flex items-center space-x-6">
              <Button
                variant={activeView === "explore" ? "default" : "ghost"}
                onClick={() => setActiveView("explore")}
                className="text-sm"
              >
                Explore
              </Button>
              <Button
                variant={activeView === "dashboard" ? "default" : "ghost"}
                onClick={() => setActiveView("dashboard")}
                className="text-sm"
              >
                Dashboard
              </Button>
              <Button
                variant={activeView === "simulator" ? "default" : "ghost"}
                onClick={() => setActiveView("simulator")}
                className="text-sm"
              >
                ROI Simulator
              </Button>
            </nav>

            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                <span className="font-semibold text-blue-600">{userPoints}</span> Signal Points
              </div>
              <Button size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600">
                Submit Idea
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent">
            Turn Ideas Into Assets
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            The marketplace where brilliant ideas meet community validation. 
            Contribute, earn Signal Points, and simulate your potential returns.
          </p>
          <div className="flex justify-center space-x-4">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8">
              Start Exploring
            </Button>
            <Button size="lg" variant="outline">
              Submit Your Idea
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-8 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">247</div>
              <div className="text-sm text-gray-600">Active Ideas</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-indigo-600">1.2K</div>
              <div className="text-sm text-gray-600">Community Members</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">$12M</div>
              <div className="text-sm text-gray-600">Total Valuation</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-pink-600">89%</div>
              <div className="text-sm text-gray-600">Validation Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Ideas Feed */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Featured Ideas</h2>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">Popular</Button>
              <Button variant="outline" size="sm">Recent</Button>
              <Button variant="outline" size="sm">Hot</Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockIdeas.map((idea) => (
              <IdeaCard
                key={idea.id}
                idea={idea}
                onVote={handleVote}
                hasVoted={votedIdeas.has(idea.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold mb-6">Ready to Monetize Your Ideas?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join Signal Vault and turn your intellectual property into a scalable revenue stream.
          </p>
          <Button size="lg" variant="secondary" className="text-blue-600 font-semibold px-8">
            Get Started Today
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
