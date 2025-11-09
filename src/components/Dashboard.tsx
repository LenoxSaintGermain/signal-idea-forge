
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, TrendingUp, DollarSign, Lightbulb, Target } from "lucide-react";
import { useUserActivity } from "@/hooks/useUserActivity";
import { useAuth } from "@/hooks/useAuth";
import { formatDistanceToNow } from "date-fns";

interface DashboardProps {
  userPoints: number;
  ideas: any[];
}

const Dashboard = ({ userPoints, ideas }: DashboardProps) => {
  const { user } = useAuth();
  const { activities, loading: activitiesLoading } = useUserActivity(user?.id);

  const totalEquity = ideas.reduce((sum, idea) => sum + (idea.userEquity || 0), 0);
  const estimatedValue = ideas.reduce((sum, idea) => 
    sum + (idea.valuationEstimate * (idea.userEquity || 0)), 0
  );
  const ideasInfluenced = ideas.length;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(value);
  };

  const getActionLabel = (type: string) => {
    switch (type) {
      case 'vote': return 'Upvoted';
      case 'comment': return 'Commented';
      case 'enhancement': return 'Enhanced';
      case 'submission': return 'Submitted';
      default: return type;
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Signal Dashboard</h1>
          <p className="text-gray-600">Track your contributions and potential returns</p>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium opacity-90">Signal Points</CardTitle>
                <Target className="h-4 w-4 opacity-90" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userPoints}</div>
              <p className="text-xs opacity-90">+15 this week</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium opacity-90">Est. Take</CardTitle>
                <DollarSign className="h-4 w-4 opacity-90" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(estimatedValue)}</div>
              <p className="text-xs opacity-90">If all ideas succeed</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium opacity-90">Ideas Influenced</CardTitle>
                <Lightbulb className="h-4 w-4 opacity-90" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{ideasInfluenced}</div>
              <p className="text-xs opacity-90">Your contributions</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium opacity-90">Total Equity</CardTitle>
                <TrendingUp className="h-4 w-4 opacity-90" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{(totalEquity * 100).toFixed(2)}%</div>
              <p className="text-xs opacity-90">Across all ideas</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <Card className="lg:col-span-2 bg-white/80 backdrop-blur-sm border-0">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {activitiesLoading ? (
                <div className="text-center text-gray-500 py-4">Loading...</div>
              ) : activities.length === 0 ? (
                <div className="text-center text-gray-500 py-4">No recent activity</div>
              ) : (
                <div className="space-y-4">
                  {activities.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-sm">{getActionLabel(activity.type)}</div>
                        <div className="text-sm text-gray-600">{activity.ideaTitle}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-green-600">+{activity.points} pts</div>
                        <div className="text-xs text-gray-500">{formatDistanceToNow(activity.timestamp, { addSuffix: true })}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Your Ideas Portfolio */}
          <Card className="bg-white/80 backdrop-blur-sm border-0">
            <CardHeader>
              <CardTitle>Your Portfolio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {ideas.map((idea, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="font-medium text-sm mb-1">{idea.title}</div>
                    <div className="flex justify-between items-center text-xs">
                      <Badge variant="secondary">{(idea.userEquity * 100).toFixed(2)}% equity</Badge>
                      <span className="text-green-600 font-semibold">
                        {formatCurrency(idea.valuationEstimate * idea.userEquity)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button className="w-full mt-4" variant="outline">
                View All Ideas
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
