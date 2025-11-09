
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, TrendingUp, DollarSign } from "lucide-react";
import { useIdeas } from "@/hooks/useIdeas";
import { useAuth } from "@/hooks/useAuth";
import { useUserPortfolio } from "@/hooks/useUserPortfolio";

const ROISimulator = () => {
  const { user } = useAuth();
  const { portfolio } = useUserPortfolio(user?.id);
  const { ideas } = useIdeas();
  const [selectedIdea, setSelectedIdea] = useState("");
  const [investmentAmount, setInvestmentAmount] = useState("");
  const [exitValuation, setExitValuation] = useState("");
  const [timeHorizon, setTimeHorizon] = useState("3");

  // Combine ideas from portfolio and general ideas
  const availableIdeas = ideas.map(idea => {
    const portfolioItem = portfolio.find(p => p.idea_id === idea.id);
    return {
      id: idea.id,
      title: idea.title,
      currentValuation: idea.valuationEstimate,
      userEquity: portfolioItem?.equity_percentage || 0
    };
  });

  const calculateROI = () => {
    if (!selectedIdea || !investmentAmount || !exitValuation) return null;
    
    const idea = availableIdeas.find(i => i.id === selectedIdea);
    if (!idea) return null;

    const investment = parseFloat(investmentAmount);
    const exit = parseFloat(exitValuation);
    const equity = idea.userEquity;
    
    const exitValue = exit * equity;
    const totalReturn = exitValue - investment;
    const roiPercent = ((totalReturn / investment) * 100);
    const annualizedReturn = Math.pow(1 + (totalReturn / investment), 1/parseFloat(timeHorizon)) - 1;

    return {
      exitValue,
      totalReturn,
      roiPercent,
      annualizedReturn: annualizedReturn * 100,
      equity: equity * 100
    };
  };

  const results = calculateROI();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ROI Simulator</h1>
          <p className="text-gray-600">Model potential returns on your Signal Vault investments</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Panel */}
          <Card className="bg-white/80 backdrop-blur-sm border-0">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calculator className="h-5 w-5" />
                <span>Investment Parameters</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="idea-select">Select Idea</Label>
                <Select value={selectedIdea} onValueChange={setSelectedIdea}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose an idea to simulate" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableIdeas.map((idea) => (
                      <SelectItem key={idea.id} value={idea.id}>
                        {idea.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedIdea && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="text-sm text-blue-800">
                    Current Valuation: {formatCurrency(availableIdeas.find(i => i.id === selectedIdea)?.currentValuation || 0)}
                  </div>
                  <div className="text-sm text-blue-600">
                    Your Equity: {((availableIdeas.find(i => i.id === selectedIdea)?.userEquity || 0) * 100).toFixed(2)}%
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="investment">Investment Amount ($)</Label>
                <Input
                  id="investment"
                  type="number"
                  placeholder="50000"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="exit-valuation">Exit Valuation ($)</Label>
                <Input
                  id="exit-valuation"
                  type="number"
                  placeholder="10000000"
                  value={exitValuation}
                  onChange={(e) => setExitValuation(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="time-horizon">Time Horizon (years)</Label>
                <Select value={timeHorizon} onValueChange={setTimeHorizon}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 year</SelectItem>
                    <SelectItem value="2">2 years</SelectItem>
                    <SelectItem value="3">3 years</SelectItem>
                    <SelectItem value="5">5 years</SelectItem>
                    <SelectItem value="7">7 years</SelectItem>
                    <SelectItem value="10">10 years</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600">
                Calculate Returns
              </Button>
            </CardContent>
          </Card>

          {/* Results Panel */}
          <Card className="bg-white/80 backdrop-blur-sm border-0">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Projected Returns</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {results ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="text-sm text-green-600 font-medium">Exit Value</div>
                      <div className="text-xl font-bold text-green-700">
                        {formatCurrency(results.exitValue)}
                      </div>
                    </div>
                    
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="text-sm text-blue-600 font-medium">Total Return</div>
                      <div className="text-xl font-bold text-blue-700">
                        {formatCurrency(results.totalReturn)}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="text-sm text-purple-600 font-medium">ROI</div>
                    <div className="text-2xl font-bold text-purple-700">
                      {results.roiPercent.toFixed(1)}%
                    </div>
                    <div className="text-xs text-purple-600">
                      {results.annualizedReturn.toFixed(1)}% annualized
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-2">Scenario Breakdown</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Your Equity Share:</span>
                        <span className="font-medium">{results.equity.toFixed(2)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Investment Multiple:</span>
                        <span className="font-medium">{(results.exitValue / parseFloat(investmentAmount)).toFixed(1)}x</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Time to Exit:</span>
                        <span className="font-medium">{timeHorizon} years</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Enter investment parameters to see projected returns</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Disclaimer */}
        <Card className="mt-6 bg-yellow-50 border-yellow-200">
          <CardContent className="pt-6">
            <p className="text-sm text-yellow-800">
              <strong>Disclaimer:</strong> This simulator provides hypothetical projections based on the inputs provided. 
              Actual returns may vary significantly and past performance does not guarantee future results. 
              Please consult with financial advisors before making investment decisions.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ROISimulator;
