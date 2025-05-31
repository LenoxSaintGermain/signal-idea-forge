
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUp, ArrowDown, MessageCircle, Share2, Heart, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface IdeaDetailModalProps {
  idea: any;
  isOpen: boolean;
  onClose: () => void;
  onVote: (ideaId: string, voteType: 'up' | 'down') => void;
  hasVoted: boolean;
}

const IdeaDetailModal = ({ idea, isOpen, onClose, onVote, hasVoted }: IdeaDetailModalProps) => {
  const { toast } = useToast();
  const [comment, setComment] = useState("");
  const [comments] = useState([
    { id: 1, author: "Sarah Chen", content: "Love the AI automation angle. Have you considered B2B SaaS pricing?", time: "2h ago", votes: 5 },
    { id: 2, author: "Mike Rodriguez", content: "The HOA market is huge but fragmented. Curious about customer acquisition strategy.", time: "4h ago", votes: 3 },
    { id: 3, author: "Jennifer Liu", content: "Similar to LegalZoom but more niche. Could see 10x potential if executed well.", time: "1d ago", votes: 8 }
  ]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(value);
  };

  const handleComment = () => {
    if (!comment.trim()) return;
    
    toast({
      title: "Comment added!",
      description: "+2 Signal Points earned",
    });
    
    setComment("");
  };

  if (!idea) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-start">
            <div>
              <DialogTitle className="text-2xl font-bold mb-2">{idea.title}</DialogTitle>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>Posted 3 days ago</span>
                <span>•</span>
                <span>by Signal Vault</span>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Heart className="h-4 w-4 mr-1" />
                Save
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Summary */}
            <div>
              <h3 className="font-semibold text-lg mb-2">Summary</h3>
              <p className="text-gray-700 leading-relaxed">{idea.summary}</p>
            </div>

            {/* Problem */}
            <div>
              <h3 className="font-semibold text-lg mb-2">Problem</h3>
              <p className="text-gray-700 leading-relaxed">
                HOA disputes are bureaucratic nightmares that waste time and money for homeowners. 
                Current solutions require expensive lawyers or lengthy mediation processes that often escalate conflicts rather than resolve them.
              </p>
            </div>

            {/* Solution */}
            <div>
              <h3 className="font-semibold text-lg mb-2">Solution</h3>
              <p className="text-gray-700 leading-relaxed">
                An AI-powered agent that understands HOA bylaws, local regulations, and conflict resolution best practices. 
                It can draft letters, suggest compromises, and automate the bureaucratic process while maintaining a neutral tone.
              </p>
            </div>

            {/* Market Opportunity */}
            <div>
              <h3 className="font-semibold text-lg mb-2">Market Opportunity</h3>
              <p className="text-gray-700 leading-relaxed">
                73% of Americans live in HOA communities (370,000+ associations). Average dispute costs $3,000+ in legal fees. 
                TAM: $2.1B annually in HOA-related legal costs.
              </p>
            </div>

            {/* Business Model */}
            <div>
              <h3 className="font-semibold text-lg mb-2">Business Model</h3>
              <p className="text-gray-700 leading-relaxed">
                SaaS subscription: $29/month for basic AI mediation, $99/month for premium with human backup support. 
                Revenue share with property management companies.
              </p>
            </div>

            {/* Comments Section */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Discussion ({comments.length})</h3>
              
              {/* Add Comment */}
              <div className="mb-6">
                <Textarea
                  placeholder="Share your thoughts, suggestions, or feedback..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="mb-2"
                />
                <Button onClick={handleComment} disabled={!comment.trim()}>
                  Add Comment (+2 Points)
                </Button>
              </div>

              {/* Comments List */}
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-medium text-sm">{comment.author}</div>
                      <div className="text-xs text-gray-500">{comment.time}</div>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{comment.content}</p>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" className="text-xs">
                        <ArrowUp className="h-3 w-3 mr-1" />
                        {comment.votes}
                      </Button>
                      <Button variant="ghost" size="sm" className="text-xs">
                        Reply
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Voting */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold">Community Signal</h4>
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onVote(idea.id, 'up')}
                    disabled={hasVoted}
                    className="p-2"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <span className="font-medium">{idea.voteCount}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onVote(idea.id, 'down')}
                    disabled={hasVoted}
                    className="p-2"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="text-center">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Simulate ROI
                </Button>
              </div>
            </div>

            {/* Tags */}
            <div>
              <h4 className="font-semibold mb-2">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {idea.tags.map((tag: string, index: number) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Valuation */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">Estimated Valuation</h4>
              <div className="text-2xl font-bold text-green-700">
                {formatCurrency(idea.valuationEstimate)}
              </div>
              <div className="text-sm text-green-600">AI-Generated Estimate</div>
            </div>

            {/* Your Equity */}
            {idea.userEquity && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Your Potential Equity</h4>
                <div className="text-xl font-bold text-blue-700">
                  {(idea.userEquity * 100).toFixed(2)}%
                </div>
                <div className="text-sm text-blue-600">
                  Est. Value: {formatCurrency(idea.valuationEstimate * idea.userEquity)}
                </div>
              </div>
            )}

            {/* Interest Button */}
            <Button variant="outline" className="w-full">
              Express Interest in Licensing
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IdeaDetailModal;
