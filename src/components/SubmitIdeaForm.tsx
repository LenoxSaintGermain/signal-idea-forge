
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, ArrowLeft, ArrowRight, Sparkles, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SubmitIdeaFormProps {
  onBack: () => void;
}

const SubmitIdeaForm = ({ onBack }: SubmitIdeaFormProps) => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    problem: "",
    solution: "",
    market: "",
    businessModel: "",
    tags: [] as string[],
    category: "",
    targetAudience: "",
    monetization: "",
    competition: "",
    risks: ""
  });

  const totalSteps = 4;
  const availableTags = ["AI", "SaaS", "FinTech", "HealthTech", "EdTech", "LegalTech", "ClimaTech", "Productivity", "B2B", "B2C", "Marketplace", "Blockchain"];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTagToggle = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) 
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSaveDraft = () => {
    toast({
      title: "Draft saved!",
      description: "Your idea has been saved as a draft",
    });
  };

  const handleSubmit = () => {
    toast({
      title: "Idea submitted!",
      description: "+15 Signal Points earned for submitting an idea",
    });
    onBack();
  };

  const handleAIAssist = () => {
    toast({
      title: "AI assistance coming soon!",
      description: "AI-powered content generation will help complete your idea",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Explore
          </Button>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Submit Your Idea</h1>
          <p className="text-gray-600">Share your brilliant idea with the Signal Vault community</p>
          
          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Step {currentStep} of {totalSteps}</span>
              <span>{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lightbulb className="h-5 w-5" />
              <span>
                {currentStep === 1 && "Basic Information"}
                {currentStep === 2 && "Problem & Solution"}
                {currentStep === 3 && "Market & Business Model"}
                {currentStep === 4 && "Additional Details"}
              </span>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <>
                <div>
                  <Label htmlFor="title">Idea Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., AI Agent for HOA Disputes"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="summary">One-line Summary *</Label>
                  <Input
                    id="summary"
                    placeholder="e.g., Autonomous AI lawyer that mediates petty neighborhood conflicts"
                    value={formData.summary}
                    onChange={(e) => handleInputChange('summary', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ai-automation">AI & Automation</SelectItem>
                      <SelectItem value="fintech">FinTech</SelectItem>
                      <SelectItem value="healthtech">HealthTech</SelectItem>
                      <SelectItem value="edtech">EdTech</SelectItem>
                      <SelectItem value="legaltech">LegalTech</SelectItem>
                      <SelectItem value="climatetech">ClimateTech</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Tags</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {availableTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant={formData.tags.includes(tag) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => handleTagToggle(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Step 2: Problem & Solution */}
            {currentStep === 2 && (
              <>
                <div>
                  <Label htmlFor="problem">Problem Statement *</Label>
                  <Textarea
                    id="problem"
                    placeholder="What specific problem does this idea solve? Who experiences this problem?"
                    value={formData.problem}
                    onChange={(e) => handleInputChange('problem', e.target.value)}
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="solution">Solution Overview *</Label>
                  <Textarea
                    id="solution"
                    placeholder="How does your idea solve the problem? What makes it unique?"
                    value={formData.solution}
                    onChange={(e) => handleInputChange('solution', e.target.value)}
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="targetAudience">Target Audience</Label>
                  <Input
                    id="targetAudience"
                    placeholder="e.g., Homeowners in HOA communities, Property managers"
                    value={formData.targetAudience}
                    onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                  />
                </div>
              </>
            )}

            {/* Step 3: Market & Business Model */}
            {currentStep === 3 && (
              <>
                <div>
                  <Label htmlFor="market">Market Opportunity</Label>
                  <Textarea
                    id="market"
                    placeholder="What's the market size? Who are the competitors? What's the opportunity?"
                    value={formData.market}
                    onChange={(e) => handleInputChange('market', e.target.value)}
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="businessModel">Business Model</Label>
                  <Textarea
                    id="businessModel"
                    placeholder="How will this make money? Subscription, one-time, freemium, etc.?"
                    value={formData.businessModel}
                    onChange={(e) => handleInputChange('businessModel', e.target.value)}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="competition">Competition Analysis</Label>
                  <Textarea
                    id="competition"
                    placeholder="Who are the main competitors? What's your competitive advantage?"
                    value={formData.competition}
                    onChange={(e) => handleInputChange('competition', e.target.value)}
                    rows={3}
                  />
                </div>
              </>
            )}

            {/* Step 4: Additional Details */}
            {currentStep === 4 && (
              <>
                <div>
                  <Label htmlFor="monetization">Monetization Strategy</Label>
                  <Textarea
                    id="monetization"
                    placeholder="Detailed revenue model, pricing strategy, revenue streams"
                    value={formData.monetization}
                    onChange={(e) => handleInputChange('monetization', e.target.value)}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="risks">Risks & Challenges</Label>
                  <Textarea
                    id="risks"
                    placeholder="What are the main risks? Technical, market, regulatory challenges?"
                    value={formData.risks}
                    onChange={(e) => handleInputChange('risks', e.target.value)}
                    rows={3}
                  />
                </div>

                {/* Summary Preview */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Idea Summary</h4>
                  <div className="text-sm space-y-1">
                    <div><strong>Title:</strong> {formData.title || "Not provided"}</div>
                    <div><strong>Summary:</strong> {formData.summary || "Not provided"}</div>
                    <div><strong>Category:</strong> {formData.category || "Not selected"}</div>
                    <div><strong>Tags:</strong> {formData.tags.join(", ") || "None selected"}</div>
                  </div>
                </div>
              </>
            )}

            {/* AI Assist Button */}
            <div className="border-t pt-4">
              <Button variant="outline" onClick={handleAIAssist} className="w-full">
                <Sparkles className="h-4 w-4 mr-2" />
                AI Assist (Coming Soon)
              </Button>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center pt-6 border-t">
              <div className="flex space-x-2">
                <Button variant="outline" onClick={handleSaveDraft}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Draft
                </Button>
              </div>

              <div className="flex space-x-2">
                {currentStep > 1 && (
                  <Button variant="outline" onClick={handlePrev}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                )}
                
                {currentStep < totalSteps ? (
                  <Button onClick={handleNext}>
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} className="bg-gradient-to-r from-blue-600 to-indigo-600">
                    Submit Idea (+15 Points)
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SubmitIdeaForm;
