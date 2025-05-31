
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import Dashboard from "@/components/Dashboard";
import ROISimulator from "@/components/ROISimulator";
import IdeaCard from "@/components/IdeaCard";
import IdeaDetailModal from "@/components/IdeaDetailModal";
import SubmitIdeaForm from "@/components/SubmitIdeaForm";
import FilterBar from "@/components/FilterBar";

const Index = () => {
  const { toast } = useToast();
  const [activeView, setActiveView] = useState("explore");
  const [userPoints, setUserPoints] = useState(412);
  const [votedIdeas, setVotedIdeas] = useState(new Set());
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState("popular");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

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

  const handleIdeaClick = (idea: any) => {
    setSelectedIdea(idea);
    setIsDetailModalOpen(true);
  };

  // Filter and sort ideas based on current filters
  const filteredIdeas = mockIdeas.filter(idea => {
    if (statusFilter !== "all" && idea.status !== statusFilter) return false;
    // Add more filtering logic based on categoryFilter
    return true;
  });

  // Render different views
  if (activeView === "dashboard") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Navigation activeView={activeView} setActiveView={setActiveView} userPoints={userPoints} />
        <Dashboard userPoints={userPoints} ideas={mockIdeas} />
      </div>
    );
  }

  if (activeView === "simulator") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Navigation activeView={activeView} setActiveView={setActiveView} userPoints={userPoints} />
        <ROISimulator />
      </div>
    );
  }

  if (activeView === "submit") {
    return (
      <SubmitIdeaForm onBack={() => setActiveView("explore")} />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navigation activeView={activeView} setActiveView={setActiveView} userPoints={userPoints} />

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
            <button 
              onClick={() => document.getElementById('ideas-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
            >
              Start Exploring
            </button>
            <button 
              onClick={() => setActiveView("submit")}
              className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:shadow-lg transition-all"
            >
              Submit Your Idea
            </button>
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
      <section id="ideas-section" className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Featured Ideas</h2>
            <FilterBar 
              onSortChange={setSortBy}
              onCategoryChange={setCategoryFilter}
              onStatusChange={setStatusFilter}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIdeas.map((idea) => (
              <div key={idea.id} onClick={() => handleIdeaClick(idea)} className="cursor-pointer">
                <IdeaCard
                  idea={idea}
                  onVote={handleVote}
                  hasVoted={votedIdeas.has(idea.id)}
                />
              </div>
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
          <button 
            onClick={() => setActiveView("submit")}
            className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            Get Started Today
          </button>
        </div>
      </section>

      {/* Idea Detail Modal */}
      <IdeaDetailModal
        idea={selectedIdea}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onVote={handleVote}
        hasVoted={selectedIdea ? votedIdeas.has(selectedIdea.id) : false}
      />
    </div>
  );
};

export default Index;
