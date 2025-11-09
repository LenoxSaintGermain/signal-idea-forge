import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, DollarSign, Lightbulb, Target, Activity } from "lucide-react";
import { useUserActivity } from "@/hooks/useUserActivity";
import { useAuth } from "@/hooks/useAuth";
import EmptyState from "./EmptyState";

interface DashboardProps {
  userPoints: number;
  ideas: any[];
}

const Dashboard = ({ userPoints, ideas }: DashboardProps) => {
  const { user } = useAuth();
  const { activities, loading } = useUserActivity(user?.id);

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
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <Activity className="h-4 w-4 mr-2" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-start space-x-3 pb-3 border-b">
                      <Skeleton className="h-5 w-16 mt-1" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                      <Skeleton className="h-4 w-8" />
                    </div>
                  ))}
                </div>
              ) : activities.length === 0 ? (
                <EmptyState
                  icon={<Activity className="h-8 w-8 text-gray-400" />}
                  title="No activity yet"
                  description="Start voting and commenting to see your activity here"
                  className="py-8"
                />
              ) : (
                <div className="space-y-4">
                  {activities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3 pb-3 border-b last:border-0">
                      <div className="mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {getActionLabel(activity.type)}
                        </Badge>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 truncate">{activity.ideaTitle}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(activity.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-sm font-medium text-green-600">
                        +{activity.points}
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
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <Lightbulb className="h-4 w-4 mr-2" />
                Your Portfolio
              </CardTitle>
            </CardHeader>
            <CardContent>
              {ideas.length === 0 ? (
                <EmptyState
                  icon={<Lightbulb className="h-8 w-8 text-gray-400" />}
                  title="No ideas yet"
                  description="Submit your first idea to start building your portfolio"
                  className="py-8"
                />
              ) : (
                <div className="space-y-4">
                  {ideas.slice(0, 5).map((idea) => (
                    <div key={idea.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-sm text-gray-900">{idea.title}</h4>
                        <Badge variant="secondary" className="text-xs">{idea.status}</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-gray-500">Your Equity:</span>
                          <span className="ml-1 font-medium text-blue-600">
                            {((idea.userEquity || 0) * 100).toFixed(2)}%
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Est. Value:</span>
                          <span className="ml-1 font-medium text-green-600">
                            {formatCurrency(idea.valuationEstimate * (idea.userEquity || 0))}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full">
                    View All Ideas
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
