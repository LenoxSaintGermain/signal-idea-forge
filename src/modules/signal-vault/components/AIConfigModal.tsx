import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Bot, Key, Eye, EyeOff } from "lucide-react";
import { useAI } from "../contexts/AIContext";
import { AIConfigModalProps } from "../types";

const AIConfigModal = ({ isOpen, onClose }: AIConfigModalProps) => {
  const { configureAI, isConfigured } = useAI();
  const { toast } = useToast();
  const [claudeKey, setClaudeKey] = useState(localStorage.getItem('ai_claude_key') || '');
  const [geminiKey, setGeminiKey] = useState(localStorage.getItem('ai_gemini_key') || '');
  const [showClaudeKey, setShowClaudeKey] = useState(false);
  const [showGeminiKey, setShowGeminiKey] = useState(false);

  const handleSave = () => {
    if (!claudeKey && !geminiKey) {
      toast({
        title: "API Keys Required",
        description: "Please provide at least one API key to enable AI features",
        variant: "destructive"
      });
      return;
    }

    try {
      configureAI(claudeKey, geminiKey);
      toast({
        title: "AI Configured Successfully!",
        description: "AI assistance is now available throughout the app",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Configuration Failed",
        description: "Please check your API keys and try again",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Bot className="h-5 w-5" />
            <span>Configure AI Assistant</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="text-sm text-gray-600">
            Configure your AI API keys to unlock powerful features like idea enhancement, 
            smart valuations, and content generation.
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="claude-key" className="flex items-center space-x-2">
                <Key className="h-4 w-4" />
                <span>Claude API Key</span>
                <span className="text-xs text-gray-500">(Primary)</span>
              </Label>
              <div className="relative mt-1">
                <Input
                  id="claude-key"
                  type={showClaudeKey ? "text" : "password"}
                  placeholder="sk-ant-..."
                  value={claudeKey}
                  onChange={(e) => setClaudeKey(e.target.value)}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowClaudeKey(!showClaudeKey)}
                >
                  {showClaudeKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="gemini-key" className="flex items-center space-x-2">
                <Key className="h-4 w-4" />
                <span>Gemini API Key</span>
                <span className="text-xs text-gray-500">(Fallback)</span>
              </Label>
              <div className="relative mt-1">
                <Input
                  id="gemini-key"
                  type={showGeminiKey ? "text" : "password"}
                  placeholder="AIza..."
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowGeminiKey(!showGeminiKey)}
                >
                  {showGeminiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>

          <div className="text-xs text-gray-500 space-y-1">
            <div>• Claude API: Get your key from console.anthropic.com</div>
            <div>• Gemini API: Get your key from aistudio.google.com</div>
            <div>• Keys are stored locally in your browser</div>
            <div>• At least one key is required for AI features</div>
          </div>

          <div className="flex justify-between space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-gradient-to-r from-blue-600 to-indigo-600">
              {isConfigured ? 'Update Configuration' : 'Enable AI Assistant'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIConfigModal;
