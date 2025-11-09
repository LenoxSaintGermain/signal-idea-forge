import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useIdeas } from "@/hooks/useIdeas";
import { useSignals } from "@/hooks/useSignals";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useGlobalStats } from "@/hooks/useGlobalStats";
import { Lightbulb, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
// Using modularized Signal Vault components
import {
  Navigation,
  Dashboard,
  ROISimulator,
  IdeaCard,
  IdeaDetailModal,
  SubmitIdeaForm,
  FilterBar,
} from "@/modules/signal-vault";
import IdeaCardSkeleton from "@/components/IdeaCardSkeleton";
import EmptyState from "@/components/EmptyState";
import ErrorBoundary from "@/components/ErrorBoundary";

const Index = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeView, setActiveView] = useState("explore");
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState("popular");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [valuationRange, setValuationRange] = useState("all");
  const [optimisticVotes, setOptimisticVotes] = useState<Map<string, number>>(new Map());

  const { ideas, loading: ideasLoading, hasMore, loadMore } = useIdeas(
    sortBy, 
    categoryFilter, 
    statusFilter, 
    valuationRange
  );
  const { votedIdeas, createSignal } = useSignals(user?.id);
  const { profile } = useUserProfile(user?.id);
  const { stats, loading: statsLoading } = useGlobalStats();

  const handleVote = useCallback(async (ideaId: string, voteType: 'up' | 'down') => {
    if (votedIdeas.has(ideaId)) {
      toast({
        title: "Already voted",
        description: "You can only vote once per idea",
        variant: "destructive"
      });
      return;
    }

    // Optimistic UI update
    setOptimisticVotes(prev => new Map(prev).set(ideaId, (prev.get(ideaId) || 0) + 1));

    try {
      await createSignal(ideaId, 'vote', 1);
      toast({
        title: "Vote recorded!",
        description: "+1 Signal Point earned",
      });
    } catch (error) {
      console.error('Vote error:', error);
      // Rollback optimistic update on error
      setOptimisticVotes(prev => {
        const newMap = new Map(prev);
        newMap.delete(ideaId);
        return newMap;
      });
      toast({
        title: "Vote failed",
        description: "Please try again",
        variant: "destructive"
      });
    }
  }, [votedIdeas, createSignal, toast]);

  const handleIdeaClick = (idea: any) => {
    setSelectedIdea(idea);
    setIsDetailModalOpen(true);
  };

  // Apply optimistic vote counts
  const ideasWithOptimisticVotes = ideas.map(idea => ({
    ...idea,
    voteCount: idea.voteCount + (optimisticVotes.get(idea.id) || 0)
  }));

  // Render different views
  if (activeView === "dashboard") {
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
          <Navigation activeView={activeView} setActiveView={setActiveView} userPoints={profile?.signal_points || 0} />
          <Dashboard userPoints={profile?.signal_points || 0} ideas={ideas} />
        </div>
      </ErrorBoundary>
    );
  }

  if (activeView === "simulator") {
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
          <Navigation activeView={activeView} setActiveView={setActiveView} userPoints={profile?.signal_points || 0} />
          <ROISimulator />
        </div>
      </ErrorBoundary>
    );
  }

  if (activeView === "submit") {
    return (
      <ErrorBoundary>
        <SubmitIdeaForm onBack={() => setActiveView("explore")} />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Navigation activeView={activeView} setActiveView={setActiveView} userPoints={profile?.signal_points || 0} />

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
              <div className="text-2xl font-bold text-blue-600">
                {statsLoading ? '...' : stats.totalIdeas}
              </div>
              <div className="text-sm text-gray-600">Active Ideas</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-indigo-600">
                {statsLoading ? '...' : stats.activeUsers}
              </div>
              <div className="text-sm text-gray-600">Community Members</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {statsLoading ? '...' : `$${(stats.totalValuation / 1000000).toFixed(1)}M`}
              </div>
              <div className="text-sm text-gray-600">Total Valuation</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-pink-600">
                {statsLoading ? '...' : `${stats.validationRate}%`}
              </div>
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
              onValuationChange={setValuationRange}
            />
          </div>
          
          {/* Loading State */}
          {ideasLoading && ideasWithOptimisticVotes.length === 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <IdeaCardSkeleton key={i} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!ideasLoading && ideasWithOptimisticVotes.length === 0 && (
            <EmptyState
              icon={<Lightbulb className="h-12 w-12 text-gray-400" />}
              title="No ideas yet"
              description="Be the first to submit an idea and start earning Signal Points!"
              action={{
                label: "Submit Your Idea",
                onClick: () => setActiveView("submit")
              }}
            />
          )}

          {/* Ideas Grid */}
          {ideasWithOptimisticVotes.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ideasWithOptimisticVotes.map((idea) => (
                  <div key={idea.id} onClick={() => handleIdeaClick(idea)} className="cursor-pointer">
                    <IdeaCard
                      idea={idea}
                      onVote={handleVote}
                      hasVoted={votedIdeas.has(idea.id)}
                    />
                  </div>
                ))}
              </div>

              {/* Load More Button */}
              {hasMore && (
                <div className="flex justify-center mt-8">
                  <Button 
                    onClick={loadMore}
                    disabled={ideasLoading}
                    variant="outline"
                    size="lg"
                  >
                    {ideasLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      'Load More Ideas'
                    )}
                  </Button>
                </div>
              )}
            </>
          )}
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
    </ErrorBoundary>
  );
};

export default Index;
