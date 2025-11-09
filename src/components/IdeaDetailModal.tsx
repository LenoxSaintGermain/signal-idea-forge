
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUp, ArrowDown, MessageCircle, Share2, Heart, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useComments } from "@/hooks/useComments";
import type { Idea } from "@/modules/signal-vault/types";

interface IdeaDetailModalProps {
  idea: Idea | null;
  isOpen: boolean;
  onClose: () => void;
  onVote: (ideaId: string, voteType: 'up' | 'down') => void;
  hasVoted: boolean;
}

const IdeaDetailModal = ({ idea, isOpen, onClose, onVote, hasVoted }: IdeaDetailModalProps) => {
  const { toast } = useToast();
  const [commentText, setCommentText] = useState("");
  const { comments, addComment } = useComments(idea?.id || null);

  const handleComment = async () => {
    if (!commentText.trim() || !idea) return;
    
    try {
      await addComment(commentText, "You");
      setCommentText("");
    } catch (error) {
      console.error('Comment error:', error);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(value);
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
            {idea.problem && (
              <div>
                <h3 className="font-semibold text-lg mb-2">Problem</h3>
                <p className="text-gray-700 leading-relaxed">{idea.problem}</p>
              </div>
            )}

            {/* Solution */}
            {idea.solution && (
              <div>
                <h3 className="font-semibold text-lg mb-2">Solution</h3>
                <p className="text-gray-700 leading-relaxed">{idea.solution}</p>
              </div>
            )}

            {/* Market Opportunity */}
            {idea.marketOpportunity && (
              <div>
                <h3 className="font-semibold text-lg mb-2">Market Opportunity</h3>
                <p className="text-gray-700 leading-relaxed">{idea.marketOpportunity}</p>
              </div>
            )}

            {/* Business Model */}
            {idea.businessModel && (
              <div>
                <h3 className="font-semibold text-lg mb-2">Business Model</h3>
                <p className="text-gray-700 leading-relaxed">{idea.businessModel}</p>
              </div>
            )}

            {/* Comments Section */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Discussion ({comments.length})</h3>
              
              {/* Add Comment */}
              <div className="mb-6">
                <Textarea
                  placeholder="Share your thoughts, suggestions, or feedback..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="mb-2"
                />
                <Button onClick={handleComment} disabled={!commentText.trim()}>
                  Add Comment (+2 Points)
                </Button>
              </div>

              {/* Comments List */}
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-medium text-sm">{comment.user_name}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{comment.content}</p>
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
