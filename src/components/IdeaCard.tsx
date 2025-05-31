
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Idea {
  id: string;
  title: string;
  summary: string;
  tags: string[];
  valuationEstimate: number;
  voteCount: number;
  commentCount: number;
  userEquity?: number;
  status: string;
}

interface IdeaCardProps {
  idea: Idea;
  onVote: (ideaId: string, voteType: 'up' | 'down') => void;
  hasVoted: boolean;
}

const IdeaCard = ({ idea, onVote, hasVoted }: IdeaCardProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'hot': return 'bg-red-500';
      case 'trending': return 'bg-orange-500';
      case 'rising': return 'bg-green-500';
      default: return 'bg-blue-500';
    }
  };

  const handleVoteClick = (e: React.MouseEvent, voteType: 'up' | 'down') => {
    e.stopPropagation(); // Prevent card click when voting
    onVote(idea.id, voteType);
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-2">
          <Badge className={cn("text-white text-xs", getStatusColor(idea.status))}>
            {idea.status}
          </Badge>
          <div className="text-right">
            <div className="text-sm font-semibold text-green-600">
              {formatCurrency(idea.valuationEstimate)}
            </div>
            <div className="text-xs text-gray-500">Est. Valuation</div>
          </div>
        </div>
        
        <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
          {idea.title}
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          {idea.summary}
        </p>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-1 mb-4">
          {idea.tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        
        {idea.userEquity && (
          <div className="bg-blue-50 p-3 rounded-lg mb-4">
            <div className="text-sm text-blue-800">
              <span className="font-semibold">Your Equity:</span> {(idea.userEquity * 100).toFixed(2)}%
            </div>
            <div className="text-xs text-blue-600">
              Est. Value: {formatCurrency(idea.valuationEstimate * idea.userEquity)}
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => handleVoteClick(e, 'up')}
                disabled={hasVoted}
                className={cn(
                  "p-1 h-8 w-8",
                  hasVoted ? "text-blue-600 bg-blue-50" : "hover:text-blue-600 hover:bg-blue-50"
                )}
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium text-gray-700">{idea.voteCount}</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => handleVoteClick(e, 'down')}
                disabled={hasVoted}
                className="p-1 h-8 w-8 hover:text-red-600 hover:bg-red-50"
              >
                <ArrowDown className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center space-x-1 text-gray-500">
              <MessageCircle className="h-4 w-4" />
              <span className="text-sm">{idea.commentCount}</span>
            </div>
          </div>
          
          <div className="text-xs text-gray-500 hover:text-blue-600 transition-colors">
            Click to view details →
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IdeaCard;
